// Cloud Storage Integration Utilities
// This module provides utilities for cloud storage integration

export const saveToCloud = async (presentationData, filename) => {
  try {
    // Placeholder for cloud storage integration
    // This could be integrated with services like:
    // - Google Drive API
    // - Dropbox API
    // - OneDrive API
    // - AWS S3
    
    const response = await fetch('/api/presentations/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        filename,
        data: presentationData,
        timestamp: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save to cloud');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Cloud save error:', error);
    throw error;
  }
};

export const loadFromCloud = async (presentationId) => {
  try {
    const response = await fetch(`/api/presentations/${presentationId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to load from cloud');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Cloud load error:', error);
    throw error;
  }
};

export const listCloudPresentations = async () => {
  try {
    const response = await fetch('/api/presentations', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to list presentations');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Cloud list error:', error);
    throw error;
  }
};

export const deleteFromCloud = async (presentationId) => {
  try {
    const response = await fetch(`/api/presentations/${presentationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete from cloud');
    }
    
    return true;
  } catch (error) {
    console.error('Cloud delete error:', error);
    throw error;
  }
};

// Local storage fallback
export const saveToLocal = (presentationData, filename) => {
  try {
    const savedPresentations = JSON.parse(localStorage.getItem('savedPresentations') || '{}');
    savedPresentations[filename] = {
      data: presentationData,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('savedPresentations', JSON.stringify(savedPresentations));
    return { success: true, filename };
  } catch (error) {
    console.error('Local save error:', error);
    throw error;
  }
};

export const loadFromLocal = (filename) => {
  try {
    const savedPresentations = JSON.parse(localStorage.getItem('savedPresentations') || '{}');
    return savedPresentations[filename]?.data || null;
  } catch (error) {
    console.error('Local load error:', error);
    throw error;
  }
};

export const listLocalPresentations = () => {
  try {
    const savedPresentations = JSON.parse(localStorage.getItem('savedPresentations') || '{}');
    return Object.keys(savedPresentations).map(filename => ({
      filename,
      timestamp: savedPresentations[filename].timestamp
    }));
  } catch (error) {
    console.error('Local list error:', error);
    return [];
  }
};