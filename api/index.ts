import connectDB from "../dist/config/db.js";
import app from "../dist/index.js";

let initialized = false;

export default async function handler(req: any, res: any) {
  try {
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

    await new Promise<void>((resolve) => {
      app(req, res);
      res.on("finish", resolve);
      res.on("close", resolve);
    });
  } catch (err) {
    console.error("Handler error:", err);
    if (!res.headersSent) {
      try { res.status(500).json({ error: "Internal server error" }); } catch {}
    }
  }
}
