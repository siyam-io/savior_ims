import { Router } from "express";
import * as CatCtrl from "../controllers/category.controller";
import { protect, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { categorySchema } from "../validators/master.validator";
import { PERMISSIONS } from "../constants/permissions";

const router = Router();

router.use(protect);

// --- SUB-CATEGORY ROUTES ---
router.route("/sub")
  .post(authorize(PERMISSIONS.CREATE_CATEGORY), CatCtrl.createSubCategory)
  .get(authorize(PERMISSIONS.VIEW_CATEGORIES), CatCtrl.getSubCategories);

router.route("/sub/:id")
  .delete(authorize(PERMISSIONS.CREATE_CATEGORY), CatCtrl.deleteSubCategory);

// --- MAIN CATEGORY ROUTES ---
router.route("/")
  .get(authorize(PERMISSIONS.VIEW_CATEGORIES), CatCtrl.getCategories)
  .post(authorize(PERMISSIONS.CREATE_CATEGORY), validate(categorySchema), CatCtrl.createCategory);

router.route("/:id")
  .get(authorize(PERMISSIONS.VIEW_CATEGORIES), CatCtrl.getCategory)
  .put(authorize(PERMISSIONS.CREATE_CATEGORY), CatCtrl.updateCategory)
  .delete(authorize(PERMISSIONS.CREATE_CATEGORY), CatCtrl.deleteCategory);

export default router;