// server/services/test-service.ts

export interface TestUser {
  id: string;
  email: string;
  name: string;
  role: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestUserData {
  email: string;
  name: string;
  role: string;
  password: string;
}

export class TestService {
  private static users: TestUser[] = [];
  private static nextId = 1;

  /**
   * Create a test user in memory
   */
  static createTestUser(userData: CreateTestUserData): TestUser {
    const timestamp = new Date().toISOString();
    const newUser: TestUser = {
      id: `test-${this.nextId++}`,
      ...userData,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    this.users.push(newUser);
    console.log(`✅ Test user created: ${newUser.email} (${newUser.role})`);
    
    return newUser;
  }

  /**
   * Get test user by email
   */
  static getTestUserByEmail(email: string): TestUser | null {
    const user = this.users.find(u => u.email === email);
    return user || null;
  }

  /**
   * Get test user by ID
   */
  static getTestUserById(id: string): TestUser | null {
    const user = this.users.find(u => u.id === id);
    return user || null;
  }

  /**
   * Get all test users
   */
  static getAllTestUsers(): TestUser[] {
    return [...this.users];
  }

  /**
   * Update test user
   */
  static updateTestUser(id: string, updateData: Partial<TestUser>): TestUser | null {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;

    const updatedUser = {
      ...this.users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  /**
   * Delete test user
   */
  static deleteTestUser(id: string): boolean {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    return true;
  }

  /**
   * Clear all test data
   */
  static clearTestData(): void {
    this.users = [];
    this.nextId = 1;
    console.log("🧹 All test data cleared");
  }

  /**
   * Get test data summary
   */
  static getTestDataSummary(): { userCount: number; roles: string[] } {
    const roles = [...new Set(this.users.map(u => u.role))];
    return {
      userCount: this.users.length,
      roles
    };
  }
}
