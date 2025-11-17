import React, { useState, useEffect } from 'react';
import { usePresentation } from '../contexts/PresentationContext';

const VersionHistory = ({ onClose }) => {
  const { slides, setSlides } = usePresentation();
  const [versions, setVersions] = useState([]);

  useEffect(() => {
    // Load version history from localStorage
    const history = JSON.parse(localStorage.getItem('presentationHistory') || '[]');
    setVersions(history.slice(0, 10)); // Show last 10 versions
  }, []);

  const saveVersion = () => {
    const version = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      slides: JSON.parse(JSON.stringify(slides)),
      description: `Version ${versions.length + 1}`,
      slideCount: slides.length
    };

    const updatedVersions = [version, ...versions].slice(0, 10);
    setVersions(updatedVersions);
    localStorage.setItem('presentationHistory', JSON.stringify(updatedVersions));
    alert('Version saved successfully!');
  };

  const restoreVersion = (version) => {
    if (confirm(`Restore to ${version.description}? Current changes will be lost.`)) {
      setSlides(version.slides);
      onClose();
      alert('Version restored successfully!');
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">📚 Version History</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <button
            onClick={saveVersion}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            💾 Save Current Version
          </button>

          <div>
            <h4 className="text-sm font-medium mb-2">Previous Versions</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {versions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No versions saved yet
                </div>
              ) : (
                versions.map(version => (
                  <div key={version.id} className="p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{version.description}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(version.timestamp)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {version.slideCount} slides
                        </div>
                      </div>
                      <button
                        onClick={() => restoreVersion(version)}
                        className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Restore
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="text-xs text-gray-500 p-2 bg-gray-50 dark:bg-gray-700 rounded">
            💡 Tip: Versions are automatically saved every 10 minutes and when you make major changes.
          </div>
        </div>
      </div>
    </div>
  );
};

export default VersionHistory;