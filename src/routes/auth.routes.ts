import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  me,
  changePassword,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", authMiddleware, me);
router.put("/password", authMiddleware, changePassword);

export default router;
