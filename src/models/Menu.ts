import mongoose, { Document, Schema } from "mongoose";
import type { MenuItem, TemplateType } from "../types/index.js";

export interface IMenu extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  template: TemplateType;
  categories: string[];
  items: MenuItem[];
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const menuItemSchema = new Schema<MenuItem>(
  {
    category: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const menuSchema = new Schema<IMenu>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Menu title is required"],
      trim: true,
    },
    template: {
      type: String,
      enum: ["modern", "classic", "elegant", "neobrutalism", "nature", "farm", "rimberio"],
      default: "modern",
    },
    categories: {
      type: [String],
      default: ["Makanan", "Minuman"],
    },
    items: [menuItemSchema],
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model<IMenu>("Menu", menuSchema);
