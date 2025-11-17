import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const CloudContext = createContext();

export const useCloud = () => {
  const context = useContext(CloudContext);
  if (!context) {
    throw new Error('useCloud must be used within a CloudProvider');
  }
  return context;
};

export const CloudProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [cloudProvider, setCloudProvider] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle');

  const connectToCloud = async (provider, credentials) => {
    try {
      setSyncStatus('connecting');
      const response = await axios.post('/api/cloud/connect', {
        provider,
        credentials
      });
      
      if (response.data.success) {
        setIsConnected(true);
        setCloudProvider(provider);
        setSyncStatus('connected');
        return { success: true };
      }
    } catch (error) {
      setSyncStatus('error');
      return { success: false, error: error.message };
    }
  };

  const syncPresentation = async (presentationData) => {
    if (!isConnected) return { success: false, error: 'Not connected to cloud' };
    
    try {
      setSyncStatus('syncing');
      const response = await axios.post('/api/cloud/sync', {
        provider: cloudProvider,
        data: presentationData
      });
      
      setSyncStatus('synced');
      return { success: true, cloudId: response.data.cloudId };
    } catch (error) {
      setSyncStatus('error');
      return { success: false, error: error.message };
    }
  };

  const loadFromCloud = async (cloudId) => {
    try {
      setSyncStatus('loading');
      const response = await axios.get(`/api/cloud/load/${cloudId}`);
      setSyncStatus('loaded');
      return { success: true, data: response.data };
    } catch (error) {
      setSyncStatus('error');
      return { success: false, error: error.message };
    }
  };

  const value = {
    isConnected,
    cloudProvider,
    syncStatus,
    connectToCloud,
    syncPresentation,
    loadFromCloud
  };

  return (
    <CloudContext.Provider value={value}>
      {children}
    </CloudContext.Provider>
  );
};