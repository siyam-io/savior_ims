import { Router } from "express";
import * as InvCtrl from "../controllers/inventory.controller";
import { validate } from "../middlewares/validate";
import { updateInventorySchema } from "../validators/inventory.validator";
import { protect, authorize } from "../middlewares/auth";
import { PERMISSIONS } from "../constants/permissions";

const router = Router();

router.use(protect);

router.get("/:vendorId", 
  authorize(PERMISSIONS.VIEW_INVENTORY), 
  InvCtrl.handleGetInventory
);

router.patch("/:productId", 
  authorize(PERMISSIONS.ADJUST_STOCK), 
  validate(updateInventorySchema), 
  InvCtrl.handleUpdateInventory
);

export default router;