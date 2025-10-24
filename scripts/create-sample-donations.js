// scripts/create-sample-donations.js
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { 
  profiles, 
  foodDonations, 
  foodItems
} from '../shared/schema.ts';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function createSampleDonations() {
  console.log('🍽️ Creating sample food donations...');

  try {
    // Get existing donor users
    const donors = await db.select().from(profiles).where(eq(profiles.role, 'donor'));
    
    if (donors.length === 0) {
      console.log('❌ No donor users found. Please register some donors first.');
      return;
    }

    console.log(`📊 Found ${donors.length} donor users`);

    // Sample food items data
    const sampleFoodItems = [
      {
        foodType: 'Rice',
        quantity: 5,
        foodSafetyTag: 'Home cooked',
        preparationTime: '12:00',
        preparationDate: '2025-08-23',
        foodTypeCategory: 'cooked',
        storageRequirement: 'room-temp',
        expiryDate: '2025-08-24',
        expiryTime: '18:00'
      },
      {
        foodType: 'Dal',
        quantity: 3,
        foodSafetyTag: 'Fresh',
        preparationTime: '13:00',
        preparationDate: '2025-08-23',
        foodTypeCategory: 'cooked',
        storageRequirement: 'hot',
        expiryDate: '2025-08-24',
        expiryTime: '20:00'
      },
      {
        foodType: 'Vegetables',
        quantity: 4,
        foodSafetyTag: 'Organic',
        preparationTime: '14:00',
        preparationDate: '2025-08-23',
        foodTypeCategory: 'raw',
        storageRequirement: 'cold',
        expiryDate: '2025-08-25',
        expiryTime: '12:00'
      },
      {
        foodType: 'Bread',
        quantity: 2,
        foodSafetyTag: 'Bakery fresh',
        preparationTime: '08:00',
        preparationDate: '2025-08-23',
        foodTypeCategory: 'packed',
        storageRequirement: 'room-temp',
        expiryDate: '2025-08-24',
        expiryTime: '22:00'
      },
      {
        foodType: 'Curry',
        quantity: 6,
        foodSafetyTag: 'Restaurant quality',
        preparationTime: '15:00',
        preparationDate: '2025-08-23',
        foodTypeCategory: 'cooked',
        storageRequirement: 'hot',
        expiryDate: '2025-08-24',
        expiryTime: '19:00'
      }
    ];

    // Create donations for each donor
    for (let i = 0; i < donors.length; i++) {
      const donor = donors[i];
      
      // Create 2-3 donations per donor
      const donationCount = Math.floor(Math.random() * 2) + 2;
      
      for (let j = 0; j < donationCount; j++) {
        // Select 2-3 random food items
        const itemCount = Math.floor(Math.random() * 2) + 2;
        const selectedItems = [];
        
        for (let k = 0; k < itemCount; k++) {
          const randomItem = sampleFoodItems[Math.floor(Math.random() * sampleFoodItems.length)];
          selectedItems.push({
            ...randomItem,
            quantity: Math.floor(Math.random() * 5) + 2, // 2-7 kg
          });
        }

        const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

        // Create food donation
        const [donation] = await db.insert(foodDonations).values({
          userId: donor.id,
          totalItems: selectedItems.length,
          totalQuantity: totalQuantity.toString(),
        }).returning();

        // Create food items
        for (const item of selectedItems) {
          await db.insert(foodItems).values({
            donationId: donation.id,
            foodType: item.foodType,
            quantity: item.quantity.toString(),
            foodSafetyTag: item.foodSafetyTag,
            preparationTime: item.preparationTime,
            preparationDate: item.preparationDate,
            foodTypeCategory: item.foodTypeCategory,
            storageRequirement: item.storageRequirement,
            expiryDate: item.expiryDate,
            expiryTime: item.expiryTime,
          });
        }

        console.log(`✅ Created donation for ${donor.name}: ${donation.id} (${totalQuantity} kg, ${selectedItems.length} items)`);
      }
    }

    console.log('🎉 Sample food donations created successfully!');

  } catch (error) {
    console.error('❌ Error creating sample donations:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

createSampleDonations();