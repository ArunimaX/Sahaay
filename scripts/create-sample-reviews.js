import { config } from 'dotenv';
import { Pool } from 'pg';

// Load environment variables
config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createSampleReviews() {
  console.log('🔧 Creating sample reviews...');
  
  try {
    // First, get some profile IDs to use for reviews
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
      console.log('⚠️ Not enough profiles found. Need at least 3 profiles to create sample reviews.');
      return;
    }

    console.log(`📋 Found ${profiles.length} profiles to work with`);

    // Get NGOs and businesses separately
    const ngos = profiles.filter(p => p.role === 'ngo');
    const businesses = profiles.filter(p => p.role === 'donor' || p.role === 'service-provider');
    const reviewers = profiles.filter(p => p.role !== 'ngo'); // Anyone can be a reviewer

    console.log(`👥 Found ${ngos.length} NGOs, ${businesses.length} businesses, ${reviewers.length} potential reviewers`);

    const sampleReviews = [];

    // Create reviews for NGOs
    if (ngos.length > 0 && reviewers.length > 0) {
      const ngoReviews = [
        {
          ngo: ngos[0],
          reviewer: reviewers[0],
          rating: 5,
          title: "Excellent food distribution service",
          text: "This NGO does amazing work in our community. They distribute food efficiently and with great care. The volunteers are friendly and professional. Highly recommended!"
        },
        {
          ngo: ngos[0],
          reviewer: reviewers[1] || reviewers[0],
          rating: 4,
          title: "Good service, room for improvement",
          text: "Overall good experience with this NGO. They helped us during difficult times. The only suggestion would be to improve their response time for urgent requests."
        }
      ];

      if (ngos.length > 1) {
        ngoReviews.push({
          ngo: ngos[1],
          reviewer: reviewers[0],
          rating: 5,
          title: "Outstanding community support",
          text: "This NGO goes above and beyond to help families in need. Their food distribution program is well-organized and reaches the right people. Great work!"
        });
      }

      sampleReviews.push(...ngoReviews);
    }

    // Create reviews for businesses
    if (businesses.length > 0 && reviewers.length > 0) {
      const businessReviews = [
        {
          business: businesses[0],
          reviewer: reviewers[0],
          rating: 4,
          title: "Reliable food donor",
          text: "This business regularly donates quality food to our community. Their donations are always fresh and well-packaged. Thank you for your generosity!"
        },
        {
          business: businesses[0],
          reviewer: reviewers[1] || reviewers[0],
          rating: 5,
          title: "Generous and consistent",
          text: "Amazing business that truly cares about the community. They donate surplus food regularly and it's always in excellent condition. Highly appreciate their contribution!"
        }
      ];

      if (businesses.length > 1) {
        businessReviews.push({
          business: businesses[1],
          reviewer: reviewers[0],
          rating: 3,
          title: "Good service provider",
          text: "Decent service provider. They completed the work as requested, though there were some minor delays. Overall satisfactory experience."
        });
      }

      sampleReviews.push(...businessReviews);
    }

    // Insert sample reviews
    for (const review of sampleReviews) {
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
      
      console.log(`✅ Created review: "${createdReview.review_title}" (${createdReview.rating} stars) - ID: ${createdReview.id}`);
    }

    // Show summary
    const countQuery = 'SELECT COUNT(*) as total FROM reviews';
    const countResult = await pool.query(countQuery);
    const totalReviews = countResult.rows[0].total;

    console.log(`🎉 Successfully created ${sampleReviews.length} sample reviews!`);
    console.log(`📊 Total reviews in database: ${totalReviews}`);

    // Show review breakdown
    const statsQuery = `
      SELECT 
        rating,
        COUNT(*) as count
      FROM reviews
      GROUP BY rating
      ORDER BY rating DESC;
    `;
    
    const statsResult = await pool.query(statsQuery);
    console.log('⭐ Review rating distribution:');
    statsResult.rows.forEach(row => {
      console.log(`   ${row.rating} stars: ${row.count} reviews`);
    });

  } catch (error) {
    console.error('❌ Error creating sample reviews:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the script
createSampleReviews()
  .then(() => {
    console.log('🎉 Sample reviews creation completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Sample reviews creation failed:', error);
    process.exit(1);
  });