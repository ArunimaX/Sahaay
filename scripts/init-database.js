// scripts/init-database.js
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function initDatabase() {
  console.log('🚀 Initializing database...');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  try {
    // Run migrations (skip if already applied)
    console.log('📦 Checking migrations...');
    try {
      await migrate(db, { migrationsFolder: './migrations' });
      console.log('✅ Migrations completed successfully');
    } catch (migrationError) {
      if (migrationError.message.includes('already exists')) {
        console.log('✅ Migrations already applied');
      } else {
        throw migrationError;
      }
    }

    // Test connection
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    console.log('🗄️ Connected to database:', process.env.DATABASE_URL?.split('/').pop());

    // Check if profiles table exists
    const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles'
    `);
    
    if (tableCheck.rows.length > 0) {
      console.log('✅ Profiles table exists');
    } else {
      console.log('❌ Profiles table not found');
    }

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
    console.log('🔒 Database connection closed');
  }
}

initDatabase();