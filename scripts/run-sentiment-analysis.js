import { config } from 'dotenv';
import { Pool } from 'pg';

// Load environment variables
config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Simple sentiment analysis function (mimicking the ML model)
function analyzeSentiment(reviewText, rating) {
  const negativeKeywords = [
    'bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'disgusting',
    'poor', 'disappointing', 'unsatisfactory', 'rude', 'slow', 'dirty',
    'expensive', 'overpriced', 'cold', 'stale', 'tasteless', 'unprofessional',
    'delayed', 'cancelled', 'refused', 'denied', 'failed', 'broken',
    'damaged', 'spoiled', 'expired', 'unhygienic', 'unclean', 'messy'
  ];

  const positiveKeywords = [
    'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
    'outstanding', 'perfect', 'love', 'delicious', 'fresh', 'clean',
    'professional', 'friendly', 'helpful', 'quick', 'fast', 'efficient',
    'quality', 'tasty', 'generous', 'caring', 'supportive', 'reliable',
    'consistent', 'organized', 'timely', 'responsive', 'courteous'
  ];

  const text = reviewText.toLowerCase();
  
  const negativeCount = negativeKeywords.filter(keyword => text.includes(keyword)).length;
  const positiveCount = positiveKeywords.filter(keyword => text.includes(keyword)).length;

  let sentiment;
  let confidence = 0.6;

  if (rating <= 2) {
    sentiment = 'negative';
    confidence += 0.2;
  } else if (rating >= 4) {
    sentiment = 'positive';
    confidence += 0.2;
  } else {
    sentiment = 'neutral';
  }

  if (negativeCount > positiveCount) {
    sentiment = 'negative';
    confidence += Math.min(negativeCount * 0.1, 0.3);
  } else if (positiveCount > negativeCount) {
    sentiment = 'positive';
    confidence += Math.min(positiveCount * 0.1, 0.3);
  }

  return { sentiment, confidence: Math.min(confidence, 1.0) };
}

async function runSentimentAnalysis() {
  console.log('🔍 Starting sentiment analysis...');
  
  try {
    // Get all reviews with entity information
    const reviewsQuery = `
      SELECT 
        r.id,
        r.rating,
        r.review_text,
        r.review_title,
        r.ngo_profile_id,
        r.business_profile_id,
        CASE 
          WHEN r.ngo_profile_id IS NOT NULL THEN 'ngo'
          ELSE 'business'
        END as entity_type,
        COALESCE(r.ngo_profile_id, r.business_profile_id) as profile_id,
        p.name as entity_name
      FROM reviews r
      LEFT JOIN profiles p ON (p.id = COALESCE(r.ngo_profile_id, r.business_profile_id))
      ORDER BY p.id, r.created_at;
    `;

    const reviewsResult = await pool.query(reviewsQuery);
    const reviews = reviewsResult.rows;

    console.log(`📊 Found ${reviews.length} reviews to analyze`);

    // Group reviews by entity
    const entitiesByProfile = {};
    reviews.forEach(review => {
      if (!entitiesByProfile[review.profile_id]) {
        entitiesByProfile[review.profile_id] = {
          profileId: review.profile_id,
          entityName: review.entity_name,
          entityType: review.entity_type,
          reviews: []
        };
      }
      entitiesByProfile[review.profile_id].reviews.push(review);
    });

    const entities = Object.values(entitiesByProfile);
    console.log(`🏢 Analyzing ${entities.length} entities`);

    const results = {
      entitiesAnalyzed: 0,
      entitiesFlagged: 0,
      totalReviews: reviews.length,
      flaggedEntities: []
    };

    // Analyze each entity
    for (const entity of entities) {
      console.log(`\n🔍 Analyzing: ${entity.entityName} (${entity.entityType})`);
      
      const entityReviews = entity.reviews;
      const totalReviews = entityReviews.length;
      
      // Analyze sentiment for each review
      const sentimentResults = entityReviews.map(review => {
        const sentiment = analyzeSentiment(review.review_text, review.rating);
        return {
          reviewId: review.id,
          rating: review.rating,
          sentiment: sentiment.sentiment,
          confidence: sentiment.confidence
        };
      });

      // Calculate statistics
      const negativeReviews = sentimentResults.filter(r => r.sentiment === 'negative').length;
      const positiveReviews = sentimentResults.filter(r => r.sentiment === 'positive').length;
      const neutralReviews = sentimentResults.filter(r => r.sentiment === 'neutral').length;
      const negativePercentage = (negativeReviews / totalReviews) * 100;

      console.log(`   📊 Reviews: ${totalReviews} total, ${negativeReviews} negative (${negativePercentage.toFixed(1)}%)`);

      results.entitiesAnalyzed++;

      // Flag if more than 30% negative reviews
      if (negativePercentage > 30) {
        console.log(`   🚩 FLAGGED: ${negativePercentage.toFixed(1)}% negative reviews`);
        
        // Check if already flagged
        const existingFlagQuery = `
          SELECT id FROM blacklist 
          WHERE profile_id = $1 AND status = 'flagged'
        `;
        const existingFlag = await pool.query(existingFlagQuery, [entity.profileId]);

        if (existingFlag.rows.length === 0) {
          // Insert into blacklist
          const insertBlacklistQuery = `
            INSERT INTO blacklist (
              profile_id, entity_type, flagged_reason, 
              negative_review_percentage, total_reviews, negative_reviews
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, flagged_at;
          `;

          const flaggedReason = `Automated flagging: ${negativePercentage.toFixed(1)}% negative reviews (${negativeReviews}/${totalReviews})`;
          
          const flagResult = await pool.query(insertBlacklistQuery, [
            entity.profileId,
            entity.entityType,
            flaggedReason,
            negativePercentage.toFixed(2),
            totalReviews,
            negativeReviews
          ]);

          results.entitiesFlagged++;
          results.flaggedEntities.push({
            flagId: flagResult.rows[0].id,
            profileId: entity.profileId,
            entityName: entity.entityName,
            entityType: entity.entityType,
            negativePercentage: negativePercentage.toFixed(1),
            totalReviews,
            negativeReviews,
            flaggedAt: flagResult.rows[0].flagged_at
          });

          console.log(`   ✅ Added to blacklist with ID: ${flagResult.rows[0].id}`);
        } else {
          console.log(`   ⚠️ Already flagged`);
        }
      } else {
        console.log(`   ✅ SAFE: ${negativePercentage.toFixed(1)}% negative reviews`);
      }
    }

    // Summary
    console.log('\n🎉 Sentiment Analysis Complete!');
    console.log('=====================================');
    console.log(`📊 Entities Analyzed: ${results.entitiesAnalyzed}`);
    console.log(`🚩 Entities Flagged: ${results.entitiesFlagged}`);
    console.log(`📝 Total Reviews: ${results.totalReviews}`);
    
    if (results.flaggedEntities.length > 0) {
      console.log('\n🚨 FLAGGED ENTITIES:');
      results.flaggedEntities.forEach((entity, index) => {
        console.log(`${index + 1}. ${entity.entityName} (${entity.entityType})`);
        console.log(`   - ${entity.negativePercentage}% negative (${entity.negativeReviews}/${entity.totalReviews} reviews)`);
        console.log(`   - Flag ID: ${entity.flagId}`);
      });
    }

    return results;

  } catch (error) {
    console.error('❌ Error running sentiment analysis:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the analysis
runSentimentAnalysis()
  .then((results) => {
    console.log('\n🎉 Sentiment analysis completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Sentiment analysis failed:', error);
    process.exit(1);
  });