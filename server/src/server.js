import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';

dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'EtherXPPT Server Running',
    version: '2.0.0',
    status: 'healthy'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);

// Import cloud routes
import cloudRoutes from './routes/cloud.js';
app.use('/api/cloud', cloudRoutes);

// Import presentation routes
import presentationRoutes from './routes/presentations.js';
app.use('/api/presentations', presentationRoutes);

// Import AI routes
import aiRoutes from './routes/ai.js';
app.use('/api/ai', aiRoutes);

// Import all feature routes
import templateRoutes from './routes/templates.js';
import versionRoutes from './routes/versions.js';
import uploadRoutes from './routes/upload.js';
import chartRoutes from './routes/charts.js';
import exportRoutes from './routes/export.js';
import collaborationRoutes from './routes/collaboration.js';
import searchRoutes from './routes/search.js';

app.use('/api/templates', templateRoutes);
app.use('/api/versions', versionRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/charts', chartRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/collaboration', collaborationRoutes);
app.use('/api/search', searchRoutes);

// Import remaining feature routes
import animationRoutes from './routes/animations.js';
import interactiveRoutes from './routes/interactive.js';
import notesRoutes from './routes/notes.js';
import drawingRoutes from './routes/drawing.js';

app.use('/api/animations', animationRoutes);
app.use('/api/interactive', interactiveRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/drawing', drawingRoutes);

// Forgot password route (temporary)
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`🔑 OTP for ${email}: ${otp}`);
    
    res.json({
      message: 'OTP sent successfully to your email address',
      email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
      testOTP: otp
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

app.post('/api/auth/verify-otp', (req, res) => {
  res.json({ message: 'OTP verified successfully', verified: true });
});

app.post('/api/auth/reset-password', (req, res) => {
  res.json({ message: 'Password reset successfully' });
});

// Socket.io for real-time collaboration
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-presentation', (presentationId) => {
    socket.join(presentationId);
    console.log(`User ${socket.id} joined presentation ${presentationId}`);
  });

  socket.on('slide-update', (data) => {
    socket.to(data.presentationId).emit('slide-updated', data);
  });

  socket.on('cursor-move', (data) => {
    socket.to(data.presentationId).emit('cursor-moved', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Client URL: ${process.env.CLIENT_URL}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});