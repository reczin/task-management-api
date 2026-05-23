import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: "15m" });
};

export const generateRefreshTokenValue = (): string => {
  return crypto.randomBytes(40).toString("hex");
};

export const getRefreshTokenExpiry = (): Date => {
  const days = parseInt(process.env.REFRESH_TOKEN_DAYS ?? "30", 10);
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};
