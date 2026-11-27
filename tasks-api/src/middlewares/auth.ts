import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type TokenPayload = { id: number; email: string; role: string };

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não informado." });
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    res.locals.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
}

export function requireEditor(_req: Request, res: Response, next: NextFunction) {
  if (res.locals.user?.role !== "EDITOR") {
    return res.status(403).json({ message: "Apenas editores podem fazer isso." });
  }
  next();
}