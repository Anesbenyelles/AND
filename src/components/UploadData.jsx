import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';

const UploadData = ({ setData }) => {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file.type !== 'text/csv') {
      setError('Veuillez importer un fichier CSV');
      return;
    }

    Papa.parse(file, {
      complete: (result) => {
        setData(result.data);
        setPreview(result.data.slice(0, 10));
        setError(null);
      },
      header: true,
    });
  }, [setData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition duration-300 ease-in-out ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
            : 'border-gray-300 dark:border-gray-700'
        }`}
      >
        <input {...getInputProps()} accept=".csv" />
        <p className="text-gray-600 dark:text-gray-400">
          Glissez et déposez un fichier CSV ici ou cliquez pour importer
        </p>
      </div>

      {error && (
        <p className="text-red-500 dark:text-red-400 text-center">{error}</p>
      )}

      {preview && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                {Object.keys(preview[0]).map((header) => (
                  <th
                    key={header}
                    className="px-4 py-2 text-left text-gray-600 dark:text-gray-300"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.map((row, index) => (
                <tr key={index} className="border-b dark:border-gray-700">
                  {Object.values(row).map((value, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-2 text-gray-800 dark:text-gray-200"
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {preview && (
        <div className="flex justify-end">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
            Confirmer
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadData;
