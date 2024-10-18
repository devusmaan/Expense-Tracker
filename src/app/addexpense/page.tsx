"use client";

import Navbar from "@/components/navbar";
import { saveExpense } from "@/firebase/firebasefirestore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddExpense() {
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState(''); // Change initial state to an empty string
    const [category, setCategory] = useState('None');
    const [note, setNote] = useState('');
    const [date] = useState(new Date());
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    type CategoryType = "Food" | "Transport" | "Bills" | "Education" | "Investments" | "Luxuries" | "Other";

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (amount && title && category !== "None") {
            setLoading(true);
            try {
                await saveExpense(title, Number(amount), date, category, note);
                setTitle('');
                setAmount('');
                setCategory("None");
                setNote("");
                router.push("/");
            } catch (err) {
                console.error("Error saving expense:", err);
                setError('Failed to save expense. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            setError('Title, Amount, and Category are required fields.');
            setTimeout(() => {
                setError('');
            }, 4000);
        }
    }

    return (
        <>
            <Navbar />

            <div>
                <div className="flex items-center justify-center mt-10 bg-gray-100">
                    <div className="card bg-base-100 w-full max-w-md shadow-xl mt-7 pt-3">
                        <h1 className="text-2xl font-bold text-center">Add your Expense</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="card-body">
                                <label className="input input-bordered flex items-center gap-2">
                                    Title:
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}

                                        className="grow"
                                        placeholder="e.g., Groceries, Rent" />
                                </label>
                                <label className="input input-bordered flex items-center gap-2">
                                    Amount:
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}

                                        className="grow"
                                        placeholder="Enter Number" />
                                </label>

                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="pr-2">Select a Category:</h4>
                                </div>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as CategoryType)}

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
                                    onChange={(e) => setNote(e.target.value)}
                                    className="textarea textarea-bordered w-full mb-4"
                                    placeholder=""></textarea>
                                <div className="flex items-center justify-center mb-4">
                                    {error && <p className="text-red-500 text-center">{error}</p>} 
                                </div>

                                {loading ? (
                                    <p className="text-blue-500 text-center">Saving your expense...</p>
                                ) : (
                                    <button type="submit" className="btn btn-xs h-10 sm:btn-sm md:btn-md lg:btn-lg w-full mt-4">
                                        Save Expense
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
