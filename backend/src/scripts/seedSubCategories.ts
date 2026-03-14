import mongoose from "mongoose";
import { SubCategory } from "../models/Category.ts"; //
import { ENV } from "../constants/env.config.ts"; //

const subCategoriesToSeed = [
  // 👕 SHIRTS (Parent: 69b45153ca7b72867d014807)
  { name: "Half Shirt", parentCategory: "69b45153ca7b72867d014807" },
  { name: "Drop Shoulder Cuban shirt", parentCategory: "69b45153ca7b72867d014807" },
  { name: "Eid Collection Cuban Collar Half Sleeve", parentCategory: "69b45153ca7b72867d014807" },
  { name: "Polo Shirt 85", parentCategory: "69b45153ca7b72867d014807" },
  { name: "Half Sleeve", parentCategory: "69b45153ca7b72867d014807" },
  { name: "Pocket Less Full Sleeve Shirt", parentCategory: "69b45153ca7b72867d014807" },
  { name: "Half Sleeve Shirt 0223", parentCategory: "69b45153ca7b72867d014807" },
  { name: "OLD MONEY 238", parentCategory: "69b45153ca7b72867d014807" },
  { name: "Full Sleeve 204", parentCategory: "69b45153ca7b72867d014807" },
  { name: "Half Sleeve (#270)", parentCategory: "69b45153ca7b72867d014807" },
  { name: "Embroidery Shirt (#0140)", parentCategory: "69b45153ca7b72867d014807" },
  { name: "Pocket Less Check Shirt (#0353)", parentCategory: "69b45153ca7b72867d014807" },
  { name: "Print Shirt (Royal Fancy Silk)", parentCategory: "69b45153ca7b72867d014807" },
  { name: "SOLID Color Shirts", parentCategory: "69b45153ca7b72867d014807" },
  { name: "Eid Collection 01", parentCategory: "69b45153ca7b72867d014807" },
  { name: "Print Shirt", parentCategory: "69b45153ca7b72867d014807" },
  { name: "Luxury Shirts", parentCategory: "69b45153ca7b72867d014807" },
  { name: "Shacket", parentCategory: "69b45153ca7b72867d014807" },
  { name: "Sweatshirt", parentCategory: "69b45153ca7b72867d014807" },
  { name: "Sweater", parentCategory: "69b45153ca7b72867d014807" },
  { name: "T-shirts", parentCategory: "69b45153ca7b72867d014807" },
  { name: "Full Sleeve Print Shirt", parentCategory: "69b45153ca7b72867d014807" },
  { name: "Full Sleeve Designed Fabric Shirt", parentCategory: "69b45153ca7b72867d014807" },
  { name: "Cuban Collar Shirt", parentCategory: "69b45153ca7b72867d014807" },
  { name: "Pocketless Full Sleeve Check Shirt", parentCategory: "69b45153ca7b72867d014807" },

  // 👖 PANTS (Parent: 69b45153ca7b72867d014808)
  { name: "Denim 6 Pocket Baggy Pant", parentCategory: "69b45153ca7b72867d014808" },
  { name: "6 Pocket Baggy Pants", parentCategory: "69b45153ca7b72867d014808" },
  { name: "6 Pocket Cargo Joggers", parentCategory: "69b45153ca7b72867d014808" },
  { name: "6 Pocket Mobile Pant", parentCategory: "69b45153ca7b72867d014808" },
  { name: "Pants & Joggers", parentCategory: "69b45153ca7b72867d014808" },

  // 🕌 PANJABI (Parent: 69b45153ca7b72867d014809)
  { name: "Panjabi", parentCategory: "69b45153ca7b72867d014809" },

  // ⭐ VELOR (Parent: 69b45153ca7b72867d01480a)
  { name: "VELOR Eid Collection", parentCategory: "69b45153ca7b72867d01480a" },
  { name: "VELOR Shirts", parentCategory: "69b45153ca7b72867d01480a" },

  // 🧥 HOODIE (Parent: 69b45153ca7b72867d01480b)
  { name: "Hoodie", parentCategory: "69b45153ca7b72867d01480b" },

  // 🧥 JACKET (Parent: 69b45153ca7b72867d01480c)
  { name: "Shacket/Jacket", parentCategory: "69b45153ca7b72867d01480c" },

  // 🧶 SWEATER (Parent: 69b45153ca7b72867d01480d)
  { name: "Knit Sweater", parentCategory: "69b45153ca7b72867d01480d" },

  // 👕 T-SHIRT (Parent: 69b45153ca7b72867d01480e)
  { name: "Half Sleeve T-Shirt", parentCategory: "69b45153ca7b72867d01480e" },
  { name: "Full Sleeve T-shirt", parentCategory: "69b45153ca7b72867d01480e" }
];

const seedSubCategories = async () => {
  try {
    console.log("⏳ Connecting to database...");
    await mongoose.connect(ENV.MONGO_URI); //
    console.log("✅ Connected to MongoDB");

    console.log("🌱 Seeding Sub-Categories...");
    for (const subCat of subCategoriesToSeed) {
      await SubCategory.findOneAndUpdate(
        { name: subCat.name, parentCategory: subCat.parentCategory },
        { $set: subCat },
        { upsert: true, new: true }
      );
    }

    console.log(`\n🎉 Success! All Sub-Categories seeded for database: savior_ims`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedSubCategories();