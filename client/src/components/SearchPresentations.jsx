import React, { useState, useEffect } from 'react';
import { listLocalPresentations, loadFromLocal } from '../utils/cloudStorage';

const SearchPresentations = ({ onClose, onLoadPresentation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchTerm.trim()) {
      performSearch(searchTerm);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const performSearch = async (term) => {
    setIsSearching(true);
    try {
      const presentations = listLocalPresentations();
      const results = [];

      for (const presentation of presentations) {
        const data = loadFromLocal(presentation.filename);
        if (data && data.slides) {
          // Search in presentation name
          if (presentation.filename.toLowerCase().includes(term.toLowerCase())) {
            results.push({
              ...presentation,
              matchType: 'title',
              matchText: presentation.filename,
              slideCount: data.slides.length
            });
            continue;
          }

          // Search in slide content
          for (let i = 0; i < data.slides.length; i++) {
            const slide = data.slides[i];
            const searchableText = `${slide.title || ''} ${slide.content || ''}`.toLowerCase();
            
            if (searchableText.includes(term.toLowerCase())) {
              results.push({
                ...presentation,
                matchType: 'content',
                matchText: slide.title || 'Untitled Slide',
                slideIndex: i,
                slideCount: data.slides.length
              });
              break; // Only add once per presentation
            }
          }
        }
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLoadPresentation = (filename) => {
    try {
      const data = loadFromLocal(filename);
      if (data && data.slides) {
        onLoadPresentation(data);
        onClose();
      }
    } catch (error) {
      alert('Failed to load presentation: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-3/4 max-w-4xl h-3/4 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Search Presentations
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search presentations, titles, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <div className="absolute left-3 top-3.5 text-gray-400">
              🔍
            </div>
            {isSearching && (
              <div className="absolute right-3 top-3.5">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 p-4 overflow-y-auto">
          {searchTerm.trim() === '' ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <div className="text-gray-500 dark:text-gray-400">
                Start typing to search your presentations
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-3">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchTerm}"
              </div>
              
              {searchResults.map((result, index) => (
                <div
                  key={`${result.filename}-${index}`}
                  className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  onClick={() => handleLoadPresentation(result.filename)}
                >
                  {/* Icon */}
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {result.filename}
                    </h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {result.matchType === 'title' ? (
                        <span>Match in presentation title</span>
                      ) : (
                        <span>Match in slide: "{result.matchText}"</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {result.slideCount} slides • Modified {new Date(result.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {/* Match Type Badge */}
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    result.matchType === 'title' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {result.matchType === 'title' ? 'Title' : 'Content'}
                  </div>
                </div>
              ))}
            </div>
          ) : !isSearching ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <div className="text-gray-500 dark:text-gray-400 mb-2">
                No presentations found for "{searchTerm}"
              </div>
              <div className="text-sm text-gray-400 dark:text-gray-500">
                Try different keywords or check your spelling
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchPresentations;