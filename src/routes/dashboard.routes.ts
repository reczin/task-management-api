import { Router } from "express";
import { stats } from "../controllers/dashboard.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
router.use(authMiddleware);
router.get("/stats", stats);

export default router;
