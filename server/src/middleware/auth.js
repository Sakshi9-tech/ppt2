import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists (only if database is connected)
    if (process.env.MONGODB_URI) {
      try {
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }
        req.user = { userId: user._id, email: user.email, name: user.name };
      } catch (dbError) {
        // Fallback to token data if database is unavailable
        req.user = { userId: decoded.userId, email: decoded.email };
      }
    } else {
      // Use token data directly when no database
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (process.env.MONGODB_URI) {
        try {
          const user = await User.findById(decoded.userId).select('-password');
          if (user) {
            req.user = { userId: user._id, email: user.email, name: user.name };
          }
        } catch (dbError) {
          req.user = decoded;
        }
      } else {
        req.user = decoded;
      }
    }
    
    next();
  } catch (error) {
    // For optional auth, we don't return errors, just continue without user
    next();
  }
};

// Simple auth for basic functionality
export const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};