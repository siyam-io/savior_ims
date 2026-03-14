import { Router } from "express";
import * as AuthCtrl from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { loginSchema } from "../validators/auth.validator";
import { protect } from "../middlewares/auth";

const router = Router();

router.post("/login", validate(loginSchema), AuthCtrl.login);
router.post("/logout", AuthCtrl.logout);

// Protected route
router.get("/me", protect, AuthCtrl.getMe);

export default router;