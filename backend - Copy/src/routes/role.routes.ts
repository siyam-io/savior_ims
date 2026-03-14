import { Router } from "express";
import * as RoleCtrl from "../controllers/role.controller";
import { protect, authorize } from "../middlewares/auth";
import { PERMISSIONS } from "../constants/permissions";

const router = Router();

router.use(protect);

router.route("/")
  .get(authorize(PERMISSIONS.VIEW_ROLES), RoleCtrl.getRoles)
  .post(authorize(PERMISSIONS.CREATE_ROLE), RoleCtrl.createRole);

router.route("/:id")
  .put(authorize(PERMISSIONS.EDIT_ROLE), RoleCtrl.updateRole)
  .delete(authorize(PERMISSIONS.DELETE_ROLE), RoleCtrl.deleteRole);

export default router;