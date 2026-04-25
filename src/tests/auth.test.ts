import request from "supertest";
import app from "../app";

describe("auth", () => {
  it("registers a user and returns a token", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "a@a.com", password: "secret12" });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it("rejects duplicate email on register", async () => {
    await request(app)
      .post("/auth/register")
      .send({ email: "dup@a.com", password: "secret12" });
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "dup@a.com", password: "secret12" });
    expect(res.status).toBe(409);
  });

  it("logs in and returns a token", async () => {
    await request(app)
      .post("/auth/register")
      .send({ email: "b@a.com", password: "secret12" });
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "b@a.com", password: "secret12" });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("rejects wrong password on login", async () => {
    await request(app)
      .post("/auth/register")
      .send({ email: "c@a.com", password: "secret12" });
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "c@a.com", password: "wrongpass" });
    expect(res.status).toBe(401);
  });
});
