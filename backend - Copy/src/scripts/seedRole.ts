import mongoose from "mongoose";
import "dotenv/config";
import { Role } from "../models/Role.ts"; // Import path might need adjustment based on exact location

const seedInitialRole = async () => {
  try {
    const mongoUri = 'mongodb://localhost:27017/savior_ims?replicaSet=rs0';
    if (!mongoUri) {
      throw new Error("FATAL: MONGO_URI is not defined in .env");
    }

    console.log("⏳ Connecting to database...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // Check if the super-admin role already exists
    const existingRole = await Role.findOne({ name: "super-admin" });
    if (existingRole) {
      console.log(`⚠️ 'super-admin' role already exists!`);
      console.log(`👉 COPY THIS ID FOR REGISTRATION: ${existingRole._id}`);
      process.exit(0);
    }

    // Create the master role
    const superAdminRole = await Role.create({
      name: "super-admin",
      permissions: ["*"], // giving wildcard permission
      isActive: true
    });

    console.log("🎉 Success! Initial Role seeded.");
    console.log("========================================");
    console.log(`👉 COPY THIS EXACT ID: ${superAdminRole._id}`);
    console.log("========================================");
    console.log("Use this ID in the frontend Register form.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  }
};

seedInitialRole();