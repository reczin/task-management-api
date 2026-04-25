import bcrypt from "bcrypt";
import User from "../models/User";
import { generateToken } from "../utils/token";

export const register = async (email: string, password: string) => {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new Error("Email já cadastrado");

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email: email.toLowerCase(), password: hashed });
  return { token: generateToken(user.id) };
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  // mensagem genérica para não revelar se o email existe ou não
  if (!user) throw new Error("Credenciais inválidas");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Credenciais inválidas");

  return { token: generateToken(user.id) };
};
