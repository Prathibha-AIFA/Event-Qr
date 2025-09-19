// routes/scan.ts
import express from "express";
import Ticket from "../models/Tickets";

const router = express.Router();

router.post("/scan", async (req, res) => {
  try {
    const { ticketId } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      { $set: { scanned: true } },
      { new: true }
    ).populate("userId");

    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    res.json({ msg: "Scan recorded", ticket });
  } catch (err: any) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

export default router;
