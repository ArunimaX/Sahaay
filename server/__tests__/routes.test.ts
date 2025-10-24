// server/__tests__/routes.test.ts

import express from "express";
import supertest from "supertest";
import routes from "../routes";
import { TestService } from "../services/test-service";

// Mock the firebase-storage module
jest.mock("../firebase-storage", () => ({
  getUserByEmail: jest.fn(),
  createUser: jest.fn(),
}));

import * as storage from "../firebase-storage";

const app = express();
app.use(express.json());

// Register routes before running tests
app.use('/api', routes);

const mockedStorage = storage as jest.Mocked<typeof storage>;

describe("API Routes", () => {

  beforeEach(() => {
    // Clear test data before each test to avoid conflicts
    TestService.clearTestData();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/health", () => {
    it("should return health status", async () => {
      const response = await supertest(app)
        .get("/api/health");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("SahaayConnect API is running");
    });
  });

  describe("GET /api/me", () => {
    it("should return current user status", async () => {
      const response = await supertest(app)
        .get("/api/me");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBe(null);
    });
  });

  describe("POST /api/test/register", () => {
    it("should register a new test user successfully", async () => {
      const newUser = {
        name: "Test User",
        email: `test-${Date.now()}@example.com`,
        password: "password123",
        confirmPassword: "password123",
        role: "donor",
      };

      const response = await supertest(app)
        .post("/api/test/register")
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(newUser.email);
      expect(response.body.user.password).toBeUndefined(); // Password should not be returned
    });

    it("should return 400 if required fields are missing", async () => {
      const incompleteUser = {
        name: "Test User",
        email: "test@example.com",
        // Missing password, confirmPassword, and role
      };

      const response = await supertest(app)
        .post("/api/test/register")
        .send(incompleteUser);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("All fields are required");
    });

    it("should return 400 if passwords don't match", async () => {
      const userWithMismatchedPasswords = {
        name: "Test User",
        email: "test2@example.com",
        password: "password123",
        confirmPassword: "differentpassword",
        role: "donor",
      };

      const response = await supertest(app)
        .post("/api/test/register")
        .send(userWithMismatchedPasswords);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("Passwords do not match");
    });
  });

  describe("POST /api/test/login", () => {
    it("should login a test user successfully", async () => {
      // First register a user
      const uniqueEmail = `login-${Date.now()}@example.com`;
      const newUser = {
        name: "Login Test User",
        email: uniqueEmail,
        password: "password123",
        confirmPassword: "password123",
        role: "donor",
      };

      await supertest(app)
        .post("/api/test/register")
        .send(newUser);

      // Then try to login
      const loginData = {
        email: uniqueEmail,
        password: "password123",
      };

      const response = await supertest(app)
        .post("/api/test/login")
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(loginData.email);
      expect(response.body.user.password).toBeUndefined(); // Password should not be returned
    });

    it("should return 401 for invalid credentials", async () => {
      const invalidLogin = {
        email: "nonexistent@example.com",
        password: "wrongpassword",
      };

      const response = await supertest(app)
        .post("/api/test/login")
        .send(invalidLogin);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("Invalid email or password");
    });
  });

  describe("GET /api/test/users", () => {
    it("should return all test users", async () => {
      const response = await supertest(app)
        .get("/api/test/users");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.users).toBeDefined();
      expect(Array.isArray(response.body.users)).toBe(true);
    });
  });

});
