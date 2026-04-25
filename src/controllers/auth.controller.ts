import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { loginSchema, registerSchema } from "../utils/validators";

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
    // email duplicado recebe 409 Conflict; demais erros de negócio ficam em 400
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
