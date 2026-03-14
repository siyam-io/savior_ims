import { Router } from "express";
import * as InvCtrl from "../controllers/inventory.controller";
import { validate } from "../middlewares/validate";
import { updateInventorySchema } from "../validators/inventory.validator";
import { protect, authorize } from "../middlewares/auth";
import { PERMISSIONS } from "../constants/permissions";

const router = Router();

router.use(protect); // All routes require authentication

// Get inventory for a specific vendor
router.get("/vendor/:vendorId", 
  authorize(PERMISSIONS.VIEW_INVENTORY), 
  InvCtrl.handleGetInventory
);

// Update inventory for a product
router.patch("/product/:productId", 
  authorize(PERMISSIONS.ADJUST_STOCK), 
  validate(updateInventorySchema), 
  InvCtrl.handleUpdateInventory
);

// Get inventory logs (optional route)
router.get("/logs", 
  authorize(PERMISSIONS.VIEW_INVENTORY), 
  InvCtrl.handleGetInventoryLogs
);

export default router;