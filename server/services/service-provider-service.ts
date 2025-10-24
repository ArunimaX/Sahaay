// server/services/service-provider-service.ts

import { drizzle } from 'drizzle-orm/node-postgres';
import { pool } from '../postgres-config';
import { 
  serviceProviderInfo, 
  consumerInfo,
  workRequests,
  type InsertServiceProviderInfo, 
  type InsertConsumerInfo,
  type InsertWorkRequest,
  type ServiceProviderInfo,
  type ConsumerInfo,
  type WorkRequest
} from '../../shared/schema';
import { eq, and } from 'drizzle-orm';

let db: any = null;

// Initialize database connection
try {
  if (process.env.DATABASE_URL) {
    db = drizzle(pool);
    console.log('✅ Service Provider Service: Database connection established');
  } else {
    console.log('⚠️ Service Provider Service: No DATABASE_URL, using in-memory storage');
    db = null;
  }
} catch (error) {
  console.log('⚠️ Service Provider Service: Database connection failed, using in-memory storage');
  db = null;
}

// In-memory storage for development
const inMemoryServiceProviders: any = {};
const inMemoryConsumers: any = {};
const inMemoryWorkRequests: any[] = [];

export class ServiceProviderService {
  static async createServiceProviderInfo(providerData: {
    userId: string;
    name: string;
    phone: string;
    aadhaar: string;
    skillSet: string;
    yearsOfExperience: number;
  }): Promise<any> {
    try {
      console.log('🔄 Creating service provider info:', providerData);
      
      if (db) {
        console.log('📊 Using database to create provider');
        // Use database
        const [newProviderInfo] = await db.insert(serviceProviderInfo).values({
          userId: providerData.userId,
          name: providerData.name,
          phone: providerData.phone,
          aadhaar: providerData.aadhaar,
          skillSet: providerData.skillSet,
          yearsOfExperience: providerData.yearsOfExperience,
        }).returning();

        console.log(`✅ Service provider info created in database: ${providerData.name}`, newProviderInfo);
        return newProviderInfo;
      } else {
        console.log('💾 Using in-memory storage to create provider');
        // Use in-memory storage
        const newProviderInfo = {
          id: `sp-${Date.now()}`,
          userId: providerData.userId,
          name: providerData.name,
          phone: providerData.phone,
          aadhaar: providerData.aadhaar,
          skillSet: providerData.skillSet,
          yearsOfExperience: providerData.yearsOfExperience,
          createdAt: new Date(),
        };

        inMemoryServiceProviders[newProviderInfo.id] = newProviderInfo;
        
        console.log(`✅ Service provider info created in memory: ${providerData.name}`, newProviderInfo);
        console.log(`📊 Total providers in memory: ${Object.keys(inMemoryServiceProviders).length}`);
        return newProviderInfo;
      }
    } catch (error) {
      console.error('❌ Error creating service provider info:', error);
      throw error;
    }
  }

  static async getServiceProviderInfoByUserId(userId: string): Promise<any | null> {
    try {
      if (db) {
        const [providerInfo] = await db.select().from(serviceProviderInfo).where(eq(serviceProviderInfo.userId, userId));
        return providerInfo || null;
      } else {
        // Search through all providers to find by userId
        const providers = Object.values(inMemoryServiceProviders);
        return providers.find((provider: any) => provider.userId === userId) || null;
      }
    } catch (error) {
      console.error('❌ Error getting service provider info by user ID:', error);
      const providers = Object.values(inMemoryServiceProviders);
      return providers.find((provider: any) => provider.userId === userId) || null;
    }
  }

  static async createConsumerInfo(consumerData: {
    userId: string;
    name: string;
    phone: string;
    address: string;
  }): Promise<any> {
    try {
      if (db) {
        const [newConsumerInfo] = await db.insert(consumerInfo).values({
          userId: consumerData.userId,
          name: consumerData.name,
          phone: consumerData.phone,
          address: consumerData.address,
        }).returning();

        console.log(`✅ Consumer info created in database: ${consumerData.name}`);
        return newConsumerInfo;
      } else {
        const newConsumerInfo = {
          id: `consumer-${Date.now()}`,
          userId: consumerData.userId,
          name: consumerData.name,
          phone: consumerData.phone,
          address: consumerData.address,
          createdAt: new Date(),
        };

        inMemoryConsumers[consumerData.userId] = newConsumerInfo;
        
        console.log(`✅ Consumer info created in memory: ${consumerData.name}`);
        return newConsumerInfo;
      }
    } catch (error) {
      console.error('❌ Error creating consumer info:', error);
      throw error;
    }
  }

  static async createWorkRequest(requestData: {
    consumerUserId: string;
    serviceType: string;
    description: string;
    address: string;
    urgency: 'low' | 'medium' | 'high';
  }): Promise<any> {
    try {
      if (db) {
        const [newRequest] = await db.insert(workRequests).values({
          consumerUserId: requestData.consumerUserId,
          serviceType: requestData.serviceType,
          description: requestData.description,
          address: requestData.address,
          urgency: requestData.urgency,
          status: 'pending',
        }).returning();

        console.log(`✅ Work request created in database: ${requestData.serviceType}`);
        return newRequest;
      } else {
        const newRequest = {
          id: `request-${Date.now()}`,
          consumerUserId: requestData.consumerUserId,
          serviceType: requestData.serviceType,
          description: requestData.description,
          address: requestData.address,
          urgency: requestData.urgency,
          status: 'pending',
          serviceProviderId: null,
          completedAt: null,
          otpValidated: null,
          createdAt: new Date(),
        };

        inMemoryWorkRequests.push(newRequest);
        
        console.log(`✅ Work request created in memory: ${requestData.serviceType}`);
        return newRequest;
      }
    } catch (error) {
      console.error('❌ Error creating work request:', error);
      throw error;
    }
  }

  static async getWorkRequestsForServiceProvider(serviceProviderId: string): Promise<any[]> {
    try {
      if (db) {
        // Get service provider skills
        const [provider] = await db.select().from(serviceProviderInfo).where(eq(serviceProviderInfo.userId, serviceProviderId));
        
        if (!provider) {
          return [];
        }

        // Get all pending work requests
        const requests = await db
          .select({
            id: workRequests.id,
            consumerUserId: workRequests.consumerUserId,
            serviceType: workRequests.serviceType,
            description: workRequests.description,
            address: workRequests.address,
            urgency: workRequests.urgency,
            status: workRequests.status,
            createdAt: workRequests.createdAt,
          })
          .from(workRequests)
          .where(eq(workRequests.status, 'pending'));

        // Get consumer info for each request
        const requestsWithConsumerInfo = await Promise.all(
          requests.map(async (request: any) => {
            const [consumer] = await db.select().from(consumerInfo).where(eq(consumerInfo.userId, request.consumerUserId));
            
            return {
              ...request,
              consumerName: consumer?.name || 'Unknown',
              consumerPhone: consumer?.phone || 'Unknown',
            };
          })
        );

        return requestsWithConsumerInfo;
      } else {
        // In-memory implementation - create sample data if empty
        if (inMemoryWorkRequests.length === 0) {
          // Create sample work requests
          const sampleRequests = [
            {
              id: 'request-1',
              consumerUserId: 'consumer-1',
              serviceType: 'Plumbing',
              description: 'Kitchen sink is leaking and needs immediate repair',
              address: '123 Main Street, Apartment 4B, City Center',
              urgency: 'high' as const,
              status: 'pending' as const,
              serviceProviderId: null,
              completedAt: null,
              otpValidated: null,
              createdAt: new Date(),
              consumerName: 'John Smith',
              consumerPhone: '9876543210',
            },
            {
              id: 'request-2',
              consumerUserId: 'consumer-2',
              serviceType: 'Electrical',
              description: 'Power outlet not working in bedroom, need electrician',
              address: '456 Oak Avenue, House 12, Suburb Area',
              urgency: 'medium' as const,
              status: 'pending' as const,
              serviceProviderId: null,
              completedAt: null,
              otpValidated: null,
              createdAt: new Date(),
              consumerName: 'Sarah Johnson',
              consumerPhone: '9876543211',
            },
            {
              id: 'request-3',
              consumerUserId: 'consumer-3',
              serviceType: 'Housekeeping',
              description: 'Deep cleaning required for 3BHK apartment',
              address: '789 Pine Street, Floor 2, Downtown',
              urgency: 'low' as const,
              status: 'pending' as const,
              serviceProviderId: null,
              completedAt: null,
              otpValidated: null,
              createdAt: new Date(),
              consumerName: 'Mike Davis',
              consumerPhone: '9876543212',
            }
          ];

          inMemoryWorkRequests.push(...sampleRequests);
        }

        return inMemoryWorkRequests.filter(req => req.status === 'pending');
      }
    } catch (error) {
      console.error('❌ Error getting work requests:', error);
      // Return sample data on error
      return [
        {
          id: 'sample-request-1',
          consumerUserId: 'sample-consumer',
          serviceType: 'Sample Service',
          description: 'Sample work request description',
          address: 'Sample Address',
          urgency: 'medium' as const,
          status: 'pending' as const,
          createdAt: new Date(),
          consumerName: 'Sample Consumer',
          consumerPhone: '9876543210',
        }
      ];
    }
  }

  static async completeWorkRequest(requestId: string, otp: string, serviceProviderId: string): Promise<any> {
    const VALID_OTP = '3155';
    
    if (otp !== VALID_OTP) {
      throw new Error('Invalid OTP');
    }

    try {
      if (db) {
        const [updatedRequest] = await db
          .update(workRequests)
          .set({
            status: 'completed',
            serviceProviderId,
            completedAt: new Date(),
            otpValidated: otp,
          })
          .where(eq(workRequests.id, requestId))
          .returning();

        console.log(`✅ Work request completed in database: ${requestId}`);
        return updatedRequest;
      } else {
        const requestIndex = inMemoryWorkRequests.findIndex(req => req.id === requestId);
        
        if (requestIndex === -1) {
          throw new Error('Work request not found');
        }

        inMemoryWorkRequests[requestIndex] = {
          ...inMemoryWorkRequests[requestIndex],
          status: 'completed',
          serviceProviderId,
          completedAt: new Date(),
          otpValidated: otp,
        };

        console.log(`✅ Work request completed in memory: ${requestId}`);
        return inMemoryWorkRequests[requestIndex];
      }
    } catch (error) {
      console.error('❌ Error completing work request:', error);
      throw error;
    }
  }

  static async getAllServiceProviders(): Promise<any[]> {
    try {
      console.log('🔍 Getting all service providers...');
      console.log('📊 Current inMemoryServiceProviders:', inMemoryServiceProviders);
      
      if (db) {
        console.log('📊 Using database to fetch providers');
        const allProviders = await db.select().from(serviceProviderInfo);
        console.log(`✅ Found ${allProviders.length} providers in database`);
        return allProviders;
      } else {
        console.log('💾 Using in-memory storage to fetch providers');
        const providers = Object.values(inMemoryServiceProviders);
        console.log(`✅ Found ${providers.length} providers in memory:`, providers);
        return providers;
      }
    } catch (error) {
      console.error('❌ Error getting all service providers:', error);
      console.log('🔄 Falling back to in-memory storage');
      const providers = Object.values(inMemoryServiceProviders);
      console.log(`✅ Found ${providers.length} providers in memory (fallback)`);
      return providers;
    }
  }

  static async getAllWorkRequests(): Promise<any[]> {
    try {
      if (db) {
        const requests = await db
          .select({
            id: workRequests.id,
            consumerUserId: workRequests.consumerUserId,
            serviceType: workRequests.serviceType,
            description: workRequests.description,
            address: workRequests.address,
            urgency: workRequests.urgency,
            status: workRequests.status,
            serviceProviderId: workRequests.serviceProviderId,
            completedAt: workRequests.completedAt,
            otpValidated: workRequests.otpValidated,
            createdAt: workRequests.createdAt,
          })
          .from(workRequests);

        // Get consumer info for each request
        const requestsWithConsumerInfo = await Promise.all(
          requests.map(async (request: any) => {
            const [consumer] = await db.select().from(consumerInfo).where(eq(consumerInfo.userId, request.consumerUserId));
            
            return {
              ...request,
              consumerName: consumer?.name || 'Unknown',
              consumerPhone: consumer?.phone || 'Unknown',
            };
          })
        );

        return requestsWithConsumerInfo;
      } else {
        return inMemoryWorkRequests;
      }
    } catch (error) {
      console.error('❌ Error getting all work requests:', error);
      return inMemoryWorkRequests;
    }
  }

  static async getCompletedWorkLogs(): Promise<any[]> {
    try {
      if (db) {
        const completedRequests = await db
          .select()
          .from(workRequests)
          .where(eq(workRequests.status, 'completed'));

        return completedRequests;
      } else {
        return inMemoryWorkRequests.filter(req => req.status === 'completed');
      }
    } catch (error) {
      console.error('❌ Error getting completed work logs:', error);
      return inMemoryWorkRequests.filter(req => req.status === 'completed');
    }
  }

  static async getWorkRequestsByConsumer(consumerId: string): Promise<any[]> {
    try {
      if (db) {
        const requests = await db
          .select()
          .from(workRequests)
          .where(eq(workRequests.consumerUserId, consumerId));

        return requests;
      } else {
        return inMemoryWorkRequests.filter(req => req.consumerUserId === consumerId);
      }
    } catch (error) {
      console.error('❌ Error getting work requests by consumer:', error);
      return inMemoryWorkRequests.filter(req => req.consumerUserId === consumerId);
    }
  }

  static async getConsumerInfoByUserId(userId: string): Promise<any | null> {
    try {
      if (db) {
        const [consumerInfoRecord] = await db.select().from(consumerInfo).where(eq(consumerInfo.userId, userId));
        return consumerInfoRecord || null;
      } else {
        return inMemoryConsumers[userId] || null;
      }
    } catch (error) {
      console.error('❌ Error getting consumer info by user ID:', error);
      return inMemoryConsumers[userId] || null;
    }
  }

  static async initializeService(): Promise<void> {
    try {
      console.log('✅ Service Provider service initialized');
    } catch (error) {
      console.error('❌ Error initializing Service Provider service:', error);
      throw error;
    }
  }
}