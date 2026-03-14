import { Router } from "express";
import * as RoleCtrl from "../controllers/role.controller";
import { protect, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { roleSchema } from "../validators/role.validator";

const router = Router();

// Shudhu Super Admin role change korte parbe
router.use(protect, authorize(["super-admin"]));

router.route("/")
  .post(validate(roleSchema), RoleCtrl.createRole)
  .get(RoleCtrl.getRoles);

router.route("/:id")
  .get(RoleCtrl.getRole)
  .put(validate(roleSchema), RoleCtrl.updateRole)
  .delete(RoleCtrl.deleteRole);

export default router;