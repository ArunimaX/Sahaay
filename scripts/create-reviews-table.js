import { config } from 'dotenv';
import { Pool } from 'pg';

// Load environment variables
config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createReviewsTable() {
  console.log('🔧 Creating reviews table...');
  
  try {
    // Create reviews table
    const createReviewsTableQuery = `
      CREATE TABLE IF NOT EXISTS reviews (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        reviewer_profile_id VARCHAR NOT NULL REFERENCES profiles(id),
        ngo_profile_id VARCHAR REFERENCES profiles(id),
        business_profile_id VARCHAR REFERENCES profiles(id),
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT NOT NULL,
        review_title TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT check_ngo_or_business CHECK (
          (ngo_profile_id IS NOT NULL AND business_profile_id IS NULL) OR
          (ngo_profile_id IS NULL AND business_profile_id IS NOT NULL)
        )
      );
    `;

    await pool.query(createReviewsTableQuery);
    console.log('✅ Reviews table created successfully');

    // Create indexes for better performance
    const createIndexesQuery = `
      CREATE INDEX IF NOT EXISTS idx_reviews_ngo_profile_id ON reviews(ngo_profile_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_business_profile_id ON reviews(business_profile_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_profile_id ON reviews(reviewer_profile_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
      CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);
    `;

    await pool.query(createIndexesQuery);
    console.log('✅ Reviews table indexes created successfully');

    // Check if table was created
    const checkTableQuery = `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'reviews'
      ORDER BY ordinal_position;
    `;

    const result = await pool.query(checkTableQuery);
    console.log('📊 Reviews table structure:');
    console.table(result.rows);

  } catch (error) {
    console.error('❌ Error creating reviews table:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the migration
createReviewsTable()
  .then(() => {
    console.log('🎉 Reviews table migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });