"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendEmailToUser = exports.getAllUsers = exports.getDashboardCounts = void 0;
const User_1 = __importDefault(require("../models/User"));
const Tickets_1 = __importDefault(require("../models/Tickets"));
const sendEmail_1 = require("../utils/sendEmail");
const getDashboardCounts = async (req, res) => {
    try {
        const totalUsers = await User_1.default.countDocuments();
        const totalTickets = await Tickets_1.default.countDocuments();
        res.json({ totalUsers, totalTickets });
    }
    catch (err) {
        res.status(500).json({ msg: "Failed to fetch dashboard counts", error: err });
    }
};
exports.getDashboardCounts = getDashboardCounts;
const getAllUsers = async (req, res) => {
    try {
        const users = await User_1.default.find().lean();
        // Fetch tickets for each user
        const usersWithTickets = await Promise.all(users.map(async (user) => {
            const ticket = await Tickets_1.default.findOne({ userId: user._id });
            return {
                ...user,
                ticketUrl: ticket ? `/ticket/${ticket._id}` : null,
                qrCodeData: ticket ? ticket.qrCodeData : null,
            };
        }));
        res.status(200).json(usersWithTickets);
    }
    catch (err) {
        console.error("getAllUsers error:", err);
        res.status(500).json({ msg: "Server error" });
    }
};
exports.getAllUsers = getAllUsers;
// Resend email to a specific user
const resendEmailToUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ msg: "User not found" });
        const ticket = await Tickets_1.default.findOne({ userId: user._id });
        if (!ticket)
            return res.status(404).json({ msg: "Ticket not found" });
        const ticketUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/ticket/${ticket._id}`;
        await (0, sendEmail_1.sendEmail)(user.email, "Your Tech Event Ticket (Resent)", `<h2>Hello ${user.name}</h2>
      <p>Your ticket is ready</p>
      <img src="${ticket.qrCodeData}" alt="Ticket QR Code"/>
      <p>Or click here to view online: <a href="${ticketUrl}">${ticketUrl}</a></p>`);
        res.status(200).json({ msg: "Email sent successfully" });
    }
    catch (err) {
        console.error("resendEmailToUser error:", err);
        res.status(500).json({ msg: "Server error" });
    }
};
exports.resendEmailToUser = resendEmailToUser;
