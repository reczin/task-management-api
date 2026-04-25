import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// estende Request para transportar o id do usuário autenticado entre middlewares e controllers
export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  // aceita "Bearer <token>" ou apenas "<token>"
  const token = header?.startsWith("Bearer ") ? header.slice(7) : header?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
};
