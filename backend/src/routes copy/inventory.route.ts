import { Router } from "express";
import { handleCreateProduct, handleGetInventory, handleUpdateInventory } from "../controllers/inventory.controller";
import { validate } from "../middlewares/validate";
import { productSchema } from "../validators/product.validator";
import { updateInventorySchema } from "../validators/inventory.validator";
import { protect, authorize } from "../middlewares/auth";

const router = Router();

router.post("/", protect, validate(productSchema), handleCreateProduct);
router.get("/:vendorId", protect, handleGetInventory);
router.patch("/:productId", protect, authorize(["super-admin"]), validate(updateInventorySchema), handleUpdateInventory);

export default router;