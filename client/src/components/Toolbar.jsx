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

  const ToolbarButton = ({ onClick, active, children, title, variant = 'default' }) => {
    const baseClasses = 'toolbar-btn';
    /* Map variant names to the new theme classes so visuals match dark+gold palette */
    const variantClasses = {
      default: active ? 'active' : '',
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      success: 'btn-primary',
      warning: 'btn-primary'
    };
    
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variantClasses[variant]}`}
        title={title}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="toolbar">
      <div className="flex items-center gap-1 flex-wrap">
        {/* File Operations */}
        <div className="toolbar-group">
          <ToolbarButton
            onClick={() => setShowPresentationManager(true)}
            title="Manage Presentations"
            variant="secondary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 1v6" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 1v6" />
            </svg>
            Manage
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => setShowTemplateLibrary(true)}
            title="Template Library"
            variant="secondary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Templates
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => addSlide()}
            title="New Slide (Ctrl+Shift+N)"
            variant="primary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Slide
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => {
              try {
                const name = prompt('Enter presentation name:') || `presentation-${Date.now()}`;
                saveToLocal({ slides, name, created: new Date().toISOString() }, name);
                alert('Presentation saved locally!');
              } catch (error) {
                alert('Save failed: ' + error.message);
              }
            }}
            title="Quick Save (Ctrl+S)"
            variant="success"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Save
          </ToolbarButton>
        </div>

        {/* Edit Operations */}
        <div className="toolbar-group">
          <ToolbarButton
            onClick={undo}
            title="Undo (Ctrl+Z)"
            variant="secondary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            Undo
          </ToolbarButton>
          
          <ToolbarButton
            onClick={redo}
            title="Redo (Ctrl+Y)"
            variant="secondary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
            </svg>
            Redo
          </ToolbarButton>
        </div>

        {/* Panel Toggles */}
        <div className="toolbar-group">
          <ToolbarButton
            onClick={() => setActivePanel(activePanel === 'layout' ? null : 'layout')}
            active={activePanel === 'layout'}
            title="Layout Panel"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Layout
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => setActivePanel(activePanel === 'format' ? null : 'format')}
            active={activePanel === 'format'}
            title="Format Panel"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
            </svg>
            Format
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => setActivePanel(activePanel === 'draw' ? null : 'draw')}
            active={activePanel === 'draw'}
            title="Drawing Tools"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Draw
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => setActivePanel(activePanel === 'addins' ? null : 'addins')}
            active={activePanel === 'addins'}
            title="Add-ins Panel"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Add-ins
          </ToolbarButton>
        </div>

        {/* Import/Export */}
        <div className="toolbar-group">
          <ToolbarButton
            onClick={() => setShowImportExport(true)}
            title="Import/Export"
            variant="secondary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            Import/Export
          </ToolbarButton>
          
          <div className="relative">
            <ToolbarButton
              onClick={() => setShowExportMenu(!showExportMenu)}
              title="Quick Export"
              variant="warning"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Export
            </ToolbarButton>
            
            {showExportMenu && (
              <div className="dropdown-menu">
                <button
                  onClick={() => handleExport('pptx')}
                  className="dropdown-item"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export as PPTX
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="dropdown-item"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Export as PDF
                </button>
                <button
                  onClick={() => handleExport('print')}
                  className="dropdown-item"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="toolbar-group">
          <ToolbarButton
            onClick={toggleTheme}
            title="Toggle Theme"
            variant="secondary"
          >
            {isDark ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </ToolbarButton>
        </div>
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