import List from "../models/List";
import Task from "../models/Task";

export const create = async (name: string, userId: string) => {
  return List.create({ name, userId });
};

export const getAll = (userId: string) => {
  return List.find({ userId }).sort({ name: 1 });
};

export const update = async (listId: string, userId: string, name: string) => {
  const list = await List.findOne({ _id: listId, userId });
  if (!list) throw new Error("Lista não encontrada");
  list.name = name;
  await list.save();
  return list;
};

export const remove = async (listId: string, userId: string) => {
  const list = await List.findOne({ _id: listId, userId });
  if (!list) throw new Error("Lista não encontrada");
  await Task.deleteMany({ listId, userId });
  await list.deleteOne();
};
