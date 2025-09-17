import { Router } from "express";
import { googleAuth, googleCallback, manualRegister } from "../controllers/authController";

const router = Router();

router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);
router.post("/register", manualRegister);

export default router;
