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
      .send({ title: "Fazer o teste", listId, description: "desc", priority: "alta" });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Fazer o teste");
    expect(res.body.priority).toBe("alta");
  });

  it("lists tasks with pagination", async () => {
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
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.total).toBe(1);
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

  it("searches tasks by title", async () => {
    const { token } = await registerAndGetToken();
    const listRes = await request(app)
      .post("/lists")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Search" });
    const listId = listRes.body._id;
    await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Comprar leite", listId });
    await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Outra coisa", listId });
    const res = await request(app)
      .get("/tasks?search=leite")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe("Comprar leite");
  });
});

describe("lists", () => {
  it("updates and deletes a list", async () => {
    const { token } = await registerAndGetToken();
    const create = await request(app)
      .post("/lists")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Original" });
    const id = create.body._id;

    const updated = await request(app)
      .put(`/lists/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Renomeada" });
    expect(updated.status).toBe(200);
    expect(updated.body.name).toBe("Renomeada");

    const del = await request(app)
      .delete(`/lists/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(del.status).toBe(204);
  });
});

describe("dashboard", () => {
  it("returns task stats", async () => {
    const { token } = await registerAndGetToken();
    const listRes = await request(app)
      .post("/lists")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Stats" });
    await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Pendente", listId: listRes.body._id });
    const res = await request(app)
      .get("/dashboard/stats")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.pending).toBe(1);
  });
});
