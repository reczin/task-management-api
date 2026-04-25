import { Router } from "express";
import { create, getAll, update, remove } from "../controllers/task.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
router.use(authMiddleware);
router.post("/", create);
router.get("/", getAll);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
