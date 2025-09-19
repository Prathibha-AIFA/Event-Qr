// src/controllers/dashboardController.ts
import { Request, Response } from "express";
import User from "../models/User";
import Ticket from "../models/Tickets";
import { sendEmail } from "../utils/sendEmail";

// ✅ Dashboard counts including scanned tickets
export const getDashboardCounts = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTickets = await Ticket.countDocuments();
    const totalScans = await Ticket.countDocuments({ scanned: true }); // NEW

    res.json({ totalUsers, totalTickets, totalScans });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to fetch dashboard counts", error: err });
  }
};

// ✅ Fetch all users with their tickets + QR data
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().lean();

    // Fetch tickets for each user
    const usersWithTickets = await Promise.all(
      users.map(async (user) => {
        const ticket = await Ticket.findOne({ userId: user._id });
        return {
          ...user,
          ticketUrl: ticket ? `/ticket/${ticket._id}` : null,
          qrCodeData: ticket ? ticket.qrCodeData : null,
          scanned: ticket ? ticket.scanned : false, // NEW
        };
      })
    );

    res.status(200).json(usersWithTickets);
  } catch (err) {
    console.error("getAllUsers error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Resend email to a specific user with QR code
export const resendEmailToUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const ticket = await Ticket.findOne({ userId: user._id });
    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });

    const ticketUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/ticket/${ticket._id}`;

    await sendEmail(
      user.email,
      "Your Tech Event Ticket (Resent)",
      `<h2>Hello ${user.name}</h2>
      <p>Your ticket is ready</p>
      <img src="${ticket.qrCodeData}" alt="Ticket QR Code"/>
      <p>Or click here to view online: <a href="${ticketUrl}">${ticketUrl}</a></p>`
    );

    res.status(200).json({ msg: "Email sent successfully" });
  } catch (err) {
    console.error("resendEmailToUser error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
