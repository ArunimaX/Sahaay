// scripts/check-database.js
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function checkDatabase() {
  console.log('🔍 Checking database contents...');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Check database connection
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    console.log('🗄️ Connected to database:', process.env.DATABASE_URL?.split('/').pop());

    // Check profiles table
    const profilesResult = await pool.query('SELECT id, email, name, role, created_at FROM profiles ORDER BY created_at DESC');
    console.log(`\n📊 Found ${profilesResult.rows.length} profiles in the database:`);
    console.log('┌─────────────────────────────────────────┬─────────────────────────┬─────────────────────────┬─────────────────┬─────────────────────────┐');
    console.log('│ ID                                      │ Email                   │ Name                    │ Role            │ Created At              │');
    console.log('├─────────────────────────────────────────┼─────────────────────────┼─────────────────────────┼─────────────────┼─────────────────────────┤');
    
    profilesResult.rows.forEach(profile => {
      const id = profile.id.substring(0, 36).padEnd(39);
      const email = profile.email.substring(0, 23).padEnd(23);
      const name = profile.name.substring(0, 23).padEnd(23);
      const role = profile.role.padEnd(15);
      const createdAt = new Date(profile.created_at).toLocaleString().padEnd(23);
      console.log(`│ ${id} │ ${email} │ ${name} │ ${role} │ ${createdAt} │`);
    });
    
    console.log('└─────────────────────────────────────────┴─────────────────────────┴─────────────────────────┴─────────────────┴─────────────────────────┘');

    // Show the most recent registration
    if (profilesResult.rows.length > 0) {
      const latest = profilesResult.rows[0];
      console.log(`\n🆕 Most recent registration:`);
      console.log(`   📧 Email: ${latest.email}`);
      console.log(`   👤 Name: ${latest.name}`);
      console.log(`   🏷️ Role: ${latest.role}`);
      console.log(`   📅 Created: ${new Date(latest.created_at).toLocaleString()}`);
    }

  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  } finally {
    await pool.end();
    console.log('\n🔒 Database connection closed');
  }
}

checkDatabase();