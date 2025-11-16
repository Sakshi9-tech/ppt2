import React from 'react';

const FormatPanel = () => {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Format</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Font</label>
          <select className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600">
            <option>Arial</option>
            <option>Times</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FormatPanel;