// scripts/sync-users.js
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { profiles, users } from '../shared/schema.ts';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function syncUsers() {
  console.log('🔄 Syncing profiles to users table...');

  try {
    // Get all profiles
    const allProfiles = await db.select().from(profiles);
    console.log(`📊 Found ${allProfiles.length} profiles`);

    // Check existing users
    const existingUsers = await db.select().from(users);
    console.log(`📊 Found ${existingUsers.length} existing users`);

    let syncedCount = 0;

    for (const profile of allProfiles) {
      try {
        // Check if user already exists
        const [existingUser] = await db.select().from(users).where(eq(users.id, profile.id));
        
        if (!existingUser) {
          // Create user from profile
          await db.insert(users).values({
            id: profile.id,
            username: profile.email, // Use email as username
            email: profile.email,
            name: profile.name,
            role: profile.role,
            password: profile.password,
          });
          
          console.log(`✅ Synced user: ${profile.name} (${profile.email})`);
          syncedCount++;
        } else {
          console.log(`⚠️ User already exists: ${profile.email}`);
        }
      } catch (error) {
        if (error.message.includes('duplicate key')) {
          console.log(`⚠️ Duplicate user skipped: ${profile.email}`);
        } else {
          console.error(`❌ Error syncing user ${profile.email}:`, error.message);
        }
      }
    }

    console.log(`🎉 Synced ${syncedCount} users successfully!`);

  } catch (error) {
    console.error('❌ Error syncing users:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

syncUsers();