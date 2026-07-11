import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "./models/User.js";
import Menu from "./models/Menu.js";

const img = (seed: string) =>
  `https://picsum.photos/seed/${seed}/200/200`;

const menuData = {
  title: "Menu Rumah Makan Sedap",
  template: "modern" as const,
  categories: ["Makanan", "Minuman", "Cemilan", "Topping"],
  items: [
    // Makanan
    { category: "Makanan", name: "Nasi Goreng Kampung", price: 28000, image: img("nasi-goreng-kampung") },
    { category: "Makanan", name: "Mie Goreng Seafood", price: 32000, image: img("mie-goreng-seafood") },
    { category: "Makanan", name: "Ayam Bakar Taliwang", price: 35000, image: img("ayam-bakar-taliwang") },
    { category: "Makanan", name: "Sate Lilit Bali", price: 30000, image: img("sate-lilit-bali") },
    { category: "Makanan", name: "Ikan Gurame Goreng", price: 45000, image: img("ikan-gurame-goreng") },
    { category: "Makanan", name: "Sop Buntut", price: 50000, image: img("sop-buntut") },
    { category: "Makanan", name: "Cah Kangkung", price: 18000, image: img("cah-kangkung") },
    { category: "Makanan", name: "Tahu Telur", price: 22000, image: img("tahu-telur") },
    // Minuman
    { category: "Minuman", name: "Es Teh Manis", price: 5000, image: img("es-teh-manis") },
    { category: "Minuman", name: "Jus Alpukat", price: 18000, image: img("jus-alpukat") },
    { category: "Minuman", name: "Es Campur", price: 15000, image: img("es-campur") },
    { category: "Minuman", name: "Kopi Susu Kekinian", price: 25000, image: img("kopo-susu-kekinian") },
    { category: "Minuman", name: "Teh Tarik", price: 12000, image: img("teh-tarik") },
    { category: "Minuman", name: "Jus Mangga", price: 15000, image: img("jus-mangga") },
    // Cemilan
    { category: "Cemilan", name: "Pisang Goreng Keju", price: 15000, image: img("pisang-goreng-keju") },
    { category: "Cemilan", name: "Tahu Crispy", price: 12000, image: img("tahu-crispy") },
    { category: "Cemilan", name: "Singkong Balado", price: 12000, image: img("singkong-balado") },
    { category: "Cemilan", name: "Lumpia Isi Udang", price: 18000, image: img("lumpia-udang") },
    { category: "Cemilan", name: "Batagor", price: 15000, image: img("batagor") },
    { category: "Cemilan", name: "Risol Mayo", price: 12000, image: img("risol-mayo") },
    // Topping
    { category: "Topping", name: "Keju Parut", price: 5000, image: img("keju-parut") },
    { category: "Topping", name: "Coklat Cair", price: 5000, image: img("coklat-cair") },
    { category: "Topping", name: "Kacang Mete", price: 7000, image: img("kacang-mete") },
    { category: "Topping", name: "Kayu Manis", price: 4000, image: img("kayu-manis") },
    { category: "Topping", name: "Meses Pelangi", price: 3000, image: img("meses-pelangi") },
    { category: "Topping", name: "Nata de Coco", price: 4000, image: img("nata-de-coco") },
  ],
};

const seed = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/menu-generator";

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    let existingUser = await User.findOne({ email: "demo@menugenerator.com" });
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
    console.log("Cleared existing menus");

    const menu = await Menu.create({ ...menuData, userId });
    console.log(`Created menu: "${menu.title}" with ${menu.items.length} items`);

    const withImages = menu.items.filter((i) => i.image).length;
    console.log(`Items with images: ${withImages}/${menu.items.length}`);

    console.log("\nSeed complete! Login: demo@menugenerator.com / demo123");
  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
