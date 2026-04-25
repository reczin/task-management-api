import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { connectDB, disconnectDB } from "../config/database";

let mongoServer: MongoMemoryServer;

// sobe um MongoDB em memória antes de todos os testes; evita dependência de instância real
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const testUri = mongoServer.getUri();
  process.env.MONGO_URI_TEST = testUri;
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = "test_jwt_secret";
  }
  await connectDB(testUri, { maxPoolSize: 10 });
}, 120000);

afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.dropDatabase();
  }
  await disconnectDB();
  if (mongoServer) {
    await mongoServer.stop();
  }
}, 30000);

// limpa todas as coleções entre testes para garantir isolamento de estado
afterEach(async () => {
  const db = mongoose.connection.db;
  if (!db) return;
  const cols = await db.collections();
  for (const c of cols) {
    await c.deleteMany({});
  }
});
