import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database.js';
import seedCategories from './seeders/seedCategories.js';

// Import routes
import categoriesRouter from './routes/categories.js';
import expensesRouter from './routes/expenses.js';
import analyticsRouter from './routes/analytics.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/categories', categoriesRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/analytics', analyticsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Budget Tracker API is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database
    const dbInitialized = await initializeDatabase();
    
    if (!dbInitialized) {
      console.error('Failed to initialize database. Exiting...');
      process.exit(1);
    }
    
    // Seed categories
    await seedCategories();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`\n🚀 Budget Tracker API Server`);
      console.log(`📍 Running on: http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`\n📚 Available endpoints:`);
      console.log(`   GET    /api/health`);
      console.log(`   GET    /api/categories`);
      console.log(`   GET    /api/expenses`);
      console.log(`   POST   /api/expenses`);
      console.log(`   PUT    /api/expenses/:id`);
      console.log(`   DELETE /api/expenses/:id`);
      console.log(`   GET    /api/analytics/current-month`);
      console.log(`   GET    /api/analytics/monthly`);
      console.log(`   GET    /api/analytics/by-category\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
