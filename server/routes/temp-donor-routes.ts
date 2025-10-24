// server/routes/temp-donor-routes.ts

import express from 'express';
import { drizzle } from 'drizzle-orm/node-postgres';
import { pool } from '../postgres-config';
import { 
  donorInfo, 
  foodDonations, 
  foodItems,
  profileDonorInfo,
  profileFoodDonations,
  profileFoodItems,
  type InsertDonorInfo, 
  type InsertFoodDonation, 
  type InsertFoodItem,
  type InsertProfileDonorInfo,
  type InsertProfileFoodDonation,
  type InsertProfileFoodItem
} from '../../shared/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();
const db = drizzle(pool);

// In-memory storage for temp donor data (fallback for development)
const tempDonorData: any = {};
const tempFoodDonations: any[] = [];

/**
 * @route POST /api/temp-donor/info
 * @desc Save temporary donor information
 * @access Public
 */
router.post('/info', async (req, res) => {
  try {
    console.log("📥 Temp donor info request received:", req.body);
    const { userId, name, phone, address, aadhaar } = req.body;

    // Validate required fields
    if (!userId || !name || !phone || !address || !aadhaar) {
      console.log("❌ Missing required fields");
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    try {
      // Store in profile-based donor info table
      const [newDonorInfo] = await db.insert(profileDonorInfo).values({
        profileId: userId,
        name,
        phone,
        address,
        aadhaar,
      }).returning();

      console.log("✅ Donor info saved to database (profile_donor_info) for user:", userId);

      res.status(200).json({
        success: true,
        message: 'Donor information saved successfully to database',
        data: newDonorInfo
      });

    } catch (dbError) {
      console.error("❌ Database error:", dbError);
      console.log("⚠️ Database not available, using in-memory storage");
      
      // Fallback to in-memory storage
      tempDonorData[userId] = {
        userId,
        name,
        phone,
        address,
        aadhaar,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log("✅ Temp donor info saved in memory for user:", userId);

      res.status(200).json({
        success: true,
        message: 'Donor information saved successfully (in-memory fallback)',
        data: tempDonorData[userId]
      });
    }

  } catch (error) {
    console.error('💥 Temp donor info save error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route POST /api/temp-donor/food-donation
 * @desc Save temporary food donation
 * @access Public
 */
router.post('/food-donation', async (req, res) => {
  try {
    console.log("📥 Temp food donation request received:", req.body);
    const { userId, foodItems: foodItemsData } = req.body;

    // Validate required fields
    if (!userId || !foodItemsData || !Array.isArray(foodItemsData) || foodItemsData.length === 0) {
      console.log("❌ Missing required fields or no food items");
      return res.status(400).json({
        success: false,
        error: 'User ID and food items are required'
      });
    }

    // Validate food items
    for (const item of foodItemsData) {
      if (!item.foodType || !item.quantity || !item.foodTypeCategory) {
        return res.status(400).json({
          success: false,
          error: 'Each food item must have foodType, quantity, and foodTypeCategory'
        });
      }
    }

    try {
      // Calculate total quantity
      const totalQuantity = foodItemsData.reduce((sum: number, item: any) => sum + parseFloat(item.quantity), 0);

      // Create donation record in profile-based food donations table
      const [newDonation] = await db.insert(profileFoodDonations).values({
        profileId: userId,
        totalItems: foodItemsData.length,
        totalQuantity: totalQuantity.toString(),
      }).returning();

      // Insert individual food items into profile-based food items table
      const foodItemsForDb = foodItemsData.map((item: any) => ({
        donationId: newDonation.id,
        foodType: item.foodType,
        quantity: item.quantity.toString(),
        foodSafetyTag: item.foodSafetyTag || '',
        preparationTime: item.preparationTime,
        preparationDate: item.preparationDate,
        foodTypeCategory: item.foodTypeCategory,
        storageRequirement: item.storageRequirement,
        expiryDate: item.expiryDate,
        expiryTime: item.expiryTime,
      }));

      await db.insert(profileFoodItems).values(foodItemsForDb);

      console.log("✅ Food donation saved to database (profile_food_donations & profile_food_items):", newDonation.id);
      console.log("📊 Donation details:", {
        donationId: newDonation.id,
        profileId: userId,
        totalItems: foodItemsData.length,
        totalQuantity,
        itemsCount: foodItemsForDb.length
      });

      res.status(200).json({
        success: true,
        message: 'Food donation submitted successfully to database',
        data: {
          id: newDonation.id,
          profileId: userId,
          totalItems: foodItemsData.length,
          totalQuantity,
          foodItems: foodItemsData,
          createdAt: newDonation.createdAt
        }
      });

    } catch (dbError) {
      console.error("❌ Database error:", dbError);
      console.log("⚠️ Database not available, using in-memory storage");
      
      // Fallback to in-memory storage
      const donationId = `donation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const donation = {
        id: donationId,
        userId,
        foodItems: foodItemsData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      tempFoodDonations.push(donation);

      console.log("✅ Temp food donation saved in memory:", donationId);

      res.status(200).json({
        success: true,
        message: 'Food donation submitted successfully (in-memory fallback)',
        data: donation
      });
    }

  } catch (error) {
    console.error('💥 Temp food donation save error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route GET /api/temp-donor/info/:userId
 * @desc Get temporary donor information
 * @access Public
 */
router.get('/info/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const donorInfo = tempDonorData[userId];

    if (!donorInfo) {
      return res.status(404).json({
        success: false,
        error: 'Donor information not found'
      });
    }

    res.status(200).json({
      success: true,
      data: donorInfo
    });

  } catch (error) {
    console.error('💥 Get temp donor info error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route GET /api/temp-donor/donations/:userId
 * @desc Get user's food donations
 * @access Public
 */
router.get('/donations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userDonations = tempFoodDonations.filter(donation => donation.userId === userId);

    res.status(200).json({
      success: true,
      data: userDonations
    });

  } catch (error) {
    console.error('💥 Get temp donations error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route DELETE /api/temp-donor/clear
 * @desc Clear all temp donor data (for testing)
 * @access Public
 */
router.delete('/clear', (req, res) => {
  try {
    Object.keys(tempDonorData).forEach(key => delete tempDonorData[key]);
    tempFoodDonations.length = 0;
    
    res.status(200).json({
      success: true,
      message: 'All temp donor data cleared'
    });

  } catch (error) {
    console.error('Clear temp donor data error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;