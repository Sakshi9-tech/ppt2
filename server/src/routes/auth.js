import express from 'express';
import {
  register,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
  getProfile
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import {
  validateRegistration,
  validateLogin,
  validateForgotPassword,
  validateOTPVerification,
  validatePasswordReset
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/verify-otp', validateOTPVerification, verifyOTP);
router.post('/reset-password', validatePasswordReset, resetPassword);

// Protected routes
router.get('/profile', authenticateToken, getProfile);

export default router;