import React from 'react';
import { Moon, Sun, HelpCircle, Settings, RefreshCw } from 'react-feather';

const Header = ({ toggleDarkMode, darkMode, classifier, setClassifier, currentStep }) => {
  const steps = ['upload', 'visualize', 'impute', 'results'];
  const currentStepIndex = steps.indexOf(currentStep) + 1;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <select
          value={classifier}
          onChange={(e) => setClassifier(e.target.value)}
          className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded px-2 py-1"
        >
          <option value="MLP">MLP</option>
          <option value="KNN">KNN</option>
        </select>
        <span className="text-gray-600 dark:text-gray-400">
          Étape {currentStepIndex}/4
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <button
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          title="Aide"
        >
          <HelpCircle />
        </button>
        <button
          className="text-white dark:text-wh hover:text-gray-800 dark:hover:text-gray-200"
          title="Paramètres"
        >
          <Settings />
        </button>
        <button
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          title="Réinitialiser"
        >
          <RefreshCw />
        </button>
        <button
          onClick={toggleDarkMode}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          {darkMode ? <Sun /> : <Moon />}
        </button>
      </div>
    </header>
  );
};

export default Header;
