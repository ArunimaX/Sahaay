// server/index.ts

import dotenv from 'dotenv';
import express from 'express';
import routes from './routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📡 ${new Date().toISOString()} [${req.method}] ${req.path} - Body:`, req.body);
  next();
});

// Routes
app.use('/api', routes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl,
    availableEndpoints: '/api/docs'
  });
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Initialize services
async function initializeServices() {
  try {
    // Initialize database services if available
    if (process.env.DATABASE_URL) {
      const { AuthService } = await import('./services/auth-service');
      const { ProfileService } = await import('./services/profile-service');
      const { NgoService } = await import('./services/ngo-service');
      const { ServiceProviderService } = await import('./services/service-provider-service');
      
      await AuthService.initializeDatabase();
      await ProfileService.initializeTable();
      await NgoService.initializeService();
      await ServiceProviderService.initializeService();
      
      console.log('✅ Database services initialized');
    }
  } catch (error) {
    console.error('⚠️ Service initialization failed:', error);
    console.log('📝 Continuing without database services...');
  }
}

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📖 API Documentation: http://localhost:${PORT}/api/docs`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🗄️ Database: ${process.env.DATABASE_URL ? 'PostgreSQL (configured)' : 'PostgreSQL (not configured - using test routes)'}`);
    console.log(`🎯 Frontend: http://localhost:5173 (run 'npm run dev:client' in another terminal)`);
    console.log(`💡 Test Routes: http://localhost:${PORT}/api/test/* (working without database)`);
    console.log(`🏢 NGO Routes: http://localhost:${PORT}/api/ngo/* (requires database)`);
    
    // Initialize services
    await initializeServices();
  });
}

export default app;
