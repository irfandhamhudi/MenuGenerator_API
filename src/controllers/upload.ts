import type { Response } from "express";
import multer from "multer";
import { storage } from "../config/cloudinary.js";
import type { AuthRequest } from "../types/index.js";

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadMiddleware = (req: AuthRequest, res: Response, next: any) => {
  const single = upload.single("image");
  single(req, res, (err: any) => {
    if (err) {
      console.error("Multer error:", err);
      res.status(400).json({ message: err.message || "Upload error" });
      return;
    }
    next();
  });
};

export const uploadImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const file = req.file as any;

    res.json({
      url: file.path,
      public_id: file.filename,
    });
  } catch (error: any) {
    console.error("Upload controller error:", error);
    res.status(500).json({ message: error.message || "Upload failed" });
  }
};
