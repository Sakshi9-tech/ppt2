import React, { useEffect } from 'react';

const KeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        window.dispatchEvent(new Event('exitSlideshow'));
      }
      if (e.key === 'F5') {
        e.preventDefault();
        window.dispatchEvent(new Event('startSlideshow'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return null;
};

export default KeyboardShortcuts;