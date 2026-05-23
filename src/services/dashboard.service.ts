import Task from "../models/Task";

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getStats = async (userId: string) => {
  const today = startOfToday();
  const base = { userId };
  const [total, pending, inProgress, completed, overdue] = await Promise.all([
    Task.countDocuments(base),
    Task.countDocuments({ ...base, status: "pendente" }),
    Task.countDocuments({ ...base, status: "em andamento" }),
    Task.countDocuments({ ...base, status: "concluída" }),
    Task.countDocuments({
      ...base,
      status: { $ne: "concluída" },
      dueDate: { $lt: today },
    }),
  ]);
  return { total, pending, inProgress, completed, overdue };
};
