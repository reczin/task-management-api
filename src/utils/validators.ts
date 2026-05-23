import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export const listCreateSchema = z.object({
  name: z.string().min(1),
});

export const listUpdateSchema = z.object({
  name: z.string().min(1),
});

const taskStatus = z.enum(["pendente", "em andamento", "concluída"]);
const taskPriority = z.enum(["baixa", "media", "alta"]);

export const taskCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  listId: z.string().min(1),
  status: taskStatus.optional(),
  priority: taskPriority.optional(),
  dueDate: z.string().min(1).optional(),
});

export const taskUpdateSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    listId: z.string().min(1).optional(),
    status: taskStatus.optional(),
    priority: taskPriority.optional(),
    dueDate: z.string().min(1).optional().nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: "Nenhum campo para atualizar" });

export const taskListQuerySchema = z.object({
  listId: z.string().optional(),
  status: taskStatus.optional(),
  dueDate: z.string().optional(),
  search: z.string().optional(),
  overdue: z.enum(["true", "false"]).optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});
