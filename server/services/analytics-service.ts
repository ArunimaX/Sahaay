// server/services/analytics-service.ts

import { drizzle } from 'drizzle-orm/node-postgres';
import { pool } from '../postgres-config';
import { 
  profiles, 
  donorInfo, 
  foodDonations, 
  foodItems,
  profileDonorInfo,
  profileFoodDonations,
  profileFoodItems,
  ngoInfo,
  serviceProviderInfo,
  consumerInfo,
  workRequests,
  ngoRequests
} from '../../shared/schema';
import { eq, sql, desc, asc, and, gte, lte } from 'drizzle-orm';

const db = drizzle(pool);

export interface DashboardAnalytics {
  overview: {
    totalUsers: number;
    totalDonors: number;
    totalNGOs: number;
    totalServiceProviders: number;
    totalConsumers: number;
    totalFoodDonations: number;
    totalFoodQuantity: number;
    totalWorkRequests: number;
  };
  foodDonations: {
    totalDonations: number;
    totalQuantity: number;
    totalItems: number;
    averageQuantityPerDonation: number;
    donationsByCategory: Array<{
      category: string;
      count: number;
      totalQuantity: number;
    }>;
    donationsByStorageType: Array<{
      storageType: string;
      count: number;
      totalQuantity: number;
    }>;
    recentDonations: Array<{
      id: string;
      donorName: string;
      totalItems: number;
      totalQuantity: number;
      createdAt: Date;
      foodItems: Array<{
        foodType: string;
        quantity: number;
        category: string;
      }>;
    }>;
    monthlyTrends: Array<{
      month: string;
      donations: number;
      quantity: number;
    }>;
  };
  userGrowth: {
    totalRegistrations: number;
    monthlyRegistrations: Array<{
      month: string;
      count: number;
      role: string;
    }>;
    roleDistribution: Array<{
      role: string;
      count: number;
      percentage: number;
    }>;
  };
  workRequests: {
    totalRequests: number;
    pendingRequests: number;
    completedRequests: number;
    requestsByUrgency: Array<{
      urgency: string;
      count: number;
    }>;
    requestsByServiceType: Array<{
      serviceType: string;
      count: number;
    }>;
  };
}

export class AnalyticsService {
  static async getDashboardAnalytics(): Promise<DashboardAnalytics> {
    try {
      console.log('📊 Generating dashboard analytics...');

      // Get overview statistics
      const [
        totalUsersResult,
        totalDonorsResult,
        totalNGOsResult,
        totalServiceProvidersResult,
        totalConsumersResult,
        totalFoodDonationsResult,
        totalFoodQuantityResult,
        totalWorkRequestsResult
      ] = await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(profiles),
        db.select({ count: sql<number>`count(*)` }).from(profileDonorInfo),
        db.select({ count: sql<number>`count(*)` }).from(ngoInfo),
        db.select({ count: sql<number>`count(*)` }).from(serviceProviderInfo),
        db.select({ count: sql<number>`count(*)` }).from(consumerInfo),
        db.select({ count: sql<number>`count(*)` }).from(profileFoodDonations),
        db.select({ 
          totalQuantity: sql<number>`COALESCE(SUM(CAST(total_quantity AS DECIMAL)), 0)` 
        }).from(profileFoodDonations),
        db.select({ count: sql<number>`count(*)` }).from(workRequests)
      ]);

      const overview = {
        totalUsers: totalUsersResult[0]?.count || 0,
        totalDonors: totalDonorsResult[0]?.count || 0,
        totalNGOs: totalNGOsResult[0]?.count || 0,
        totalServiceProviders: totalServiceProvidersResult[0]?.count || 0,
        totalConsumers: totalConsumersResult[0]?.count || 0,
        totalFoodDonations: totalFoodDonationsResult[0]?.count || 0,
        totalFoodQuantity: Math.round(totalFoodQuantityResult[0]?.totalQuantity || 0),
        totalWorkRequests: totalWorkRequestsResult[0]?.count || 0,
      };

      // Get food donation analytics
      const foodDonationAnalytics = await this.getFoodDonationAnalytics();
      
      // Get user growth analytics
      const userGrowthAnalytics = await this.getUserGrowthAnalytics();
      
      // Get work request analytics
      const workRequestAnalytics = await this.getWorkRequestAnalytics();

      console.log('✅ Dashboard analytics generated successfully');

      return {
        overview,
        foodDonations: foodDonationAnalytics,
        userGrowth: userGrowthAnalytics,
        workRequests: workRequestAnalytics
      };

    } catch (error) {
      console.error('❌ Error generating dashboard analytics:', error);
      throw error;
    }
  }

  private static async getFoodDonationAnalytics() {
    try {
      // Get donation statistics
      const [totalDonationsResult, totalQuantityResult, totalItemsResult] = await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(profileFoodDonations),
        db.select({ 
          totalQuantity: sql<number>`COALESCE(SUM(CAST(total_quantity AS DECIMAL)), 0)` 
        }).from(profileFoodDonations),
        db.select({ 
          totalItems: sql<number>`COALESCE(SUM(total_items), 0)` 
        }).from(profileFoodDonations)
      ]);

      const totalDonations = totalDonationsResult[0]?.count || 0;
      const totalQuantity = Math.round(totalQuantityResult[0]?.totalQuantity || 0);
      const totalItems = totalItemsResult[0]?.totalItems || 0;
      const averageQuantityPerDonation = totalDonations > 0 ? Math.round(totalQuantity / totalDonations) : 0;

      // Get donations by category
      const donationsByCategory = await db
        .select({
          category: foodItems.foodTypeCategory,
          count: sql<number>`count(*)`,
          totalQuantity: sql<number>`COALESCE(SUM(CAST(quantity AS DECIMAL)), 0)`
        })
        .from(foodItems)
        .groupBy(foodItems.foodTypeCategory)
        .orderBy(desc(sql`count(*)`));

      // Get donations by storage type
      const donationsByStorageType = await db
        .select({
          storageType: foodItems.storageRequirement,
          count: sql<number>`count(*)`,
          totalQuantity: sql<number>`COALESCE(SUM(CAST(quantity AS DECIMAL)), 0)`
        })
        .from(foodItems)
        .groupBy(foodItems.storageRequirement)
        .orderBy(desc(sql`count(*)`));

      // Get recent donations with donor info
      const recentDonationsRaw = await db
        .select({
          donationId: foodDonations.id,
          donorName: donorInfo.name,
          totalItems: foodDonations.totalItems,
          totalQuantity: foodDonations.totalQuantity,
          createdAt: foodDonations.createdAt,
          userId: foodDonations.userId
        })
        .from(foodDonations)
        .leftJoin(donorInfo, eq(foodDonations.userId, donorInfo.userId))
        .orderBy(desc(foodDonations.createdAt))
        .limit(10);

      // Get food items for recent donations
      const recentDonations = await Promise.all(
        recentDonationsRaw.map(async (donation) => {
          const items = await db
            .select({
              foodType: foodItems.foodType,
              quantity: foodItems.quantity,
              category: foodItems.foodTypeCategory
            })
            .from(foodItems)
            .where(eq(foodItems.donationId, donation.donationId));

          return {
            id: donation.donationId,
            donorName: donation.donorName || 'Anonymous Donor',
            totalItems: donation.totalItems,
            totalQuantity: parseFloat(donation.totalQuantity),
            createdAt: donation.createdAt!,
            foodItems: items.map(item => ({
              foodType: item.foodType,
              quantity: parseFloat(item.quantity),
              category: item.category
            }))
          };
        })
      );

      // Get monthly trends (last 6 months)
      const monthlyTrends = await db
        .select({
          month: sql<string>`TO_CHAR(created_at, 'YYYY-MM')`,
          donations: sql<number>`count(*)`,
          quantity: sql<number>`COALESCE(SUM(CAST(total_quantity AS DECIMAL)), 0)`
        })
        .from(foodDonations)
        .where(gte(foodDonations.createdAt, sql`NOW() - INTERVAL '6 months'`))
        .groupBy(sql`TO_CHAR(created_at, 'YYYY-MM')`)
        .orderBy(asc(sql`TO_CHAR(created_at, 'YYYY-MM')`));

      return {
        totalDonations,
        totalQuantity,
        totalItems,
        averageQuantityPerDonation,
        donationsByCategory: donationsByCategory.map(item => ({
          category: item.category,
          count: item.count,
          totalQuantity: Math.round(item.totalQuantity)
        })),
        donationsByStorageType: donationsByStorageType.map(item => ({
          storageType: item.storageType,
          count: item.count,
          totalQuantity: Math.round(item.totalQuantity)
        })),
        recentDonations,
        monthlyTrends: monthlyTrends.map(trend => ({
          month: trend.month,
          donations: trend.donations,
          quantity: Math.round(trend.quantity)
        }))
      };

    } catch (error) {
      console.error('❌ Error getting food donation analytics:', error);
      return {
        totalDonations: 0,
        totalQuantity: 0,
        totalItems: 0,
        averageQuantityPerDonation: 0,
        donationsByCategory: [],
        donationsByStorageType: [],
        recentDonations: [],
        monthlyTrends: []
      };
    }
  }

  private static async getUserGrowthAnalytics() {
    try {
      // Get total registrations
      const totalRegistrationsResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(profiles);

      // Get monthly registrations by role
      const monthlyRegistrations = await db
        .select({
          month: sql<string>`TO_CHAR(created_at, 'YYYY-MM')`,
          count: sql<number>`count(*)`,
          role: profiles.role
        })
        .from(profiles)
        .where(gte(profiles.createdAt, sql`NOW() - INTERVAL '12 months'`))
        .groupBy(sql`TO_CHAR(created_at, 'YYYY-MM')`, profiles.role)
        .orderBy(asc(sql`TO_CHAR(created_at, 'YYYY-MM')`));

      // Get role distribution
      const roleDistributionRaw = await db
        .select({
          role: profiles.role,
          count: sql<number>`count(*)`
        })
        .from(profiles)
        .groupBy(profiles.role)
        .orderBy(desc(sql`count(*)`));

      const totalUsers = totalRegistrationsResult[0]?.count || 0;
      const roleDistribution = roleDistributionRaw.map(item => ({
        role: item.role,
        count: item.count,
        percentage: totalUsers > 0 ? Math.round((item.count / totalUsers) * 100) : 0
      }));

      return {
        totalRegistrations: totalUsers,
        monthlyRegistrations: monthlyRegistrations.map(item => ({
          month: item.month,
          count: item.count,
          role: item.role
        })),
        roleDistribution
      };

    } catch (error) {
      console.error('❌ Error getting user growth analytics:', error);
      return {
        totalRegistrations: 0,
        monthlyRegistrations: [],
        roleDistribution: []
      };
    }
  }

  private static async getWorkRequestAnalytics() {
    try {
      // Get work request statistics
      const [totalRequestsResult, pendingRequestsResult, completedRequestsResult] = await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(workRequests),
        db.select({ count: sql<number>`count(*)` }).from(workRequests).where(eq(workRequests.status, 'pending')),
        db.select({ count: sql<number>`count(*)` }).from(workRequests).where(eq(workRequests.status, 'completed'))
      ]);

      // Get requests by urgency
      const requestsByUrgency = await db
        .select({
          urgency: workRequests.urgency,
          count: sql<number>`count(*)`
        })
        .from(workRequests)
        .groupBy(workRequests.urgency)
        .orderBy(desc(sql`count(*)`));

      // Get requests by service type
      const requestsByServiceType = await db
        .select({
          serviceType: workRequests.serviceType,
          count: sql<number>`count(*)`
        })
        .from(workRequests)
        .groupBy(workRequests.serviceType)
        .orderBy(desc(sql`count(*)`))
        .limit(10);

      return {
        totalRequests: totalRequestsResult[0]?.count || 0,
        pendingRequests: pendingRequestsResult[0]?.count || 0,
        completedRequests: completedRequestsResult[0]?.count || 0,
        requestsByUrgency: requestsByUrgency.map(item => ({
          urgency: item.urgency,
          count: item.count
        })),
        requestsByServiceType: requestsByServiceType.map(item => ({
          serviceType: item.serviceType,
          count: item.count
        }))
      };

    } catch (error) {
      console.error('❌ Error getting work request analytics:', error);
      return {
        totalRequests: 0,
        pendingRequests: 0,
        completedRequests: 0,
        requestsByUrgency: [],
        requestsByServiceType: []
      };
    }
  }

  static async getFoodDonationDetails(donationId: string) {
    try {
      // Get donation with donor info
      const [donation] = await db
        .select({
          id: foodDonations.id,
          userId: foodDonations.userId,
          totalItems: foodDonations.totalItems,
          totalQuantity: foodDonations.totalQuantity,
          createdAt: foodDonations.createdAt,
          donorName: donorInfo.name,
          donorPhone: donorInfo.phone,
          donorAddress: donorInfo.address
        })
        .from(foodDonations)
        .leftJoin(donorInfo, eq(foodDonations.userId, donorInfo.userId))
        .where(eq(foodDonations.id, donationId));

      if (!donation) {
        return null;
      }

      // Get food items for this donation
      const items = await db
        .select()
        .from(foodItems)
        .where(eq(foodItems.donationId, donationId));

      return {
        ...donation,
        foodItems: items
      };

    } catch (error) {
      console.error('❌ Error getting food donation details:', error);
      throw error;
    }
  }
}