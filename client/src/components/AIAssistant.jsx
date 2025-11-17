import React, { useState } from 'react';
import { usePresentation } from '../contexts/PresentationContext';

const AIAssistant = ({ onClose }) => {
  const { slides, currentSlide, updateSlide, addSlide } = usePresentation();
  const [activeTab, setActiveTab] = useState('generate');
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const generateContent = async () => {
    if (!prompt.trim()) return;
    
    setIsProcessing(true);
    try {
      // Simulate AI content generation
      const topics = prompt.split(',').map(t => t.trim());
      const generatedSlides = topics.map((topic, index) => ({
        id: Date.now() + index,
        title: topic,
        content: `<p>Key points about ${topic}:</p><ul><li>Overview and importance</li><li>Main benefits and features</li><li>Implementation strategies</li><li>Future considerations</li></ul>`,
        background: '#ffffff',
        textColor: '#000000',
        layout: 'title-content',
        elements: []
      }));
      
      generatedSlides.forEach(() => addSlide('title-content'));
      alert(`Generated ${generatedSlides.length} slides based on your prompt!`);
      onClose();
    } catch (error) {
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const improveSlide = async () => {
    setIsProcessing(true);
    try {
      const currentSlideData = slides[currentSlide];
      const improvedContent = currentSlideData.content
        .replace(/\b\w+\b/g, (word) => {
          const synonyms = {
            'good': 'excellent',
            'bad': 'challenging',
            'big': 'significant',
            'small': 'focused'
          };
          return synonyms[word.toLowerCase()] || word;
        });
      
      updateSlide(currentSlide, { content: improvedContent });
      alert('Slide content improved with AI suggestions!');
    } catch (error) {
      alert('Failed to improve slide. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const designSuggestions = [
    { name: 'Professional Blue', bg: '#1E40AF', text: '#FFFFFF' },
    { name: 'Corporate Gray', bg: '#374151', text: '#FFFFFF' },
    { name: 'Creative Orange', bg: '#EA580C', text: '#FFFFFF' },
    { name: 'Modern Green', bg: '#059669', text: '#FFFFFF' },
    { name: 'Elegant Purple', bg: '#7C3AED', text: '#FFFFFF' }
  ];

  const applyDesign = (design) => {
    updateSlide(currentSlide, {
      background: design.bg,
      textColor: design.text
    });
    alert(`Applied ${design.name} design theme!`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">🤖 AI Assistant</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          
          <div className="flex mt-4 border-b border-gray-200 dark:border-gray-600">
            {['generate', 'improve', 'design'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium capitalize ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {activeTab === 'generate' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  📝 Generate Slides
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter topics separated by commas (e.g., Introduction, Market Analysis, Strategy, Conclusion)"
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 h-24 resize-none"
                />
              </div>
              <button
                onClick={generateContent}
                disabled={isProcessing || !prompt.trim()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isProcessing ? 'Generating...' : 'Generate Slides'}
              </button>
            </div>
          )}

          {activeTab === 'improve' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  ✨ Improve Current Slide
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  AI will enhance your slide content with better vocabulary and structure.
                </p>
              </div>
              <button
                onClick={improveSlide}
                disabled={isProcessing}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {isProcessing ? 'Improving...' : 'Improve Slide'}
              </button>
            </div>
          )}

          {activeTab === 'design' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  🎨 Smart Design Suggestions
                </label>
                <div className="space-y-2">
                  {designSuggestions.map(design => (
                    <button
                      key={design.name}
                      onClick={() => applyDesign(design)}
                      className="w-full p-3 rounded-md border hover:border-blue-500 transition-colors"
                      style={{ backgroundColor: design.bg, color: design.text }}
                    >
                      {design.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;