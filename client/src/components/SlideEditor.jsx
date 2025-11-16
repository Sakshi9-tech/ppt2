import React from 'react';

const SlideEditor = () => {
  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-8 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg" style={{ width: '800px', height: '600px' }}>
        <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Click to add title</h2>
            <p>Click to add content</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideEditor;