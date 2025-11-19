import React, { useState, useEffect } from 'react';

// Modern Professional SplashScreen with enhanced animations
function SplashScreen({ onLoadingComplete }) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [loadingText, setLoadingText] = useState('Initializing...');

  const SIMULATION_DURATION = 2500;
  const PROGRESS_INTERVAL = 50;

  const loadingSteps = [
    { progress: 20, text: 'Loading components...' },
    { progress: 40, text: 'Setting up workspace...' },
    { progress: 60, text: 'Preparing templates...' },
    { progress: 80, text: 'Finalizing setup...' },
    { progress: 100, text: 'Ready to create!' }
  ];

  useEffect(() => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      let newProgress = (elapsed / SIMULATION_DURATION) * 100;

      // Update loading text based on progress
      const currentStep = loadingSteps.find(step => newProgress >= step.progress - 20 && newProgress < step.progress + 20);
      if (currentStep) {
        setLoadingText(currentStep.text);
      }

      if (newProgress >= 100) {
        newProgress = 100;
        setLoadingText('Ready to create!');
        clearInterval(interval);

        setTimeout(() => {
          setIsVisible(false);
          setTimeout(onLoadingComplete, 600);
        }, 400);
      }

      setProgress(newProgress);
    }, PROGRESS_INTERVAL);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center p-8 transition-all duration-600 z-50 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      style={{ background: 'var(--primary-dark)' }}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-soft"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-soft animation-delay-200"></div>
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-primary-50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-soft animation-delay-100"></div>
      </div>

      <div className="relative flex flex-col items-center space-y-8 max-w-md w-full">
        {/* Modern Logo */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl blur-lg opacity-30 animate-pulse-soft"></div>
          <div className="relative p-6 bg-white rounded-2xl shadow-strong border border-neutral-200">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center animate-bounce-in">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <div className="text-center space-y-2 animate-fade-in animation-delay-200">
          <h1 className="text-5xl font-bold" style={{ color: 'var(--accent-gold)' }}>
            EtherXPPT
          </h1>
          <p className="text-lg font-medium muted">
            Professional Presentation Suite
          </p>
        </div>
        
        {/* Loading Status */}
        <div className="text-center space-y-4 w-full animate-fade-in animation-delay-300">
          <p className="text-sm font-medium h-5 transition-all duration-300 muted">
            {loadingText}
          </p>

          {/* Modern Progress Bar */}
          <div className="w-full">
            <div className="flex justify-between text-xs mb-2 muted">
              <span>Loading</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden shadow-inner" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
              <div
                className="h-full rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--accent-gold), var(--gold-hover))' }}
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 -skew-x-12 animate-slide-in-right" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-3 gap-4 w-full animate-fade-in animation-delay-300">
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
              </svg>
            </div>
            <p className="text-xs font-medium muted">Templates</p>
          </div>
          
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
            </div>
            <p className="text-xs font-medium muted">Charts</p>
          </div>
          
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <p className="text-xs font-medium muted">Export</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;