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
    categories: ["Makanan", "Minuman", "Cemilan", "Topping"],
    items: [
      { category: "Makanan", name: "Nasi Goreng Spesial", price: 25000 },
      { category: "Makanan", name: "Mie Goreng Jawa", price: 22000 },
      { category: "Makanan", name: "Ayam Bakar Bumbu Rujak", price: 35000 },
      { category: "Makanan", name: "Sate Ayam Madura", price: 28000 },
      { category: "Makanan", name: "Gado-Gado", price: 23000 },
      { category: "Makanan", name: "Soto Ayam Lamongan", price: 25000 },
      { category: "Makanan", name: "Rendang Daging", price: 42000 },
      { category: "Makanan", name: "Ikan Bakar Jimbaran", price: 38000 },
      { category: "Minuman", name: "Es Teh Manis", price: 5000 },
      { category: "Minuman", name: "Jus Jeruk Segar", price: 12000 },
      { category: "Minuman", name: "Es Campur", price: 15000 },
      { category: "Minuman", name: "Kopi Tubruk", price: 10000 },
      { category: "Minuman", name: "Es Kelapa Muda", price: 15000 },
      { category: "Minuman", name: "Jus Alpukat", price: 18000 },
      { category: "Cemilan", name: "Pisang Goreng Madu", price: 12000 },
      { category: "Cemilan", name: "Tahu Crispy", price: 10000 },
      { category: "Cemilan", name: "Tempe Mendoan", price: 8000 },
      { category: "Cemilan", name: "Lumpia Semarang", price: 15000 },
      { category: "Cemilan", name: "Risoles Mayo", price: 12000 },
      { category: "Cemilan", name: "Bakwan Jagung", price: 10000 },
      { category: "Topping", name: "Keju Parut", price: 5000 },
      { category: "Topping", name: "Coklat Cair", price: 5000 },
      { category: "Topping", name: "Kacang Sangrai", price: 4000 },
      { category: "Topping", name: "Susu Kental Manis", price: 3000 },
      { category: "Topping", name: "Meses Coklat", price: 3000 },
      { category: "Topping", name: "Selai Stroberi", price: 4000 },
    ],
  },
  {
    title: "Daftar Menu Istimewa",
    template: "classic",
    categories: ["Makanan", "Minuman", "Cemilan", "Topping"],
    items: [
      { category: "Makanan", name: "Tumpeng Mini", price: 55000 },
      { category: "Makanan", name: "Gurame Asam Manis", price: 45000 },
      { category: "Makanan", name: "Cumi Hitam Madura", price: 40000 },
      { category: "Makanan", name: "Ayam Goreng Lengkuas", price: 30000 },
      { category: "Makanan", name: "Pepes Ikan Mas", price: 35000 },
      { category: "Makanan", name: "Tahu Telur", price: 20000 },
      { category: "Minuman", name: "Wedang Jahe", price: 8000 },
      { category: "Minuman", name: "Bandrek", price: 10000 },
      { category: "Minuman", name: "Es Teler", price: 18000 },
      { category: "Minuman", name: "Sari Kelapa", price: 12000 },
      { category: "Minuman", name: "Lemon Tea", price: 8000 },
      { category: "Minuman", name: "Milkshake Coklat", price: 22000 },
      { category: "Cemilan", name: "Pastel Goreng", price: 10000 },
      { category: "Cemilan", name: "Martabak Telur", price: 25000 },
      { category: "Cemilan", name: "Sosis Goreng", price: 12000 },
      { category: "Cemilan", name: "Siomay Bandung", price: 15000 },
      { category: "Cemilan", name: "Batagor", price: 15000 },
      { category: "Topping", name: "Keju Mozarella", price: 7000 },
      { category: "Topping", name: "Matcha Powder", price: 6000 },
      { category: "Topping", name: "Karamel Sauce", price: 5000 },
      { category: "Topping", name: "Chip Coklat", price: 4000 },
      { category: "Topping", name: "Kacang Almond", price: 7000 },
    ],
  },
  {
    title: "Menu Spesial Malam",
    template: "elegant",
    categories: ["Makanan", "Minuman", "Cemilan", "Topping"],
    items: [
      { category: "Makanan", name: "Steak Wagyu", price: 120000 },
      { category: "Makanan", name: "Lamb Chop Rosemary", price: 95000 },
      { category: "Makanan", name: "Salmon Teriyaki", price: 85000 },
      { category: "Makanan", name: "Beef Wellington", price: 150000 },
      { category: "Makanan", name: "Pasta Aglio Olio", price: 55000 },
      { category: "Makanan", name: "Caesar Salad", price: 45000 },
      { category: "Makanan", name: "Mushroom Soup", price: 35000 },
      { category: "Minuman", name: "Red Wine", price: 75000 },
      { category: "Minuman", name: "White Wine", price: 75000 },
      { category: "Minuman", name: "Mocktail Sunrise", price: 35000 },
      { category: "Minuman", name: "Espresso", price: 20000 },
      { category: "Minuman", name: "Cappuccino", price: 25000 },
      { category: "Minuman", name: "Mojito Non-Alcohol", price: 30000 },
      { category: "Cemilan", name: "Bruschetta", price: 25000 },
      { category: "Cemilan", name: "Nachos Cheese", price: 28000 },
      { category: "Cemilan", name: "French Fries Truffle", price: 30000 },
      { category: "Cemilan", name: "Calamari Rings", price: 32000 },
      { category: "Topping", name: "Extra Cheese", price: 8000 },
      { category: "Topping", name: "Smoked Beef", price: 10000 },
      { category: "Topping", name: "Truffle Oil", price: 12000 },
      { category: "Topping", name: "Bacon Bits", price: 10000 },
      { category: "Topping", name: "Avocado Slice", price: 8000 },
    ],
  },
  {
    title: "Menu Sederhana",
    template: "modern",
    categories: ["Makanan", "Minuman", "Cemilan", "Topping"],
    items: [
      { category: "Makanan", name: "Nasi Putih", price: 5000 },
      { category: "Makanan", name: "Telur Ceplok", price: 7000 },
      { category: "Makanan", name: "Tempe Goreng", price: 5000 },
      { category: "Makanan", name: "Tahu Goreng", price: 5000 },
      { category: "Makanan", name: "Ayam Goreng", price: 15000 },
      { category: "Makanan", name: "Ikan Asin", price: 8000 },
      { category: "Makanan", name: "Sayur Asem", price: 8000 },
      { category: "Minuman", name: "Teh Hangat", price: 3000 },
      { category: "Minuman", name: "Kopi Hitam", price: 5000 },
      { category: "Minuman", name: "Air Mineral", price: 3000 },
      { category: "Minuman", name: "Susu Hangat", price: 7000 },
      { category: "Cemilan", name: "Gorengan Campur", price: 5000 },
      { category: "Cemilan", name: "Singkong Goreng", price: 5000 },
      { category: "Cemilan", name: "Ubi Goreng", price: 5000 },
      { category: "Topping", name: "Sambal", price: 2000 },
      { category: "Topping", name: "Lalapan", price: 3000 },
      { category: "Topping", name: "Krupuk", price: 2000 },
    ],
  },
  {
    title: "Menu Kafe Kita",
    template: "farm",
    categories: ["Makanan", "Minuman", "Cemilan", "Topping"],
    items: [
      { category: "Makanan", name: "Sandwich Grilled Chicken", price: 35000 },
      { category: "Makanan", name: "Wrap Beef BBQ", price: 38000 },
      { category: "Makanan", name: "Nasi Goreng Kafe", price: 30000 },
      { category: "Makanan", name: "Spaghetti Carbonara", price: 40000 },
      { category: "Makanan", name: "Club Sandwich", price: 32000 },
      { category: "Makanan", name: "Fish and Chips", price: 35000 },
      { category: "Minuman", name: "Iced Latte", price: 25000 },
      { category: "Minuman", name: "Matcha Latte", price: 28000 },
      { category: "Minuman", name: "Cold Brew", price: 22000 },
      { category: "Minuman", name: "Smoothie Bowl", price: 30000 },
      { category: "Minuman", name: "Hot Chocolate", price: 25000 },
      { category: "Minuman", name: "Thai Tea", price: 20000 },
      { category: "Cemilan", name: "Banana Bread", price: 18000 },
      { category: "Cemilan", name: "Croissant", price: 15000 },
      { category: "Cemilan", name: "Cheesecake", price: 25000 },
      { category: "Cemilan", name: "Cookie Trio", price: 12000 },
      { category: "Cemilan", name: "Brownies Fudge", price: 20000 },
      { category: "Cemilan", name: "Muffin Blueberry", price: 15000 },
      { category: "Topping", name: "Whipped Cream", price: 5000 },
      { category: "Topping", name: "Sirup Karamel", price: 5000 },
      { category: "Topping", name: "Biji Chia", price: 6000 },
      { category: "Topping", name: "Granola Crunch", price: 6000 },
      { category: "Topping", name: "Dark Chips", price: 5000 },
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

    console.log(`\nSeed complete! Created ${menuData.length} menus.`);
    console.log("Login with: demo@menugenerator.com / demo123");
  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
