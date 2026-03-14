import { Router } from "express";
import * as VendorCtrl from "../controllers/vendor.controller";
import { protect, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { vendorSchema } from "../validators/master.validator";

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