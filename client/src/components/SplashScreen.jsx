import React, { useState, useEffect } from 'react';
import logo from '../assets/icons/DOCS-LOGO-final-transparent.png';

// The SplashScreen component simulates the loading process and handles the transition.
function SplashScreen({ onLoadingComplete }) {
  // State to control the width of the progress bar (0% to 100%)
  const [progress, setProgress] = useState(0);
  // State to control the visibility/fade of the entire splash screen
  const [isVisible, setIsVisible] = useState(true);

  // Constants for the loading simulation
  const SIMULATION_DURATION = 3000; // Total time in milliseconds (3 seconds)
  const PROGRESS_INTERVAL = 100;    // Update interval in milliseconds

  useEffect(() => {
    // 1. Start the loading animation
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      let newProgress = (elapsed / SIMULATION_DURATION) * 100;

      if (newProgress >= 100) {
        newProgress = 100;
        clearInterval(interval);

        // 2. Once progress is 100%, start the fade-out process
        setTimeout(() => {
          setIsVisible(false); // Start fading out (opacity transition)

          // 3. After the fade-out duration, call the completion handler
          // This delay should match the CSS transition duration (500ms)
          setTimeout(onLoadingComplete, 500);
        }, 300); // Small delay before fade starts
      }

      setProgress(newProgress);
    }, PROGRESS_INTERVAL);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  // If the component is no longer visible (faded out), return nothing.
  if (!isVisible) {
    return null;
  }

  // Tailwind CSS classes provide the visual design and responsiveness
  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center p-8 transition-opacity duration-500 z-50 shadow-2xl ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ 
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#1B1A17'
      }}
    >
      <div className="flex flex-col items-center space-y-8 max-w-sm w-full">
        
        {/* EtherXPPT Logo */}
        <div className="p-4 bg-gray-800 rounded-2xl shadow-xl border border-gray-700">
          <img 
            src={logo} 
            alt="EtherXPPT Logo" 
            className="w-16 h-16 object-contain"
          />
        </div>

        {/* Application Title */}
        <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: '#F0A500' }}>
          Loading Application...
        </h1>
        
        {/* Status Text */}
        <p className="text-sm font-medium text-gray-400">
          Preparing environment for launch.
        </p>

        {/* Loading Bar Container */}
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden shadow-inner">
          {/* Progress Bar with Transition */}
          <div
            className="h-full rounded-full transition-all duration-100 ease-linear"
            style={{ 
              width: `${progress}%`,
              backgroundColor: '#F0A500'
            }}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;