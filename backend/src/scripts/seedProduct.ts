import mongoose from "mongoose";
import { Product } from "../models/Product.ts"; //
import { ENV } from "../constants/env.config.ts"; //
import { productsToSeed } from "../utils/prodcutdata.js";



const seedProducts = async () => {
  try {
    console.log("⏳ Connecting to database...");
    await mongoose.connect(ENV.MONGO_URI); //
    console.log("✅ Connected to MongoDB");

    console.log("🌱 Seeding Products...");
  
    for (const data of productsToSeed) {
      const product = new Product(data);
      await product.save();
    }

    console.log(`\n🎉 Success! ${productsToSeed.length} Products seeded successfully.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedProducts();