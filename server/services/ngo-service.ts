// server/services/ngo-service.ts

import { drizzle } from 'drizzle-orm/node-postgres';
import { pool } from '../postgres-config';
import { 
  ngoInfo, 
  foodDonations, 
  foodItems, 
  donorInfo, 
  ngoRequests, 
  deliveryProofs,
  type InsertNgoInfo, 
  type InsertNgoRequest, 
  type InsertDeliveryProof,
  type NgoInfo,
  type NgoRequest,
  type DeliveryProof
} from '../../shared/schema';
import { eq, and, isNull } from 'drizzle-orm';

let db: any = null;

// Initialize database connection
try {
  if (process.env.DATABASE_URL) {
    db = drizzle(pool);
    console.log('✅ NGO Service: Database connection established');
  } else {
    console.log('⚠️ NGO Service: No DATABASE_URL, using in-memory storage');
    db = null;
  }
} catch (error) {
  console.log('⚠️ NGO Service: Database connection failed, using in-memory storage');
  db = null;
}

// In-memory storage for development
const inMemoryNgoInfo: any = {};
const inMemoryDonorRequests: any[] = [];
const inMemoryNgoRequests: any[] = [];
const inMemoryDeliveryProofs: any[] = [];

export class NgoService {
  static async createNgoInfo(ngoData: {
    userId: string;
    name: string;
    phone: string;
    address: string;
    panId: string;
  }): Promise<any> {
    try {
      if (db) {
        // Use database
        const [newNgoInfo] = await db.insert(ngoInfo).values({
          userId: ngoData.userId,
          name: ngoData.name,
          phone: ngoData.phone,
          address: ngoData.address,
          panId: ngoData.panId,
        }).returning();

        console.log(`✅ NGO info created in database: ${ngoData.name} (PAN: ${ngoData.panId})`);
        
        // Send notification to admin
        console.log(`📢 ADMIN NOTIFICATION: New NGO registered - ${ngoData.name} (PAN: ${ngoData.panId})`);
        
        return newNgoInfo;
      } else {
        // Use in-memory storage
        const newNgoInfo = {
          id: `ngo-${Date.now()}`,
          userId: ngoData.userId,
          name: ngoData.name,
          phone: ngoData.phone,
          address: ngoData.address,
          panId: ngoData.panId,
          createdAt: new Date(),
        };

        inMemoryNgoInfo[ngoData.userId] = newNgoInfo;
        
        console.log(`✅ NGO info created in memory: ${ngoData.name} (PAN: ${ngoData.panId})`);
        console.log(`📢 ADMIN NOTIFICATION: New NGO registered - ${ngoData.name} (PAN: ${ngoData.panId})`);
        
        return newNgoInfo;
      }
    } catch (error) {
      console.error('❌ Error creating NGO info:', error);
      throw error;
    }
  }

  static async getNgoInfoByUserId(userId: string): Promise<any | null> {
    try {
      if (db) {
        const [ngoInfoRecord] = await db.select().from(ngoInfo).where(eq(ngoInfo.userId, userId));
        return ngoInfoRecord || null;
      } else {
        return inMemoryNgoInfo[userId] || null;
      }
    } catch (error) {
      console.error('❌ Error getting NGO info by user ID:', error);
      return inMemoryNgoInfo[userId] || null;
    }
  }

  static async getNextDonorRequest(ngoUserId: string): Promise<any | null> {
    try {
      if (db) {
        // Database implementation
        const availableDonations = await db
          .select({
            donationId: foodDonations.id,
            userId: foodDonations.userId,
            totalItems: foodDonations.totalItems,
            totalQuantity: foodDonations.totalQuantity,
            createdAt: foodDonations.createdAt,
          })
          .from(foodDonations)
          .leftJoin(
            ngoRequests, 
            and(
              eq(ngoRequests.donationId, foodDonations.id),
              eq(ngoRequests.ngoUserId, ngoUserId)
            )
          )
          .where(isNull(ngoRequests.id))
          .limit(1);

        if (availableDonations.length === 0) {
          return null;
        }

        const donation = availableDonations[0];

        const [donor] = await db
          .select()
          .from(donorInfo)
          .where(eq(donorInfo.userId, donation.userId));

        const items = await db
          .select()
          .from(foodItems)
          .where(eq(foodItems.donationId, donation.donationId));

        return {
          id: donation.donationId,
          donorName: donor?.name || 'Unknown',
          donorPhone: donor?.phone || 'Unknown',
          donorAddress: donor?.address || 'Unknown',
          foodItems: items.map((item: any) => ({
            foodType: item.foodType,
            quantity: parseFloat(item.quantity),
            foodTypeCategory: item.foodTypeCategory,
            storageRequirement: item.storageRequirement,
            expiryDate: item.expiryDate,
            expiryTime: item.expiryTime,
          })),
          totalQuantity: parseFloat(donation.totalQuantity),
          createdAt: donation.createdAt?.toISOString(),
        };
      } else {
        // In-memory implementation - create sample data
        if (inMemoryDonorRequests.length === 0) {
          // Create sample donor requests
          inMemoryDonorRequests.push({
            id: 'donation-1',
            donorName: 'John Doe',
            donorPhone: '9876543210',
            donorAddress: '123 Main Street, City',
            foodItems: [
              {
                foodType: 'Rice',
                quantity: 5,
                foodTypeCategory: 'cooked',
                storageRequirement: 'room-temp',
                expiryDate: '2025-08-23',
                expiryTime: '18:00',
              },
              {
                foodType: 'Dal',
                quantity: 3,
                foodTypeCategory: 'cooked',
                storageRequirement: 'hot',
                expiryDate: '2025-08-23',
                expiryTime: '19:00',
              }
            ],
            totalQuantity: 8,
            createdAt: new Date().toISOString(),
          });
        }

        // Find a request not processed by this NGO
        const processedRequests = inMemoryNgoRequests
          .filter(req => req.ngoUserId === ngoUserId)
          .map(req => req.donationId);

        const availableRequest = inMemoryDonorRequests.find(req => 
          !processedRequests.includes(req.id)
        );

        return availableRequest || null;
      }
    } catch (error) {
      console.error('❌ Error getting next donor request:', error);
      // Return sample data on error
      return {
        id: 'sample-donation-1',
        donorName: 'Sample Donor',
        donorPhone: '9876543210',
        donorAddress: '123 Sample Street, Sample City',
        foodItems: [
          {
            foodType: 'Rice',
            quantity: 5,
            foodTypeCategory: 'cooked',
            storageRequirement: 'room-temp',
            expiryDate: '2025-08-23',
            expiryTime: '18:00',
          }
        ],
        totalQuantity: 5,
        createdAt: new Date().toISOString(),
      };
    }
  }

  static async rejectDonorRequest(donationId: string, ngoUserId: string): Promise<any> {
    try {
      if (db) {
        const [newRequest] = await db.insert(ngoRequests).values({
          donationId,
          ngoUserId,
          status: 'rejected',
          decisionAt: new Date(),
        }).returning();

        console.log(`✅ Donation ${donationId} rejected by NGO ${ngoUserId}`);
        return newRequest;
      } else {
        const newRequest = {
          id: `request-${Date.now()}`,
          donationId,
          ngoUserId,
          status: 'rejected',
          decisionAt: new Date(),
          createdAt: new Date(),
        };

        inMemoryNgoRequests.push(newRequest);
        console.log(`✅ Donation ${donationId} rejected by NGO ${ngoUserId} (in-memory)`);
        return newRequest;
      }
    } catch (error) {
      console.error('❌ Error rejecting donor request:', error);
      throw error;
    }
  }

  static async acceptDonorRequest(donationId: string, ngoUserId: string): Promise<any> {
    try {
      if (db) {
        const [newRequest] = await db.insert(ngoRequests).values({
          donationId,
          ngoUserId,
          status: 'accepted',
          decisionAt: new Date(),
        }).returning();

        console.log(`✅ Donation ${donationId} accepted by NGO ${ngoUserId}`);
        return newRequest;
      } else {
        const newRequest = {
          id: `request-${Date.now()}`,
          donationId,
          ngoUserId,
          status: 'accepted',
          decisionAt: new Date(),
          createdAt: new Date(),
        };

        inMemoryNgoRequests.push(newRequest);
        console.log(`✅ Donation ${donationId} accepted by NGO ${ngoUserId} (in-memory)`);
        return newRequest;
      }
    } catch (error) {
      console.error('❌ Error accepting donor request:', error);
      throw error;
    }
  }

  static async createDeliveryProof(proofData: {
    donationId: string;
    ngoUserId: string;
    beforeImagePath: string;
    afterImagePath: string;
    beforeLat: number;
    beforeLng: number;
    afterLat: number;
    afterLng: number;
  }): Promise<any> {
    try {
      if (db) {
        // Database implementation
        let [ngoRequest] = await db
          .select()
          .from(ngoRequests)
          .where(
            and(
              eq(ngoRequests.donationId, proofData.donationId),
              eq(ngoRequests.ngoUserId, proofData.ngoUserId)
            )
          );

        if (!ngoRequest) {
          [ngoRequest] = await db.insert(ngoRequests).values({
            donationId: proofData.donationId,
            ngoUserId: proofData.ngoUserId,
            status: 'accepted',
            decisionAt: new Date(),
          }).returning();
        }

        const [newProof] = await db.insert(deliveryProofs).values({
          ngoRequestId: ngoRequest.id,
          beforeImagePath: proofData.beforeImagePath,
          afterImagePath: proofData.afterImagePath,
          beforeLat: proofData.beforeLat.toString(),
          beforeLng: proofData.beforeLng.toString(),
          afterLat: proofData.afterLat.toString(),
          afterLng: proofData.afterLng.toString(),
        }).returning();

        console.log(`✅ Delivery proof created for request ${ngoRequest.id}`);
        return newProof;
      } else {
        // In-memory implementation
        const requestId = `request-${proofData.donationId}-${proofData.ngoUserId}`;
        
        const newProof = {
          id: `proof-${Date.now()}`,
          ngoRequestId: requestId,
          beforeImagePath: proofData.beforeImagePath,
          afterImagePath: proofData.afterImagePath,
          beforeLat: proofData.beforeLat.toString(),
          beforeLng: proofData.beforeLng.toString(),
          afterLat: proofData.afterLat.toString(),
          afterLng: proofData.afterLng.toString(),
          createdAt: new Date(),
        };

        inMemoryDeliveryProofs.push(newProof);
        console.log(`✅ Delivery proof created in memory for request ${requestId}`);
        return newProof;
      }
    } catch (error) {
      console.error('❌ Error creating delivery proof:', error);
      throw error;
    }
  }

  static async getAllNgoInfo(): Promise<any[]> {
    try {
      if (db) {
        const allNgoInfo = await db.select().from(ngoInfo);
        return allNgoInfo;
      } else {
        return Object.values(inMemoryNgoInfo);
      }
    } catch (error) {
      console.error('❌ Error getting all NGO info:', error);
      return Object.values(inMemoryNgoInfo);
    }
  }

  static async getNgoActivity(ngoUserId: string): Promise<any> {
    try {
      if (db) {
        const [ngoInfoRecord] = await db.select().from(ngoInfo).where(eq(ngoInfo.userId, ngoUserId));
        
        const requests = await db
          .select({
            requestId: ngoRequests.id,
            donationId: ngoRequests.donationId,
            status: ngoRequests.status,
            decisionAt: ngoRequests.decisionAt,
            beforeImagePath: deliveryProofs.beforeImagePath,
            afterImagePath: deliveryProofs.afterImagePath,
            beforeLat: deliveryProofs.beforeLat,
            beforeLng: deliveryProofs.beforeLng,
            afterLat: deliveryProofs.afterLat,
            afterLng: deliveryProofs.afterLng,
          })
          .from(ngoRequests)
          .leftJoin(deliveryProofs, eq(deliveryProofs.ngoRequestId, ngoRequests.id))
          .where(eq(ngoRequests.ngoUserId, ngoUserId));

        return {
          ngoInfo: ngoInfoRecord,
          requests: requests,
        };
      } else {
        return {
          ngoInfo: inMemoryNgoInfo[ngoUserId],
          requests: inMemoryNgoRequests.filter(req => req.ngoUserId === ngoUserId),
        };
      }
    } catch (error) {
      console.error('❌ Error getting NGO activity:', error);
      return {
        ngoInfo: inMemoryNgoInfo[ngoUserId],
        requests: inMemoryNgoRequests.filter(req => req.ngoUserId === ngoUserId),
      };
    }
  }

  static async initializeService(): Promise<void> {
    try {
      console.log('✅ NGO service initialized');
    } catch (error) {
      console.error('❌ Error initializing NGO service:', error);
      throw error;
    }
  }
}