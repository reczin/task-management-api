import { Response } from "express";
import * as dashboardService from "../services/dashboard.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export const stats = async (req: AuthRequest, res: Response) => {
  if (!req.userId) {
    return res.status(401).json({ error: "Não autorizado" });
  }
  const data = await dashboardService.getStats(req.userId);
  return res.json(data);
};
