import bcrypt from "bcrypt";
import User from "../models/User";

export const getProfile = async (userId: string) => {
  const user = await User.findById(userId).select("email");
  if (!user) throw new Error("Usuário não encontrado");
  return { id: user.id, email: user.email };
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("Usuário não encontrado");

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) throw new Error("Senha atual incorreta");

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
};
