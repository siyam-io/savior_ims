import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Memory storage – file is kept in RAM as a buffer
const storage = multer.memoryStorage();

// Multer middleware with a 4MB limit (Vercel's hard limit is 4.5MB)
export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 }, // 4 MB
});

/**
 * Upload a file buffer directly to Cloudinary using a stream.
 * @param fileBuffer - The file buffer from multer
 * @param folder - Cloudinary folder name (e.g., 'products')
 * @returns The secure URL of the uploaded image
 */
export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Cloudinary upload failed: no result'));
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete an image from Cloudinary using its public ID.
 * The public ID can be extracted from the URL (see deleteFromUrl helper).
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  if (!publicId) return;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`🗑️ Cloudinary cleanup: ${publicId} – ${result.result}`);
  } catch (error) {
    console.error('❌ Cloudinary deletion error:', error);
    // Non‑critical – don't throw
  }
};

/**
 * Extract the Cloudinary public ID from a full image URL.
 * Example:
 *   URL: https://res.cloudinary.com/demo/image/upload/v1234/products/sample.jpg
 *   returns: 'products/sample'
 */
export const getPublicIdFromUrl = (url: string): string | null => {
  try {
    const parts = url.split('/');
    const uploadIndex = parts.findIndex((part) => part === 'upload');
    if (uploadIndex === -1 || uploadIndex + 2 >= parts.length) return null;
    // The public ID starts after '/upload/v<version>/' (version is optional)
    // We take everything after the upload segment, skipping the version if present.
    const afterUpload = parts.slice(uploadIndex + 2).join('/');
    // Remove file extension if any
    return afterUpload.replace(/\.[^/.]+$/, '');
  } catch {
    return null;
  }
};

export default cloudinary;