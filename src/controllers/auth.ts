import type { Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import type { AuthRequest } from "../types/index.js";

const createToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: 7 * 24 * 60 * 60,
  });
};

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      res.status(400).json({
        message: "User with this email or username already exists",
      });
      return;
    }

    const user = await User.create({ username, email, password });
    const token = createToken(user._id.toString());

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Registration failed" });
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = createToken(user._id.toString());

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Login failed" });
  }
};

export const logout = async (_req: AuthRequest, res: Response): Promise<void> => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ user: { id: user._id, username: user.username, email: user.email } });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};
