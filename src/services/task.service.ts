import mongoose, { Types } from "mongoose";
import List from "../models/List";
import Task, { TaskPriority, TaskStatus } from "../models/Task";

const ensureListOwner = async (listId: string, userId: string) => {
  const list = await List.findOne({ _id: listId, userId });
  if (!list) throw new Error("Lista não encontrada");
  return list;
};

const ensureTask = async (taskId: string, userId: string) => {
  if (!mongoose.isValidObjectId(taskId)) throw new Error("Tarefa inválida");
  const task = await Task.findOne({ _id: taskId, userId });
  if (!task) throw new Error("Tarefa não encontrada");
  return task;
};

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const buildFilter = (
  userId: string,
  query: {
    listId?: string;
    status?: string;
    dueDate?: string;
    search?: string;
    overdue?: string;
  }
) => {
  const filter: Record<string, unknown> = { userId };
  if (query.status) filter.status = query.status;
  if (query.listId) {
    if (!mongoose.isValidObjectId(query.listId)) throw new Error("Lista inválida");
    filter.listId = query.listId;
  }
  if (query.dueDate) {
    const d = new Date(query.dueDate);
    if (isNaN(d.getTime())) throw new Error("Data inválida");
    filter.dueDate = { $lte: d };
  }
  if (query.search?.trim()) {
    const regex = new RegExp(query.search.trim(), "i");
    filter.$or = [{ title: regex }, { description: regex }];
  }
  if (query.overdue === "true") {
    filter.status = { $ne: "concluída" };
    filter.dueDate = { $lt: startOfToday() };
  }
  return filter;
};

export const create = async (
  data: {
    title: string;
    description?: string;
    listId: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
  },
  userId: string
) => {
  await ensureListOwner(data.listId, userId);
  let due: Date | undefined;
  if (data.dueDate) {
    due = new Date(data.dueDate);
    if (isNaN(due.getTime())) throw new Error("Data inválida");
  }
  return Task.create({
    title: data.title,
    description: data.description,
    listId: data.listId,
    userId,
    status: data.status,
    priority: data.priority,
    dueDate: due,
  });
};

export const getAll = async (
  userId: string,
  query: {
    listId?: string;
    status?: string;
    dueDate?: string;
    search?: string;
    overdue?: string;
    page?: string;
    limit?: string;
  }
) => {
  const filter = buildFilter(userId, query);
  const page = Math.max(1, parseInt(query.page ?? "1", 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit ?? "20", 10) || 20));
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Task.find(filter).sort({ dueDate: 1, createdAt: 1 }).skip(skip).limit(limit),
    Task.countDocuments(filter),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

export const update = async (
  taskId: string,
  userId: string,
  data: {
    title?: string;
    description?: string;
    listId?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string | null;
  }
) => {
  const task = await ensureTask(taskId, userId);
  if (data.listId) {
    await ensureListOwner(data.listId, userId);
    task.listId = new Types.ObjectId(data.listId);
  }
  if (data.title !== undefined) task.title = data.title;
  if (data.description !== undefined) task.description = data.description;
  if (data.status !== undefined) task.status = data.status;
  if (data.priority !== undefined) task.priority = data.priority;
  if (data.dueDate === null) {
    task.dueDate = undefined;
  } else if (data.dueDate !== undefined) {
    const d = new Date(data.dueDate);
    if (isNaN(d.getTime())) throw new Error("Data inválida");
    task.dueDate = d;
  }
  await task.save();
  return task;
};

export const remove = async (taskId: string, userId: string) => {
  const task = await ensureTask(taskId, userId);
  await task.deleteOne();
};
