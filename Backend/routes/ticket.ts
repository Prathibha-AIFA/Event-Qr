import { Router } from "express";
import Ticket from "../models/Tickets";

const router = Router();

router.get("/:id", async (req, res) => {
  const ticketId = req.params.id;

  try {
    const ticket = await Ticket.findById(ticketId).populate("userId", "name email");

    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });

    const ticketData = {
      _id: ticket._id,
      eventId: ticket.eventId,
      qrCodeData: ticket.qrCodeData,
      userId: ticket.userId,
      name:
    ticket.name ||
    (ticket.userId && typeof ticket.userId !== "string" && "name" in ticket.userId
      ? ticket.userId.name
      : undefined),
  email:
    ticket.email ||
    (ticket.userId && typeof ticket.userId !== "string" && "email" in ticket.userId
      ? ticket.userId.email
      : undefined),
    };

    res.json(ticketData);
  } catch (err: any) {
    console.error(`[Ticket API] Error fetching ticket: ${err.message}`);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

export default router; 
