import dotenv from 'dotenv';
import path from 'path';

// .env ফাইল লোড করার জন্য path একদম নির্দিষ্ট করে দিন
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const ENV = {
  PORT: process.env.PORT || 5022,
  MONGO_URI: process.env.MONGO_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'your_secret',
  
  CLOUDINARY: {
    NAME: process.env.CLOUDINARY_NAME, // .env এর নামের সাথে চেক করুন
    API_KEY: process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_API_SECRET,
  },
};

// ডিবাগ করার জন্য একবার চেক করুন (কনসোলে ভ্যালু আসছে কি না)
console.log("🛠️ ENV Loader Checking Credentials:", {
  CloudName: ENV.CLOUDINARY.NAME ? "✅ FOUND" : "❌ MISSING",
  ApiKey: ENV.CLOUDINARY.API_KEY ? "✅ FOUND" : "❌ MISSING",
  ApiSecret: ENV.CLOUDINARY.API_SECRET ? "✅ FOUND" : "❌ MISSING",
});

export default ENV;