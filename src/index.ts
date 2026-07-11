import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { cleanTrash } from "./controllers/menu.js";
import authRoutes from "./routes/auth.js";
import menuRoutes from "./routes/menu.js";
import uploadRoutes from "./routes/upload.js";
import publicRoutes from "./routes/public.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/public", publicRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

const start = async () => {
  await connectDB();
  const cleaned = await cleanTrash();
  if (cleaned > 0) console.log(`Cleaned ${cleaned} expired trashed menus`);
};

if (!process.env.VERCEL) {
  start();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
