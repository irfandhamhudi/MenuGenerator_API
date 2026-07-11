import { Router } from "express";
import { getPublicMenu } from "../controllers/menu.js";

const router = Router();

router.get("/menus/:id", getPublicMenu);

export default router;
