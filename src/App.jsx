import React, { useState } from 'react';

// Sidebar Component
const Sidebar = ({ onNavigate }) => {
  return (
    <div className="flex flex-col h-screen w-64 bg-gray-800 text-white shadow-lg">
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <h1 className="text-2xl font-semibold">Logo</h1>
      </div>
      <nav className="flex-grow p-4">
        <ul className="space-y-4">
          {['Uploader', 'Visualiser', 'Imputer', 'Résultats'].map((item) => (
            <li key={item} className="group">
              <button
                onClick={() => onNavigate(item)}
                className="flex items-center w-full space-x-3 p-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                <span className="material-icons text-lg">menu</span>
                <span className="group-hover:translate-x-2 transition-transform">{item}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-md shadow-md transition-colors">
          Logout
        </button>
      </div>
    </div>
  );
};

// Header Component
const Header = ({ classifier, setClassifier }) => {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-gray-200 shadow-md">
      <h1 className="text-xl font-semibold">SCA Optimizer</h1>
      <div>
        <label htmlFor="classifier" className="mr-2 font-medium">Classifieur :</label>
        <select
          id="classifier"
          value={classifier}
          onChange={(e) => setClassifier(e.target.value)}
          className="px-3 py-2 border rounded-md shadow-sm"
        >
          <option value="MLP">MLP</option>
          <option value="KNN">KNN</option>
        </select>
      </div>
    </header>
  );
};

// FileUploader Component
const FileUploader = ({ onFileUpload }) => {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        onFileUpload(content);
      };
      reader.readAsText(file);
    } else {
      alert('Veuillez télécharger un fichier CSV valide.');
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white border rounded-md shadow-sm">
      <label className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
        <span className="text-gray-500">{fileName || 'Drag & Drop ou cliquez pour télécharger un fichier CSV'}</span>
      </label>
    </div>
  );
};

// Visualization Component
const Visualization = ({ data }) => {
  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">Visualisation des Données</h2>
      {data ? (
        <pre className="overflow-auto bg-gray-100 p-2 rounded-md text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <p className="text-gray-500">Aucune donnée à afficher</p>
      )}
    </div>
  );
};

// App Component
const App = () => {
  const [page, setPage] = useState('Uploader');
  const [classifier, setClassifier] = useState('MLP');
  const [uploadedData, setUploadedData] = useState(null);

  const handleNavigation = (page) => {
    setPage(page);
  };

  const handleFileUpload = (data) => {
    setUploadedData(data);
  };

  return (
    <div className="flex h-screen">
      <Sidebar onNavigate={handleNavigation} />
      <div className="flex-grow flex flex-col">
        <Header classifier={classifier} setClassifier={setClassifier} />
        <main className="p-4 flex-grow overflow-auto">
          {page === 'Uploader' && <FileUploader onFileUpload={handleFileUpload} />}
          {page === 'Visualiser' && <Visualization data={uploadedData} />}
          {page === 'Imputer' && <p>Imputation avec SCA - En développement</p>}
          {page === 'Résultats' && <p>Résultats et Graphiques Dynamiques - En développement</p>}
        </main>
      </div>
    </div>
  );
};

export default App;
