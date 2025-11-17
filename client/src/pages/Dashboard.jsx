import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Toolbar from '../components/Toolbar';
import Sidebar from '../components/Sidebar';
import SlideEditor from '../components/SlideEditor';
import LayoutSelector from '../components/LayoutSelector';
import FormatPanel from '../components/FormatPanel';
import DrawingTools from '../components/DrawingTools';
import EnhancedChartComponent from '../components/EnhancedChartComponent';
import AddInsPanel from '../components/AddInsPanel';
import SlideShow from '../components/SlideShow';
import KeyboardShortcuts from '../components/KeyboardShortcuts';
import PresentationManager from '../components/PresentationManager';
import TemplateLibrary from '../components/TemplateLibrary';
import RecentPresentations from '../components/RecentPresentations';
import SearchPresentations from '../components/SearchPresentations';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [activePanel, setActivePanel] = useState(null);
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showPresentationManager, setShowPresentationManager] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [showRecentPresentations, setShowRecentPresentations] = useState(false);
  const [showSearchPresentations, setShowSearchPresentations] = useState(false);

  useEffect(() => {
    const handleStartSlideshow = () => setIsSlideshow(true);
    const handleExitSlideshow = () => setIsSlideshow(false);

    window.addEventListener('startSlideshow', handleStartSlideshow);
    window.addEventListener('exitSlideshow', handleExitSlideshow);

    return () => {
      window.removeEventListener('startSlideshow', handleStartSlideshow);
      window.removeEventListener('exitSlideshow', handleExitSlideshow);
    };
  }, []);

  const renderRightPanel = () => {
    switch (activePanel) {
      case 'layout':
        return <LayoutSelector />;
      case 'format':
        return <FormatPanel />;
      case 'draw':
        return <DrawingTools />;
      case 'charts':
        return <EnhancedChartComponent />;
      case 'addins':
        return <AddInsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <KeyboardShortcuts />
      
      {/* Top Menu Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img src="/src/assets/icons/DOCS-LOGO-final-transparent.png" alt="Logo" className="w-8 h-8" />
              <span className="text-xl font-bold text-gray-800 dark:text-white">EtherXPPT</span>
            </div>
            
            {/* Menu Items */}
            <nav className="flex space-x-6">
              <div className="relative">
                <button 
                  onClick={() => setShowFileMenu(!showFileMenu)}
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                  File
                </button>
                {showFileMenu && (
                  <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 w-48">
                    <button
                      onClick={() => {
                        setShowPresentationManager(true);
                        setShowFileMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      📁 Manage Presentations
                    </button>
                    <button
                      onClick={() => {
                        setShowTemplateLibrary(true);
                        setShowFileMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      🎨 Template Library
                    </button>
                    <button
                      onClick={() => {
                        setShowRecentPresentations(true);
                        setShowFileMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      🕰 Recent Presentations
                    </button>
                    <button
                      onClick={() => {
                        setShowSearchPresentations(true);
                        setShowFileMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      🔍 Search Presentations
                    </button>
                  </div>
                )}
              </div>
              <button className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                Home
              </button>
              <button className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                Insert
              </button>
              <button className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                Design
              </button>
              <button className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                Animations
              </button>
              <button 
                onClick={() => setIsSlideshow(true)}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                Slideshow
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSearchPresentations(true)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              title="Search Presentations (Ctrl+F)"
            >
              🔍
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              title="Toggle Theme"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, {user?.email || 'User'}
              </span>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <Toolbar activePanel={activePanel} setActivePanel={setActivePanel} />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Slide Editor */}
        <SlideEditor />

        {/* Right Panel */}
        {renderRightPanel()}
      </div>

      {/* Status Bar */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span>Ready</span>
            <span>•</span>
            <span>Auto-save: On</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Zoom: 100%</span>
            <span>•</span>
            <span>View: Normal</span>
          </div>
        </div>
      </div>

      {/* Slideshow */}
      <SlideShow 
        isActive={isSlideshow} 
        onExit={() => setIsSlideshow(false)} 
      />
      
      {/* Presentation Management Modals */}
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
      
      {showSearchPresentations && (
        <SearchPresentations 
          onClose={() => setShowSearchPresentations(false)}
          onLoadPresentation={(data) => console.log('Loaded:', data)}
        />
      )}
    </div>
  );
};

export default Dashboard;