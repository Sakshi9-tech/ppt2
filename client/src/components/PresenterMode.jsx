import React from 'react';

const PresenterMode = ({ isActive, onExit }) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="text-white text-center">
        <h2 className="text-2xl mb-4">Presenter Mode</h2>
        <p className="mb-4">Feature coming soon...</p>
        <button
          onClick={onExit}
          className="bg-primary-500 text-white px-4 py-2 rounded"
        >
          Exit
        </button>
      </div>
    </div>
  );
};

export default PresenterMode;