import { Router } from "express";
import * as VendorCtrl from "../controllers/vendor.controller.ts";
import { protect, authorize } from "../middlewares/auth.ts";
import { validate } from "../middlewares/validate.ts";
import { vendorSchema } from "../validators/master.validator.ts";

const router = Router();

// Shob route Admin protected
router.use(protect, authorize(["super-admin"])); 

router.route("/")
  .post(validate(vendorSchema), VendorCtrl.createVendor)
  .get(VendorCtrl.getVendors);

router.route("/:id")
  .get(VendorCtrl.getVendor)
  .put(VendorCtrl.updateVendor)
  .delete(VendorCtrl.deleteVendor);

export default router;