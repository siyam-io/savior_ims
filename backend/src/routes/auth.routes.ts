import { Router } from "express";
import * as AuthCtrl from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { loginSchema } from "../validators/auth.validator";
import { protect } from "../middlewares/auth";
import { updateProfileSchema } from "../validators/profile.validator";

const router = Router();

router.post("/login", validate(loginSchema), AuthCtrl.login);
router.post("/logout", AuthCtrl.logout);

// Protected route
router.get("/me", protect, AuthCtrl.getMe);
router.put("/me", protect, validate(updateProfileSchema), AuthCtrl.updateMe);

export default router;