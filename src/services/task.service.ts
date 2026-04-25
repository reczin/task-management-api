import mongoose, { Types } from "mongoose";
import List from "../models/List";
import Task, { TaskStatus } from "../models/Task";

// garante que a lista existe e pertence ao usuário antes de qualquer operação
const ensureListOwner = async (listId: string, userId: string) => {
  const list = await List.findOne({ _id: listId, userId });
  if (!list) throw new Error("Lista não encontrada");
  return list;
};

// garante que a tarefa existe e pertence ao usuário; rejeita ObjectIds malformados antes de consultar
const ensureTask = async (taskId: string, userId: string) => {
  if (!mongoose.isValidObjectId(taskId)) throw new Error("Tarefa inválida");
  const task = await Task.findOne({ _id: taskId, userId });
  if (!task) throw new Error("Tarefa não encontrada");
  return task;
};

export const create = async (
  data: {
    title: string;
    description?: string;
    listId: string;
    status?: TaskStatus;
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
    dueDate: due,
  });
};

export const getAll = async (
  userId: string,
  query: { listId?: string; status?: string; dueDate?: string }
) => {
  const filter: Record<string, unknown> = { userId };
  if (query.status) {
    filter.status = query.status;
  }
  if (query.listId) {
    if (!mongoose.isValidObjectId(query.listId)) {
      throw new Error("Lista inválida");
    }
    filter.listId = query.listId;
  }
  if (query.dueDate) {
    const d = new Date(query.dueDate);
    if (isNaN(d.getTime())) throw new Error("Data inválida");
    // retorna tarefas com vencimento até (inclusive) a data informada
    filter.dueDate = { $lte: d };
  }
  return Task.find(filter).sort({ dueDate: 1, createdAt: 1 });
};

export const update = async (
  taskId: string,
  userId: string,
  data: {
    title?: string;
    description?: string;
    listId?: string;
    status?: TaskStatus;
    dueDate?: string | null;
  }
) => {
  const task = await ensureTask(taskId, userId);
  if (data.listId) {
    // valida que a nova lista também pertence ao usuário
    await ensureListOwner(data.listId, userId);
    task.listId = new Types.ObjectId(data.listId);
  }
  if (data.title !== undefined) task.title = data.title;
  if (data.description !== undefined) task.description = data.description;
  if (data.status !== undefined) task.status = data.status;
  if (data.dueDate === null) {
    // null explícito remove a data de vencimento
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
