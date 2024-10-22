import { auth } from "@/firebase/firebaseauth";
import { db, deleteExpense } from "@/firebase/firebasefirestore";
import { onAuthStateChanged, Unsubscribe } from "firebase/auth";
import { collection, DocumentData, onSnapshot, query, where } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import Chart from "./chart";
import Loading from "@/components/loading";

export default function AllExpense() {
    const [expense, setExpense] = useState<DocumentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [amountFilter, setAmountFilter] = useState<number>(0);
    const [notification, setNotification] = useState<string | null>(null);


    useEffect(() => {
        const detachOnAuthListener = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchExpensesRealtime();
            }
        });
        return () => {
            if (readTodosRealtime) {
                console.log("Component Unmount.");
                readTodosRealtime();
                detachOnAuthListener();
            }
        };
    }, []);

    let readTodosRealtime: Unsubscribe;
    const fetchExpensesRealtime = () => {
        const collectionRef = collection(db, "expenses");
        const currentUserUID = auth.currentUser?.uid;
        const condition = where("uid", "==", currentUserUID);
        const q = query(collectionRef, condition);
        const expenseClone = [...expense];

        readTodosRealtime = onSnapshot(q, (querySnapshot) => {
            querySnapshot.docChanges().forEach((change) => {
                const todo = change.doc.data();
                todo.id = change.doc.id;
                if (change.type === "added") {
                    expenseClone.push(todo);
                    setExpense([...expenseClone]);
                }
                if (change.type === "modified") {
                    const index = expenseClone.findIndex(t => t.id === todo.id);
                    if (index !== -1) {
                        expenseClone[index] = todo;
                    }
                    setExpense([...expenseClone]);
                    console.log("modified");
                }
                if (change.type === "removed") {
                    console.log("removed", change);
                    const index = expenseClone.findIndex(t => t.id === todo.id);
                    if (index !== -1) {
                        expenseClone.splice(index, 1);
                        setExpense([...expenseClone]);
                    }
                }
            });
            setLoading(false);
        });
    };

    const filteredExpenses = expense.filter((item) => {
        const isCategoryMatch = categoryFilter === "all" || item.category === categoryFilter;
        const isAmountMatch = amountFilter === 0 || item.amount >= amountFilter;
        return isCategoryMatch && isAmountMatch;
    });

    const handleDeleteExpense = (firebaseID: string) => {
        deleteExpense(firebaseID).then(() => {
            setNotification("Expense deleted successfully!");
            setTimeout(() => {
                setNotification(null);
            }, 3000);
        });
    };

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const totalMonthlyExpenses = filteredExpenses
        .filter((item) => {
            const expenseDate = item.date.toDate();
            return (
                expenseDate.getFullYear() === currentYear && expenseDate.getMonth() === currentMonth
            );
        })
        .reduce((acc, item) => acc + item.amount, 0);

    const categories = ["Food", "Transport", "Bills", "Education", "Investments", "Luxuries", "Other"];
    const categoryData = categories.map((category) => {
        const totalForCategory = filteredExpenses
            .filter((item) => item.category === category)
            .reduce((acc, item) => acc + item.amount, 0);
        return totalForCategory;
    });

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className="flex flex-col lg:flex-row items-center justify-between">
                        <div className="expense-container w-full lg:w-1/3 flex items-center justify-center"></div>

                        <div className="lg:w-1/3 w-full max-w-sm lg:max-w-none bg-gray-100 p-4 shadow-lg rounded-lg flex flex-col items-center mt-6 lg:mt-0 mb-3">
                            <h2 className="text-2xl font-bold mb-4">Total Monthly Expense</h2>
                            <p className="text-4xl font-bold">Rs: {totalMonthlyExpenses.toFixed(2)}</p>
                        </div>

                        <div className="hidden lg:flex lg:w-1/3 items-center justify-center">
                            <Chart labels={categories} data={categoryData} />
                        </div>
                    </div>

                    <div className="expense-container flex items-center justify-center">
                        <div>
                            <div className="filters flex flex-col items-center justify-center p-4 space-y-4">
                                <div className="flex flex-col items-start w-full max-w-xs">
                                    <div className="flex items-center space-x-2">
                                        <h4 className="font-bold">Filtered by Category:</h4>
                                        <select
                                            value={categoryFilter}
                                            onChange={(e) => setCategoryFilter(e.target.value)}
                                            required
                                            className="select select-primary w-full"
                                        >
                                            <option value="all">All</option>
                                            <option value="None">None</option>
                                            <option value="Food">Food</option>
                                            <option value="Transport">Transport</option>
                                            <option value="Bills">Bills</option>
                                            <option value="Education">Education</option>
                                            <option value="Investments">Investments</option>
                                            <option value="Luxuries">Luxuries</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col items-start w-full max-w-xs">
                                    <div className="flex items-center space-x-2">
                                        <label className="font-bold">Filtered by Amount:</label>
                                        <input
                                            type="number"
                                            value={amountFilter}
                                            onChange={(e) => setAmountFilter(Number(e.target.value))}
                                            className="input input-bordered w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            <br />

                            {notification && (
                                <div className="alert alert-success mb-4">
                                    {notification}
                                </div>
                            )}

                            {filteredExpenses.length > 0 ? (
                                <div className="flex flex-wrap items-center gap-3 justify-center">
                                    {filteredExpenses.map(({ amount, category, date, note, title, id, firebaseID }) => {
                                        return (
                                            <div key={id} className="card bg-base-100 w-full sm:w-80 md:w-96 shadow-xl mb-4">
                                                <div className="card-body">
                                                    <p className="font-bold">Title: </p>
                                                    <h2 className="pl-6 text-2xl md:text-4xl font-bold">{title}</h2>

                                                    <p className="font-bold">Amount: </p>
                                                    <p className="pl-6">RS {amount}</p>

                                                    <p className="font-bold">Category:</p>
                                                    <div className="badge badge-secondary ml-6">{category}</div>

                                                    <p className="font-bold">Date:</p>
                                                    <p className="pl-6">{new Date().toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true })}</p>
                                                    <p className="pl-6">{new Date().toLocaleDateString()}</p>

                                                    <p className="font-bold">Optional Note:</p>
                                                    <p className="pl-6 break-words max-w-full">{note || "N/A"}</p>

                                                    <div className="card-actions justify-end">
                                                        <div>
                                                            <button onClick={() => handleDeleteExpense(firebaseID)} className="btn">Delete</button>
                                                        </div>
                                                        <div>
                                                            <Link href={`editexpense/${firebaseID}`}>
                                                                <button className="btn">Edit</button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        );
                                    })}
                                </div>
                            ) : (
                                <h4 className="font-bold text-center pt-4">No expenses match your filters</h4>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>

    )

}