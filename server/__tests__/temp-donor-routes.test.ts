// server/__tests__/temp-donor-routes.test.ts

import express from "express";
import supertest from "supertest";
import routes from "../routes";

const app = express();
app.use(express.json());
app.use('/api', routes);

describe("Temp Donor Routes", () => {

  beforeEach(async () => {
    // Clear temp donor data before each test
    await supertest(app).delete("/api/temp-donor/clear");
  });

  describe("POST /api/temp-donor/info", () => {
    it("should save donor information successfully", async () => {
      const donorInfo = {
        userId: "test-user-1",
        name: "John Doe",
        phone: "9876543210",
        address: "123 Test Street, Test City",
        aadhaar: "123456789012"
      };

      const response = await supertest(app)
        .post("/api/temp-donor/info")
        .send(donorInfo);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toMatch(/Donor information saved successfully/);
      expect(response.body.data.userId).toBe(donorInfo.userId);
      expect(response.body.data.name).toBe(donorInfo.name);
    });

    it("should return 400 if required fields are missing", async () => {
      const incompleteDonorInfo = {
        userId: "test-user-1",
        name: "John Doe"
        // Missing phone, address, aadhaar
      };

      const response = await supertest(app)
        .post("/api/temp-donor/info")
        .send(incompleteDonorInfo);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("All fields are required");
    });
  });

  describe("POST /api/temp-donor/food-donation", () => {
    it("should save food donation successfully", async () => {
      const foodDonation = {
        userId: "test-user-1",
        foodItems: [
          {
            foodType: "Rice",
            quantity: "5 KG",
            foodTypeCategory: "Grains",
            storageRequirement: "Dry place",
            preparationTime: "10:00",
            preparationDate: "2024-01-15",
            expiryDate: "2024-01-20",
            expiryTime: "18:00"
          }
        ],
        pickupLocation: "123 Test Street",
        pickupTime: "14:00",
        specialInstructions: "Handle with care"
      };

      const response = await supertest(app)
        .post("/api/temp-donor/food-donation")
        .send(foodDonation);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toMatch(/Food donation submitted successfully/);
      expect(response.body.data.userId).toBe(foodDonation.userId);
      expect(response.body.data.foodItems).toHaveLength(1);
    });

    it("should return 400 if food items are missing", async () => {
      const invalidDonation = {
        userId: "test-user-1",
        foodItems: []
      };

      const response = await supertest(app)
        .post("/api/temp-donor/food-donation")
        .send(invalidDonation);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("User ID and food items are required");
    });
  });

  describe("GET /api/temp-donor/info/:userId", () => {
    it("should retrieve donor information", async () => {
      const donorInfo = {
        userId: "test-user-1",
        name: "John Doe",
        phone: "9876543210",
        address: "123 Test Street, Test City",
        aadhaar: "123456789012"
      };

      // First save the donor info
      await supertest(app)
        .post("/api/temp-donor/info")
        .send(donorInfo);

      // Then retrieve it
      const response = await supertest(app)
        .get("/api/temp-donor/info/test-user-1");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.userId).toBe("test-user-1");
      expect(response.body.data.name).toBe("John Doe");
    });

    it("should return 404 if donor info not found", async () => {
      const response = await supertest(app)
        .get("/api/temp-donor/info/nonexistent-user");

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("Donor information not found");
    });
  });

  describe("DELETE /api/temp-donor/clear", () => {
    it("should clear all temp donor data", async () => {
      // First add some data
      await supertest(app)
        .post("/api/temp-donor/info")
        .send({
          userId: "test-user-1",
          name: "John Doe",
          phone: "9876543210",
          address: "123 Test Street",
          aadhaar: "123456789012"
        });

      // Clear the data
      const response = await supertest(app)
        .delete("/api/temp-donor/clear");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("All temp donor data cleared");

      // Verify data is cleared
      const getResponse = await supertest(app)
        .get("/api/temp-donor/info/test-user-1");

      expect(getResponse.status).toBe(404);
    });
  });
});