import React, { useState } from 'react';
import { useCloud } from '../contexts/CloudContext';
import { usePresentation } from '../contexts/PresentationContext';

const CloudSync = ({ onClose }) => {
  const { isConnected, cloudProvider, syncStatus, connectToCloud, syncPresentation } = useCloud();
  const { slides } = usePresentation();
  const [selectedProvider, setSelectedProvider] = useState('');
  const [credentials, setCredentials] = useState({ apiKey: '', clientId: '' });

  const providers = [
    { id: 'gdrive', name: 'Google Drive', icon: '📁', color: 'bg-blue-600' },
    { id: 'onedrive', name: 'OneDrive', icon: '☁️', color: 'bg-blue-500' },
    { id: 'dropbox', name: 'Dropbox', icon: '📦', color: 'bg-blue-700' }
  ];

  const handleConnect = async () => {
    if (!selectedProvider) return;
    
    const result = await connectToCloud(selectedProvider, credentials);
    if (result.success) {
      alert('Successfully connected to cloud storage!');
    } else {
      alert('Failed to connect: ' + result.error);
    }
  };

  const handleSync = async () => {
    const presentationData = {
      name: `Presentation_${Date.now()}`,
      slides,
      timestamp: new Date().toISOString()
    };
    
    const result = await syncPresentation(presentationData);
    if (result.success) {
      alert('Presentation synced to cloud successfully!');
    } else {
      alert('Sync failed: ' + result.error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">☁️ Cloud Sync</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {!isConnected ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Select Cloud Provider</label>
                <div className="space-y-2">
                  {providers.map(provider => (
                    <button
                      key={provider.id}
                      onClick={() => setSelectedProvider(provider.id)}
                      className={`w-full p-3 rounded-md border-2 transition-colors ${
                        selectedProvider === provider.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{provider.icon}</span>
                        <span className="font-medium">{provider.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedProvider && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="API Key"
                    value={credentials.apiKey}
                    onChange={(e) => setCredentials({...credentials, apiKey: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                  />
                  <input
                    type="text"
                    placeholder="Client ID"
                    value={credentials.clientId}
                    onChange={(e) => setCredentials({...credentials, clientId: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                  />
                  <button
                    onClick={handleConnect}
                    disabled={syncStatus === 'connecting'}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {syncStatus === 'connecting' ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900 rounded-md">
                <span className="text-green-600">✅</span>
                <span className="text-sm">Connected to {cloudProvider}</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sync Status:</span>
                  <span className={`font-medium ${
                    syncStatus === 'synced' ? 'text-green-600' : 
                    syncStatus === 'error' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {syncStatus}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Slides:</span>
                  <span>{slides.length}</span>
                </div>
              </div>

              <button
                onClick={handleSync}
                disabled={syncStatus === 'syncing'}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {syncStatus === 'syncing' ? 'Syncing...' : 'Sync to Cloud'}
              </button>

              <div className="text-xs text-gray-500 space-y-1">
                <p>• Auto-sync: Every 5 minutes</p>
                <p>• Backup: Last 10 versions</p>
                <p>• Sharing: Team collaboration ready</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CloudSync;