import bcrypt from "bcrypt";
import User from "../models/User";
import { generateToken } from "../utils/token";
import * as refreshTokenService from "./refreshToken.service";

const authResponse = async (userId: string) => {
  const refreshToken = await refreshTokenService.createRefreshToken(userId);
  return { token: generateToken(userId), refreshToken };
};

export const register = async (email: string, password: string) => {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new Error("Email já cadastrado");

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email: email.toLowerCase(), password: hashed });
  return authResponse(user.id);
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new Error("Credenciais inválidas");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Credenciais inválidas");

  return authResponse(user.id);
};

export const refresh = async (refreshToken: string) => {
  const userId = await refreshTokenService.validateRefreshToken(refreshToken);
  await refreshTokenService.revokeRefreshToken(refreshToken);
  return authResponse(userId);
};

export const logout = async (refreshToken: string) => {
  await refreshTokenService.revokeRefreshToken(refreshToken);
};

export const logoutAll = async (userId: string) => {
  await refreshTokenService.revokeAllForUser(userId);
};
