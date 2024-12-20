import React from 'react';
import { Upload, BarChart2, Database, PieChart } from 'react-feather';

const Sidebar = ({ currentStep, setCurrentStep }) => {
  const steps = [
    { id: 'upload', name: 'Uploader', icon: Upload },
    { id: 'visualize', name: 'Visualiser', icon: BarChart2 },
    { id: 'impute', name: 'Imputer', icon: Database },
    { id: 'results', name: 'Résultats', icon: PieChart },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <nav>
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(step.id)}
            className={`flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 w-full ${
              currentStep === step.id
                ? 'bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <step.icon className="h-5 w-5" />
            <span>{step.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
