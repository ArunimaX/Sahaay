import { Router } from "express";
import { ReviewService } from "../services/review-service";

const router = Router();

// Create a new review
router.post("/", async (req, res) => {
  try {
    console.log('📥 Review creation request received:', req.body);

    const { reviewerProfileId, ngoProfileId, businessProfileId, rating, reviewText, reviewTitle } = req.body;

    // Validate required fields
    if (!reviewerProfileId || !rating || !reviewText || !reviewTitle) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        error: "Missing required fields: reviewerProfileId, rating, reviewText, reviewTitle"
      });
    }

    // Validate that either NGO or business is selected
    if (!ngoProfileId && !businessProfileId) {
      console.log('❌ Neither NGO nor business selected');
      return res.status(400).json({
        success: false,
        error: "Either ngoProfileId or businessProfileId must be provided"
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      console.log('❌ Invalid rating value');
      return res.status(400).json({
        success: false,
        error: "Rating must be between 1 and 5"
      });
    }

    const reviewData = {
      reviewerProfileId,
      ngoProfileId: ngoProfileId || '',
      businessProfileId: businessProfileId || '',
      rating: parseInt(rating),
      reviewText,
      reviewTitle,
    };

    const newReview = await ReviewService.createReview(reviewData);

    console.log('✅ Review created successfully');
    res.status(201).json({
      success: true,
      data: newReview,
      message: "Review created successfully"
    });

  } catch (error) {
    console.error('❌ Error creating review:', error);
    res.status(500).json({
      success: false,
      error: "Failed to create review"
    });
  }
});

// Get all NGOs for dropdown
router.get("/ngos", async (req, res) => {
  try {
    console.log('📥 Request to fetch all NGOs');

    const ngos = await ReviewService.getAllNGOs();

    res.status(200).json({
      success: true,
      data: ngos,
      message: "NGOs retrieved successfully"
    });

  } catch (error) {
    console.error('❌ Error fetching NGOs:', error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch NGOs"
    });
  }
});

// Get all businesses for dropdown
router.get("/businesses", async (req, res) => {
  try {
    console.log('📥 Request to fetch all businesses');

    const businesses = await ReviewService.getAllBusinesses();

    res.status(200).json({
      success: true,
      data: businesses,
      message: "Businesses retrieved successfully"
    });

  } catch (error) {
    console.error('❌ Error fetching businesses:', error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch businesses"
    });
  }
});

// Get reviews for a specific NGO
router.get("/ngo/:ngoId", async (req, res) => {
  try {
    const { ngoId } = req.params;
    console.log('📥 Request to fetch reviews for NGO:', ngoId);

    const reviews = await ReviewService.getReviewsForNGO(ngoId);
    const stats = await ReviewService.getNGOReviewStats(ngoId);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        stats
      },
      message: "NGO reviews retrieved successfully"
    });

  } catch (error) {
    console.error('❌ Error fetching NGO reviews:', error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch NGO reviews"
    });
  }
});

// Get reviews for a specific business
router.get("/business/:businessId", async (req, res) => {
  try {
    const { businessId } = req.params;
    console.log('📥 Request to fetch reviews for business:', businessId);

    const reviews = await ReviewService.getReviewsForBusiness(businessId);
    const stats = await ReviewService.getBusinessReviewStats(businessId);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        stats
      },
      message: "Business reviews retrieved successfully"
    });

  } catch (error) {
    console.error('❌ Error fetching business reviews:', error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch business reviews"
    });
  }
});

// Get all reviews
router.get("/", async (req, res) => {
  try {
    console.log('📥 Request to fetch all reviews');

    const reviews = await ReviewService.getAllReviews();

    res.status(200).json({
      success: true,
      data: reviews,
      message: "All reviews retrieved successfully"
    });

  } catch (error) {
    console.error('❌ Error fetching all reviews:', error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch reviews"
    });
  }
});

export default router;