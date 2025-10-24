// server/routes/test-routes.ts

import express from 'express';
import bcrypt from 'bcryptjs';
import { TestService } from '../services/test-service';
import { ProfileService } from '../services/profile-service';

const router = express.Router();

/**
 * @route POST /api/test/register
 * @desc Register a test user (in-memory)
 * @access Public
 */
router.post('/register', async (req, res) => {
  try {
    console.log("📥 Registration request received:", req.body);
    const { email, password, name, role, confirmPassword } = req.body;

    // Validate required fields
    if (!email || !password || !name || !role || !confirmPassword) {
      console.log("❌ Missing required fields:", { email: !!email, password: !!password, name: !!name, role: !!role, confirmPassword: !!confirmPassword });
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    console.log("✅ All fields present, validating role...");

    // Validate role
    const validRoles = ['admin', 'consumer', 'service-provider', 'donor', 'ngo', 'volunteer', 'educator', 'community', 'fieldworker'];
    if (!validRoles.includes(role)) {
      console.log("❌ Invalid role:", role);
      return res.status(400).json({
        success: false,
        error: 'Invalid role. Must be one of: ' + validRoles.join(', ')
      });
    }

    console.log("✅ Role validated:", role);

    // Check if passwords match
    if (password !== confirmPassword) {
      console.log("❌ Passwords don't match");
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match'
      });
    }

    console.log("✅ Passwords match, checking if user exists...");

    // Check if user already exists in database
    const existingProfile = await ProfileService.getProfileByEmail(email);
    if (existingProfile) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    console.log("✅ User doesn't exist, creating profile in database...");

    // Create profile in database
    const newProfile = await ProfileService.createProfile({
      email,
      name,
      role,
      password
    });

    console.log("✅ Profile created successfully in database:", newProfile.id);

    // Return success without password
    const { password: _, ...userWithoutPassword } = newProfile;
    
    console.log("✅ Sending success response");
    res.status(201).json({
      success: true,
      user: userWithoutPassword,
      message: 'Test user registered successfully'
    });

  } catch (error) {
    console.error('💥 Test registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route POST /api/test/login
 * @desc Login test user (in-memory)
 * @access Public
 */
router.post('/login', async (req, res) => {
  try {
    console.log("📥 Login request received:", req.body);
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      console.log("❌ Missing required fields:", { email: !!email, password: !!password });
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    console.log("✅ All fields present, looking up user in database...");

    // Verify user credentials using database
    const user = await ProfileService.verifyPassword(email, password);
    if (!user) {
      console.log("❌ Invalid credentials for:", email);
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    console.log("✅ User authenticated successfully:", user.id);

    // Return success without password
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(200).json({
      success: true,
      user: userWithoutPassword,
      message: 'Test user logged in successfully (in-memory)'
    });

  } catch (error) {
    console.error('💥 Test login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route GET /api/test/users
 * @desc Get all test users (in-memory)
 * @access Public
 */
router.get('/users', async (req, res) => {
  try {
    const profiles = await ProfileService.getAllProfiles();
    
    // Remove passwords from response
    const usersWithoutPasswords = profiles.map(profile => {
      const { password, ...userWithoutPassword } = profile;
      return userWithoutPassword;
    });

    res.status(200).json({
      success: true,
      users: usersWithoutPasswords,
      count: profiles.length,
      message: 'Profiles retrieved from database'
    });

  } catch (error) {
    console.error('Get profiles error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route GET /api/test/profile/:id
 * @desc Get test user profile (in-memory)
 * @access Public
 */
router.get('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await ProfileService.getProfileById(id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = profile;

    res.status(200).json({
      success: true,
      user: userWithoutPassword,
      message: 'Profile retrieved from database'
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route DELETE /api/test/clear
 * @desc Clear all test data (in-memory)
 * @access Public
 */
router.delete('/clear', (req, res) => {
  try {
    TestService.clearTestData();
    
    res.status(200).json({
      success: true,
      message: 'All test data cleared from memory'
    });

  } catch (error) {
    console.error('Clear test data error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route GET /api/test/profiles
 * @desc Get all profiles from database
 * @access Public
 */
router.get('/profiles', async (req, res) => {
  try {
    const profiles = await ProfileService.getAllProfiles();
    
    // Remove passwords from response
    const profilesWithoutPasswords = profiles.map(profile => {
      const { password, ...profileWithoutPassword } = profile;
      return profileWithoutPassword;
    });

    res.status(200).json({
      success: true,
      profiles: profilesWithoutPasswords,
      count: profiles.length,
      message: `Profiles retrieved from database: sahaay_connect`
    });

  } catch (error) {
    console.error('Get profiles error:', error);
    res.status(500).json({
      success: false,
      error: 'Database connection error - make sure sahaay_connect database exists'
    });
  }
});

/**
 * @route GET /api/test/db-status
 * @desc Check database connection and table status
 * @access Public
 */
router.get('/db-status', async (req, res) => {
  try {
    // Test database connection
    const profiles = await ProfileService.getAllProfiles();
    
    res.status(200).json({
      success: true,
      database: 'sahaay_connect',
      connection: 'active',
      profilesCount: profiles.length,
      message: 'Database connection successful'
    });

  } catch (error) {
    console.error('Database status check error:', error);
    res.status(500).json({
      success: false,
      database: 'sahaay_connect',
      connection: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Database connection failed - check if sahaay_connect database exists'
    });
  }
});

export default router;
