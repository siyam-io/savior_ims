import { Router } from "express";
import * as UserCtrl from "../controllers/user.controller";
import { protect, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { registerSchema } from "../validators/auth.validator"; // অ্যাডমিন একই স্কিমা ইউজ করবে
import { updateUserSchema } from "../validators/user.validator";

const router = Router();

// সব ইউজার রুট এখন প্রোটেক্টেড
router.use(protect, authorize(["super-admin", "vendor-admin"]));

router.route("/")
  .get(UserCtrl.getUsers)
  .post(validate(registerSchema), UserCtrl.createUser); // শুধুমাত্র অ্যাডমিন ইউজার অ্যাড করবে

router.route("/:id")
  .get(UserCtrl.getUser)
  .put(validate(updateUserSchema), UserCtrl.updateUser)
  .delete(authorize(["super-admin"]), UserCtrl.deleteUser); 

export default router;