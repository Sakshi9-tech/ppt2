import React, { useState, useEffect } from 'react';
import { usePresentation } from '../contexts/PresentationContext';

const PresenterMode = ({ isActive, onExit }) => {
  const { slides, currentSlide, setCurrentSlide } = usePresentation();
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

  if (!isActive) return null;

  const currentSlideData = slides[currentSlide] || {};
  const nextSlideData = slides[currentSlide + 1] || null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex">
      {/* Main Presentation View */}
      <div className="flex-1 flex items-center justify-center">
        <div 
          className="w-full max-w-4xl aspect-video bg-white rounded-lg shadow-2xl p-8"
          style={{ backgroundColor: currentSlideData.background || '#ffffff' }}
        >
          <div 
            className="text-4xl font-bold text-center mb-8"
            style={{ color: currentSlideData.textColor || '#000000' }}
            dangerouslySetInnerHTML={{ __html: currentSlideData.title || 'Slide Title' }}
          />
          <div 
            className="text-xl leading-relaxed"
            style={{ color: currentSlideData.textColor || '#000000' }}
            dangerouslySetInnerHTML={{ __html: currentSlideData.content || 'Slide content' }}
          />
          
          {/* Render slide elements */}
          {(currentSlideData.elements || []).map((element) => (
            <div
              key={element.id}
              className="absolute"
              style={{
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height
              }}
            >
              {element.type === 'textbox' && (
                <div 
                  style={{
                    fontSize: element.fontSize,
                    fontFamily: element.fontFamily,
                    color: element.color
                  }}
                  dangerouslySetInnerHTML={{ __html: element.content }}
                />
              )}
              {element.type === 'image' && (
                <img src={element.src} alt={element.alt} className="w-full h-full object-cover" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Presenter Panel */}
      <div className="w-80 bg-gray-900 text-white p-4 flex flex-col">
        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="px-3 py-1 bg-blue-600 rounded text-sm"
            >
              {isTimerRunning ? '⏸️' : '▶️'}
            </button>
            <span className="text-lg font-mono">{formatTime(timer)}</span>
          </div>
          <button
            onClick={onExit}
            className="px-3 py-1 bg-red-600 rounded text-sm"
          >
            Exit
          </button>
        </div>

        {/* Slide Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="px-3 py-1 bg-gray-700 rounded text-sm disabled:opacity-50"
          >
            ← Previous
          </button>
          <span className="text-sm">
            {currentSlide + 1} / {slides.length}
          </span>
          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="px-3 py-1 bg-gray-700 rounded text-sm disabled:opacity-50"
          >
            Next →
          </button>
        </div>

        {/* Speaker Notes */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">📝 Speaker Notes</h4>
          <div className="bg-gray-800 p-3 rounded text-sm max-h-32 overflow-y-auto">
            {currentSlideData.speakerNotes || 'No notes for this slide'}
          </div>
        </div>

        {/* Next Slide Preview */}
        {nextSlideData && (
          <div>
            <h4 className="text-sm font-medium mb-2">👀 Next Slide</h4>
            <div className="bg-gray-800 p-2 rounded">
              <div className="text-xs font-medium mb-1">
                {nextSlideData.title || 'Next Slide'}
              </div>
              <div className="text-xs text-gray-400 line-clamp-3">
                {nextSlideData.content?.replace(/<[^>]*>/g, '') || 'Next slide content'}
              </div>
            </div>
          </div>
        )}

        {/* Slide Thumbnails */}
        <div className="mt-4 flex-1 overflow-y-auto">
          <h4 className="text-sm font-medium mb-2">📋 All Slides</h4>
          <div className="space-y-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(index)}
                className={`w-full p-2 text-left rounded text-xs ${
                  index === currentSlide ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <div className="font-medium">{index + 1}. {slide.title}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresenterMode;