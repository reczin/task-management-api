import { Response } from "express";
import * as taskService from "../services/task.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { taskCreateSchema, taskListQuerySchema, taskUpdateSchema } from "../utils/validators";

// converte erros de serviço em códigos HTTP adequados
const mapError = (err: unknown) => {
  const message = err instanceof Error ? err.message : "Erro";
  if (message.includes("não encontrad")) return { status: 404 as const, message };
  if (message === "Lista inválida" || message === "Tarefa inválida" || message === "Data inválida") {
    return { status: 400 as const, message };
  }
  return { status: 400 as const, message };
};

export const create = async (req: AuthRequest, res: Response) => {
  const parsed = taskCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  if (!req.userId) {
    return res.status(401).json({ error: "Não autorizado" });
  }
  try {
    const task = await taskService.create(
      {
        title: parsed.data.title,
        description: parsed.data.description,
        listId: parsed.data.listId,
        status: parsed.data.status,
        dueDate: parsed.data.dueDate,
      },
      req.userId
    );
    return res.status(201).json(task);
  } catch (err) {
    const { status, message } = mapError(err);
    return res.status(status).json({ error: message });
  }
};

export const getAll = async (req: AuthRequest, res: Response) => {
  const parsed = taskListQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  if (!req.userId) {
    return res.status(401).json({ error: "Não autorizado" });
  }
  try {
    const tasks = await taskService.getAll(req.userId, parsed.data);
    return res.json(tasks);
  } catch (err) {
    const { status, message } = mapError(err);
    return res.status(status).json({ error: message });
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  const parsed = taskUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  if (!req.userId) {
    return res.status(401).json({ error: "Não autorizado" });
  }
  const { id } = req.params;
  try {
    const task = await taskService.update(id, req.userId, parsed.data);
    return res.json(task);
  } catch (err) {
    const { status, message } = mapError(err);
    return res.status(status).json({ error: message });
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  if (!req.userId) {
    return res.status(401).json({ error: "Não autorizado" });
  }
  const { id } = req.params;
  try {
    await taskService.remove(id, req.userId);
    return res.status(204).send();
  } catch (err) {
    const { status, message } = mapError(err);
    return res.status(status).json({ error: message });
  }
};
