import React from 'react';

const SlideShow = ({ isActive, onExit }) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="text-white text-center">
        <h1 className="text-4xl mb-4">Slideshow Mode</h1>
        <p className="mb-8">Press ESC to exit</p>
        <button onClick={onExit} className="bg-white text-black px-4 py-2 rounded">
          Exit Slideshow
        </button>
      </div>
    </div>
  );
};

export default SlideShow;