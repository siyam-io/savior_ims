import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/User"
import ENV from "../constants/env.config";

const seedAdmin = async () => {
  try {
    console.log("⏳ Connecting to database...");
    await mongoose.connect(ENV.MONGO_URI);

    const superAdminRoleId = "69b4500bad944c55b3cb8762"; // আপনার দেওয়া Super Admin ID
    const adminEmail = "a@v.com"; // আপনার পছন্দের ইমেইল

    // চেক করা হচ্ছে অ্যাডমিন অলরেডি আছে কি না
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`⚠️  Admin with email ${adminEmail} already exists!`);
      process.exit(0);
    }

    // পাসওয়ার্ড হ্যাশ করা (bcryptjs ব্যবহার করে)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);

    // ইউজার তৈরি করা
    const newAdmin = await User.create({
      name: "Master Admin",
      email: adminEmail,
      password: hashedPassword,
      role: superAdminRoleId,
      vendors: [], // সুপার অ্যাডমিনের জন্য গ্লোবাল এক্সেস
      status: "active",
    });

    console.log("\n🎉 Super Admin Account Created Successfully!");
    console.log("========================================");
    console.log(`📧 Email: ${newAdmin.email}`);
    console.log(`🔑 Password: admin123456`);
    console.log(`🆔 User ID: ${newAdmin._id}`);
    console.log("========================================");
    console.log("You can now log in via the /api/auth/login endpoint.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedAdmin();