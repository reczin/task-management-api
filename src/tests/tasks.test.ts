import request from "supertest";
import app from "../app";

async function registerAndGetToken() {
  const email = `u${Date.now()}@t.com`;
  const reg = await request(app)
    .post("/auth/register")
    .send({ email, password: "secret12" });
  return { token: reg.body.token as string, email };
}

describe("tasks", () => {
  it("returns 401 when listing tasks without token", async () => {
    const res = await request(app).get("/tasks");
    expect(res.status).toBe(401);
  });

  it("creates a task linked to a list", async () => {
    const { token } = await registerAndGetToken();
    const listRes = await request(app)
      .post("/lists")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Minha lista" });
    expect(listRes.status).toBe(201);
    const listId = listRes.body._id;
    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Fazer o teste", listId, description: "desc" });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Fazer o teste");
  });

  it("lists tasks for the authenticated user", async () => {
    const { token } = await registerAndGetToken();
    const listRes = await request(app)
      .post("/lists")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "L2" });
    const listId = listRes.body._id;
    await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "T1", listId });
    const res = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  it("updates a task", async () => {
    const { token } = await registerAndGetToken();
    const listRes = await request(app)
      .post("/lists")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "L3" });
    const listId = listRes.body._id;
    const tRes = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Antes", listId });
    const id = tRes.body._id;
    const res = await request(app)
      .put(`/tasks/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Depois", status: "em andamento" });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Depois");
    expect(res.body.status).toBe("em andamento");
  });
});
