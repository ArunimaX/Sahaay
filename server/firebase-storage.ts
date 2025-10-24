// server/firebase-storage.ts

import { db } from "./firebase-config";
import { InsertUser, InsertDonorInfo, InsertFoodDonation, InsertFoodItem, InsertNgoInfo, InsertDeliveryProof } from "@shared/schema";

// --- User Management ---

/**
 * Creates a new user in the general 'users' collection and in their role-specific collection.
 * @param user - The user data to create.
 * @returns The newly created user object.
 */
export async function createUser(user: InsertUser & { id: string }) {
  const { id, role, ...userData } = user;

  // 1. Create the user in the general users collection for easy lookup
  const userRef = db.collection("users").doc(id);
  await userRef.set({
    ...userData,
    role,
    createdAt: new Date().toISOString(),
  });

  // 2. Create the user in their role-specific collection
  const roleCollection = `${role}s`; // e.g., 'ngos', 'donors'
  const roleRef = db.collection(roleCollection).doc(id);
  await roleRef.set({
    ...userData,
    createdAt: new Date().toISOString(),
  });

  return { id, role, ...userData };
}

/**
 * Retrieves a user by their email from the 'users' collection.
 * @param email - The email of the user to find.
 * @returns The user object if found, otherwise null.
 */
export async function getUserByEmail(email: string) {
  const usersRef = db.collection("users");
  const snapshot = await usersRef.where("email", "==", email).limit(1).get();

  if (snapshot.empty) {
    return null;
  }

  const userDoc = snapshot.docs[0];
  return { id: userDoc.id, ...userDoc.data() };
}


// --- Form Data Management ---

/**
 * Stores temporary donor information in the 'donorInfo' collection.
 * @param donorData - The donor's personal information.
 * @returns The created donor info object.
 */
export async function createDonorInfo(donorData: InsertDonorInfo) {
    const docRef = await db.collection("donorInfo").add({
        ...donorData,
        createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...donorData };
}

/**
 * Stores a complete food donation record, including donor info and food items.
 * @param donationData - The data for the food donation.
 * @param foodItems - An array of food items in the donation.
 * @returns The created food donation object.
 */
export async function createFoodDonation(donationData: InsertFoodDonation, foodItems: InsertFoodItem[]) {
    const donationRef = db.collection("foodDonations").doc();
    await donationRef.set({
        ...donationData,
        items: foodItems, // Embed food items directly in the donation document
        status: "pending", // Initial status
        createdAt: new Date().toISOString(),
    });

    return { id: donationRef.id, ...donationData, items: foodItems };
}

/**
 * Stores NGO information in the 'ngoInfo' collection.
 * @param ngoData - The NGO's profile information.
 * @returns The created NGO info object.
 */
export async function createNgoInfo(ngoData: InsertNgoInfo) {
    const docRef = await db.collection("ngoInfo").add({
        ...ngoData,
        createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...ngoData };
}

/**
 * Stores delivery proof information in the 'deliveryProofs' collection.
 * @param proofData - The delivery proof data including images and coordinates.
 * @returns The created delivery proof object.
 */
export async function createDeliveryProof(proofData: InsertDeliveryProof) {
    const docRef = await db.collection("deliveryProofs").add({
        ...proofData,
        verified: false, // Initial verification status
        createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...proofData };
}

// --- Data Retrieval for Dashboards ---

/**
 * Retrieves all food donations for the admin dashboard.
 * @returns An array of food donation reports.
 */
export async function getAdminFoodDonationReports() {
    const snapshot = await db.collection("foodDonations").orderBy("createdAt", "desc").get();
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
