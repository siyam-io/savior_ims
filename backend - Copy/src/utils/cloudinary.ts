import cloudinary from '../config/cloudinary.config';

/**
 * ক্লাউডিনারি থেকে ইমেজ ডিলিট করার ফাংশন
 * @param publicId ক্লাউডিনারি ইমেজ আইডি (filename ফিল্ড থেকে পাওয়া যায়)
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;
    
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`🗑️ Cloudinary Cleanup: ${publicId} - Status: ${result.result}`);
    return result;
  } catch (error) {
    console.error("❌ Cloudinary Delete Failed:", error);
    // আমরা এরর থ্রো করছি না যাতে মেইন অপারেশন পুরোপুরি ক্রাশ না করে
  }
};