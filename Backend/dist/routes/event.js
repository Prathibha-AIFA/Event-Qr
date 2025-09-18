"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", (Requestreq, res) => {
    res.json({
        id: "tech2025",
        title: "Tech Event 2025",
        description: "Explore new technologies, network with peers, and gain insights."
    });
});
exports.default = router;
