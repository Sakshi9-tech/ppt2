import React, { useState } from 'react';
import { usePresentation } from '../contexts/PresentationContext';
import { useTheme } from '../contexts/ThemeContext';
import { exportToPPTX, exportToPDF, printPresentation, exportToJSON } from '../utils/exportUtils';
import { saveToLocal, loadFromLocal } from '../utils/cloudStorage';
import ImportExport from './ImportExport';
import PresentationManager from './PresentationManager';
import TemplateLibrary from './TemplateLibrary';
import RecentPresentations from './RecentPresentations';

const Toolbar = ({ activePanel, setActivePanel }) => {
  const { slides, addSlide, resetSlide, currentSlide, undo, redo } = usePresentation();
  const { isDark, toggleTheme } = useTheme();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const [showPresentationManager, setShowPresentationManager] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [showRecentPresentations, setShowRecentPresentations] = useState(false);

  const handleExport = (type) => {
    switch (type) {
      case 'pptx':
        exportToPPTX(slides);
        break;
      case 'pdf':
        exportToPDF(slides);
        break;
      case 'print':
        printPresentation();
        break;
    }
    setShowExportMenu(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
      <div className="flex items-center space-x-2 flex-wrap">
        {/* File Operations */}
        <div className="flex items-center space-x-1 border-r border-gray-300 dark:border-gray-600 pr-2">
          <button
            onClick={() => setShowPresentationManager(true)}
            className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            title="Manage Presentations"
          >
            📁 Manage
          </button>
          <button
            onClick={() => setShowTemplateLibrary(true)}
            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            title="Template Library"
          >
            🎨 Templates
          </button>
          <button
            onClick={() => addSlide()}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            title="New Slide (Ctrl+Shift+N)"
          >
            📄 New Slide
          </button>
          <button
            onClick={() => {
              try {
                const name = prompt('Enter presentation name:') || `presentation-${Date.now()}`;
                saveToLocal({ slides, name, created: new Date().toISOString() }, name);
                alert('Presentation saved locally!');
              } catch (error) {
                alert('Save failed: ' + error.message);
              }
            }}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            title="Quick Save (Ctrl+S)"
          >
            💾 Save
          </button>
        </div>

        {/* Edit Operations */}
        <div className="flex items-center space-x-1 border-r border-gray-300 dark:border-gray-600 pr-2">
          <button
            onClick={undo}
            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            title="Undo (Ctrl+Z)"
          >
            ↶ Undo
          </button>
          <button
            onClick={redo}
            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            title="Redo (Ctrl+Y)"
          >
            ↷ Redo
          </button>
        </div>

        {/* Panel Toggles */}
        <div className="flex items-center space-x-1 border-r border-gray-300 dark:border-gray-600 pr-2">
          <button
            onClick={() => setActivePanel(activePanel === 'layout' ? null : 'layout')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              activePanel === 'layout'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
            }`}
          >
            📐 Layout
          </button>
          <button
            onClick={() => setActivePanel(activePanel === 'format' ? null : 'format')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              activePanel === 'format'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
            }`}
          >
            🎨 Format
          </button>
          <button
            onClick={() => setActivePanel(activePanel === 'draw' ? null : 'draw')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              activePanel === 'draw'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
            }`}
          >
            ✏️ Draw
          </button>
          <button
            onClick={() => setActivePanel(activePanel === 'addins' ? null : 'addins')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              activePanel === 'addins'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
            }`}
          >
            🧩 Add-ins
          </button>
        </div>

        {/* Import/Export */}
        <div className="flex items-center space-x-1 border-r border-gray-300 dark:border-gray-600 pr-2">
          <button
            onClick={() => setShowImportExport(true)}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            📁 Import/Export
          </button>
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              📤 Quick Export
            </button>
            {showExportMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                <button
                  onClick={() => handleExport('pptx')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  📊 Export as PPTX
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  📄 Export as PDF
                </button>
                <button
                  onClick={() => handleExport('print')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  🖨️ Print
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          title="Toggle Theme"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
      
      {/* Modals */}
      {showImportExport && (
        <ImportExport onClose={() => setShowImportExport(false)} />
      )}
      
      {showPresentationManager && (
        <PresentationManager 
          onClose={() => setShowPresentationManager(false)}
          onLoadPresentation={(data) => console.log('Loaded:', data)}
        />
      )}
      
      {showTemplateLibrary && (
        <TemplateLibrary onClose={() => setShowTemplateLibrary(false)} />
      )}
      
      {showRecentPresentations && (
        <RecentPresentations 
          onClose={() => setShowRecentPresentations(false)}
          onLoadPresentation={(data) => console.log('Loaded:', data)}
        />
      )}
    </div>
  );
};

export default Toolbar;