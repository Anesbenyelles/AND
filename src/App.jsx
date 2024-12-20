import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import UploadData from './components/UploadData';
import VisualizeData from './components/VisualizeData';
import ImputeData from './components/ImputeData';
import Results from './components/Results';
import { useEffect } from 'react';
function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentStep, setCurrentStep] = useState('upload');
  const [classifier, setClassifier] = useState('MLP');
  const [data, setData] = useState(null);
  useEffect(() => {
    console.log('Dark Mode:', darkMode);
    if (darkMode) {
      console.log("if")
      document.documentElement.classList.add('dark');
    } else {
      console.log("else")
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);;

  const toggleDarkMode = () => setDarkMode(!darkMode);
  
  const renderStep = () => {
    switch (currentStep) {
      case 'upload':
        return <UploadData setData={setData} />;
      case 'visualize':
        return <VisualizeData data={data} />;
      case 'impute':
        return <ImputeData data={data} setData={setData} />;
      case 'results':
        return <Results data={data} classifier={classifier} />;
      default:
        return <UploadData setData={setData} />;
    }
  };

  return (
    <div className={`flex h-screen w-screen  ${darkMode ? 'dark' : ''}`}>

      <div>
      <Sidebar currentStep={currentStep} setCurrentStep={setCurrentStep} /></div>
      <div className="flex flex-col flex-1 overflow-hidden">

        <Header
          toggleDarkMode={toggleDarkMode}
          darkMode={darkMode}
          classifier={classifier}
          setClassifier={setClassifier}
          currentStep={currentStep}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4">
          {renderStep()}
        </main>
      </div>
    </div>
  );
}

export default App;
