import mongoose from "mongoose";
import { Role } from "../models/Role"; //
import { PERMISSIONS } from "../constants/permissions"; //
import ENV from "../constants/env.config";

// dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const rolesToSeed = [
  {
    name: "super-admin",
    isActive: true,
    permissions: ["*"],
  },
  {
    name: "vendor-admin",
    isActive: true,
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_PRODUCTS,
      PERMISSIONS.CREATE_PRODUCT,
      PERMISSIONS.EDIT_PRODUCT,
      PERMISSIONS.VIEW_INVENTORY,
      PERMISSIONS.ADJUST_STOCK,
      PERMISSIONS.VIEW_CATEGORIES,
      PERMISSIONS.VIEW_SIZES,
      PERMISSIONS.VIEW_USERS,
      PERMISSIONS.CREATE_USER,
      PERMISSIONS.EDIT_USER,
    ],
  },
  {
    name: "staff",
    isActive: true,
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_PRODUCTS,
      PERMISSIONS.VIEW_INVENTORY,
      PERMISSIONS.ADJUST_STOCK,
      PERMISSIONS.VIEW_CATEGORIES,
      PERMISSIONS.VIEW_SIZES,
    ],
  },
];

const seedRoles = async () => {
  try {
    const mongoUri = ENV.MONGO_URI;
    
    console.log("⏳ Connecting to database...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    for (const roleData of rolesToSeed) {
      // চেক করা হচ্ছে রোলটি অলরেডি আছে কি না
      const existingRole = await Role.findOne({ name: roleData.name });

      if (existingRole) {
        // যদি থাকে তবে আপডেট করা হবে
        existingRole.permissions = roleData.permissions;
        await existingRole.save();
        console.log(`♻️  Role '${roleData.name}' updated with latest permissions.`);
      } else {
        // না থাকলে নতুন তৈরি হবে
        const newRole = await Role.create(roleData);
        console.log(`✨ Role '${roleData.name}' created. ID: ${newRole._id}`);
      }
    }

    console.log("\n🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedRoles();