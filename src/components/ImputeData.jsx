import React, { useState } from 'react';

const ImputeData = ({ data, setData }) => {
  const [iterations, setIterations] = useState(100);
  const [searchRange, setSearchRange] = useState(10);
  const [isAutomatic, setIsAutomatic] = useState(true);
  const [isImputing, setIsImputing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImpute = () => {
    setIsImputing(true);
    // Simulating imputation process
    let currentProgress = 0;
    const intervalId = setInterval(() => {
      currentProgress += 1;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(intervalId);
        setIsImputing(false);
        // Here you would typically update the data with imputed values
        // For demonstration, we'll just set a dummy "imputed" flag
        setData(data.map(row => ({ ...row, imputed: true })));
      }
    }, 50);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Paramètres d'imputation</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-gray-700 dark:text-gray-300">Mode automatique</label>
            <input
              type="checkbox"
              checked={isAutomatic}
              onChange={(e) => setIsAutomatic(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </div>
          {!isAutomatic && (
            <>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Nombre d'itérations</label>
                <input
                  type="number"
                  value={iterations}
                  onChange={(e) => setIterations(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Plage de recherche</label>
                <input
                  type="number"
                  value={searchRange}
                  onChange={(e) => setSearchRange(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                />
              </div>
            </>
          )}
        </div>
      </div>

      <button
        onClick={handleImpute}
        disabled={isImputing}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out disabled:opacity-50"
      >
        {isImputing ? 'Imputation en cours...' : 'Lancer l\'imputation'}
      </button>

      {isImputing && (
        <div className="mt-4">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-400">{progress}% complété</p>
        </div>
      )}

      {data && data[0].imputed && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">Aperçu des données imputées</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  {Object.keys(data[0]).map((header) => (
                    <th key={header} className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 10).map((row, index) => (
                  <tr key={index} className="border-b dark:border-gray-700">
                    {Object.values(row).map((value, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-2 text-gray-800 dark:text-gray-200">
                        {value.toString()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImputeData;
