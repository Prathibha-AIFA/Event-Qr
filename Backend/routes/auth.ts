import { Router } from "express";
import {  adminLogin, manualRegister, googleLogin } from "../controllers/authController";

const router = Router();

router.post("/google-login", googleLogin);

router.post("/register", manualRegister);
router.post("/adminlogin", adminLogin);

export default router;
