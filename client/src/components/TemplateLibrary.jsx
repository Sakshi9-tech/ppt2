import React, { useState } from 'react';
import { usePresentation } from '../contexts/PresentationContext';

const TemplateLibrary = ({ onClose }) => {
  const { setSlides, setCurrentSlide } = usePresentation();
  const [selectedCategory, setSelectedCategory] = useState('business');

  const templates = {
    business: [
      {
        id: 'business-pitch',
        name: 'Business Pitch',
        description: 'Professional presentation for business proposals',
        slides: [
          {
            id: 1,
            title: 'Company Overview',
            content: 'Present your company vision and mission',
            background: '#1E40AF',
            textColor: '#FFFFFF',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Problem Statement',
            content: 'Define the problem you are solving',
            background: '#FFFFFF',
            textColor: '#1F2937',
            layout: 'title-content',
            elements: []
          },
          {
            id: 3,
            title: 'Our Solution',
            content: 'Present your innovative solution',
            background: '#F3F4F6',
            textColor: '#1F2937',
            layout: 'title-content',
            elements: []
          }
        ]
      },
      {
        id: 'quarterly-report',
        name: 'Quarterly Report',
        description: 'Professional quarterly business report template',
        slides: [
          {
            id: 1,
            title: 'Q4 2024 Report',
            content: 'Quarterly Performance Overview',
            background: '#059669',
            textColor: '#FFFFFF',
            layout: 'title-only',
            elements: []
          },
          {
            id: 2,
            title: 'Key Metrics',
            content: 'Revenue, Growth, and Performance Indicators',
            background: '#FFFFFF',
            textColor: '#1F2937',
            layout: 'title-content',
            elements: []
          }
        ]
      }
    ],
    education: [
      {
        id: 'lecture-slides',
        name: 'Lecture Slides',
        description: 'Educational presentation template',
        slides: [
          {
            id: 1,
            title: 'Course Introduction',
            content: 'Welcome to the course',
            background: '#7C3AED',
            textColor: '#FFFFFF',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Learning Objectives',
            content: 'What you will learn in this session',
            background: '#FFFFFF',
            textColor: '#1F2937',
            layout: 'title-content',
            elements: []
          }
        ]
      }
    ],
    creative: [
      {
        id: 'portfolio',
        name: 'Portfolio Showcase',
        description: 'Creative portfolio presentation',
        slides: [
          {
            id: 1,
            title: 'My Portfolio',
            content: 'Showcasing my best work',
            background: '#EC4899',
            textColor: '#FFFFFF',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'About Me',
            content: 'Professional background and skills',
            background: '#FFFFFF',
            textColor: '#1F2937',
            layout: 'title-content',
            elements: []
          }
        ]
      }
    ]
  };

  const categories = [
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'education', name: 'Education', icon: '🎓' },
    { id: 'creative', name: 'Creative', icon: '🎨' }
  ];

  const handleUseTemplate = (template) => {
    setSlides(template.slides);
    setCurrentSlide(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-4/5 max-w-5xl h-4/5 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Template Library
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          
          {/* Categories */}
          <div className="flex space-x-4 mt-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates[selectedCategory]?.map(template => (
              <div
                key={template.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Preview */}
                <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="text-sm font-medium">{template.slides.length} Slides</div>
                  </div>
                </div>
                
                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {template.description}
                  </p>
                  
                  {/* Slide Preview */}
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Slide Themes:
                    </div>
                    <div className="flex space-x-2">
                      {template.slides.slice(0, 3).map((slide, index) => (
                        <div
                          key={index}
                          className="w-8 h-6 rounded border"
                          style={{ backgroundColor: slide.background }}
                          title={slide.title}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {(!templates[selectedCategory] || templates[selectedCategory].length === 0) && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🎨</div>
              <div className="text-gray-500 dark:text-gray-400">
                No templates available in this category yet.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateLibrary;