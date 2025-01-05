import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './index.css'


// Simulation des icônes puisque lucide-react nécessite une configuration spéciale
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#9333ea', '#ea580c'];

const mockResults = [
  { method: "SCA", accuracy: 0.85, recall: 0.83, precision: 0.84, f1: 0.85 },
  { method: "PSO", accuracy: 0.88, recall: 0.86, precision: 0.87, f1: 0.88 },
  { method: "GA", accuracy: 0.84, recall: 0.82, precision: 0.85, f1: 0.84 },
  { method: "GWO", accuracy: 0.86, recall: 0.84, precision: 0.86, f1: 0.86 },
  { method: "WOA", accuracy: 0.87, recall: 0.85, precision: 0.88, f1: 0.87 }
];
// const handleUpload = async (event, setResults) => {
//   const file = event.target.files[0];
//   if (!file) return;

//   console.log("Fichier sélectionné:", file.name);
//   const formData = new FormData();
//   formData.append('file', file);

//   try {
//     console.log("Envoi du fichier...");
//     const response = await fetch('http://localhost:5000/optimazation-methods-using-knn-classifier', {
//       method: 'POST',
//       body: formData,
//     });
  


//     if (!response.ok) {
//       console.log('Erreur lors de l\'envoi du fichier');
//       console.error('Erreur lors de l\'envoi du fichier');
//       throw new Error('Erreur lors de l\'envoi du fichier');
//     }
//     console.log("Données reçues:");
//     const data = await response.json();
//     console.log("Données reçues:", data);

//     console.log("Données reçues:", data);

//     if (data["Performances avant optimisation"] && data["Performances après optimisation"]) {
//       console.log("dkhlt if");
//       setResults({
//         "Performances avant optimisation": data["Performances avant optimisation"],
//         "Performances après optimisation": data["Performances après optimisation"]
//     });
    
//     console.log("Results updated:", {
        
//     });
//     } else {
//       console.error('Données manquantes dans la réponse:', data);
//     }

//   } catch (error) {
//     console.error('Erreur API:', error);
//   }
// };

const transformResults = (data) => {
  const { "Performances avant optimisation": initialResults, "Performances après optimisation": optimizedResults } = data;

  const formattedInitialResults = [
    {
      method: "Initial",
      accuracy: initialResults.accuracy,
      recall: initialResults.recall,
      precision: initialResults.precision,
      f1: initialResults.f1_score
    }
  ];

  const formattedOptimizedResults = Object.keys(optimizedResults).map(method => ({
    method,
    accuracy: optimizedResults[method].accuracy,
    recall: optimizedResults[method].recall,
    precision: optimizedResults[method].precision,
    f1: optimizedResults[method].f1_score
  }));

  return {
    initialResults: formattedInitialResults,
    optimizedResults: formattedOptimizedResults
  };
};

const FileUpload = ({ onFileSelect, setResults }) => (
  <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed rounded-lg border-gray-300 bg-gray-50">
    <div className="text-gray-400">
      <UploadIcon />
    </div>
    <input
      type="file"
      accept=".csv"
      onChange={onFileSelect} // Utilisation de la bonne prop
      className="hidden"
      id="csv-upload"
    />
    <label
      htmlFor="csv-upload"
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 cursor-pointer"
    >
      Choisir un fichier CSV
    </label>
    <p className="text-sm text-gray-500">Format accepté : CSV</p>
  </div>
);

const ResultsTable = ({ results }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-left">Méthode</th>
          <th className="px-4 py-2 text-left">Accuracy</th>
          <th className="px-4 py-2 text-left">Recall</th>
          <th className="px-4 py-2 text-left">Precision</th>
          <th className="px-4 py-2 text-left">F1 Score</th>
        </tr>
      </thead>
      <tbody>
        {results.map((result, index) => (
          <tr key={result.method} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <td className="px-4 py-2 font-medium">{result.method}</td>
            <td className="px-4 py-2">{result.accuracy.toFixed(3)}</td>
            <td className="px-4 py-2">{result.recall.toFixed(3)}</td>
            <td className="px-4 py-2">{result.precision.toFixed(3)}</td>
            <td className="px-4 py-2">{result.f1.toFixed(3)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ResultsCharts = ({ results }) => {
  const barData = results.map(result => ({
    name: result.method,
    Accuracy: result.accuracy,
    Recall: result.recall,
    Precision: result.precision
  }));

  const pieData = results.map(result => ({
    name: result.method,
    value: result.f1
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-medium mb-4">Métriques par Méthode</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Accuracy" fill="#2563eb" />
            <Bar dataKey="Recall" fill="#16a34a" />
            <Bar dataKey="Precision" fill="#dc2626" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-medium mb-4">F1 Score par Méthode</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({name, value}) => `${name}: ${value.toFixed(3)}`}
            >
              {pieData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
const App = () => {
  const [results, setResults] = useState(null);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/optimazation-methods-using-knn-classifier', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du fichier');
      }

      const data = await response.json();
      const transformedData = transformResults(data);
      setResults(transformedData);
    } catch (error) {
      console.error('Erreur API:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Comparaison des Algorithmes d'Optimisation</h1>
          <p className="text-gray-600">Importez un fichier CSV pour analyser les résultats avec différentes méthodes d'optimisation</p>
        </header>

        <div className="max-w-xl mx-auto mb-8">
        <FileUpload setResults={setResults} onFileSelect={handleUpload} />
        </div>

        {results && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Performances avant optimisation</h2>
              <ResultsTable results={results.initialResults} />
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Performances après optimisation</h2>
              <ResultsTable results={results.optimizedResults} />
            </div>

            <ResultsCharts results={results.optimizedResults} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;