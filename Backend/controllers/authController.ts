import { Request, Response } from "express";
import User from "../models/User";
import Ticket from "../models/Tickets";
import { generateQR } from "../utils/generateQR";
import { sendEmail } from "../utils/sendEmail";
import { OAuth2Client } from "google-auth-library";
import fs from "fs";
import path from "path";

interface Admin {
  name: string;
  email: string;
  password: string;
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); 

export const googleLogin = async (req: any, res: any) => {
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
    let user = await User.findOne({ email: payload.email });
    if (!user) user = await User.create({ name: payload.name, email: payload.email, googleId: payload.sub });

    // Find or create ticket for this event
    let ticketDoc = await Ticket.findOne({ userId: user._id, eventId: "tech2025" });
    let isNewTicket = false;

    if (!ticketDoc) {
      ticketDoc = new Ticket({ userId: user._id, eventId: "tech2025" });
      const ticketUrl = `${origin}/ticket/${ticketDoc._id}`;
      ticketDoc.qrCodeData = await generateQR(ticketUrl);
      await ticketDoc.save();
      isNewTicket = true;

      // Send email only if ticket is new
      await sendEmail(
        user.email,
        "Your Tech Event Ticket",
        `<h2>Hello ${user.name}</h2>
        <p>Your ticket is ready</p>
        <img src="${ticketDoc.qrCodeData}" alt="Your Ticket QR Code" />
        <p>Or click here to view online: <a href="${ticketUrl}">${ticketUrl}</a></p>`
      );
    }

    // Return JSON response to frontend
    res.status(200).json({
      ticketId: ticketDoc._id,
      message: isNewTicket ? "Ticket created & sent via email" : "Existing ticket",
    });
  } catch (err: any) {
    console.error("[ERROR] Google login:", err);
    res.status(500).json({ msg: err.message || "Server error" });
  }
};

export const manualRegister = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    console.log("[DEBUG] Received manual register request:", { name, email });

    // Check if user exists
    let user = await User.findOne({ email });
    console.log("[DEBUG] Existing user check:", user);
    if (user) {
      console.log("[DEBUG] User already exists, aborting registration");
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create user
    user = await User.create({ name, email });
    console.log("[DEBUG] Created new user:", user);

    // Create ticket
    const ticket = new Ticket({
      userId: user._id,
      eventId: "tech2025",
      qrCodeData: "", // placeholder if you generate later
    });
    console.log("[DEBUG] Ticket object created (before QR generation):");

    // Generate QR code
    const ticketUrl = `${req.headers.origin}/ticket/${ticket._id}`;
    console.log("[DEBUG] Ticket URL for QR:", ticketUrl);
    ticket.qrCodeData = await generateQR(ticketUrl);
    console.log("[DEBUG] Generated QR code data:");

    // Save ticket
    await ticket.save();
    console.log("[DEBUG] Ticket saved successfully:");

    // Send email
    await sendEmail(
      user.email,
      "Your Tech Event Ticket",
      `<h2>Hello ${user.name}</h2><p>Your ticket is ready</p>
      <img src="${ticket.qrCodeData}" alt="Your Ticket QR Code" />
    <p>Or click here to view online: <a href="${ticketUrl}">${ticketUrl}</a></p>`
    );
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

  } catch (err: any) {
    console.error("[ERROR] manualRegister error:", err);
    res.status(500).json({ msg: err.message || "Server error" });
  }
};




export const adminLogin = (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    // ✅ Use process.cwd() so path works in production too
    const dbPath = path.join(process.cwd(), "db.json");

    if (!fs.existsSync(dbPath)) {
      console.error("db.json not found at", dbPath);
      return res.status(500).json({ msg: "Database file missing in production" });
    }

    const rawData = fs.readFileSync(dbPath, "utf-8");
    const data = JSON.parse(rawData);
    const admins = data.admins || [];

    const matchedAdmin = admins.find(
      (admin: any) => admin.email === email && admin.password === password
    );

    if (matchedAdmin) {
      return res.status(200).json({
        msg: "Login successful",
        admin: {
          name: matchedAdmin.name,
          email: matchedAdmin.email,
        },
        token: "dummyToken123", // optional
      });
    } else {
      return res.status(401).json({ msg: "Invalid credentials" });
    }
  } catch (err: any) {
    console.error("Admin login error:", err.message || err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};




