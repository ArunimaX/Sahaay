import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: varchar("role", { length: 32 }).notNull(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  name: true,
  role: true,
  password: true,
});

// Profiles table for user registration data
export const profiles = pgTable("profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: varchar("role", { length: 32 }).notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Temporary Donor Information Schema
export const donorInfo = pgTable("donor_info", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 10 }).notNull(),
  address: text("address").notNull(),
  aadhaar: varchar("aadhaar", { length: 12 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Profile-based Donor Information Schema (for current implementation)
export const profileDonorInfo = pgTable("profile_donor_info", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").notNull().references(() => profiles.id),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 10 }).notNull(),
  address: text("address").notNull(),
  aadhaar: varchar("aadhaar", { length: 12 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Profile-based Food Donations Schema
export const profileFoodDonations = pgTable("profile_food_donations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").notNull().references(() => profiles.id),
  totalItems: integer("total_items").notNull(),
  totalQuantity: decimal("total_quantity", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Profile-based Food Items Schema
export const profileFoodItems = pgTable("profile_food_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  donationId: varchar("donation_id").notNull().references(() => profileFoodDonations.id),
  foodType: text("food_type").notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  foodSafetyTag: text("food_safety_tag"),
  preparationTime: varchar("preparation_time").notNull(),
  preparationDate: varchar("preparation_date").notNull(),
  foodTypeCategory: text("food_type_category").notNull(),
  storageRequirement: text("storage_requirement").notNull(),
  expiryDate: varchar("expiry_date").notNull(),
  expiryTime: varchar("expiry_time").notNull(),
});

// Food Donation Schema
export const foodDonations = pgTable("food_donations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  totalItems: integer("total_items").notNull(),
  totalQuantity: decimal("total_quantity", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Food Items Schema
export const foodItems = pgTable("food_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  donationId: varchar("donation_id").notNull().references(() => foodDonations.id),
  foodType: text("food_type").notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  foodSafetyTag: text("food_safety_tag"),
  preparationTime: varchar("preparation_time").notNull(),
  preparationDate: varchar("preparation_date").notNull(),
  foodTypeCategory: text("food_type_category").notNull(),
  storageRequirement: text("storage_requirement").notNull(),
  expiryDate: varchar("expiry_date").notNull(),
  expiryTime: varchar("expiry_time").notNull(),
});

// NGO Information Schema
export const ngoInfo = pgTable("ngo_info", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 10 }).notNull(),
  address: text("address").notNull(),
  panId: varchar("pan_id", { length: 16 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// NGO Requests against donor food donations
export const ngoRequests = pgTable("ngo_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  donationId: varchar("donation_id").notNull().references(() => foodDonations.id),
  ngoUserId: varchar("ngo_user_id").notNull().references(() => users.id),
  status: varchar("status", { length: 16 }).notNull(), // pending | accepted | rejected
  createdAt: timestamp("created_at").defaultNow(),
  decisionAt: timestamp("decision_at"),
});

// Delivery Proofs for accepted NGO requests
export const deliveryProofs = pgTable("delivery_proofs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ngoRequestId: varchar("ngo_request_id").notNull().references(() => ngoRequests.id),
  beforeImagePath: text("before_image_path").notNull(),
  afterImagePath: text("after_image_path").notNull(),
  beforeLat: decimal("before_lat", { precision: 10, scale: 6 }).notNull(),
  beforeLng: decimal("before_lng", { precision: 10, scale: 6 }).notNull(),
  afterLat: decimal("after_lat", { precision: 10, scale: 6 }).notNull(),
  afterLng: decimal("after_lng", { precision: 10, scale: 6 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProfileSchema = createInsertSchema(profiles);
export const insertDonorInfoSchema = createInsertSchema(donorInfo);
export const insertProfileDonorInfoSchema = createInsertSchema(profileDonorInfo);
export const insertFoodDonationSchema = createInsertSchema(foodDonations);
export const insertProfileFoodDonationSchema = createInsertSchema(profileFoodDonations);
export const insertFoodItemSchema = createInsertSchema(foodItems);
export const insertProfileFoodItemSchema = createInsertSchema(profileFoodItems);
export const insertNgoInfoSchema = createInsertSchema(ngoInfo);
export const insertNgoRequestSchema = createInsertSchema(ngoRequests);
// Service Provider Information Schema
export const serviceProviderInfo = pgTable("service_provider_info", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 10 }).notNull(),
  aadhaar: varchar("aadhaar", { length: 12 }).notNull(),
  skillSet: text("skill_set").notNull(), // JSON array of skills
  yearsOfExperience: integer("years_of_experience").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Consumer Information Schema
export const consumerInfo = pgTable("consumer_info", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 10 }).notNull(),
  address: text("address").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Work Requests Schema
export const workRequests = pgTable("work_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  consumerUserId: varchar("consumer_user_id").notNull().references(() => users.id),
  serviceType: text("service_type").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  urgency: varchar("urgency", { length: 16 }).notNull(), // low, medium, high
  status: varchar("status", { length: 16 }).notNull().default('pending'), // pending, assigned, completed
  serviceProviderId: varchar("service_provider_id").references(() => serviceProviderInfo.id),
  completedAt: timestamp("completed_at"),
  otpValidated: varchar("otp_validated", { length: 4 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertServiceProviderInfoSchema = createInsertSchema(serviceProviderInfo);
export const insertConsumerInfoSchema = createInsertSchema(consumerInfo);
export const insertWorkRequestSchema = createInsertSchema(workRequests);
export const insertDeliveryProofSchema = createInsertSchema(deliveryProofs);

// Reviews Schema
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reviewerProfileId: varchar("reviewer_profile_id").notNull().references(() => profiles.id),
  ngoProfileId: varchar("ngo_profile_id").notNull().references(() => profiles.id),
  businessProfileId: varchar("business_profile_id").notNull().references(() => profiles.id),
  rating: integer("rating").notNull(), // 1-5 stars
  reviewText: text("review_text").notNull(),
  reviewTitle: text("review_title").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviews);

// Blacklist Schema for flagged entities
export const blacklist = pgTable("blacklist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").notNull().references(() => profiles.id),
  entityType: varchar("entity_type", { length: 20 }).notNull(), // 'ngo', 'business'
  flaggedReason: text("flagged_reason").notNull(),
  negativeReviewPercentage: decimal("negative_review_percentage", { precision: 5, scale: 2 }).notNull(),
  totalReviews: integer("total_reviews").notNull(),
  negativeReviews: integer("negative_reviews").notNull(),
  status: varchar("status", { length: 20 }).notNull().default('flagged'), // 'flagged', 'investigated', 'cleared', 'blacklisted'
  flaggedAt: timestamp("flagged_at").defaultNow(),
  investigatedAt: timestamp("investigated_at"),
  investigatedBy: varchar("investigated_by").references(() => profiles.id),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBlacklistSchema = createInsertSchema(blacklist);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type InsertDonorInfo = z.infer<typeof insertDonorInfoSchema>;
export type InsertProfileDonorInfo = z.infer<typeof insertProfileDonorInfoSchema>;
export type InsertFoodDonation = z.infer<typeof insertFoodDonationSchema>;
export type InsertProfileFoodDonation = z.infer<typeof insertProfileFoodDonationSchema>;
export type InsertFoodItem = z.infer<typeof insertFoodItemSchema>;
export type InsertProfileFoodItem = z.infer<typeof insertProfileFoodItemSchema>;
export type InsertNgoInfo = z.infer<typeof insertNgoInfoSchema>;
export type InsertNgoRequest = z.infer<typeof insertNgoRequestSchema>;
export type InsertDeliveryProof = z.infer<typeof insertDeliveryProofSchema>;
export type InsertServiceProviderInfo = z.infer<typeof insertServiceProviderInfoSchema>;
export type InsertConsumerInfo = z.infer<typeof insertConsumerInfoSchema>;
export type InsertWorkRequest = z.infer<typeof insertWorkRequestSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type InsertBlacklist = z.infer<typeof insertBlacklistSchema>;

export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type DonorInfo = typeof donorInfo.$inferSelect;
export type ProfileDonorInfo = typeof profileDonorInfo.$inferSelect;
export type FoodDonation = typeof foodDonations.$inferSelect;
export type ProfileFoodDonation = typeof profileFoodDonations.$inferSelect;
export type FoodItem = typeof foodItems.$inferSelect;
export type ProfileFoodItem = typeof profileFoodItems.$inferSelect;
export type NgoInfo = typeof ngoInfo.$inferSelect;
export type NgoRequest = typeof ngoRequests.$inferSelect;
export type DeliveryProof = typeof deliveryProofs.$inferSelect;
export type ServiceProviderInfo = typeof serviceProviderInfo.$inferSelect;
export type ConsumerInfo = typeof consumerInfo.$inferSelect;
export type WorkRequest = typeof workRequests.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Blacklist = typeof blacklist.$inferSelect;
