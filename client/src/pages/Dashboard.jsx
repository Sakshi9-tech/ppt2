import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Toolbar from '../components/Toolbar';
import Sidebar from '../components/Sidebar';
import SlideEditor from '../components/SlideEditor';
import SpeakerNotes from '../components/SpeakerNotes';
import LayoutSelector from '../components/LayoutSelector';
import FormatPanel from '../components/FormatPanel';
import DrawingTools from '../components/DrawingTools';
import EnhancedChartComponent from '../components/EnhancedChartComponent';
import AddInsPanel from '../components/AddInsPanel';
import AnimationPanel from '../components/AnimationPanel';
import PresenterMode from '../components/PresenterMode';
import SlideShow from '../components/SlideShow';
import KeyboardShortcuts from '../components/KeyboardShortcuts';
import PresentationManager from '../components/PresentationManager';
import TemplateLibrary from '../components/TemplateLibrary';
import RecentPresentations from '../components/RecentPresentations';
import SearchPresentations from '../components/SearchPresentations';
import AIAssistant from '../components/AIAssistant';
import CloudSync from '../components/CloudSync';
import AdvancedExport from '../components/AdvancedExport';
import InteractiveElements from '../components/InteractiveElements';
import MobileView from '../components/MobileView';
import VersionHistory from '../components/VersionHistory';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [activePanel, setActivePanel] = useState(null);
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showPresentationManager, setShowPresentationManager] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [showRecentPresentations, setShowRecentPresentations] = useState(false);
  const [showSearchPresentations, setShowSearchPresentations] = useState(false);
  const [showPresenterMode, setShowPresenterMode] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showCloudSync, setShowCloudSync] = useState(false);
  const [showAdvancedExport, setShowAdvancedExport] = useState(false);
  const [showInteractiveElements, setShowInteractiveElements] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);

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
      case 'animations':
        return <AnimationPanel />;
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
              <button 
                onClick={() => navigate('/')}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                Home
              </button>
              <button className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                Insert
              </button>
              <button className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                Design
              </button>
              <button 
                onClick={() => setActivePanel(activePanel === 'animations' ? null : 'animations')}
                className={`text-sm hover:text-gray-800 dark:hover:text-white ${
                  activePanel === 'animations' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Animations
              </button>
              <button 
                onClick={() => setIsSlideshow(true)}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                Slideshow
              </button>
              <button 
                onClick={() => setShowPresenterMode(true)}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                Presenter
              </button>
              <button 
                onClick={() => setShowAIAssistant(true)}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                🤖 AI
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCloudSync(true)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              title="Cloud Sync"
            >
              ☁️
            </button>
            <button
              onClick={() => setShowAdvancedExport(true)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              title="Advanced Export"
            >
              🚀
            </button>
            <button
              onClick={() => setShowInteractiveElements(true)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              title="Interactive Elements"
            >
              ⚡
            </button>
            <button
              onClick={() => setShowVersionHistory(true)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              title="Version History"
            >
              📚
            </button>
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
      
      {/* Speaker Notes */}
      <SpeakerNotes />

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
      
      {/* Presenter Mode */}
      <PresenterMode 
        isActive={showPresenterMode} 
        onExit={() => setShowPresenterMode(false)} 
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
      
      {/* New Feature Modals */}
      {showAIAssistant && <AIAssistant onClose={() => setShowAIAssistant(false)} />}
      {showCloudSync && <CloudSync onClose={() => setShowCloudSync(false)} />}
      {showAdvancedExport && <AdvancedExport onClose={() => setShowAdvancedExport(false)} />}
      {showInteractiveElements && <InteractiveElements onClose={() => setShowInteractiveElements(false)} />}
      {showVersionHistory && <VersionHistory onClose={() => setShowVersionHistory(false)} />}
      
      {/* Mobile View */}
      <MobileView />
    </div>
  );
};

export default Dashboard;