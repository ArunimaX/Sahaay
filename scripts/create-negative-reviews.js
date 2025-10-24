import { config } from 'dotenv';
import { Pool } from 'pg';

// Load environment variables
config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createNegativeReviews() {
  console.log('🔧 Creating negative reviews for testing...');
  
  try {
    // Get some profiles to use
    const profilesQuery = `
      SELECT id, name, role 
      FROM profiles 
      WHERE role IN ('ngo', 'donor', 'service-provider', 'consumer', 'admin')
      ORDER BY created_at
      LIMIT 10;
    `;
    
    const profilesResult = await pool.query(profilesQuery);
    const profiles = profilesResult.rows;
    
    if (profiles.length < 3) {
      console.log('⚠️ Not enough profiles found.');
      return;
    }

    const ngos = profiles.filter(p => p.role === 'ngo');
    const businesses = profiles.filter(p => p.role === 'donor' || p.role === 'service-provider');
    const reviewers = profiles.filter(p => p.role !== 'ngo');

    console.log(`👥 Found ${ngos.length} NGOs, ${businesses.length} businesses, ${reviewers.length} reviewers`);

    const negativeReviews = [];

    // Create negative reviews for the first NGO (to get it flagged)
    if (ngos.length > 0 && reviewers.length > 0) {
      const targetNgo = ngos[0];
      
      // Add 3 negative reviews (will make it >30% negative)
      negativeReviews.push({
        ngo: targetNgo,
        reviewer: reviewers[0],
        rating: 1,
        title: "Terrible service and unprofessional staff",
        text: "This NGO is absolutely terrible. The staff is rude and unprofessional. They refused to help when we needed it most. The food they distributed was stale and expired. I would never recommend them to anyone. Worst experience ever!"
      });

      negativeReviews.push({
        ngo: targetNgo,
        reviewer: reviewers[1] || reviewers[0],
        rating: 2,
        title: "Poor quality food and bad service",
        text: "Very disappointing experience. The food was cold, tasteless, and some items were spoiled. The volunteers were unhelpful and seemed annoyed when we asked questions. This organization needs serious improvement."
      });

      negativeReviews.push({
        ngo: targetNgo,
        reviewer: reviewers[2] || reviewers[0],
        rating: 1,
        title: "Unreliable and unprofessional organization",
        text: "They cancelled our appointment at the last minute without any explanation. When we finally got service, it was awful. The facility was dirty and unhygienic. Staff was rude and dismissive. Completely unreliable."
      });
    }

    // Create negative reviews for the first business (to get it flagged)
    if (businesses.length > 0 && reviewers.length > 0) {
      const targetBusiness = businesses[0];
      
      // Add 2 negative reviews
      negativeReviews.push({
        business: targetBusiness,
        reviewer: reviewers[0],
        rating: 2,
        title: "Poor quality donations and unreliable",
        text: "This business donated expired food items that were unsafe to consume. When we complained, they were defensive and refused to take responsibility. Very unprofessional and unreliable donor."
      });

      negativeReviews.push({
        business: targetBusiness,
        reviewer: reviewers[1] || reviewers[0],
        rating: 1,
        title: "Worst donor experience ever",
        text: "Absolutely terrible experience. They promised fresh food but delivered stale, spoiled items. The packaging was damaged and unhygienic. When confronted, they were rude and dismissive. Avoid at all costs!"
      });
    }

    // Insert negative reviews
    for (const review of negativeReviews) {
      const insertQuery = `
        INSERT INTO reviews (
          reviewer_profile_id,
          ngo_profile_id,
          business_profile_id,
          rating,
          review_title,
          review_text
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, rating, review_title;
      `;

      const values = [
        review.reviewer.id,
        review.ngo ? review.ngo.id : null,
        review.business ? review.business.id : null,
        review.rating,
        review.title,
        review.text
      ];

      const result = await pool.query(insertQuery, values);
      const createdReview = result.rows[0];
      
      console.log(`✅ Created negative review: "${createdReview.review_title}" (${createdReview.rating} stars)`);
    }

    // Show updated review counts
    const countQuery = 'SELECT COUNT(*) as total FROM reviews';
    const countResult = await pool.query(countQuery);
    const totalReviews = countResult.rows[0].total;

    console.log(`🎉 Successfully created ${negativeReviews.length} negative reviews!`);
    console.log(`📊 Total reviews in database: ${totalReviews}`);

    // Show review breakdown by rating
    const statsQuery = `
      SELECT 
        rating,
        COUNT(*) as count
      FROM reviews
      GROUP BY rating
      ORDER BY rating DESC;
    `;
    
    const statsResult = await pool.query(statsQuery);
    console.log('⭐ Updated review rating distribution:');
    statsResult.rows.forEach(row => {
      console.log(`   ${row.rating} stars: ${row.count} reviews`);
    });

  } catch (error) {
    console.error('❌ Error creating negative reviews:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the script
createNegativeReviews()
  .then(() => {
    console.log('🎉 Negative reviews creation completed successfully!');
    console.log('💡 Now run sentiment analysis to see entities get flagged!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Negative reviews creation failed:', error);
    process.exit(1);
  });