import { Router } from "express";
import * as CategoryCtrl from "../controllers/category.controller";
import { protect, authorize } from "../middlewares/auth"; // removed .ts extension for cleaner imports
import { validate } from "../middlewares/validate";
import { categorySchema } from "../validators/master.validator";

const router = Router();

router.use(protect);

// --- SUB-CATEGORY ROUTES (Must be before /:id) ---
router.route("/sub")
  .post(authorize(["super-admin"]), CategoryCtrl.createSubCategory)
  .get(CategoryCtrl.getSubCategories);

router.route("/sub/:id")
  .delete(authorize(["super-admin"]), CategoryCtrl.deleteSubCategory);


// --- MAIN CATEGORY ROUTES ---
router.route("/")
  .post(authorize(["super-admin"]), validate(categorySchema), CategoryCtrl.createCategory)
  .get(CategoryCtrl.getCategories);

router.route("/:id")
  .get(CategoryCtrl.getCategory)
  .put(authorize(["super-admin"]), CategoryCtrl.updateCategory)
  .delete(authorize(["super-admin"]), CategoryCtrl.deleteCategory);

export default router;