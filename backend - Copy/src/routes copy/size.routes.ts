import { Router } from "express";
import * as SizeCtrl from "../controllers/size.controller";
import { protect, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { sizeSchema } from "../validators/master.validator";

const router = Router();

router.use(protect);

router.post("/", authorize(["super-admin"]), validate(sizeSchema), SizeCtrl.createSize);
router.get("/", SizeCtrl.getSizes);

router.route("/:id")
  .get(SizeCtrl.getSize)
  .put(authorize(["super-admin"]), SizeCtrl.updateSize)
  .delete(authorize(["super-admin"]), SizeCtrl.deleteSize);

export default router;