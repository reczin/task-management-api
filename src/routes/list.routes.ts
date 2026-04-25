import { Router } from "express";
import { create, getAll } from "../controllers/list.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
router.use(authMiddleware);
router.post("/", create);
router.get("/", getAll);

export default router;
