import { drizzle } from 'drizzle-orm/node-postgres';
import { pool } from '../postgres-config';
import { eq, and, desc } from "drizzle-orm";
import { reviews, profiles, blacklist, type InsertBlacklist } from "../../shared/schema";

const db = drizzle(pool);

// Simple sentiment analysis based on keywords and rating
// In production, this would use the ML model you provided
export class SentimentAnalysisService {
  
  // Negative sentiment keywords
  private static negativeKeywords = [
    'bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'disgusting',
    'poor', 'disappointing', 'unsatisfactory', 'rude', 'slow', 'dirty',
    'expensive', 'overpriced', 'cold', 'stale', 'tasteless', 'unprofessional',
    'delayed', 'cancelled', 'refused', 'denied', 'failed', 'broken',
    'damaged', 'spoiled', 'expired', 'unhygienic', 'unclean', 'messy'
  ];

  // Positive sentiment keywords
  private static positiveKeywords = [
    'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
    'outstanding', 'perfect', 'love', 'delicious', 'fresh', 'clean',
    'professional', 'friendly', 'helpful', 'quick', 'fast', 'efficient',
    'quality', 'tasty', 'generous', 'caring', 'supportive', 'reliable',
    'consistent', 'organized', 'timely', 'responsive', 'courteous'
  ];

  // Analyze sentiment of a single review
  static analyzeSentiment(reviewText: string, rating: number): {
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    reasoning: string;
  } {
    const text = reviewText.toLowerCase();
    
    // Count positive and negative keywords
    const negativeCount = this.negativeKeywords.filter(keyword => 
      text.includes(keyword)
    ).length;
    
    const positiveCount = this.positiveKeywords.filter(keyword => 
      text.includes(keyword)
    ).length;

    // Rating-based sentiment (primary factor)
    let sentiment: 'positive' | 'negative' | 'neutral';
    let confidence = 0.6; // Base confidence from rating
    let reasoning = '';

    if (rating <= 2) {
      sentiment = 'negative';
      reasoning = `Low rating (${rating} stars)`;
      confidence += 0.2;
    } else if (rating >= 4) {
      sentiment = 'positive';
      reasoning = `High rating (${rating} stars)`;
      confidence += 0.2;
    } else {
      sentiment = 'neutral';
      reasoning = `Neutral rating (${rating} stars)`;
    }

    // Adjust based on keyword analysis
    if (negativeCount > positiveCount) {
      if (sentiment !== 'negative') {
        sentiment = 'negative';
        reasoning += `, negative keywords detected (${negativeCount})`;
      }
      confidence += Math.min(negativeCount * 0.1, 0.3);
    } else if (positiveCount > negativeCount) {
      if (sentiment !== 'positive') {
        sentiment = 'positive';
        reasoning += `, positive keywords detected (${positiveCount})`;
      }
      confidence += Math.min(positiveCount * 0.1, 0.3);
    }

    // Cap confidence at 1.0
    confidence = Math.min(confidence, 1.0);

    return { sentiment, confidence, reasoning };
  }

  // Analyze all reviews for a specific entity (NGO or business)
  static async analyzeEntityReviews(profileId: string, entityType: 'ngo' | 'business') {
    try {
      console.log(`🔍 Analyzing reviews for ${entityType}:`, profileId);

      // Get all reviews for this entity
      const entityReviews = await db
        .select({
          id: reviews.id,
          rating: reviews.rating,
          reviewText: reviews.reviewText,
          reviewTitle: reviews.reviewTitle,
          createdAt: reviews.createdAt,
        })
        .from(reviews)
        .where(
          entityType === 'ngo' 
            ? eq(reviews.ngoProfileId, profileId)
            : eq(reviews.businessProfileId, profileId)
        )
        .orderBy(desc(reviews.createdAt));

      if (entityReviews.length === 0) {
        console.log('⚠️ No reviews found for this entity');
        return {
          totalReviews: 0,
          positiveReviews: 0,
          negativeReviews: 0,
          neutralReviews: 0,
          negativePercentage: 0,
          shouldFlag: false,
          analysis: []
        };
      }

      // Analyze each review
      const analysis = entityReviews.map(review => {
        const sentiment = this.analyzeSentiment(review.reviewText, review.rating);
        return {
          reviewId: review.id,
          rating: review.rating,
          reviewTitle: review.reviewTitle,
          sentiment: sentiment.sentiment,
          confidence: sentiment.confidence,
          reasoning: sentiment.reasoning,
          createdAt: review.createdAt
        };
      });

      // Calculate statistics
      const totalReviews = analysis.length;
      const positiveReviews = analysis.filter(a => a.sentiment === 'positive').length;
      const negativeReviews = analysis.filter(a => a.sentiment === 'negative').length;
      const neutralReviews = analysis.filter(a => a.sentiment === 'neutral').length;
      const negativePercentage = (negativeReviews / totalReviews) * 100;

      // Flag if more than 30% negative reviews
      const shouldFlag = negativePercentage > 30;

      console.log(`📊 Analysis complete: ${totalReviews} reviews, ${negativePercentage.toFixed(1)}% negative`);

      return {
        totalReviews,
        positiveReviews,
        negativeReviews,
        neutralReviews,
        negativePercentage: Math.round(negativePercentage * 100) / 100,
        shouldFlag,
        analysis
      };

    } catch (error) {
      console.error('❌ Error analyzing entity reviews:', error);
      throw error;
    }
  }

  // Flag entity for blacklisting
  static async flagEntityForBlacklisting(
    profileId: string, 
    entityType: 'ngo' | 'business',
    analysisResult: any
  ) {
    try {
      console.log(`🚩 Flagging ${entityType} for blacklisting:`, profileId);

      // Check if already flagged
      const existingFlag = await db
        .select()
        .from(blacklist)
        .where(
          and(
            eq(blacklist.profileId, profileId),
            eq(blacklist.status, 'flagged')
          )
        )
        .limit(1);

      if (existingFlag.length > 0) {
        console.log('⚠️ Entity already flagged');
        return existingFlag[0];
      }

      // Create blacklist entry
      const flagData: Omit<InsertBlacklist, 'id' | 'createdAt' | 'updatedAt'> = {
        profileId,
        entityType,
        flaggedReason: `Automated flagging: ${analysisResult.negativePercentage}% negative reviews (${analysisResult.negativeReviews}/${analysisResult.totalReviews})`,
        negativeReviewPercentage: analysisResult.negativePercentage.toString(),
        totalReviews: analysisResult.totalReviews,
        negativeReviews: analysisResult.negativeReviews,
        status: 'flagged',
        flaggedAt: new Date(),
        investigatedAt: null,
        investigatedBy: null,
        adminNotes: null,
      };

      const [newFlag] = await db
        .insert(blacklist)
        .values(flagData)
        .returning();

      console.log('✅ Entity flagged successfully:', newFlag.id);
      return newFlag;

    } catch (error) {
      console.error('❌ Error flagging entity:', error);
      throw error;
    }
  }

  // Run sentiment analysis on all entities
  static async runFullSentimentAnalysis() {
    try {
      console.log('🔍 Starting full sentiment analysis...');

      // Get all NGOs
      const ngos = await db
        .select({ id: profiles.id, name: profiles.name })
        .from(profiles)
        .where(eq(profiles.role, 'ngo'));

      // Get all businesses (donors and service providers)
      const businesses = await db
        .select({ id: profiles.id, name: profiles.name, role: profiles.role })
        .from(profiles)
        .where(
          and(
            eq(profiles.role, 'donor')
          )
        );

      const serviceProviders = await db
        .select({ id: profiles.id, name: profiles.name, role: profiles.role })
        .from(profiles)
        .where(eq(profiles.role, 'service-provider'));

      const allBusinesses = [...businesses, ...serviceProviders];

      console.log(`📊 Found ${ngos.length} NGOs and ${allBusinesses.length} businesses to analyze`);

      const results = {
        ngos: [],
        businesses: [],
        flaggedEntities: [],
        summary: {
          totalEntitiesAnalyzed: 0,
          entitiesFlagged: 0,
          totalReviewsAnalyzed: 0
        }
      };

      // Analyze NGOs
      for (const ngo of ngos) {
        const analysis = await this.analyzeEntityReviews(ngo.id, 'ngo');
        const ngoResult = {
          id: ngo.id,
          name: ngo.name,
          type: 'ngo',
          ...analysis
        };

        results.ngos.push(ngoResult);
        results.summary.totalReviewsAnalyzed += analysis.totalReviews;

        if (analysis.shouldFlag) {
          const flagResult = await this.flagEntityForBlacklisting(ngo.id, 'ngo', analysis);
          results.flaggedEntities.push({
            ...ngoResult,
            flagId: flagResult.id,
            flaggedAt: flagResult.flaggedAt
          });
          results.summary.entitiesFlagged++;
        }
      }

      // Analyze businesses
      for (const business of allBusinesses) {
        const analysis = await this.analyzeEntityReviews(business.id, 'business');
        const businessResult = {
          id: business.id,
          name: business.name,
          type: 'business',
          role: business.role,
          ...analysis
        };

        results.businesses.push(businessResult);
        results.summary.totalReviewsAnalyzed += analysis.totalReviews;

        if (analysis.shouldFlag) {
          const flagResult = await this.flagEntityForBlacklisting(business.id, 'business', analysis);
          results.flaggedEntities.push({
            ...businessResult,
            flagId: flagResult.id,
            flaggedAt: flagResult.flaggedAt
          });
          results.summary.entitiesFlagged++;
        }
      }

      results.summary.totalEntitiesAnalyzed = ngos.length + allBusinesses.length;

      console.log(`🎉 Analysis complete: ${results.summary.entitiesFlagged} entities flagged out of ${results.summary.totalEntitiesAnalyzed}`);
      return results;

    } catch (error) {
      console.error('❌ Error running full sentiment analysis:', error);
      throw error;
    }
  }

  // Get all flagged entities for admin panel
  static async getFlaggedEntities() {
    try {
      console.log('🔍 Fetching flagged entities for admin panel...');

      const flaggedEntities = await db
        .select({
          id: blacklist.id,
          profileId: blacklist.profileId,
          entityName: profiles.name,
          entityEmail: profiles.email,
          entityType: blacklist.entityType,
          flaggedReason: blacklist.flaggedReason,
          negativeReviewPercentage: blacklist.negativeReviewPercentage,
          totalReviews: blacklist.totalReviews,
          negativeReviews: blacklist.negativeReviews,
          status: blacklist.status,
          flaggedAt: blacklist.flaggedAt,
          investigatedAt: blacklist.investigatedAt,
          adminNotes: blacklist.adminNotes,
        })
        .from(blacklist)
        .leftJoin(profiles, eq(blacklist.profileId, profiles.id))
        .orderBy(desc(blacklist.flaggedAt));

      console.log(`✅ Found ${flaggedEntities.length} flagged entities`);
      return flaggedEntities;

    } catch (error) {
      console.error('❌ Error fetching flagged entities:', error);
      throw error;
    }
  }

  // Update blacklist status (for admin actions)
  static async updateBlacklistStatus(
    blacklistId: string,
    status: 'investigated' | 'cleared' | 'blacklisted',
    adminProfileId: string,
    adminNotes?: string
  ) {
    try {
      console.log(`📝 Updating blacklist status: ${blacklistId} -> ${status}`);

      const [updated] = await db
        .update(blacklist)
        .set({
          status,
          investigatedAt: new Date(),
          investigatedBy: adminProfileId,
          adminNotes: adminNotes || null,
          updatedAt: new Date(),
        })
        .where(eq(blacklist.id, blacklistId))
        .returning();

      console.log('✅ Blacklist status updated successfully');
      return updated;

    } catch (error) {
      console.error('❌ Error updating blacklist status:', error);
      throw error;
    }
  }
}