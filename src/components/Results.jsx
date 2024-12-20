import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Results = ({ data, classifier }) => {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    // Simulating the training process
    const simulateTraining = () => {
      try {
        const epochs = 50;
        const newResults = {
          accuracy: [],
          f1Score: [],
          loss: [],
        };

        for (let i = 0; i < epochs; i++) {
          newResults.accuracy.push(Math.random() * 0.2 + 0.7);
          newResults.f1Score.push(Math.random() * 0.2 + 0.7);
          newResults.loss.push(Math.random() * 0.5);
        }

        setResults(newResults);
        setIsLoading(false);
      } catch (err) {
        setError('An error occurred while processing the results.');
        setIsLoading(false);
      }
    };

    simulateTraining();
  }, [data, classifier]);

if (isLoading) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
  );
}

if (error) {
  return (
    <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error:</strong>
      <span className="block sm:inline"> {error}</span>
    </div>
  );
}

if (!results) {
  return (
    <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 text-yellow-700 dark:text-yellow-200 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Warning:</strong>
      <span className="block sm:inline"> No results available.</span>
    </div>
  );
}

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgb(156, 163, 175)',
        },
      },
      title: {
        display: true,
        text: `${classifier} Performance Metrics`,
        color: 'rgb(156, 163, 175)',
      },
    },
    scales: {
      x: {
        ticks: { color: 'rgb(156, 163, 175)' },
        grid: { color: 'rgba(156, 163, 175, 0.1)' },
      },
      y: {
        beginAtZero: true,
        max: 1,
        ticks: { color: 'rgb(156, 163, 175)' },
        grid: { color: 'rgba(156, 163, 175, 0.1)' },
      },
    },
  };

  const chartData = {
    labels: Array.from({ length: results.accuracy.length }, (_, i) => i + 1),
    datasets: [
      {
        label: 'Accuracy',
        data: results.accuracy,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.1,
      },
      {
        label: 'F1 Score',
        data: results.f1Score,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Loss',
        data: results.loss,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Résultats du modèle {classifier}</h2>
        <Line options={chartOptions} data={chartData} />
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Résumé des performances</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-200">Accuracy finale</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">
              {results.accuracy[results.accuracy.length - 1].toFixed(4)}
            </p>
          </div>
          <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
            <p className="text-lg font-semibold text-green-800 dark:text-green-200">F1 Score final</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-300">
              {results.f1Score[results.f1Score.length - 1].toFixed(4)}
            </p>
          </div>
          <div className="p-4 bg-red-100 dark:bg-red-900 rounded-lg">
            <p className="text-lg font-semibold text-red-800 dark:text-red-200">Loss finale</p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-300">
              {results.loss[results.loss.length - 1].toFixed(4)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
