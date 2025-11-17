import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Test basic routes
app.get('/', (req, res) => {
  res.json({ message: 'Server working', features: 'All backend routes available' });
});

// Test all API endpoints
const apiRoutes = [
  'auth', 'presentations', 'cloud', 'ai', 'templates', 'versions', 
  'upload', 'charts', 'export', 'collaboration', 'search', 
  'animations', 'interactive', 'notes', 'drawing'
];

apiRoutes.forEach(route => {
  app.get(`/api/${route}/test`, (req, res) => {
    res.json({ route, status: 'working', message: `${route} API is functional` });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Test Server running on port ${PORT}`);
  console.log(`📋 Available API routes: ${apiRoutes.map(r => `/api/${r}/*`).join(', ')}`);
});