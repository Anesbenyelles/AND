import React from 'react';

const Sidebar = () => {
  return (
    <div className="flex flex-col h-screen w-64 bg-gray-800 text-white shadow-lg">
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <h1 className="text-2xl font-semibold">Logo</h1>
      </div>
      <nav className="flex-grow p-4">
        <ul className="space-y-4">
          <li className="group">
            <a href="#" className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 transition-colors">
              <span className="material-icons text-lg">home</span>
              <span className="group-hover:translate-x-2 transition-transform">Home</span>
            </a>
          </li>
          <li className="group">
            <a href="#" className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 transition-colors">
              <span className="material-icons text-lg">settings</span>
              <span className="group-hover:translate-x-2 transition-transform">Settings</span>
            </a>
          </li>
          <li className="group">
            <a href="#" className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 transition-colors">
              <span className="material-icons text-lg">help</span>
              <span className="group-hover:translate-x-2 transition-transform">Help</span>
            </a>
          </li>
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

export default Sidebar;