"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Tickets_1 = __importDefault(require("../models/Tickets"));
const router = (0, express_1.Router)();
router.get("/:id", async (req, res) => {
    const ticketId = req.params.id;
    console.log(`[Ticket API] Fetching ticket with ID: ${ticketId}`);
    try {
        const ticket = await Tickets_1.default.findById(ticketId).populate("userId");
        if (!ticket) {
            console.log(`[Ticket API] Ticket not found: ${ticketId}`);
            return res.status(404).json({ msg: "Ticket not found" });
        }
        // console.log(`[Ticket API] Ticket found:`, ticket);
        res.json(ticket);
    }
    catch (err) {
        console.error(`[Ticket API] Error fetching ticket: ${err.message}`);
        res.status(500).json({ msg: "Server error", error: err.message });
    }
});
exports.default = router;
