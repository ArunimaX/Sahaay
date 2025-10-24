// Simple script to create the database
import { Client } from 'pg';

async function createDatabase() {
  // First connect to postgres database to create our database
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres', // Connect to default postgres database
    password: '3155',
    port: 5432,
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Check if database exists
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'sahaay_connect'"
    );

    if (result.rows.length === 0) {
      // Create the database
      await client.query('CREATE DATABASE sahaay_connect');
      console.log('✅ Database "sahaay_connect" created successfully');
    } else {
      console.log('ℹ️ Database "sahaay_connect" already exists');
    }

  } catch (error) {
    console.error('❌ Error creating database:', error.message);
  } finally {
    await client.end();
  }
}

createDatabase();