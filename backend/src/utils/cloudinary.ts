import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

// Load environment variables (ensure dotenv is called in main file)
// For safety, we'll check again here
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ Cloudinary environment variables are missing!');
  console.error('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅' : '❌');
  console.error('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅' : '❌');
  console.error('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅' : '❌');
  throw new Error('Cloudinary configuration incomplete');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Optional: test the config (remove in production)
cloudinary.api.ping()
  .then(() => console.log('✅ Cloudinary connection successful'))
  .catch(err => console.error('❌ Cloudinary ping failed:', err));

// Memory storage
const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 }, // 4 MB
});

/**
 * Upload a buffer to Cloudinary using base64 data URI (avoids stream signature issues)
 */
export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const base64 = fileBuffer.toString('base64');
    // Determine MIME type from buffer (default to jpeg)
    const mime = fileBuffer[0] === 0xff && fileBuffer[1] === 0xd8 ? 'image/jpeg' :
                 fileBuffer[0] === 0x89 && fileBuffer[1] === 0x50 ? 'image/png' :
                 fileBuffer[0] === 0x52 && fileBuffer[1] === 0x49 ? 'image/webp' : 'image/jpeg';
    
    cloudinary.uploader.upload(
      `data:${mime};base64,${base64}`,
      { folder },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Cloudinary upload failed: no result'));
        resolve(result.secure_url);
      }
    );
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  if (!publicId) return;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`🗑️ Cloudinary cleanup: ${publicId} – ${result.result}`);
  } catch (error) {
    console.error('❌ Cloudinary deletion error:', error);
  }
};

export const getPublicIdFromUrl = (url: string): string | null => {
  try {
    const parts = url.split('/');
    const uploadIndex = parts.findIndex((part) => part === 'upload');
    if (uploadIndex === -1 || uploadIndex + 2 >= parts.length) return null;
    const afterUpload = parts.slice(uploadIndex + 2).join('/');
    return afterUpload.replace(/\.[^/.]+$/, '');
  } catch {
    return null;
  }
};

export default cloudinary;