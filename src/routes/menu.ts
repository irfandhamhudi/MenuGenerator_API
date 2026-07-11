import { Router } from "express";
import {
  getMenus,
  getMenu,
  createMenu,
  updateMenu,
  deleteMenu,
  getTrashed,
  restoreMenu,
  permanentDelete,
} from "../controllers/menu.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getMenus);
router.get("/trashed", getTrashed);
router.get("/:id", getMenu);
router.post("/", createMenu);
router.put("/:id", updateMenu);
router.delete("/:id", deleteMenu);
router.post("/:id/restore", restoreMenu);
router.delete("/:id/permanent", permanentDelete);

export default router;
