import { Router } from "express";
import * as VendorCtrl from "../controllers/vendor.controller";
import { protect, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { vendorSchema } from "../validators/master.validator";
import { PERMISSIONS } from "../constants/permissions";

const router = Router();

router.use(protect);

router.route("/")
  .get(authorize(PERMISSIONS.VIEW_VENDORS), VendorCtrl.getVendors)
  .post(authorize(PERMISSIONS.CREATE_VENDOR), validate(vendorSchema), VendorCtrl.createVendor);

router.route("/:id")
  .get(authorize(PERMISSIONS.VIEW_VENDORS), VendorCtrl.getVendor)
  .put(authorize(PERMISSIONS.EDIT_VENDOR), VendorCtrl.updateVendor)
  .delete(authorize(PERMISSIONS.DELETE_VENDOR), VendorCtrl.deleteVendor);

export default router;