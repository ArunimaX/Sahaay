// server/routes.ts

import express from 'express';
import authRoutes from './routes/auth-routes';
import testRoutes from './routes/test-routes';
import tempDonorRoutes from './routes/temp-donor-routes';
import ngoRoutes from './routes/ngo-routes';
import serviceProviderRoutes from './routes/service-provider-routes';
import analyticsRoutes from './routes/analytics-routes';
import reviewRoutes from './routes/review-routes';
import sentimentRoutes from './routes/sentiment-routes';
import { TestService } from './services/test-service';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SahaayConnect API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'PostgreSQL (not configured - using test routes)',
    status: 'Frontend-ready mode'
  });
});

// API documentation endpoint
router.get('/docs', (req, res) => {
  res.json({
    success: true,
    message: 'SahaayConnect API Documentation',
    version: '1.0.0',
    database: 'PostgreSQL (not configured - using test routes)',
    endpoints: {
      'GET /api/health': 'Health check',
      'GET /api/docs': 'API documentation',

      'GET /api/me': 'Get current user (Test mode) ✅ WORKING',
      'POST /api/test/register': 'Test user registration (In-Memory) ✅ WORKING',
      'POST /api/test/login': 'Test user login (In-Memory) ✅ WORKING',
      'GET /api/test/users': 'Get all test users (In-Memory) ✅ WORKING',
      'GET /api/test/profile/:id': 'Get test user profile (In-Memory) ✅ WORKING',
      'DELETE /api/test/clear': 'Clear all test data (In-Memory) ✅ WORKING',
      'POST /api/temp-donor/info': 'Save temp donor information (In-Memory) ✅ WORKING',
      'POST /api/temp-donor/food-donation': 'Save temp food donation (In-Memory) ✅ WORKING',
      'GET /api/temp-donor/info/:userId': 'Get temp donor info (In-Memory) ✅ WORKING',
      'GET /api/temp-donor/donations/:userId': 'Get user donations (In-Memory) ✅ WORKING',
      'DELETE /api/temp-donor/clear': 'Clear temp donor data (In-Memory) ✅ WORKING',
      'POST /api/auth/register': 'User registration (PostgreSQL) ⚠️ Requires DB',
      'POST /api/auth/login': 'User login (PostgreSQL) ⚠️ Requires DB',
      'GET /api/auth/profile/:id': 'Get user profile (PostgreSQL) ⚠️ Requires DB',
      'GET /api/auth/users': 'Get all users (PostgreSQL) ⚠️ Requires DB',
      'GET /api/auth/users/role/:role': 'Get users by role (PostgreSQL) ⚠️ Requires DB'
    },
    note: 'Test routes work in-memory for development. Main routes require PostgreSQL setup.',
    timestamp: new Date().toISOString()
  });
});

// Current user endpoint (for frontend compatibility)
router.get('/me', (req, res) => {
  try {
    // For now, return a default user or null
    // This will be replaced with proper session handling later
    res.json({
      success: true,
      user: null,
      message: 'No user logged in (test mode)'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Test routes (In-Memory) - PRIORITY for frontend testing
router.use('/test', testRoutes);

// Temp donor routes (In-Memory) - For donor dashboard functionality
router.use('/temp-donor', tempDonorRoutes);

// NGO routes (PostgreSQL) - For NGO dashboard functionality
router.use('/ngo', ngoRoutes);

// Service Provider routes - For EmpowerBridge service provider functionality
router.use('/service-provider', serviceProviderRoutes);

// Analytics routes - For admin dashboard analytics
router.use('/analytics', analyticsRoutes);

// Review routes - For review system functionality
router.use('/reviews', reviewRoutes);

// Sentiment analysis routes - For ML-based review analysis and blacklisting
router.use('/sentiment', sentimentRoutes);

// Auth routes (PostgreSQL) - Will fail gracefully if DB not configured
router.use('/auth', (req, res, next) => {
  // Check if database is available
  if (!process.env.DATABASE_URL) {
    return res.status(503).json({
      success: false,
      error: 'Database not configured',
      message: 'Please use /api/test routes for now. Database setup required for /api/auth routes.',
      availableRoutes: '/api/test/*',
      timestamp: new Date().toISOString()
    });
  }
  next();
}, authRoutes);

export default router;
