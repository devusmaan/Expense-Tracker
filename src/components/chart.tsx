"use client";

import { PolarArea } from "react-chartjs-2";
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from "chart.js";
import { FC } from "react";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

interface ChartProps {
    labels: string[];
    data: number[];
}

const Chart: FC<ChartProps> = ({ labels, data }) => {
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: "Expenses by Category",
                data: data,
                backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                    "rgba(100, 255, 218, 0.6)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                    "rgba(100, 255, 218, 1)",
                ],
                borderWidth: 2,
            },
        ],
    };

    return (
        <div className="flex justify-center items-center" style={{
            width: '100%',
            height: '400px',
            padding: '20px'
        }}>
            <PolarArea data={chartData} />
        </div>
    );
};

export default Chart;
