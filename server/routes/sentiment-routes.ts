import { Router } from "express";
import { SentimentAnalysisService } from "../services/sentiment-analysis-service";

const router = Router();

// Run full sentiment analysis on all entities
router.post("/analyze-all", async (req, res) => {
  try {
    console.log('📥 Request to run full sentiment analysis');

    const results = await SentimentAnalysisService.runFullSentimentAnalysis();

    res.status(200).json({
      success: true,
      data: results,
      message: "Sentiment analysis completed successfully"
    });

  } catch (error) {
    console.error('❌ Error running sentiment analysis:', error);
    res.status(500).json({
      success: false,
      error: "Failed to run sentiment analysis"
    });
  }
});

// Analyze specific entity
router.post("/analyze-entity", async (req, res) => {
  try {
    const { profileId, entityType } = req.body;
    console.log('📥 Request to analyze specific entity:', { profileId, entityType });

    if (!profileId || !entityType) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: profileId, entityType"
      });
    }

    if (!['ngo', 'business'].includes(entityType)) {
      return res.status(400).json({
        success: false,
        error: "entityType must be 'ngo' or 'business'"
      });
    }

    const analysis = await SentimentAnalysisService.analyzeEntityReviews(profileId, entityType);

    // Flag if necessary
    if (analysis.shouldFlag) {
      const flagResult = await SentimentAnalysisService.flagEntityForBlacklisting(
        profileId, 
        entityType, 
        analysis
      );
      analysis.flagged = true;
      analysis.flagId = flagResult.id;
    }

    res.status(200).json({
      success: true,
      data: analysis,
      message: "Entity analysis completed successfully"
    });

  } catch (error) {
    console.error('❌ Error analyzing entity:', error);
    res.status(500).json({
      success: false,
      error: "Failed to analyze entity"
    });
  }
});

// Get all flagged entities for admin panel
router.get("/flagged-entities", async (req, res) => {
  try {
    console.log('📥 Request to fetch flagged entities');

    const flaggedEntities = await SentimentAnalysisService.getFlaggedEntities();

    res.status(200).json({
      success: true,
      data: flaggedEntities,
      message: "Flagged entities retrieved successfully"
    });

  } catch (error) {
    console.error('❌ Error fetching flagged entities:', error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch flagged entities"
    });
  }
});

// Update blacklist status (admin action)
router.put("/blacklist/:blacklistId", async (req, res) => {
  try {
    const { blacklistId } = req.params;
    const { status, adminProfileId, adminNotes } = req.body;
    
    console.log('📥 Request to update blacklist status:', { blacklistId, status });

    if (!status || !adminProfileId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: status, adminProfileId"
      });
    }

    if (!['investigated', 'cleared', 'blacklisted'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "status must be 'investigated', 'cleared', or 'blacklisted'"
      });
    }

    const updated = await SentimentAnalysisService.updateBlacklistStatus(
      blacklistId,
      status,
      adminProfileId,
      adminNotes
    );

    res.status(200).json({
      success: true,
      data: updated,
      message: "Blacklist status updated successfully"
    });

  } catch (error) {
    console.error('❌ Error updating blacklist status:', error);
    res.status(500).json({
      success: false,
      error: "Failed to update blacklist status"
    });
  }
});

// Analyze single review text (for testing)
router.post("/analyze-text", async (req, res) => {
  try {
    const { reviewText, rating } = req.body;
    console.log('📥 Request to analyze review text');

    if (!reviewText || !rating) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: reviewText, rating"
      });
    }

    const sentiment = SentimentAnalysisService.analyzeSentiment(reviewText, parseInt(rating));

    res.status(200).json({
      success: true,
      data: sentiment,
      message: "Text sentiment analyzed successfully"
    });

  } catch (error) {
    console.error('❌ Error analyzing text sentiment:', error);
    res.status(500).json({
      success: false,
      error: "Failed to analyze text sentiment"
    });
  }
});

export default router;