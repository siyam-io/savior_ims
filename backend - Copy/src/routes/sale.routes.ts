import { Router } from "express";
import * as SaleCtrl from "../controllers/sale.controller";
import { protect, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
// import { createSaleSchema } from "../validators/sale.validator";
import { PERMISSIONS } from "../constants/permissions";

const router = Router();
router.use(protect);

router.post("/", 
  authorize(PERMISSIONS.ADJUST_STOCK), // সেল মানেই স্টক আউট/অ্যাডজাস্ট
  // validate(createSaleSchema), 
  SaleCtrl.handleCreateSale
);

router.get("/", 
  authorize(PERMISSIONS.VIEW_INVENTORY), 
  SaleCtrl.handleGetSales
);

export default router;