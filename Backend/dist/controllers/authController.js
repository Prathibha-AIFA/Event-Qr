"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogin = exports.manualRegister = exports.googleLogin = void 0;
const User_1 = __importDefault(require("../models/User"));
const Tickets_1 = __importDefault(require("../models/Tickets"));
const generateQR_1 = require("../utils/generateQR");
const sendEmail_1 = require("../utils/sendEmail");
const google_auth_library_1 = require("google-auth-library");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const googleLogin = async (req, res) => {
    const { token } = req.body; // receive Google JWT token from frontend
    const origin = process.env.FRONTEND_URL || "http://localhost:5173";
    try {
        // Verify token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload?.email || !payload.name) {
            return res.status(400).json({ msg: "Invalid token" });
        }
        // Find or create user
        let user = await User_1.default.findOne({ email: payload.email });
        if (!user)
            user = await User_1.default.create({ name: payload.name, email: payload.email, googleId: payload.sub });
        // Find or create ticket for this event
        let ticketDoc = await Tickets_1.default.findOne({ userId: user._id, eventId: "tech2025" });
        let isNewTicket = false;
        if (!ticketDoc) {
            ticketDoc = new Tickets_1.default({ userId: user._id, eventId: "tech2025" });
            const ticketUrl = `${origin}/ticket/${ticketDoc._id}`;
            ticketDoc.qrCodeData = await (0, generateQR_1.generateQR)(ticketUrl);
            await ticketDoc.save();
            isNewTicket = true;
            // Send email only if ticket is new
            await (0, sendEmail_1.sendEmail)(user.email, "Your Tech Event Ticket", `<h2>Hello ${user.name}</h2>
        <p>Your ticket is ready</p>
        <img src="${ticketDoc.qrCodeData}" alt="Your Ticket QR Code" />
        <p>Or click here to view online: <a href="${ticketUrl}">${ticketUrl}</a></p>`);
        }
        // Return JSON response to frontend
        res.status(200).json({
            ticketId: ticketDoc._id,
            message: isNewTicket ? "Ticket created & sent via email" : "Existing ticket",
        });
    }
    catch (err) {
        console.error("[ERROR] Google login:", err);
        res.status(500).json({ msg: err.message || "Server error" });
    }
};
exports.googleLogin = googleLogin;
const manualRegister = async (req, res) => {
    try {
        const { name, email } = req.body;
        console.log("[DEBUG] Received manual register request:", { name, email });
        // Check if user exists
        let user = await User_1.default.findOne({ email });
        console.log("[DEBUG] Existing user check:", user);
        if (user) {
            console.log("[DEBUG] User already exists, aborting registration");
            return res.status(400).json({ msg: "User already exists" });
        }
        // Create user
        user = await User_1.default.create({ name, email });
        console.log("[DEBUG] Created new user:", user);
        // Create ticket
        const ticket = new Tickets_1.default({
            userId: user._id,
            eventId: "tech2025",
            qrCodeData: "", // placeholder if you generate later
        });
        console.log("[DEBUG] Ticket object created (before QR generation):");
        // Generate QR code
        const ticketUrl = `${req.headers.origin}/ticket/${ticket._id}`;
        console.log("[DEBUG] Ticket URL for QR:", ticketUrl);
        ticket.qrCodeData = await (0, generateQR_1.generateQR)(ticketUrl);
        console.log("[DEBUG] Generated QR code data:");
        // Save ticket
        await ticket.save();
        console.log("[DEBUG] Ticket saved successfully:");
        // Send email
        await (0, sendEmail_1.sendEmail)(user.email, "Your Tech Event Ticket", `<h2>Hello ${user.name}</h2><p>Your ticket is ready</p>
      <img src="${ticket.qrCodeData}" alt="Your Ticket QR Code" />
    <p>Or click here to view online: <a href="${ticketUrl}">${ticketUrl}</a></p>`);
        console.log("[DEBUG] Email sent successfully to:", user.email);
        // Send response
        res.status(201).json({
            ticket: {
                _id: ticket._id,
                name: user.name,
                email: user.email,
                qrCodeData: ticket.qrCodeData,
            },
            redirect: ticketUrl,
        });
        console.log("[DEBUG] Response sent successfully");
    }
    catch (err) {
        console.error("[ERROR] manualRegister error:", err);
        res.status(500).json({ msg: err.message || "Server error" });
    }
};
exports.manualRegister = manualRegister;
const adminLogin = (req, res) => {
    const { email, password } = req.body;
    // Step 1: Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ msg: "Email and password are required" });
    }
    // Step 2: Read admin data from db.json
    const dbPath = path_1.default.join(__dirname, "../db.json");
    const rawData = fs_1.default.readFileSync(dbPath, "utf-8");
    const data = JSON.parse(rawData);
    const admins = data.admins;
    // Step 3: Find matching admin
    const matchedAdmin = admins.find((admin) => admin.email === email && admin.password === password);
    // Step 4: Respond based on match
    if (matchedAdmin) {
        return res.status(200).json({
            msg: "Login successful",
            admin: {
                name: matchedAdmin.name,
                email: matchedAdmin.email,
            },
        });
    }
    else {
        return res.status(401).json({ msg: "Invalid credentials" });
    }
};
exports.adminLogin = adminLogin;
