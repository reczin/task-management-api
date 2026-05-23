import { Response } from "express";
import * as listService from "../services/list.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { listCreateSchema, listUpdateSchema } from "../utils/validators";

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

export const update = async (req: AuthRequest, res: Response) => {
  const parsed = listUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  if (!req.userId) {
    return res.status(401).json({ error: "Não autorizado" });
  }
  try {
    const list = await listService.update(req.params.id, req.userId, parsed.data.name);
    return res.json(list);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro";
    const status = message.includes("não encontrad") ? 404 : 400;
    return res.status(status).json({ error: message });
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  if (!req.userId) {
    return res.status(401).json({ error: "Não autorizado" });
  }
  try {
    await listService.remove(req.params.id, req.userId);
    return res.status(204).send();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro";
    const status = message.includes("não encontrad") ? 404 : 400;
    return res.status(status).json({ error: message });
  }
};
