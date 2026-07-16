import type { Response } from "express";
import Menu from "../models/Menu.js";
import type { AuthRequest } from "../types/index.js";

export const getMenus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const menus = await Menu.find({ userId: req.user?.userId, deletedAt: null }).sort({ updatedAt: -1 });
    res.json({ menus });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch menus" });
  }
};

const TRASH_EXPIRE_DAYS = 30;

const sanitizeItems = (items: any[] = []) =>
  items
    .filter((item) => item?.name?.trim())
    .map((item) => ({
      category: item.category || "",
      name: item.name.trim(),
      price: typeof item.price === "string" ? parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0 : Number(item.price) || 0,
      image: item.image || "",
    }));

export const cleanTrash = async (): Promise<number> => {
  const cutoff = new Date(Date.now() - TRASH_EXPIRE_DAYS * 24 * 60 * 60 * 1000);
  const result = await Menu.deleteMany({ deletedAt: { $ne: null, $lt: cutoff } });
  return result.deletedCount;
};

export const getTrashed = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await cleanTrash();
    const menus = await Menu.find({ userId: req.user?.userId, deletedAt: { $ne: null } }).sort({ deletedAt: -1 });
    res.json({ menus });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch trashed menus" });
  }
};

export const getMenu = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const menu = await Menu.findOne({
      _id: req.params.id,
      userId: req.user?.userId,
    });

    if (!menu) {
      res.status(404).json({ message: "Menu not found" });
      return;
    }

    res.json({ menu });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch menu" });
  }
};

export const createMenu = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, template, categories, items } = req.body;

    const sanitizedItems = sanitizeItems(items);

    const menu = await Menu.create({
      userId: req.user?.userId,
      title,
      template,
      categories,
      items: sanitizedItems,
    });

    const sanitizedMenu = {
      ...menu.toObject(),
      items: menu.items.map((item) => ({
        ...item,
        price: typeof item.price === "string" ? parseFloat(item.price) || 0 : Number(item.price) || 0,
      })),
    };

    res.status(201).json({ menu: sanitizedMenu });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to create menu" });
  }
};

export const updateMenu = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, template, categories, items } = req.body;

    const menu = await Menu.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.userId },
      { title, template, categories, items: sanitizeItems(items) },
      { new: true, runValidators: true }
    );

    if (!menu) {
      res.status(404).json({ message: "Menu not found" });
      return;
    }

    const sanitizedMenu = {
      ...menu.toObject(),
      items: menu.items.map((item) => ({
        ...item,
        price: typeof item.price === "string" ? parseFloat(item.price) || 0 : Number(item.price) || 0,
      })),
    };

    res.json({ menu: sanitizedMenu });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to update menu" });
  }
};

export const getPublicMenu = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) {
      res.status(404).json({ message: "Menu not found" });
      return;
    }
    res.json({ menu });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch menu" });
  }
};

export const deleteMenu = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const menu = await Menu.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.userId },
      { deletedAt: new Date() },
      { new: true }
    );

    if (!menu) {
      res.status(404).json({ message: "Menu not found" });
      return;
    }

    res.json({ message: "Menu moved to trash" });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to delete menu" });
  }
};

export const restoreMenu = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const menu = await Menu.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.userId, deletedAt: { $ne: null } },
      { deletedAt: null },
      { new: true }
    );

    if (!menu) {
      res.status(404).json({ message: "Trashed menu not found" });
      return;
    }

    res.json({ menu });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to restore menu" });
  }
};

export const permanentDelete = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const menu = await Menu.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?.userId,
      deletedAt: { $ne: null },
    });

    if (!menu) {
      res.status(404).json({ message: "Trashed menu not found" });
      return;
    }

    res.json({ message: "Menu permanently deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to permanently delete menu" });
  }
};
