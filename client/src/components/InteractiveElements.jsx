import React, { useState } from 'react';
import { usePresentation } from '../contexts/PresentationContext';

const InteractiveElements = ({ onClose }) => {
  const { slides, currentSlide, updateSlide } = usePresentation();
  const [elementType, setElementType] = useState('button');

  const interactiveTypes = [
    { id: 'button', name: 'Action Button', icon: '🔘', desc: 'Clickable button with actions' },
    { id: 'link', name: 'Hyperlink', icon: '🔗', desc: 'Link to websites or slides' },
    { id: 'poll', name: 'Live Poll', icon: '📊', desc: 'Real-time audience polling' },
    { id: 'quiz', name: 'Quiz Question', icon: '❓', desc: 'Interactive quiz with answers' },
    { id: 'video', name: 'Video Player', icon: '🎥', desc: 'Embedded video with controls' },
    { id: 'audio', name: 'Audio Player', icon: '🔊', desc: 'Background music or narration' }
  ];

  const addInteractiveElement = () => {
    const baseElement = {
      id: Date.now(),
      type: 'interactive',
      subType: elementType,
      x: 100,
      y: 100,
      width: 200,
      height: 50
    };

    let element;
    switch (elementType) {
      case 'button':
        element = {
          ...baseElement,
          text: 'Click Me',
          action: 'nextSlide',
          style: { backgroundColor: '#3B82F6', color: '#FFFFFF', borderRadius: '8px' }
        };
        break;
      case 'link':
        element = {
          ...baseElement,
          text: 'Visit Link',
          url: 'https://example.com',
          target: '_blank'
        };
        break;
      case 'poll':
        element = {
          ...baseElement,
          height: 150,
          question: 'What do you think?',
          options: ['Option A', 'Option B', 'Option C'],
          results: [0, 0, 0]
        };
        break;
      case 'quiz':
        element = {
          ...baseElement,
          height: 200,
          question: 'What is 2+2?',
          options: ['3', '4', '5', '6'],
          correct: 1,
          showAnswer: false
        };
        break;
      case 'video':
        element = {
          ...baseElement,
          width: 400,
          height: 225,
          src: '',
          autoplay: false,
          controls: true
        };
        break;
      case 'audio':
        element = {
          ...baseElement,
          height: 30,
          src: '',
          autoplay: false,
          loop: false
        };
        break;
      default:
        element = baseElement;
    }

    const elements = slides[currentSlide].elements || [];
    updateSlide(currentSlide, { elements: [...elements, element] });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">⚡ Interactive Elements</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Element Type</label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {interactiveTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setElementType(type.id)}
                  className={`w-full p-3 rounded-md border-2 text-left transition-colors ${
                    elementType === type.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-xl">{type.icon}</span>
                    <div>
                      <div className="font-medium">{type.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{type.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
            <h4 className="text-sm font-medium mb-2">Preview</h4>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {elementType === 'button' && '🔘 Clickable button that can navigate slides or trigger actions'}
              {elementType === 'link' && '🔗 Hyperlink that opens external websites or internal slides'}
              {elementType === 'poll' && '📊 Live polling system for audience engagement'}
              {elementType === 'quiz' && '❓ Interactive quiz with multiple choice answers'}
              {elementType === 'video' && '🎥 Embedded video player with playback controls'}
              {elementType === 'audio' && '🔊 Audio player for background music or narration'}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={addInteractiveElement}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Element
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveElements;