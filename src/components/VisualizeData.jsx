import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const VisualizeData = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>No data available to visualize</div>;
  }

  const columns = Object.keys(data[0]);
  const numericColumns = columns.filter(column => 
    data.every(row => !isNaN(parseFloat(row[column])))
  );

  const calculateStats = (column) => {
    const values = data.map(row => parseFloat(row[column])).filter(val => !isNaN(val));
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / values.length;
    const sortedValues = values.sort((a, b) => a - b);
    const median = sortedValues[Math.floor(sortedValues.length / 2)];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const missingValues = data.length - values.length;

    return { mean, median, min, max, missingValues };
  };

  const chartData = {
    labels: numericColumns,
    datasets: [
      {
        label: 'Mean',
        data: numericColumns.map(column => calculateStats(column).mean),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Mean Values by Column',
      },
    },
  };

  return (
    <div className="space-y-8">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Column</th>
              <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Mean</th>
              <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Median</th>
              <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Min</th>
              <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Max</th>
              <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Missing Values</th>
            </tr>
          </thead>
          <tbody>
            {numericColumns.map(column => {
              const stats = calculateStats(column);
              return (
                <tr key={column} className="border-b dark:border-gray-700">
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{column}</td>
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{stats.mean.toFixed(2)}</td>
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{stats.median.toFixed(2)}</td>
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{stats.min.toFixed(2)}</td>
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{stats.max.toFixed(2)}</td>
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{stats.missingValues}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default VisualizeData;
