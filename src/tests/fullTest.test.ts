import request from "supertest";
import { app } from "../app";
import { sequelize } from "../models";

describe("Full Flow: Register, Login, Add Order, List Orders", () => {
  let token: string;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  // 1. Register a new user
  it("should register a new user", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({
        firstName: "Test",
        lastName: "User",
        email: "testuser@example.com",
        password: "password123",
      })
      .expect(201); // 201 Created

    expect(response.body.user.email).toBe("testuser@example.com");
  });

  // 2. Login with the registered user and get JWT token
  it("should login the user", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({
        email: "testuser@example.com",
        password: "password123",
      })
      .expect(200);

    token = response.body.jwt;
    expect(token).toBeDefined();
  });

  // 3. Add a service to create an order for
  it("should add a new service", async () => {
    const serviceResponse = await request(app)
      .post("/api/services")
      .send({
        name: "Test service",
        description: "Basic shipping service with average delivery time.",
        price: 5.0,
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(201);

    expect(serviceResponse.body.name).toBe("Test service");
  });

  // 4. Add an order with the logged-in user
  it("should add a new order", async () => {
    const orderResponse = await request(app)
      .post("/api/orders")
      .send({
        services: [{ serviceName: "Test service", quantity: 2 }],
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(201);

    expect(orderResponse.body.message).toBe("Sipariş başarıyla oluşturuldu.");
  });

  // 5. List all orders for the logged-in user
  it("should list all orders for the user", async () => {
    const ordersResponse = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(ordersResponse.body.length).toBeGreaterThan(0);
    expect(ordersResponse.body[0].serviceName).toBe("Test service");
  });
});
