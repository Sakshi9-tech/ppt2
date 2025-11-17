import React, { useState } from 'react';
import { usePresentation } from '../contexts/PresentationContext';

const AnimationPanel = () => {
  const { slides, currentSlide, updateSlide } = usePresentation();
  const [selectedElement, setSelectedElement] = useState(null);
  
  const slide = slides[currentSlide] || {};
  const animations = slide.animations || [];

  const animationTypes = [
    { id: 'fadeIn', name: 'Fade In', icon: '🌅' },
    { id: 'slideInLeft', name: 'Slide In Left', icon: '⬅️' },
    { id: 'slideInRight', name: 'Slide In Right', icon: '➡️' },
    { id: 'slideInUp', name: 'Slide In Up', icon: '⬆️' },
    { id: 'slideInDown', name: 'Slide In Down', icon: '⬇️' },
    { id: 'zoomIn', name: 'Zoom In', icon: '🔍' },
    { id: 'bounce', name: 'Bounce', icon: '⚡' },
    { id: 'pulse', name: 'Pulse', icon: '💓' }
  ];

  const addAnimation = (elementId, animationType) => {
    const newAnimation = {
      id: Date.now(),
      elementId,
      type: animationType,
      duration: 1000,
      delay: 0,
      order: animations.length
    };
    
    const updatedAnimations = [...animations, newAnimation];
    updateSlide(currentSlide, { animations: updatedAnimations });
  };

  const removeAnimation = (animationId) => {
    const updatedAnimations = animations.filter(a => a.id !== animationId);
    updateSlide(currentSlide, { animations: updatedAnimations });
  };

  const elements = slide.elements || [];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        🎬 Animations
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
            Select Element
          </label>
          <select
            value={selectedElement || ''}
            onChange={(e) => setSelectedElement(e.target.value)}
            className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Choose element...</option>
            <option value="title">Title</option>
            <option value="content">Content</option>
            {elements.map(el => (
              <option key={el.id} value={el.id}>
                {el.type} - {el.id}
              </option>
            ))}
          </select>
        </div>

        {selectedElement && (
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              Animation Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {animationTypes.map(anim => (
                <button
                  key={anim.id}
                  onClick={() => addAnimation(selectedElement, anim.id)}
                  className="p-2 text-xs bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded hover:bg-blue-100 dark:hover:bg-blue-800"
                >
                  <div>{anim.icon}</div>
                  <div className="mt-1">{anim.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
            Current Animations
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {animations.map(anim => (
              <div key={anim.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-xs">
                  <div className="font-medium">{anim.type}</div>
                  <div className="text-gray-500">Element: {anim.elementId}</div>
                </div>
                <button
                  onClick={() => removeAnimation(anim.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
            {animations.length === 0 && (
              <div className="text-xs text-gray-500 text-center py-4">
                No animations added
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimationPanel;