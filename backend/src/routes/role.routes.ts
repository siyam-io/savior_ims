import { Router } from "express";
import * as RoleCtrl from "../controllers/role.controller";
import { protect, authorize } from "../middlewares/auth";
import { PERMISSIONS } from "../constants/permissions";

const router = Router();

router.use(protect);

router.route("/")
  .get(authorize(PERMISSIONS.VIEW_ROLES), RoleCtrl.getRoles)
  .post(authorize(PERMISSIONS.MANAGE_ROLES), RoleCtrl.createRole);

router.route("/:id")
  .get(authorize(PERMISSIONS.VIEW_ROLES), RoleCtrl.getRole)
  .put(authorize(PERMISSIONS.MANAGE_ROLES), RoleCtrl.updateRole)
  .delete(authorize(PERMISSIONS.MANAGE_ROLES), RoleCtrl.deleteRole);

export default router;