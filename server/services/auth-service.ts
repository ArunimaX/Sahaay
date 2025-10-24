// server/services/auth-service.ts

import bcrypt from 'bcryptjs';
import { UserService, CreateUserData } from './user-service';

export interface AuthResult {
  success: boolean;
  user?: any;
  error?: string;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends CreateUserData {
  confirmPassword: string;
}

export class AuthService {
  private static readonly SALT_ROUNDS = 12;

  /**
   * Initialize the database tables
   */
  static async initializeDatabase(): Promise<void> {
    try {
      await UserService.initializeTable();
      console.log('✅ Database tables initialized successfully');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   */
  static async registerUser(userData: RegisterData): Promise<AuthResult> {
    try {
      // Validate input
      if (!userData.email || !userData.password || !userData.name || !userData.role) {
        return {
          success: false,
          error: 'Missing required fields'
        };
      }

      // Check if passwords match
      if (userData.password !== userData.confirmPassword) {
        return {
          success: false,
          error: 'Passwords do not match'
        };
      }

      // Check if user already exists
      const existingUser = await UserService.getUserByEmail(userData.email);
      if (existingUser) {
        return {
          success: false,
          error: 'User with this email already exists'
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, this.SALT_ROUNDS);

      // Create user object
      const newUser: CreateUserData = {
        email: userData.email,
        name: userData.name,
        role: userData.role,
        password: hashedPassword
      };

      // Save to PostgreSQL
      const createdUser = await UserService.createUser(newUser);

      // Return success without password
      const { password, ...userWithoutPassword } = createdUser;
      
      return {
        success: true,
        user: userWithoutPassword
      };

    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Registration failed. Please try again.'
      };
    }
  }

  /**
   * Authenticate user login
   */
  static async loginUser(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      // Validate input
      if (!credentials.email || !credentials.password) {
        return {
          success: false,
          error: 'Email and password are required'
        };
      }

      // Get user by email
      const user = await UserService.getUserByEmail(credentials.email);
      if (!user) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Return success without password
      const { password, ...userWithoutPassword } = user;
      
      return {
        success: true,
        user: userWithoutPassword
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Login failed. Please try again.'
      };
    }
  }

  /**
   * Change user password
   */
  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<AuthResult> {
    try {
      // Get user
      const user = await UserService.getUserById(userId);
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return {
          success: false,
          error: 'Current password is incorrect'
        };
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

      // Update password
      await UserService.updateUser(userId, { password: hashedNewPassword });

      return {
        success: true,
        user: { id: userId }
      };

    } catch (error) {
      console.error('Password change error:', error);
      return {
        success: false,
        error: 'Password change failed. Please try again.'
      };
    }
  }
}
