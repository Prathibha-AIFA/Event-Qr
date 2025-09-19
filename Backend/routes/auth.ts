import { Router } from "express";
import {  adminLogin, manualRegister, googleLogin } from "../controllers/authController";

const router = Router();

router.post("/google-login", (req, res) => {
  console.log("Google login route hit!");
  res.json({ msg: "ok" });
});

router.post("/register", manualRegister);
router.post("/adminlogin", adminLogin);

export default router;
