import { Router } from "express";
import { uploadMiddleware, uploadImage } from "../controllers/upload.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

router.post("/", authMiddleware, uploadMiddleware, uploadImage);

export default router;
