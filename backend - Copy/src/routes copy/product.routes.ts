import { Router } from "express";
import * as ProductCtrl from "../controllers/product.controller";
import { protect, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { productSchema, updateProductSchema } from "../validators/product.validator";
import { upload } from "../config/cloudinary.config";

const router = Router();

router.use(protect); 

router.get("/", ProductCtrl.getProducts);
router.get("/:id", ProductCtrl.getProduct);

// upload.single("image") -> ফ্রন্টএন্ডের data.append('image', ...) এর সাথে ম্যাচ হতে হবে
router.post("/", protect, upload.single("image"), validate(productSchema), ProductCtrl.createProduct);

router.put(
  "/:id", 
  authorize(["super-admin", "vendor-admin", "staff"]), 
  upload.single("image"), 
  validate(updateProductSchema), 
  ProductCtrl.updateProduct
);

router.delete(
  "/:id", 
  authorize(["super-admin"]),
  ProductCtrl.deleteProduct
);

export default router;