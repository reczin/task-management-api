import { Request, Response, NextFunction } from "express";

// captura erros não tratados nas rotas (incluindo async via express-async-errors)
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Erro interno" });
};
