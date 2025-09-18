"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const adminController_2 = require("../controllers/adminController");
const router = express_1.default.Router();
router.get("/dashboard", adminController_1.getDashboardCounts);
router.get("/users", adminController_2.getAllUsers);
// Get users with resend email button / send email
router.get("/resend", adminController_2.getAllUsers); // reuse getAllUsers for table display
router.post("/resend/:userId", adminController_2.resendEmailToUser);
exports.default = router;
