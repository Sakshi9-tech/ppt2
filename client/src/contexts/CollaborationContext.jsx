import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const CollaborationContext = createContext();

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
};

export const CollaborationProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const [userCursors, setUserCursors] = useState({});

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('users-updated', (users) => {
      setActiveUsers(users);
    });

    newSocket.on('cursor-moved', ({ userId, position }) => {
      setUserCursors(prev => ({ ...prev, [userId]: position }));
    });

    return () => newSocket.close();
  }, []);

  const joinRoom = (presentationId, user) => {
    if (socket) {
      socket.emit('join-room', { roomId: presentationId, user });
      setRoomId(presentationId);
    }
  };

  const leaveRoom = () => {
    if (socket && roomId) {
      socket.emit('leave-room', roomId);
      setRoomId(null);
    }
  };

  const broadcastSlideChange = (slideData) => {
    if (socket && roomId) {
      socket.emit('slide-updated', { roomId, slideData });
    }
  };

  const broadcastCursorMove = (position) => {
    if (socket && roomId) {
      socket.emit('cursor-move', { roomId, position });
    }
  };

  const value = {
    socket,
    isConnected,
    activeUsers,
    userCursors,
    joinRoom,
    leaveRoom,
    broadcastSlideChange,
    broadcastCursorMove
  };

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
};