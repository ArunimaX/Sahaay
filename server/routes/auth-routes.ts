// server/routes/auth-routes.ts

import express from 'express';
import { AuthService } from '../services/auth-service';
import { UserService } from '../services/user-service';

const router = express.Router();

// Initialize database when routes are loaded
AuthService.initializeDatabase().catch(console.error);

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role, confirmPassword } = req.body;

    // Validate required fields
    if (!email || !password || !name || !role || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Validate role
    const validRoles = ['donor', 'ngo', 'volunteer', 'educator', 'community', 'fieldworker', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role. Must be one of: ' + validRoles.join(', ')
      });
    }

    const result = await AuthService.registerUser({
      email,
      password,
      name,
      role,
      confirmPassword
    });

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }

  } catch (error) {
    console.error('Registration route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    const result = await AuthService.loginUser({ email, password });

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(401).json(result);
    }

  } catch (error) {
    console.error('Login route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route GET /api/auth/profile/:id
 * @desc Get user profile
 * @access Public (for now)
 */
router.get('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserService.getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Get profile route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route GET /api/auth/users
 * @desc Get all users (for testing)
 * @access Public (for now)
 */
router.get('/users', async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    
    // Remove passwords from response
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.status(200).json({
      success: true,
      users: usersWithoutPasswords,
      count: usersWithoutPasswords.length
    });

  } catch (error) {
    console.error('Get users route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route GET /api/auth/users/role/:role
 * @desc Get users by role
 * @access Public (for now)
 */
router.get('/users/role/:role', async (req, res) => {
  try {
    const { role } = req.params;
    const users = await UserService.getUsersByRole(role);
    
    // Remove passwords from response
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.status(200).json({
      success: true,
      users: usersWithoutPasswords,
      count: usersWithoutPasswords.length,
      role
    });

  } catch (error) {
    console.error('Get users by role route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
