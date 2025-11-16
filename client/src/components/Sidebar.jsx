import React from 'react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Slides</h3>
      <div className="space-y-2">
        <div className="bg-blue-50 dark:bg-blue-900 border-2 border-blue-500 rounded p-2">
          <div className="text-xs text-gray-600 dark:text-gray-300">Slide 1</div>
          <div className="bg-white dark:bg-gray-700 h-16 rounded mt-1"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;