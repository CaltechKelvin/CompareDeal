import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupDatabase } from './database.js';
import { startScrapingJobs } from './scraper/scheduler.js';
import productsRouter from './routes/products.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS with specific options
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Basic logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/products', productsRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message || 'An unexpected error occurred'
  });
});

// Initialize database and start server
async function startServer() {
  try {
    // Ensure database is set up
    await setupDatabase();
    console.log('Database initialized successfully');

    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      
      // Start scraping jobs after server is running
      startScrapingJobs().catch(err => {
        console.error('Failed to start scraping jobs:', err);
      });
    });

    // Handle server shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();