import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePresentation } from '../contexts/PresentationContext';
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
  const { slides, currentSlide } = usePresentation();
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
    <div className="h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
      <KeyboardShortcuts />
      
      {/* Modern Top Menu Bar */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shadow-soft">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-8">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-neutral-800 to-neutral-600 dark:from-neutral-200 dark:to-neutral-400 bg-clip-text text-transparent">
                EtherXPPT
              </span>
            </div>
            
            {/* Navigation Menu */}
            <nav className="flex items-center space-x-1">
              <div className="relative">
                <button 
                  onClick={() => setShowFileMenu(!showFileMenu)}
                  className="px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200"
                >
                  File
                </button>
                {showFileMenu && (
                  <div className="dropdown-menu">
                    <button
                      onClick={() => {
                        setShowPresentationManager(true);
                        setShowFileMenu(false);
                      }}
                      className="dropdown-item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      </svg>
                      Manage Presentations
                    </button>
                    <button
                      onClick={() => {
                        setShowTemplateLibrary(true);
                        setShowFileMenu(false);
                      }}
                      className="dropdown-item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
                      </svg>
                      Template Library
                    </button>
                    <button
                      onClick={() => {
                        setShowRecentPresentations(true);
                        setShowFileMenu(false);
                      }}
                      className="dropdown-item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Recent Presentations
                    </button>
                    <button
                      onClick={() => {
                        setShowSearchPresentations(true);
                        setShowFileMenu(false);
                      }}
                      className="dropdown-item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Search Presentations
                    </button>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => navigate('/')}
                className="px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200"
              >
                Home
              </button>
              
              <button className="px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200">
                Insert
              </button>
              
              <button className="px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200">
                Design
              </button>
              
              <button 
                onClick={() => setActivePanel(activePanel === 'animations' ? null : 'animations')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activePanel === 'animations' 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                    : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                Animations
              </button>
              
              <button 
                onClick={() => setIsSlideshow(true)}
                className="px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200"
              >
                Slideshow
              </button>
              
              <button 
                onClick={() => setShowPresenterMode(true)}
                className="px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200"
              >
                Presenter
              </button>
              
              <button 
                onClick={() => setShowAIAssistant(true)}
                className="px-3 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900 rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Assistant
              </button>
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowCloudSync(true)}
                className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-all duration-200"
                title="Cloud Sync"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </button>
              
              <button
                onClick={() => setShowAdvancedExport(true)}
                className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-all duration-200"
                title="Advanced Export"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </button>
              
              <button
                onClick={() => setShowSearchPresentations(true)}
                className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-all duration-200"
                title="Search Presentations (Ctrl+F)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-all duration-200"
                title="Toggle Theme"
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
              </button>
            </div>
            
            <div className="h-6 w-px bg-neutral-300 dark:bg-neutral-700 mx-2"></div>
            
            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {user?.name || 'User'}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  {user?.email || 'user@example.com'}
                </div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </div>
              <button
                onClick={logout}
                className="p-2 text-neutral-500 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 transition-colors duration-200"
                title="Logout"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
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

      {/* Modern Status Bar */}
      <div className="status-bar">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-soft"></div>
            <span className="font-medium">Ready</span>
          </div>
          <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-700"></div>
          <div className="flex items-center space-x-2">
            <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Auto-save: On</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span>Zoom: 100%</span>
          <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-700"></div>
          <span>View: Normal</span>
          <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-700"></div>
          <span>Slide {currentSlide + 1} of {slides.length}</span>
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