import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5022,
  MONGO_URI: process.env.MONGO_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'your_secret',
  
  CLOUDINARY: {
    NAME: process.env.CLOUDINARY_NAME, 
    API_KEY: process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_API_SECRET,
  },
};

console.log("🛠️ ENV Loader Checking Credentials:", {
  CloudName: ENV.CLOUDINARY.NAME ? "✅ FOUND" : "❌ MISSING",
  ApiKey: ENV.CLOUDINARY.API_KEY ? "✅ FOUND" : "❌ MISSING",
  ApiSecret: ENV.CLOUDINARY.API_SECRET ? "✅ FOUND" : "❌ MISSING",
});

export default ENV;