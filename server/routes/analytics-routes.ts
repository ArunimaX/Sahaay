// server/routes/analytics-routes.ts

import express from 'express';
import { AnalyticsService } from '../services/analytics-service';

const router = express.Router();

/**
 * @route GET /api/analytics/dashboard
 * @desc Get comprehensive dashboard analytics
 * @access Public (should be admin-only in production)
 */
router.get('/dashboard', async (req, res) => {
  try {
    console.log('📊 Dashboard analytics request received');
    
    const analytics = await AnalyticsService.getDashboardAnalytics();
    
    res.status(200).json({
      success: true,
      data: analytics,
      message: 'Dashboard analytics retrieved successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('💥 Dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve dashboard analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route GET /api/analytics/food-donation/:id
 * @desc Get detailed information about a specific food donation
 * @access Public (should be admin-only in production)
 */
router.get('/food-donation/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📊 Food donation details request for ID:', id);
    
    const donationDetails = await AnalyticsService.getFoodDonationDetails(id);
    
    if (!donationDetails) {
      return res.status(404).json({
        success: false,
        error: 'Food donation not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: donationDetails,
      message: 'Food donation details retrieved successfully'
    });

  } catch (error) {
    console.error('💥 Food donation details error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve food donation details',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route GET /api/analytics/summary
 * @desc Get quick summary statistics
 * @access Public (should be admin-only in production)
 */
router.get('/summary', async (req, res) => {
  try {
    console.log('📊 Analytics summary request received');
    
    const analytics = await AnalyticsService.getDashboardAnalytics();
    
    // Return only overview data for quick loading
    res.status(200).json({
      success: true,
      data: {
        overview: analytics.overview,
        lastUpdated: new Date().toISOString()
      },
      message: 'Analytics summary retrieved successfully'
    });

  } catch (error) {
    console.error('💥 Analytics summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve analytics summary',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;