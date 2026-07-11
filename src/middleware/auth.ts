import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload, AuthRequest } from "../types/index.js";

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
