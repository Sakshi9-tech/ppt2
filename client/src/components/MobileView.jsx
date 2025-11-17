import React, { useState, useEffect } from 'react';
import { usePresentation } from '../contexts/PresentationContext';

const MobileView = () => {
  const { slides, currentSlide, setCurrentSlide } = usePresentation();
  const [isMobile, setIsMobile] = useState(false);
  const [showSlideList, setShowSlideList] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  const slide = slides[currentSlide] || {};

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100 dark:bg-gray-900 z-50 flex flex-col">
      {/* Mobile Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">EtherXPPT</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSlideList(!showSlideList)}
              className="p-2 bg-gray-200 dark:bg-gray-700 rounded"
            >
              📋
            </button>
            <span className="text-sm">{currentSlide + 1}/{slides.length}</span>
          </div>
        </div>
      </div>

      {/* Slide List Overlay */}
      {showSlideList && (
        <div className="absolute inset-0 bg-white dark:bg-gray-800 z-10 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">All Slides</h2>
            <button
              onClick={() => setShowSlideList(false)}
              className="p-2 bg-gray-200 dark:bg-gray-700 rounded"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 overflow-y-auto">
            {slides.map((s, index) => (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentSlide(index);
                  setShowSlideList(false);
                }}
                className={`p-3 rounded-lg border-2 text-left ${
                  index === currentSlide
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                    : 'border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className="text-sm font-medium mb-1">
                  {index + 1}. {s.title || 'Untitled'}
                </div>
                <div className="text-xs text-gray-500 line-clamp-2">
                  {s.content?.replace(/<[^>]*>/g, '') || 'No content'}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Slide View */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div 
          className="w-full max-w-sm aspect-video bg-white rounded-lg shadow-lg p-4"
          style={{ backgroundColor: slide.background || '#ffffff' }}
        >
          <div 
            className="text-lg font-bold text-center mb-3"
            style={{ color: slide.textColor || '#000000' }}
            dangerouslySetInnerHTML={{ __html: slide.title || 'Slide Title' }}
          />
          <div 
            className="text-sm leading-relaxed"
            style={{ color: slide.textColor || '#000000' }}
            dangerouslySetInnerHTML={{ __html: slide.content || 'Slide content' }}
          />
          
          {/* Mobile-optimized elements */}
          {(slide.elements || []).map((element) => (
            <div
              key={element.id}
              className="absolute"
              style={{
                left: `${(element.x / 800) * 100}%`,
                top: `${(element.y / 600) * 100}%`,
                width: `${(element.width / 800) * 100}%`,
                height: `${(element.height / 600) * 100}%`,
                fontSize: `${(element.fontSize || 16) * 0.8}px`
              }}
            >
              {element.type === 'textbox' && (
                <div 
                  style={{ color: element.color }}
                  dangerouslySetInnerHTML={{ __html: element.content }}
                />
              )}
              {element.type === 'image' && (
                <img src={element.src} alt={element.alt} className="w-full h-full object-cover rounded" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:bg-gray-400"
          >
            ← Previous
          </button>
          
          <div className="flex space-x-2">
            <button className="p-2 bg-gray-200 dark:bg-gray-700 rounded">
              🎨
            </button>
            <button className="p-2 bg-gray-200 dark:bg-gray-700 rounded">
              ➕
            </button>
            <button className="p-2 bg-gray-200 dark:bg-gray-700 rounded">
              📤
            </button>
          </div>
          
          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:bg-gray-400"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileView;