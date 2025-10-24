// server/__tests__/server.test.ts

import supertest from "supertest";
import app from "../index";

describe("Server", () => {
  it("should start and respond to health check", async () => {
    const response = await supertest(app)
      .get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("SahaayConnect API is running");
  });

  it("should handle 404 for unknown routes", async () => {
    const response = await supertest(app)
      .get("/unknown-route");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Endpoint not found");
  });

  it("should return API documentation", async () => {
    const response = await supertest(app)
      .get("/api/docs");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.endpoints).toBeDefined();
  });
});