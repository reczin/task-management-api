import List from "../models/List";

export const create = async (name: string, userId: string) => {
  return List.create({ name, userId });
};

export const getAll = (userId: string) => {
  return List.find({ userId }).sort({ name: 1 });
};
