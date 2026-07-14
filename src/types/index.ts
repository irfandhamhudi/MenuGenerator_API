import type { Request } from "express";

export interface JwtPayload {
  userId: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface MenuItem {
  category: string;
  name: string;
  price: number;
  image?: string;
}

export type TemplateType = "modern" | "classic" | "elegant" | "neobrutalism" | "nature" | "farm" | "rimberio";
