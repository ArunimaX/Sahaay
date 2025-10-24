import { config } from 'dotenv';
import { Pool } from 'pg';

// Load environment variables
config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createBlacklistTable() {
  console.log('🔧 Creating blacklist table...');
  
  try {
    // Create blacklist table
    const createBlacklistTableQuery = `
      CREATE TABLE IF NOT EXISTS blacklist (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        profile_id VARCHAR NOT NULL REFERENCES profiles(id),
        entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('ngo', 'business')),
        flagged_reason TEXT NOT NULL,
        negative_review_percentage DECIMAL(5,2) NOT NULL,
        total_reviews INTEGER NOT NULL,
        negative_reviews INTEGER NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'flagged' CHECK (status IN ('flagged', 'investigated', 'cleared', 'blacklisted')),
        flagged_at TIMESTAMP DEFAULT NOW(),
        investigated_at TIMESTAMP,
        investigated_by VARCHAR REFERENCES profiles(id),
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await pool.query(createBlacklistTableQuery);
    console.log('✅ Blacklist table created successfully');

    // Create indexes for better performance
    const createIndexesQuery = `
      CREATE INDEX IF NOT EXISTS idx_blacklist_profile_id ON blacklist(profile_id);
      CREATE INDEX IF NOT EXISTS idx_blacklist_entity_type ON blacklist(entity_type);
      CREATE INDEX IF NOT EXISTS idx_blacklist_status ON blacklist(status);
      CREATE INDEX IF NOT EXISTS idx_blacklist_flagged_at ON blacklist(flagged_at);
      CREATE INDEX IF NOT EXISTS idx_blacklist_negative_percentage ON blacklist(negative_review_percentage);
    `;

    await pool.query(createIndexesQuery);
    console.log('✅ Blacklist table indexes created successfully');

    // Check if table was created
    const checkTableQuery = `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'blacklist'
      ORDER BY ordinal_position;
    `;

    const result = await pool.query(checkTableQuery);
    console.log('📊 Blacklist table structure:');
    console.table(result.rows);

  } catch (error) {
    console.error('❌ Error creating blacklist table:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the migration
createBlacklistTable()
  .then(() => {
    console.log('🎉 Blacklist table migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });