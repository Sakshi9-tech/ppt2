import React, { useState } from 'react';
import { usePresentation } from '../contexts/PresentationContext';

const AdvancedExport = ({ onClose }) => {
  const { slides } = usePresentation();
  const [exportOptions, setExportOptions] = useState({
    format: 'pptx',
    quality: 'high',
    includeNotes: true,
    includeAnimations: true,
    watermark: false,
    password: '',
    customSize: false,
    width: 1920,
    height: 1080
  });

  const exportFormats = [
    { id: 'pptx', name: 'PowerPoint (.pptx)', icon: '📊', features: ['animations', 'notes', 'password'] },
    { id: 'pdf', name: 'PDF Document', icon: '📄', features: ['password', 'watermark'] },
    { id: 'video', name: 'Video (.mp4)', icon: '🎥', features: ['animations', 'timing'] },
    { id: 'interactive', name: 'Interactive HTML', icon: '🌐', features: ['animations', 'links'] },
    { id: 'images', name: 'Image Sequence', icon: '🖼️', features: ['quality', 'size'] }
  ];

  const handleExport = async () => {
    try {
      const exportData = {
        slides,
        options: exportOptions,
        timestamp: new Date().toISOString()
      };

      // Simulate advanced export processing
      console.log('Exporting with options:', exportData);
      
      if (exportOptions.format === 'video') {
        alert('Video export started! This may take a few minutes...');
      } else if (exportOptions.format === 'interactive') {
        alert('Interactive HTML export completed with navigation and animations!');
      } else {
        alert(`Advanced ${exportOptions.format.toUpperCase()} export completed successfully!`);
      }
      
      onClose();
    } catch (error) {
      alert('Export failed: ' + error.message);
    }
  };

  const selectedFormat = exportFormats.find(f => f.id === exportOptions.format);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">🚀 Advanced Export</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Export Format</label>
            <div className="space-y-2">
              {exportFormats.map(format => (
                <button
                  key={format.id}
                  onClick={() => setExportOptions({...exportOptions, format: format.id})}
                  className={`w-full p-3 rounded-md border-2 text-left ${
                    exportOptions.format === format.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{format.icon}</span>
                    <div>
                      <div className="font-medium">{format.name}</div>
                      <div className="text-xs text-gray-500">
                        {format.features.join(', ')}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedFormat && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Quality</label>
                <select
                  value={exportOptions.quality}
                  onChange={(e) => setExportOptions({...exportOptions, quality: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                >
                  <option value="low">Low (Fast)</option>
                  <option value="medium">Medium</option>
                  <option value="high">High (Best)</option>
                </select>
              </div>

              {selectedFormat.features.includes('notes') && (
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeNotes}
                    onChange={(e) => setExportOptions({...exportOptions, includeNotes: e.target.checked})}
                  />
                  <span className="text-sm">Include speaker notes</span>
                </label>
              )}

              {selectedFormat.features.includes('animations') && (
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeAnimations}
                    onChange={(e) => setExportOptions({...exportOptions, includeAnimations: e.target.checked})}
                  />
                  <span className="text-sm">Include animations</span>
                </label>
              )}

              {selectedFormat.features.includes('password') && (
                <div>
                  <label className="block text-sm font-medium mb-1">Password Protection</label>
                  <input
                    type="password"
                    value={exportOptions.password}
                    onChange={(e) => setExportOptions({...exportOptions, password: e.target.value})}
                    placeholder="Optional password"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                  />
                </div>
              )}

              {selectedFormat.features.includes('size') && (
                <div>
                  <label className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      checked={exportOptions.customSize}
                      onChange={(e) => setExportOptions({...exportOptions, customSize: e.target.checked})}
                    />
                    <span className="text-sm">Custom dimensions</span>
                  </label>
                  {exportOptions.customSize && (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={exportOptions.width}
                        onChange={(e) => setExportOptions({...exportOptions, width: parseInt(e.target.value)})}
                        placeholder="Width"
                        className="px-2 py-1 border rounded dark:bg-gray-700"
                      />
                      <input
                        type="number"
                        value={exportOptions.height}
                        onChange={(e) => setExportOptions({...exportOptions, height: parseInt(e.target.value)})}
                        placeholder="Height"
                        className="px-2 py-1 border rounded dark:bg-gray-700"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Export ({slides.length} slides)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedExport;