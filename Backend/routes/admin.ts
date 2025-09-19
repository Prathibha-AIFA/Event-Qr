
import express from "express";
import {getDashboardCounts } from "../controllers/adminController";
import { getAllUsers, resendEmailToUser } from "../controllers/adminController";
import { scanTicket } from "../controllers/scanController";
const router = express.Router();

router.get("/dashboard", getDashboardCounts);
router.get("/users", getAllUsers);

// Get users with resend email button / send email
router.get("/resend", getAllUsers); // reuse getAllUsers for table display
router.post("/resend/:userId", resendEmailToUser);
router.post("/scan", scanTicket);


export default router;
