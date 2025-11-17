import React, { useState, useRef } from 'react';
import { usePresentation } from '../contexts/PresentationContext';
import { 
  exportToPPTX, 
  exportToPDF, 
  exportToJSON, 
  exportToHTML,
  exportAllSlides,
  importFromJSON,
  importFromPPTX,
  exportSlideAsImage
} from '../utils/exportUtils';

const ImportExport = ({ onClose }) => {
  const { slides, setSlides } = usePresentation();
  const [activeTab, setActiveTab] = useState('export');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleExport = async (format, filename) => {
    setIsProcessing(true);
    try {
      switch (format) {
        case 'pptx':
          exportToPPTX(slides, filename);
          break;
        case 'pdf':
          exportToPDF(slides, filename);
          break;
        case 'json':
          exportToJSON(slides, filename);
          break;
        case 'html':
          exportToHTML(slides, filename);
          break;
        case 'images':
          await exportAllSlides(slides, 'png');
          break;
        default:
          console.error('Unsupported format:', format);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async (file) => {
    if (!file) return;
    
    setIsProcessing(true);
    try {
      let importedSlides = [];
      
      if (file.name.endsWith('.json')) {
        importedSlides = await importFromJSON(file);
      } else if (file.name.endsWith('.pptx')) {
        importedSlides = await importFromPPTX(file);
      } else {
        throw new Error('Unsupported file format');
      }
      
      if (importedSlides.length > 0) {
        setSlides(importedSlides);
        alert(`Successfully imported ${importedSlides.length} slides!`);
        onClose();
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Import failed: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const exportFormats = [
    { id: 'pptx', name: 'PowerPoint (.pptx)', icon: '📊', desc: 'Compatible with Microsoft PowerPoint' },
    { id: 'pdf', name: 'PDF Document (.pdf)', icon: '📄', desc: 'Portable document format' },
    { id: 'html', name: 'Web Page (.html)', icon: '🌐', desc: 'Viewable in any web browser' },
    { id: 'json', name: 'EtherXPPT (.json)', icon: '💾', desc: 'Native format with full features' },
    { id: 'images', name: 'Image Archive (.zip)', icon: '🖼️', desc: 'All slides as PNG images' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Import & Export
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex mt-4 border-b border-gray-200 dark:border-gray-600">
            <button
              onClick={() => setActiveTab('export')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'export'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Export
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'import'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Import
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Export Tab */}
          {activeTab === 'export' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Export your presentation in various formats
              </p>
              
              {exportFormats.map((format) => (
                <div
                  key={format.id}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{format.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {format.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {format.desc}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleExport(format.id, `presentation.${format.id === 'images' ? 'zip' : format.id}`)}
                    disabled={isProcessing}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isProcessing ? '...' : 'Export'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Import Tab */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Import presentations from various formats
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.pptx"
                onChange={(e) => handleImport(e.target.files[0])}
                className="hidden"
              />
              
              <div className="space-y-3">
                <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
                  <div className="text-4xl mb-2">📁</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Drag and drop files here or click to browse
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : 'Choose File'}
                  </button>
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <strong>Supported formats:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• .json - EtherXPPT native format (full compatibility)</li>
                    <li>• .pptx - PowerPoint presentations (basic import)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {isProcessing && (
          <div className="absolute inset-0 bg-white bg-opacity-75 dark:bg-gray-800 dark:bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Processing...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportExport;