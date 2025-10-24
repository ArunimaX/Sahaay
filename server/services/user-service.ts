// server/services/user-service.ts

import { pool } from '../postgres-config';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  password: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  email: string;
  name: string;
  role: string;
  password: string;
}

export class UserService {
  private static readonly TABLE = 'users';

  /**
   * Initialize the users table
   */
  static async initializeTable(): Promise<void> {
    try {
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${this.TABLE} (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL CHECK (role IN ('donor', 'ngo', 'volunteer', 'educator', 'community', 'fieldworker', 'admin')),
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      
      await pool.query(createTableQuery);
      console.log(`✅ Table ${this.TABLE} initialized successfully`);
    } catch (error) {
      console.error(`❌ Error initializing table ${this.TABLE}:`, error);
      throw error;
    }
  }

  /**
   * Create a new user
   */
  static async createUser(userData: CreateUserData): Promise<User> {
    try {
      const insertQuery = `
        INSERT INTO ${this.TABLE} (email, name, role, password)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      
      const values = [userData.email, userData.name, userData.role, userData.password];
      const result = await pool.query(insertQuery, values);
      
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const query = `SELECT * FROM ${this.TABLE} WHERE email = $1`;
      const result = await pool.query(query, [email]);
      
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw new Error('Failed to get user by email');
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string): Promise<User | null> {
    try {
      const query = `SELECT * FROM ${this.TABLE} WHERE id = $1`;
      const result = await pool.query(query, [id]);
      
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw new Error('Failed to get user by ID');
    }
  }

  /**
   * Update user
   */
  static async updateUser(id: string, updateData: Partial<User>): Promise<User> {
    try {
      const fields = Object.keys(updateData).filter(key => key !== 'id');
      const values = Object.values(updateData).filter(value => value !== undefined);
      
      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
      const query = `
        UPDATE ${this.TABLE} 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await pool.query(query, [id, ...values]);
      
      if (result.rows.length === 0) {
        throw new Error('User not found');
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  /**
   * Delete user
   */
  static async deleteUser(id: string): Promise<void> {
    try {
      const query = `DELETE FROM ${this.TABLE} WHERE id = $1`;
      const result = await pool.query(query, [id]);
      
      if (result.rowCount === 0) {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }

  /**
   * Get all users
   */
  static async getAllUsers(): Promise<User[]> {
    try {
      const query = `SELECT * FROM ${this.TABLE} ORDER BY created_at DESC`;
      const result = await pool.query(query);
      
      return result.rows;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw new Error('Failed to get all users');
    }
  }

  /**
   * Get users by role
   */
  static async getUsersByRole(role: string): Promise<User[]> {
    try {
      const query = `SELECT * FROM ${this.TABLE} WHERE role = $1 ORDER BY created_at DESC`;
      const result = await pool.query(query, [role]);
      
      return result.rows;
    } catch (error) {
      console.error('Error getting users by role:', error);
      throw new Error('Failed to get users by role');
    }
  }
}
