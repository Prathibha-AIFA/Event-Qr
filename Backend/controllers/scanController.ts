// src/controllers/scanController.ts
import { Request, Response } from "express";
import Ticket from "../models/Tickets";

// POST /api/scan
export const scanTicket = async (req: Request, res: Response) => {
  const { ticketId } = req.body;

  if (!ticketId) {
    return res.status(400).json({ msg: "ticketId is required" });
  }

  try {
    // Only mark scanned if it's not already scanned
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    if (!ticket.scanned) {
      ticket.scanned = true;
      await ticket.save();
    }

    res.status(200).json({
      msg: "Ticket scanned successfully",
      ticket: {
        _id: ticket._id,
        userId: ticket.userId,
        scanned: ticket.scanned,
      },
    });
  } catch (err: any) {
    console.error("scanTicket error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
