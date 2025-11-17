import React, { useState } from 'react';
import { usePresentation } from '../contexts/PresentationContext';
import ImageUpload from './ImageUpload';

const AddInsPanel = () => {
  const { slides, currentSlide, updateSlide } = usePresentation();
  const [activeSection, setActiveSection] = useState('elements');
  
  const slide = slides[currentSlide] || {};

  const addShape = (shapeType) => {
    const newElement = {
      id: Date.now(),
      type: 'shape',
      shapeType,
      x: 150,
      y: 150,
      width: 100,
      height: 100,
      fill: '#3B82F6',
      stroke: '#1E40AF',
      strokeWidth: 2
    };
    
    const elements = slide.elements || [];
    updateSlide(currentSlide, { elements: [...elements, newElement] });
  };

  const addIcon = (iconType) => {
    const icons = {
      star: '⭐',
      heart: '❤️',
      check: '✅',
      arrow: '➡️',
      warning: '⚠️',
      info: 'ℹ️'
    };

    const newElement = {
      id: Date.now(),
      type: 'icon',
      content: icons[iconType],
      x: 200,
      y: 200,
      width: 50,
      height: 50,
      fontSize: 32
    };
    
    const elements = slide.elements || [];
    updateSlide(currentSlide, { elements: [...elements, newElement] });
  };

  const templates = [
    { name: 'Title Slide', layout: 'title-only', bg: '#FFFFFF', text: '#000000' },
    { name: 'Content Slide', layout: 'title-content', bg: '#F8FAFC', text: '#1F2937' },
    { name: 'Two Column', layout: 'two-column', bg: '#EFF6FF', text: '#1E40AF' },
    { name: 'Dark Theme', layout: 'title-content', bg: '#1F2937', text: '#FFFFFF' }
  ];

  const applyTemplate = (template) => {
    updateSlide(currentSlide, {
      layout: template.layout,
      background: template.bg,
      textColor: template.text
    });
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Add-ins</h3>
      
      {/* Section Tabs */}
      <div className="flex mb-4 border-b border-gray-200 dark:border-gray-600">
        <button
          onClick={() => setActiveSection('elements')}
          className={`px-2 py-1 text-xs font-medium ${activeSection === 'elements' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
        >
          Elements
        </button>
        <button
          onClick={() => setActiveSection('templates')}
          className={`px-2 py-1 text-xs font-medium ${activeSection === 'templates' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
        >
          Templates
        </button>
      </div>

      {/* Elements Section */}
      {activeSection === 'elements' && (
        <div className="space-y-4">
          {/* Media */}
          <div>
            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Media</h4>
            <ImageUpload />
          </div>

          {/* Shapes */}
          <div>
            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Shapes</h4>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => addShape('rectangle')}
                className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-xs"
                title="Rectangle"
              >
                ⬜
              </button>
              <button
                onClick={() => addShape('circle')}
                className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-xs"
                title="Circle"
              >
                ⭕
              </button>
              <button
                onClick={() => addShape('triangle')}
                className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-xs"
                title="Triangle"
              >
                🔺
              </button>
            </div>
          </div>

          {/* Icons */}
          <div>
            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Icons</h4>
            <div className="grid grid-cols-3 gap-2">
              {['star', 'heart', 'check', 'arrow', 'warning', 'info'].map((icon) => (
                <button
                  key={icon}
                  onClick={() => addIcon(icon)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-lg"
                  title={icon}
                >
                  {icon === 'star' && '⭐'}
                  {icon === 'heart' && '❤️'}
                  {icon === 'check' && '✅'}
                  {icon === 'arrow' && '➡️'}
                  {icon === 'warning' && '⚠️'}
                  {icon === 'info' && 'ℹ️'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Templates Section */}
      {activeSection === 'templates' && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Slide Templates</h4>
          {templates.map((template, index) => (
            <button
              key={index}
              onClick={() => applyTemplate(template)}
              className="w-full p-3 text-left text-sm rounded border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              style={{
                backgroundColor: template.bg + '20',
                borderColor: template.bg,
                color: template.text
              }}
            >
              <div className="font-medium">{template.name}</div>
              <div className="text-xs opacity-75">{template.layout}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddInsPanel;