// server/postgres-config.ts

import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// PostgreSQL configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ PostgreSQL connection failed:', err.message);
    console.log('🔧 Make sure PostgreSQL is running and credentials are correct');
    console.log('🔧 Database URL:', process.env.DATABASE_URL?.replace(/:[^:]*@/, ':****@'));
  } else {
    console.log('✅ PostgreSQL connected successfully');
    console.log('🗄️ Connected to database:', process.env.DATABASE_URL?.split('/').pop());
  }
});

// Export the pool for use in services
export { pool };

// Helper function to check if PostgreSQL is ready
export const isPostgresReady = (): boolean => {
  return pool.totalCount > 0;
};

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await pool.end();
    console.log('✅ PostgreSQL connection pool closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during PostgreSQL shutdown:', error);
    process.exit(1);
  }
});
