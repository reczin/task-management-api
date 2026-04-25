import "express-async-errors";
import express from "express";
import authRoutes from "./routes/auth.routes";
import listRoutes from "./routes/list.routes";
import taskRoutes from "./routes/task.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/lists", listRoutes);
app.use("/tasks", taskRoutes);

// global error handler deve vir após todas as rotas
app.use(errorHandler);

export default app;
