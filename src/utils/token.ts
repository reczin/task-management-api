import jwt from "jsonwebtoken";

export const generateToken = (userId: string): string => {
  // token expira em 7 dias; o payload carrega apenas o id para minimizar dados expostos
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });
};
