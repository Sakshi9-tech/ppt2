import React, { useState } from 'react';
import { usePresentation } from '../contexts/PresentationContext';

const SpeakerNotes = () => {
  const { slides, currentSlide, updateSlide } = usePresentation();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const slide = slides[currentSlide] || {};
  const notes = slide.speakerNotes || '';

  const handleNotesChange = (e) => {
    updateSlide(currentSlide, { speakerNotes: e.target.value });
  };

  return (
    <div className={`bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ${
      isExpanded ? 'h-48' : 'h-12'
    }`}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            📝 Speaker Notes
          </span>
          <span className="text-xs text-gray-500">
            (Private notes for presenter)
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {isExpanded ? '▼' : '▲'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="p-4 h-36">
          <textarea
            value={notes}
            onChange={handleNotesChange}
            placeholder="Add speaker notes for this slide..."
            className="w-full h-full resize-none border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
};

export default SpeakerNotes;