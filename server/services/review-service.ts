import { eq, desc, and } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/node-postgres';
import { pool } from '../postgres-config';
import { reviews, profiles, type InsertReview, type Review } from "../../shared/schema";

const db = drizzle(pool);

export class ReviewService {
  // Create a new review
  static async createReview(reviewData: Omit<InsertReview, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      console.log('📝 Creating new review:', reviewData);
      
      const [newReview] = await db
        .insert(reviews)
        .values({
          ...reviewData,
        })
        .returning();

      console.log('✅ Review created successfully:', newReview.id);
      return newReview;
    } catch (error) {
      console.error('❌ Error creating review:', error);
      throw error;
    }
  }

  // Get all NGOs from profiles
  static async getAllNGOs() {
    try {
      console.log('🔍 Fetching all NGOs from database...');
      
      const ngos = await db
        .select({
          id: profiles.id,
          name: profiles.name,
          email: profiles.email,
        })
        .from(profiles)
        .where(eq(profiles.role, 'ngo'))
        .orderBy(profiles.name);

      console.log(`✅ Found ${ngos.length} NGOs`);
      return ngos;
    } catch (error) {
      console.error('❌ Error fetching NGOs:', error);
      throw error;
    }
  }

  // Get all businesses (donors with business-like names or service providers)
  static async getAllBusinesses() {
    try {
      console.log('🔍 Fetching all businesses from database...');
      
      const businesses = await db
        .select({
          id: profiles.id,
          name: profiles.name,
          email: profiles.email,
          role: profiles.role,
        })
        .from(profiles)
        .where(
          and(
            // Include donors and service providers as potential businesses
            eq(profiles.role, 'donor')
          )
        )
        .orderBy(profiles.name);

      // Also get service providers
      const serviceProviders = await db
        .select({
          id: profiles.id,
          name: profiles.name,
          email: profiles.email,
          role: profiles.role,
        })
        .from(profiles)
        .where(eq(profiles.role, 'service-provider'))
        .orderBy(profiles.name);

      const allBusinesses = [...businesses, ...serviceProviders];
      console.log(`✅ Found ${allBusinesses.length} businesses`);
      return allBusinesses;
    } catch (error) {
      console.error('❌ Error fetching businesses:', error);
      throw error;
    }
  }

  // Get reviews for a specific NGO
  static async getReviewsForNGO(ngoProfileId: string) {
    try {
      console.log('🔍 Fetching reviews for NGO:', ngoProfileId);
      
      const ngoReviews = await db
        .select({
          id: reviews.id,
          rating: reviews.rating,
          reviewText: reviews.reviewText,
          reviewTitle: reviews.reviewTitle,
          createdAt: reviews.createdAt,
          reviewerName: profiles.name,
          reviewerEmail: profiles.email,
        })
        .from(reviews)
        .leftJoin(profiles, eq(reviews.reviewerProfileId, profiles.id))
        .where(eq(reviews.ngoProfileId, ngoProfileId))
        .orderBy(desc(reviews.createdAt));

      console.log(`✅ Found ${ngoReviews.length} reviews for NGO`);
      return ngoReviews;
    } catch (error) {
      console.error('❌ Error fetching NGO reviews:', error);
      throw error;
    }
  }

  // Get reviews for a specific business
  static async getReviewsForBusiness(businessProfileId: string) {
    try {
      console.log('🔍 Fetching reviews for business:', businessProfileId);
      
      const businessReviews = await db
        .select({
          id: reviews.id,
          rating: reviews.rating,
          reviewText: reviews.reviewText,
          reviewTitle: reviews.reviewTitle,
          createdAt: reviews.createdAt,
          reviewerName: profiles.name,
          reviewerEmail: profiles.email,
        })
        .from(reviews)
        .leftJoin(profiles, eq(reviews.reviewerProfileId, profiles.id))
        .where(eq(reviews.businessProfileId, businessProfileId))
        .orderBy(desc(reviews.createdAt));

      console.log(`✅ Found ${businessReviews.length} reviews for business`);
      return businessReviews;
    } catch (error) {
      console.error('❌ Error fetching business reviews:', error);
      throw error;
    }
  }

  // Get all reviews with full details
  static async getAllReviews() {
    try {
      console.log('🔍 Fetching all reviews...');
      
      const allReviews = await db
        .select({
          id: reviews.id,
          rating: reviews.rating,
          reviewText: reviews.reviewText,
          reviewTitle: reviews.reviewTitle,
          createdAt: reviews.createdAt,
          reviewerName: profiles.name,
          ngoName: profiles.name,
          businessName: profiles.name,
        })
        .from(reviews)
        .leftJoin(profiles, eq(reviews.reviewerProfileId, profiles.id))
        .orderBy(desc(reviews.createdAt));

      console.log(`✅ Found ${allReviews.length} total reviews`);
      return allReviews;
    } catch (error) {
      console.error('❌ Error fetching all reviews:', error);
      throw error;
    }
  }

  // Get review statistics for an NGO
  static async getNGOReviewStats(ngoProfileId: string) {
    try {
      console.log('📊 Calculating review stats for NGO:', ngoProfileId);
      
      const reviewStats = await db
        .select({
          rating: reviews.rating,
        })
        .from(reviews)
        .where(eq(reviews.ngoProfileId, ngoProfileId));

      if (reviewStats.length === 0) {
        return {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
      }

      const totalReviews = reviewStats.length;
      const averageRating = reviewStats.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
      
      const ratingDistribution = reviewStats.reduce((dist, review) => {
        dist[review.rating as keyof typeof dist]++;
        return dist;
      }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

      console.log(`✅ NGO stats: ${totalReviews} reviews, ${averageRating.toFixed(1)} avg rating`);
      return {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution
      };
    } catch (error) {
      console.error('❌ Error calculating NGO review stats:', error);
      throw error;
    }
  }

  // Get review statistics for a business
  static async getBusinessReviewStats(businessProfileId: string) {
    try {
      console.log('📊 Calculating review stats for business:', businessProfileId);
      
      const reviewStats = await db
        .select({
          rating: reviews.rating,
        })
        .from(reviews)
        .where(eq(reviews.businessProfileId, businessProfileId));

      if (reviewStats.length === 0) {
        return {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
      }

      const totalReviews = reviewStats.length;
      const averageRating = reviewStats.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
      
      const ratingDistribution = reviewStats.reduce((dist, review) => {
        dist[review.rating as keyof typeof dist]++;
        return dist;
      }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

      console.log(`✅ Business stats: ${totalReviews} reviews, ${averageRating.toFixed(1)} avg rating`);
      return {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution
      };
    } catch (error) {
      console.error('❌ Error calculating business review stats:', error);
      throw error;
    }
  }
}