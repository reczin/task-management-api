import RefreshToken from "../models/RefreshToken";
import { generateRefreshTokenValue, getRefreshTokenExpiry } from "../utils/token";

export const createRefreshToken = async (userId: string) => {
  const token = generateRefreshTokenValue();
  await RefreshToken.create({
    userId,
    token,
    expiresAt: getRefreshTokenExpiry(),
  });
  return token;
};

export const validateRefreshToken = async (token: string) => {
  const doc = await RefreshToken.findOne({ token, expiresAt: { $gt: new Date() } });
  if (!doc) throw new Error("Refresh token inválido");
  return doc.userId.toString();
};

export const revokeRefreshToken = async (token: string) => {
  await RefreshToken.deleteOne({ token });
};

export const revokeAllForUser = async (userId: string) => {
  await RefreshToken.deleteMany({ userId });
};
