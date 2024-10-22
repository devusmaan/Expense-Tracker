"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase/firebasefirestore';
import Loading from '@/components/loading';
import Navbar from '@/components/navbar';
import { auth } from '@/firebase/firebaseauth';
import Chart from '@/components/chart';

export default function ChartPage() {
    const [categories, setCategories] = useState<string[]>([]);
    const [categoryData, setCategoryData] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            const currentUser = auth.currentUser;

            if (!currentUser) {
                console.error("No user logged in.");
                setLoading(false);
                return;
            }

            try {
                const q = query(collection(db, "expenses"), where("uid", "==", currentUser.uid));
                const querySnapshot = await getDocs(q);
                const fetchedCategories: string[] = [];
                const fetchedData: number[] = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    fetchedCategories.push(data.category);
                    fetchedData.push(data.amount);
                });

                setCategories(fetchedCategories);
                setCategoryData(fetchedData);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold my-4">Expenses by Category</h1>
                {loading ? (
                    <Loading />
                ) : (
                    categories.length > 0 && categoryData.length > 0 ? (
                        <Chart labels={categories} data={categoryData} />
                    ) : (
                        <p>No data available.</p>
                    )
                )}
            </div>
        </>
    );
};


