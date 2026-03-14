import { Router } from "express";
import * as DashboardCtrl from "../controllers/dashboard.controller";
import { protect, authorize } from "../middlewares/auth";
import { PERMISSIONS } from "../constants/permissions";

const router = Router();

router.use(protect); // All dashboard routes require authentication

// Main dashboard stats
router.get("/stats", 
  authorize(PERMISSIONS.VIEW_DASHBOARD), 
  DashboardCtrl.getDashboardStats
);

// Best selling products
router.get("/best-selling", 
  authorize(PERMISSIONS.VIEW_DASHBOARD), 
  DashboardCtrl.getBestSellingProducts
);

// Worst selling products
router.get("/worst-selling", 
  authorize(PERMISSIONS.VIEW_DASHBOARD), 
  DashboardCtrl.getWorstSellingProducts
);

// Stock analysis (best-stock, low-stock, no-stock)
router.get("/stock-analysis", 
  authorize(PERMISSIONS.VIEW_DASHBOARD), 
  DashboardCtrl.getStockAnalysis
);

// Sales trend data
router.get("/sales-trend", 
  authorize(PERMISSIONS.VIEW_DASHBOARD), 
  DashboardCtrl.getSalesTrend
);

// Category distribution
router.get("/category-distribution", 
  authorize(PERMISSIONS.VIEW_DASHBOARD), 
  DashboardCtrl.getCategoryDistribution
);

export default router;
