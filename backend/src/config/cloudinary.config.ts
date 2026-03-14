import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { ENV } from '../constants/env.config';

cloudinary.config({
  cloud_name: ENV.CLOUDINARY.NAME,
  api_key: ENV.CLOUDINARY.API_KEY,
  api_secret: ENV.CLOUDINARY.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'products',
      allowed_formats: ['jpg', 'png', 'webp', 'jpeg'],
      public_id: `prod-${Date.now()}`,
    };
  },
});

export const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 } // 5MB
});

export default cloudinary;