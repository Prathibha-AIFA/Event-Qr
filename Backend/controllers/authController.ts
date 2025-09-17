import { Request, Response } from "express";
import User from "../models/User";
import Ticket from "../models/Tickets";
import { generateQR } from "../utils/generateQR";
import { sendEmail } from "../utils/sendEmail";
import { oauth2Client } from "../config/google";
import { google } from "googleapis";

export const googleAuth = (req: Request, res: Response) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
    prompt: "consent",
  });
  res.redirect(url);
};

export const googleCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const origin = process.env.FRONTEND_URL || "http://localhost:5173";

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    const { email, name, id: googleId } = userInfo.data;

    if (!email || !name) return res.status(400).send("Failed to get user info");

    let user = await User.findOne({ email });
    if (!user) user = await User.create({ name, email, googleId });

    const ticket = new Ticket({ userId: user._id, eventId: "tech2025" });
    const ticketUrl = `${origin}/ticket/${ticket._id}`;
    ticket.qrCodeData = await generateQR(ticketUrl);
    await ticket.save();

    await sendEmail(
      user.email,
      "Your Tech Event Ticket",
      `<h2>Hello ${user.name}</h2><p>Your ticket is ready</p>`
    );

    res.send(`
      <script>
        window.opener.postMessage(
          { success: true, ticketId: "${ticket._id}" },
          "${origin}"
        );
        window.close();
      </script>
    `);
  } catch (err) {
    console.error("[ERROR] Google OAuth callback error:", err);
    res.send(`
      <script>
        window.opener.postMessage(
          { success: false, msg: "Authentication failed" },
          "${origin}"
        );
        window.close();
      </script>
    `);
  }
};

export const manualRegister = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const origin = (req.query.origin as string) || process.env.FRONTEND_URL;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = await User.create({ name, email, googleId: "manual-registration" });

    const ticket = new Ticket({ userId: user._id, eventId: "tech2025" });
    const ticketUrl = `${origin}/ticket/${ticket._id}`;
    ticket.qrCodeData = await generateQR(ticketUrl);
    await ticket.save();

    await sendEmail(
      user.email,
      "Your Tech Event Ticket",
      `<h2>Hello ${user.name}</h2><p>Your ticket is ready</p>`
    );

    res.status(201).json({
      ticket: { _id: ticket._id, name: user.name, email: user.email },
      redirect: ticketUrl,
    });
  } catch (err) {
    console.error("[ERROR] Manual registration error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
