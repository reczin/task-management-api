import { Response } from "express";
import * as listService from "../services/list.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { listCreateSchema } from "../utils/validators";

export const create = async (req: AuthRequest, res: Response) => {
  const parsed = listCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  if (!req.userId) {
    return res.status(401).json({ error: "Não autorizado" });
  }
  const list = await listService.create(parsed.data.name, req.userId);
  return res.status(201).json(list);
};

export const getAll = async (req: AuthRequest, res: Response) => {
  if (!req.userId) {
    return res.status(401).json({ error: "Não autorizado" });
  }
  const lists = await listService.getAll(req.userId);
  return res.json(lists);
};
