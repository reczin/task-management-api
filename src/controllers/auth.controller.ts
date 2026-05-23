import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import * as userService from "../services/user.service";
import {
  changePasswordSchema,
  loginSchema,
  refreshSchema,
  registerSchema,
} from "../utils/validators";
import { AuthRequest } from "../middlewares/auth.middleware";

export const register = async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { email, password } = parsed.data;
  try {
    const result = await authService.register(email, password);
    return res.status(201).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro";
    if (message === "Email já cadastrado") {
      return res.status(409).json({ error: message });
    }
    return res.status(400).json({ error: message });
  }
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { email, password } = parsed.data;
  try {
    const result = await authService.login(email, password);
    return res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro";
    return res.status(401).json({ error: message });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  try {
    const result = await authService.refresh(parsed.data.refreshToken);
    return res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro";
    return res.status(401).json({ error: message });
  }
};

export const logout = async (req: Request, res: Response) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  await authService.logout(parsed.data.refreshToken);
  return res.status(204).send();
};

export const me = async (req: AuthRequest, res: Response) => {
  if (!req.userId) return res.status(401).json({ error: "Não autorizado" });
  try {
    const profile = await userService.getProfile(req.userId);
    return res.json(profile);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro";
    return res.status(404).json({ error: message });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  if (!req.userId) return res.status(401).json({ error: "Não autorizado" });
  try {
    await userService.changePassword(
      req.userId,
      parsed.data.currentPassword,
      parsed.data.newPassword
    );
    await authService.logoutAll(req.userId);
    return res.json({ message: "Senha alterada. Faça login novamente." });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro";
    return res.status(400).json({ error: message });
  }
};
