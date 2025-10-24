// scripts/populate-test-data.js
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { 
  profiles, 
  donorInfo, 
  foodDonations, 
  foodItems,
  ngoInfo,
  serviceProviderInfo,
  consumerInfo,
  workRequests
} from '../shared/schema.ts';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { eq } from 'drizzle-orm';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function populateTestData() {
  console.log('🌱 Populating test data...');

  try {
    // Create test users
    const testUsers = [
      { email: 'donor1@test.com', name: 'John Donor', role: 'donor' },
      { email: 'donor2@test.com', name: 'Sarah Kitchen', role: 'donor' },
      { email: 'donor3@test.com', name: 'Mike Restaurant', role: 'donor' },
      { email: 'ngo1@test.com', name: 'Food Bank NGO', role: 'ngo' },
      { email: 'ngo2@test.com', name: 'Helping Hands', role: 'ngo' },
      { email: 'provider1@test.com', name: 'Tech Support Pro', role: 'service-provider' },
      { email: 'provider2@test.com', name: 'Plumber Expert', role: 'service-provider' },
      { email: 'consumer1@test.com', name: 'Home Owner', role: 'consumer' },
      { email: 'consumer2@test.com', name: 'Office Manager', role: 'consumer' }
    ];

    const hashedPassword = await bcrypt.hash('password123', 10);
    const createdUsers = [];

    for (const user of testUsers) {
      try {
        const [newUser] = await db.insert(profiles).values({
          email: user.email,
          name: user.name,
          role: user.role,
          password: hashedPassword,
        }).returning();
        createdUsers.push(newUser);
        console.log(`✅ Created user: ${user.name} (${user.role})`);
      } catch (error) {
        if (error.message.includes('duplicate key')) {
          console.log(`⚠️ User already exists: ${user.email}`);
          // Get existing user
          const [existingUser] = await db.select().from(profiles).where(eq(profiles.email, user.email));
          if (existingUser) createdUsers.push(existingUser);
        } else {
          throw error;
        }
      }
    }

    // Create donor info and food donations
    const donors = createdUsers.filter(u => u.role === 'donor');
    
    for (let i = 0; i < donors.length; i++) {
      const donor = donors[i];
      
      // Create donor info (skip for now since it references users table, not profiles)
      console.log(`⚠️ Skipping donor info creation (schema mismatch)`);
      
      // Create food donations directly
      /*const [donorInfoRecord] = await db.insert(donorInfo).values({
        userId: donor.id,
        name: donor.name,
        phone: `987654321${i}`,
        address: `${100 + i} Test Street, Mumbai, Maharashtra`,
        aadhaar: `12345678901${i}`,
      }).returning();

      console.log(`✅ Created donor info for: ${donor.name}`);*/

      // Create 2-3 food donations per donor
      const donationCount = Math.floor(Math.random() * 3) + 2;
      
      for (let j = 0; j < donationCount; j++) {
        const foodItemsData = [
          {
            foodType: ['Rice', 'Dal', 'Vegetables', 'Bread', 'Curry'][Math.floor(Math.random() * 5)],
            quantity: Math.floor(Math.random() * 8) + 2, // 2-10 kg
            foodSafetyTag: ['Home cooked', 'Restaurant quality', 'Fresh', 'FSSAI certified'][Math.floor(Math.random() * 4)],
            preparationTime: `${10 + Math.floor(Math.random() * 8)}:00`,
            preparationDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            foodTypeCategory: ['cooked', 'packed', 'raw'][Math.floor(Math.random() * 3)],
            storageRequirement: ['cold', 'hot', 'room-temp'][Math.floor(Math.random() * 3)],
            expiryDate: new Date(Date.now() + Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            expiryTime: `${18 + Math.floor(Math.random() * 4)}:00`
          },
          {
            foodType: ['Chapati', 'Sabzi', 'Soup', 'Fruits', 'Snacks'][Math.floor(Math.random() * 5)],
            quantity: Math.floor(Math.random() * 6) + 2, // 2-8 kg
            foodSafetyTag: ['Homemade', 'Organic', 'Fresh prepared'][Math.floor(Math.random() * 3)],
            preparationTime: `${11 + Math.floor(Math.random() * 6)}:00`,
            preparationDate: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            foodTypeCategory: ['cooked', 'packed', 'raw'][Math.floor(Math.random() * 3)],
            storageRequirement: ['cold', 'hot', 'room-temp'][Math.floor(Math.random() * 3)],
            expiryDate: new Date(Date.now() + Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            expiryTime: `${19 + Math.floor(Math.random() * 3)}:00`
          }
        ];

        const totalQuantity = foodItemsData.reduce((sum, item) => sum + item.quantity, 0);

        // Create food donation
        const [donation] = await db.insert(foodDonations).values({
          userId: donor.id,
          totalItems: foodItemsData.length,
          totalQuantity: totalQuantity.toString(),
        }).returning();

        // Create food items
        for (const item of foodItemsData) {
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

        console.log(`✅ Created food donation: ${donation.id} (${totalQuantity} kg)`);
      }
    }

    // Create NGO info
    const ngos = createdUsers.filter(u => u.role === 'ngo');
    for (let i = 0; i < ngos.length; i++) {
      const ngo = ngos[i];
      await db.insert(ngoInfo).values({
        userId: ngo.id,
        name: ngo.name,
        phone: `987654320${i}`,
        address: `${200 + i} NGO Street, Delhi, India`,
        panId: `ABCDE1234${i}F`,
      });
      console.log(`✅ Created NGO info for: ${ngo.name}`);
    }

    // Create service provider info
    const providers = createdUsers.filter(u => u.role === 'service-provider');
    for (let i = 0; i < providers.length; i++) {
      const provider = providers[i];
      await db.insert(serviceProviderInfo).values({
        userId: provider.id,
        name: provider.name,
        phone: `987654319${i}`,
        aadhaar: `98765432101${i}`,
        skillSet: JSON.stringify([['Plumbing', 'Electrical', 'Carpentry', 'Painting'][Math.floor(Math.random() * 4)]]),
        yearsOfExperience: Math.floor(Math.random() * 10) + 1,
      });
      console.log(`✅ Created service provider info for: ${provider.name}`);
    }

    // Create consumer info
    const consumers = createdUsers.filter(u => u.role === 'consumer');
    for (let i = 0; i < consumers.length; i++) {
      const consumer = consumers[i];
      await db.insert(consumerInfo).values({
        userId: consumer.id,
        name: consumer.name,
        phone: `987654318${i}`,
        address: `${300 + i} Consumer Lane, Bangalore, India`,
      });
      console.log(`✅ Created consumer info for: ${consumer.name}`);
    }

    // Create work requests
    for (let i = 0; i < 10; i++) {
      const consumer = consumers[Math.floor(Math.random() * consumers.length)];
      const urgency = ['low', 'medium', 'high'][Math.floor(Math.random() * 3)];
      const status = ['pending', 'assigned', 'completed'][Math.floor(Math.random() * 3)];
      const serviceTypes = ['Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning', 'Repair'];
      
      await db.insert(workRequests).values({
        consumerUserId: consumer.id,
        serviceType: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
        description: `Need ${serviceTypes[Math.floor(Math.random() * serviceTypes.length)].toLowerCase()} work done urgently`,
        address: `${400 + i} Work Street, Chennai, India`,
        urgency,
        status,
        completedAt: status === 'completed' ? new Date() : null,
        otpValidated: status === 'completed' ? Math.floor(Math.random() * 9000 + 1000).toString() : null,
      });
      console.log(`✅ Created work request: ${serviceTypes[Math.floor(Math.random() * serviceTypes.length)]} (${status})`);
    }

    console.log('🎉 Test data population completed successfully!');

  } catch (error) {
    console.error('❌ Error populating test data:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

populateTestData();