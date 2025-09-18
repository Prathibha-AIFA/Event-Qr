"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.post("/google-login", authController_1.googleLogin);
router.post("/register", authController_1.manualRegister);
router.post("/adminlogin", authController_1.adminLogin);
exports.default = router;
