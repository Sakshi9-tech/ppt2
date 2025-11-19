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
    <div className="w-64 panel p-4">
      {/* Panel title uses nav-title for consistent gold color */}
      <h3 className="text-sm font-medium nav-title mb-4">🎬 Animations</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-2">
            Select Element
          </label>
          <select
            value={selectedElement || ''}
            onChange={(e) => setSelectedElement(e.target.value)}
            className="form-select"
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
            <label className="block text-xs font-medium text-neutral-300 mb-2">
              Animation Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {animationTypes.map(anim => (
                <button
                  key={anim.id}
                  onClick={() => addAnimation(selectedElement, anim.id)}
                  className="btn-secondary flex flex-col items-center justify-center p-2 text-xs"
                >
                  <div>{anim.icon}</div>
                  <div className="mt-1">{anim.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-2">
            Current Animations
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {animations.map(anim => (
              <div key={anim.id} className="flex items-center justify-between p-2 card">
                <div className="text-xs">
                  <div className="font-medium">{anim.type}</div>
                  <div className="text-neutral-400">Element: {anim.elementId}</div>
                </div>
                <button
                  onClick={() => removeAnimation(anim.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            ))}
            {animations.length === 0 && (
              <div className="text-xs text-neutral-400 text-center py-4">
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