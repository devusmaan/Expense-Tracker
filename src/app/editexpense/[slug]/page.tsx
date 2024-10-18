"use client";

import Navbar from "@/components/navbar";
import { db } from "@/firebase/firebasefirestore";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ExpenseType = {
    id: string;
    title: string;
    amount: number;
    category: string;
    date: Date;
    note: string;
    firebaseID: string;
}

type CategoryType = "Food" | "Transport" | "Bills" | "Education" | "Investments" | "Luxuries" | "Other";

export default function Page({ params }: { params: { slug: string } }) {
    const [loading, setLoading] = useState(true);
    const selID: string = params.slug;
    const [error, setError] = useState<string | null>(null);
    const [expense, setExpense] = useState<ExpenseType | null>(null);
    const [title, setTitle] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);
    const [category, setCategory] = useState("None");
    const [note, setNote] = useState<string>("");
    const route = useRouter()

    useEffect(() => {
        if (selID) {
            const fetchExpense = async () => {
                try {
                    const expenseRef = doc(db, "expenses", selID as string);
                    const expenseSnap = await getDoc(expenseRef);
                    if (expenseSnap.exists()) {
                        const expenseData = expenseSnap.data() as ExpenseType;
                        setExpense(expenseData);
                        setTitle(expenseData.title);
                        setAmount(expenseData.amount);
                        setCategory(expenseData.category);
                        setNote(expenseData.note || "");
                    } else {
                        setError("Expense not found");
                    }
                } catch (error) {
                    setError("Failed to fetch expense");
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            };

            fetchExpense();
        }
    }, [selID]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (title && amount && category !== "None") {
            if (expense) {
                try {
                    const expenseRef = doc(db, "expenses", selID as string);
                    await updateDoc(expenseRef, {
                        title,
                        amount,
                        category,
                        note,
                    });
                    console.log("Expense updated successfully");
                    route.push("/");
                } catch (error) {
                    setError("Failed to update expense");
                    console.error(error);
                }
            }
        } else {
            setError('Title, Amount, and Category are required fields.');

            setTimeout(() => {
                setError('');
            }, 4000);
        }
    }

    if (loading) {
        return <div className="loading"></div>;
    }

    return (
        <>
           <Navbar />
            <div>
                <div className="flex items-center justify-center mt-10 bg-gray-100">
                    <div className="card bg-base-100 w-full max-w-md shadow-xl mt-7 pt-3">
                        <h1 className="text-2xl font-bold text-center">Edit your Expense</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="card-body">
                                <label className="input input-bordered flex items-center gap-2">
                                    Title:
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => { setTitle(e.target.value); }}
                                        required
                                        className="grow"
                                        placeholder="e.g., Groceries, Rent" />
                                </label>
                                <label className="input input-bordered flex items-center gap-2">
                                    Amount:
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => { setAmount(Number(e.target.value)); }}
                                        required
                                        className="grow"
                                        placeholder="Enter Number" />
                                </label>

                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="pr-2">Select a Category:</h4>
                                </div>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                                    required
                                    className="select select-primary w-full mb-4">
                                    <option value="None">None</option>
                                    <option value="Food">Food</option>
                                    <option value="Transport">Transport</option>
                                    <option value="Bills">Bills</option>
                                    <option value="Education">Education</option>
                                    <option value="Investments">Investments</option>
                                    <option value="Luxuries">Luxuries</option>
                                    <option value="Other">Other</option>
                                </select>

                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="pr-1">Optional Note:</h4>
                                </div>
                                <textarea
                                    value={note}
                                    onChange={(e) => { setNote(e.target.value); }}
                                    className="textarea textarea-bordered w-full mb-4"
                                    placeholder=""></textarea>

                                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                                <button type="submit" className="btn btn-xs h-10 sm:btn-sm md:btn-md lg:btn-lg w-full mt-4">
                                    Save Expense
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

