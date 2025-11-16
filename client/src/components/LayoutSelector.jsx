import React from 'react';

const LayoutSelector = () => {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Layouts</h3>
      <div className="grid grid-cols-2 gap-2">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-gray-100 dark:bg-gray-700 h-16 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"></div>
        ))}
      </div>
    </div>
  );
};

export default LayoutSelector;