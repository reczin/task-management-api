import "express-async-errors";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import listRoutes from "./routes/list.routes";
import taskRoutes from "./routes/task.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/lists", listRoutes);
app.use("/tasks", taskRoutes);
app.use("/dashboard", dashboardRoutes);

// global error handler deve vir após todas as rotas
app.use(errorHandler);

export default app;
