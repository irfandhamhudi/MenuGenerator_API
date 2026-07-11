import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Menu from "./models/Menu.js";
import type { MenuItem, TemplateType } from "./types/index.js";

const menuData: {
  title: string;
  template: TemplateType;
  categories: string[];
  items: MenuItem[];
}[] = [
  {
    title: "Menu Warung Kita",
    template: "modern",
    categories: ["Makanan", "Minuman"],
    items: [
      { category: "Makanan", name: "Nasi Goreng", price: 25000 },
      { category: "Makanan", name: "Ayam Bakar", price: 35000 },
      { category: "Makanan", name: "Soto Ayam", price: 25000 },
      { category: "Minuman", name: "Es Teh Manis", price: 5000 },
      { category: "Minuman", name: "Jus Jeruk", price: 12000 },
    ],
  },
  {
    title: "Kopi Senja",
    template: "bistro",
    categories: ["Kopi", "Non-Kopi", "Cemilan"],
    items: [
      { category: "Kopi", name: "Espresso", price: 20000 },
      { category: "Kopi", name: "Cappuccino", price: 28000 },
      { category: "Non-Kopi", name: "Matcha Latte", price: 30000 },
      { category: "Non-Kopi", name: "Chocolate", price: 25000 },
      { category: "Cemilan", name: "Banana Bread", price: 18000 },
    ],
  },
  {
    title: "Makan Siang",
    template: "minimal",
    categories: ["Paket", "Minuman"],
    items: [
      { category: "Paket", name: "Paket Ayam + Nasi", price: 20000 },
      { category: "Paket", name: "Paket Ikan + Nasi", price: 22000 },
      { category: "Paket", name: "Paket Tahu Tempe", price: 12000 },
      { category: "Minuman", name: "Air Mineral", price: 3000 },
      { category: "Minuman", name: "Teh Hangat", price: 3000 },
    ],
  },
];

const seed = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/menu-generator";

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    const existingUser = await User.findOne({ email: "demo@menugenerator.com" });
    let userId: string;

    if (existingUser) {
      userId = existingUser._id.toString();
      console.log("Using existing demo user:", existingUser.email);
    } else {
      const user = await User.create({
        username: "Demo Owner",
        email: "demo@menugenerator.com",
        password: "demo123",
      });
      userId = user._id.toString();
      console.log("Created demo user: demo@menugenerator.com / demo123");
    }

    await Menu.deleteMany({ userId });
    console.log("Cleared existing seed menus");

    for (const menu of menuData) {
      await Menu.create({ ...menu, userId });
      console.log(`Created menu: ${menu.title} (${menu.template})`);
    }

    console.log(`\nSeed complete! Created ${menuData.length} menus with fewer items.`);
    console.log("Login with: demo@menugenerator.com / demo123");
  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
