"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
);

interface Plant {
  title: string;
  score: number;
}

interface Props {
  plants: Plant[];
}

export default function PlantChart({ plants }: Props) {
  const data = {
    labels: plants.map((p) => p.title),
    datasets: [
      {
        label: "Plant Growth Score",
        data: plants.map((p) => p.score),
        backgroundColor: "#356312",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Plant Growth Suitability Scores" },
    },
    scales: {
      y: { beginAtZero: true, max: 10 },
    },
  };

  return <Bar data={data} options={options} />;
}
