import request from "supertest";
import app from "../app";

describe("auth", () => {
  it("registers a user and returns tokens", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "a@a.com", password: "secret12" });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
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

  it("logs in and returns tokens", async () => {
    await request(app)
      .post("/auth/register")
      .send({ email: "b@a.com", password: "secret12" });
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "b@a.com", password: "secret12" });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
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

  it("refreshes access token", async () => {
    const reg = await request(app)
      .post("/auth/register")
      .send({ email: "refresh@a.com", password: "secret12" });
    const res = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken: reg.body.refreshToken });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });

  it("returns profile for authenticated user", async () => {
    const reg = await request(app)
      .post("/auth/register")
      .send({ email: "me@a.com", password: "secret12" });
    const res = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${reg.body.token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe("me@a.com");
  });
});
