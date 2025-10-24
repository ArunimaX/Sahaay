// server/services/profile-service.ts

import { drizzle } from 'drizzle-orm/node-postgres';
import { pool } from '../postgres-config';
import { profiles, type InsertProfile, type Profile } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const db = drizzle(pool);

export class ProfileService {
  static async createProfile(profileData: {
    email: string;
    name: string;
    role: string;
    password: string;
  }): Promise<Profile> {
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(profileData.password, 10);

      // Insert profile into database
      const [newProfile] = await db.insert(profiles).values({
        email: profileData.email,
        name: profileData.name,
        role: profileData.role,
        password: hashedPassword,
      }).returning();

      console.log(`✅ Profile created in database: ${profileData.email} (${profileData.role})`);
      return newProfile;
    } catch (error) {
      console.error('❌ Error creating profile:', error);
      if (error instanceof Error) {
        console.error('❌ Error details:', error.message);
        if (error.message.includes('database') || error.message.includes('connection')) {
          console.log('🔧 Check if PostgreSQL is running and database "sahaay_connect" exists');
        }
      }
      throw error;
    }
  }

  static async getProfileByEmail(email: string): Promise<Profile | null> {
    try {
      const [profile] = await db.select().from(profiles).where(eq(profiles.email, email));
      return profile || null;
    } catch (error) {
      console.error('❌ Error getting profile by email:', error);
      throw error;
    }
  }

  static async getProfileById(id: string): Promise<Profile | null> {
    try {
      const [profile] = await db.select().from(profiles).where(eq(profiles.id, id));
      return profile || null;
    } catch (error) {
      console.error('❌ Error getting profile by ID:', error);
      throw error;
    }
  }

  static async getAllProfiles(): Promise<Profile[]> {
    try {
      const allProfiles = await db.select().from(profiles);
      return allProfiles;
    } catch (error) {
      console.error('❌ Error getting all profiles:', error);
      throw error;
    }
  }

  static async verifyPassword(email: string, password: string): Promise<Profile | null> {
    try {
      const profile = await this.getProfileByEmail(email);
      if (!profile) {
        return null;
      }

      const isValidPassword = await bcrypt.compare(password, profile.password);
      if (!isValidPassword) {
        return null;
      }

      return profile;
    } catch (error) {
      console.error('❌ Error verifying password:', error);
      throw error;
    }
  }

  static async initializeTable(): Promise<void> {
    try {
      // The table will be created by Drizzle migrations
      // This is just a placeholder for any initialization logic
      console.log('✅ Profile service initialized');
    } catch (error) {
      console.error('❌ Error initializing profiles table:', error);
      throw error;
    }
  }
}