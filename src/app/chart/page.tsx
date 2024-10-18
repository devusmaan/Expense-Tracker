"use client";

import Chart from '@/components/chart';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firebasefirestore';
import Loading from '@/components/loading';
import Navbar from '@/components/navbar';
const ChartPage = () => {
    const [categories, setCategories] = useState<string[]>([]);
    const [categoryData, setCategoryData] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "expenses"));
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

export default ChartPage;
