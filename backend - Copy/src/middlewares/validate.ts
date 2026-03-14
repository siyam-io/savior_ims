import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { deleteFromCloudinary } from "../utils/cloudinary";

export const validate = (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    req.body = parsed.body;
    return next();
  } catch (error: any) {
    // 🔥 Cleanup Logic: ভ্যালিডেশন ফেইল করলে আপলোড হওয়া ইমেজ ডিলিট করো
    if (req.file) {
      const publicId = (req.file as any).filename; // multer-storage-cloudinary filename এ public_id দেয়
      await deleteFromCloudinary(publicId);
    }

    if (error instanceof ZodError) {
      return res.status(400).json({ 
        success: false, 
        message: "Validation Failed",
        errors: error.flatten().fieldErrors 
      });
    }
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};