import { Router } from "express";
import * as SizeCtrl from "../controllers/size.controller";
import { protect, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { sizeSchema } from "../validators/master.validator";
import { PERMISSIONS } from "../constants/permissions";

const router = Router();

router.use(protect);

router.route("/")
  .get(authorize(PERMISSIONS.VIEW_SIZES), SizeCtrl.getSizes)
  .post(authorize(PERMISSIONS.CREATE_SIZE), validate(sizeSchema), SizeCtrl.createSize);

router.route("/:id")
  .get(authorize(PERMISSIONS.VIEW_SIZES), SizeCtrl.getSize)
  .put(authorize(PERMISSIONS.CREATE_SIZE), SizeCtrl.updateSize)
  .delete(authorize(PERMISSIONS.CREATE_SIZE), SizeCtrl.deleteSize);

export default router;