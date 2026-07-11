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

export type TemplateType = "modern" | "classic" | "minimal" | "dark" | "bistro" | "elegant" | "vintage" | "neobrutalism" | "nature" | "asian" | "monochrome" | "playful" | "luxury" | "fiesta" | "mediterranean" | "farm" | "cyberpunk" | "parisian" | "tropical" | "korean";
