import { Router } from "express";
import * as ProductCtrl from "../controllers/product.controller";
import { protect, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { productSchema, updateProductSchema } from "../validators/product.validator";
import { upload } from "../config/cloudinary.config";
import { PERMISSIONS } from "../constants/permissions";

const router = Router();

router.use(protect); // All routes require authentication

// Product routes
router.get("/", 
  authorize(PERMISSIONS.VIEW_PRODUCTS), 
  ProductCtrl.getProducts
);

router.get("/:id", 
  authorize(PERMISSIONS.VIEW_PRODUCTS), 
  ProductCtrl.getProduct
);

router.post("/", 
  authorize(PERMISSIONS.CREATE_PRODUCT), 
  upload.single("image"), 
  validate(productSchema), 
  ProductCtrl.createProduct
);

router.put("/:id", 
  authorize(PERMISSIONS.EDIT_PRODUCT), 
  upload.single("image"), 
  validate(updateProductSchema), 
  ProductCtrl.updateProduct
);

router.delete("/:id", 
  authorize(PERMISSIONS.DELETE_PRODUCT), 
  ProductCtrl.deleteProduct
);

export default router;