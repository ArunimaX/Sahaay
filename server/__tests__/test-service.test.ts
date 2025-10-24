// server/__tests__/test-service.test.ts

import { TestService } from "../services/test-service";

describe("TestService", () => {
  beforeEach(() => {
    // Clear test data before each test
    TestService.clearTestData();
  });

  describe("createTestUser", () => {
    it("should create a test user with unique ID", () => {
      const userData = {
        email: "test@example.com",
        name: "Test User",
        role: "donor" as const,
        password: "hashedpassword"
      };

      const user = TestService.createTestUser(userData);

      expect(user.id).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.name).toBe(userData.name);
      expect(user.role).toBe(userData.role);
      expect(user.password).toBe(userData.password);
      expect(user.createdAt).toBeDefined();
    });

    it("should increment user counter for each new user", () => {
      const userData1 = {
        email: "test1@example.com",
        name: "Test User 1",
        role: "donor" as const,
        password: "hashedpassword"
      };

      const userData2 = {
        email: "test2@example.com",
        name: "Test User 2",
        role: "ngo" as const,
        password: "hashedpassword"
      };

      const user1 = TestService.createTestUser(userData1);
      const user2 = TestService.createTestUser(userData2);

      expect(user1.id).toBe("test-1");
      expect(user2.id).toBe("test-2");
    });
  });

  describe("getTestUserByEmail", () => {
    it("should return user when found", () => {
      const userData = {
        email: "test@example.com",
        name: "Test User",
        role: "donor" as const,
        password: "hashedpassword"
      };

      TestService.createTestUser(userData);
      const foundUser = TestService.getTestUserByEmail("test@example.com");

      expect(foundUser).toBeDefined();
      expect(foundUser?.email).toBe("test@example.com");
    });

    it("should return null when user not found", () => {
      const foundUser = TestService.getTestUserByEmail("nonexistent@example.com");
      expect(foundUser).toBeNull();
    });
  });

  describe("getTestUserById", () => {
    it("should return user when found", () => {
      const userData = {
        email: "test@example.com",
        name: "Test User",
        role: "donor" as const,
        password: "hashedpassword"
      };

      const createdUser = TestService.createTestUser(userData);
      const foundUser = TestService.getTestUserById(createdUser.id);

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(createdUser.id);
    });

    it("should return null when user not found", () => {
      const foundUser = TestService.getTestUserById("nonexistent-id");
      expect(foundUser).toBeNull();
    });
  });

  describe("getAllTestUsers", () => {
    it("should return empty array when no users", () => {
      const users = TestService.getAllTestUsers();
      expect(users).toEqual([]);
    });

    it("should return all created users", () => {
      const userData1 = {
        email: "test1@example.com",
        name: "Test User 1",
        role: "donor" as const,
        password: "hashedpassword"
      };

      const userData2 = {
        email: "test2@example.com",
        name: "Test User 2",
        role: "ngo" as const,
        password: "hashedpassword"
      };

      TestService.createTestUser(userData1);
      TestService.createTestUser(userData2);

      const users = TestService.getAllTestUsers();
      expect(users).toHaveLength(2);
      expect(users[0].email).toBe("test1@example.com");
      expect(users[1].email).toBe("test2@example.com");
    });
  });

  describe("getTestDataSummary", () => {
    it("should return correct summary", () => {
      const userData1 = {
        email: "donor@example.com",
        name: "Donor User",
        role: "donor" as const,
        password: "hashedpassword"
      };

      const userData2 = {
        email: "ngo@example.com",
        name: "NGO User",
        role: "ngo" as const,
        password: "hashedpassword"
      };

      TestService.createTestUser(userData1);
      TestService.createTestUser(userData2);

      const summary = TestService.getTestDataSummary();
      expect(summary.userCount).toBe(2);
      expect(summary.roles).toContain("donor");
      expect(summary.roles).toContain("ngo");
      expect(summary.roles).toHaveLength(2);
    });
  });

  describe("clearTestData", () => {
    it("should clear all test data", () => {
      const userData = {
        email: "test@example.com",
        name: "Test User",
        role: "donor" as const,
        password: "hashedpassword"
      };

      TestService.createTestUser(userData);
      expect(TestService.getAllTestUsers()).toHaveLength(1);

      TestService.clearTestData();
      expect(TestService.getAllTestUsers()).toHaveLength(0);
    });
  });
});