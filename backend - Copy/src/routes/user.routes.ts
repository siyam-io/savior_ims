import { Router } from "express";
import * as UserCtrl from "../controllers/user.controller";
import { protect, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { registerSchema } from "../validators/auth.validator";
import { updateUserSchema } from "../validators/user.validator";
import { PERMISSIONS } from "../constants/permissions";

const router = Router();

router.use(protect);

router.route("/")
  .get(authorize(PERMISSIONS.VIEW_USERS), UserCtrl.getUsers)
  .post(authorize(PERMISSIONS.CREATE_USER), validate(registerSchema), UserCtrl.createUser);

router.route("/:id")
  .get(authorize(PERMISSIONS.VIEW_USERS), UserCtrl.getUser)
  .put(authorize(PERMISSIONS.EDIT_USER), validate(updateUserSchema), UserCtrl.updateUser)
  .delete(authorize(PERMISSIONS.DELETE_USER), UserCtrl.deleteUser); 

export default router;