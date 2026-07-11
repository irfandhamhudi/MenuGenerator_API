import connectDB from "../dist/config/db.js";
import app from "../dist/index.js";

let initialized = false;

export default async function handler(req: any, res: any) {
  if (!initialized) {
    try {
      await connectDB();
      initialized = true;
    } catch (err) {
      console.error("DB init failed:", err);
      res.status(500).json({ error: "Server initialization failed" });
      return;
    }
  }
  app(req, res);
}
