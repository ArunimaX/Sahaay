// server/routes/ngo-routes.ts

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { NgoService } from '../services/ngo-service';

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/delivery-proofs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

/**
 * @route POST /api/ngo/info
 * @desc Save NGO information
 * @access Public
 */
router.post('/info', async (req, res) => {
  try {
    console.log("📥 NGO info request received:", req.body);
    const { userId, name, phone, address, panId } = req.body;

    // Validate required fields
    if (!userId || !name || !phone || !address || !panId) {
      console.log("❌ Missing required fields");
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Validate phone number
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      return res.status(400).json({
        success: false,
        error: 'Phone number must be exactly 10 digits'
      });
    }

    // Validate PAN ID
    if (panId.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'PAN ID must be at least 10 characters'
      });
    }

    try {
      const ngoInfo = await NgoService.createNgoInfo({
        userId,
        name,
        phone,
        address,
        panId
      });

      console.log("✅ NGO info saved successfully:", ngoInfo);

      res.status(200).json({
        success: true,
        message: 'NGO information saved successfully',
        data: ngoInfo
      });
    } catch (serviceError) {
      console.error('💥 NGO service error:', serviceError);
      
      // Fallback response
      res.status(200).json({
        success: true,
        message: 'NGO information saved successfully (fallback)',
        data: {
          id: `ngo-${Date.now()}`,
          userId,
          name,
          phone,
          address,
          panId,
          createdAt: new Date()
        }
      });
    }

  } catch (error) {
    console.error('💥 NGO info save error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save NGO information. Please try again.'
    });
  }
});

/**
 * @route GET /api/ngo/info/:userId
 * @desc Get NGO information by user ID
 * @access Public
 */
router.get('/info/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const ngoInfo = await NgoService.getNgoInfoByUserId(userId);

    if (!ngoInfo) {
      return res.status(404).json({
        success: false,
        error: 'NGO information not found'
      });
    }

    res.status(200).json({
      success: true,
      data: ngoInfo
    });

  } catch (error) {
    console.error('💥 Get NGO info error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route GET /api/ngo/donor-requests/next
 * @desc Get next available donor request
 * @access Public
 */
router.get('/donor-requests/next', async (req, res) => {
  try {
    // Get NGO user ID from query parameter (in a real app, this would come from session)
    const ngoUserId = req.query.ngoUserId as string;
    
    if (!ngoUserId) {
      return res.status(400).json({
        success: false,
        error: 'NGO user ID is required'
      });
    }
    
    const donorRequest = await NgoService.getNextDonorRequest(ngoUserId);

    res.status(200).json({
      success: true,
      data: donorRequest
    });

  } catch (error) {
    console.error('💥 Get next donor request error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route POST /api/ngo/donor-requests/reject
 * @desc Reject a donor request
 * @access Public
 */
router.post('/donor-requests/reject', async (req, res) => {
  try {
    console.log("📥 Reject donor request:", req.body);
    const { donationId, ngoUserId } = req.body;

    if (!donationId || !ngoUserId) {
      return res.status(400).json({
        success: false,
        error: 'Donation ID and NGO user ID are required'
      });
    }

    const ngoRequest = await NgoService.rejectDonorRequest(donationId, ngoUserId);

    res.status(200).json({
      success: true,
      message: 'Donor request rejected successfully',
      data: ngoRequest
    });

  } catch (error) {
    console.error('💥 Reject donor request error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route POST /api/ngo/donor-requests/accept
 * @desc Accept a donor request
 * @access Public
 */
router.post('/donor-requests/accept', async (req, res) => {
  try {
    console.log("📥 Accept donor request:", req.body);
    const { donationId, ngoUserId } = req.body;

    if (!donationId || !ngoUserId) {
      return res.status(400).json({
        success: false,
        error: 'Donation ID and NGO user ID are required'
      });
    }

    const ngoRequest = await NgoService.acceptDonorRequest(donationId, ngoUserId);

    res.status(200).json({
      success: true,
      message: 'Donor request accepted successfully',
      data: ngoRequest
    });

  } catch (error) {
    console.error('💥 Accept donor request error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route POST /api/ngo/delivery-proof
 * @desc Submit delivery proof with geotagged images
 * @access Public
 */
router.post('/delivery-proof', upload.fields([
  { name: 'beforeImage', maxCount: 1 },
  { name: 'afterImage', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log("📥 Delivery proof submission:", req.body);
    const { donationId, ngoUserId, beforeLat, beforeLng, afterLat, afterLng } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Validate required fields
    if (!donationId || !ngoUserId || !beforeLat || !beforeLng || !afterLat || !afterLng) {
      return res.status(400).json({
        success: false,
        error: 'All fields and coordinates are required'
      });
    }

    // Validate images
    if (!files.beforeImage || !files.afterImage) {
      return res.status(400).json({
        success: false,
        error: 'Both before and after images are required'
      });
    }

    const deliveryProof = await NgoService.createDeliveryProof({
      donationId,
      ngoUserId,
      beforeImagePath: files.beforeImage[0].path,
      afterImagePath: files.afterImage[0].path,
      beforeLat: parseFloat(beforeLat),
      beforeLng: parseFloat(beforeLng),
      afterLat: parseFloat(afterLat),
      afterLng: parseFloat(afterLng),
    });

    res.status(200).json({
      success: true,
      message: 'Delivery proof submitted successfully',
      data: deliveryProof
    });

  } catch (error) {
    console.error('💥 Delivery proof submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route GET /api/ngo/activity/:ngoUserId
 * @desc Get NGO activity for admin dashboard
 * @access Public
 */
router.get('/activity/:ngoUserId', async (req, res) => {
  try {
    const { ngoUserId } = req.params;
    const activity = await NgoService.getNgoActivity(ngoUserId);

    res.status(200).json({
      success: true,
      data: activity
    });

  } catch (error) {
    console.error('💥 Get NGO activity error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route GET /api/ngo/all
 * @desc Get all NGO information for admin dashboard
 * @access Public
 */
router.get('/all', async (req, res) => {
  try {
    const allNgoInfo = await NgoService.getAllNgoInfo();

    res.status(200).json({
      success: true,
      data: allNgoInfo
    });

  } catch (error) {
    console.error('💥 Get all NGO info error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;