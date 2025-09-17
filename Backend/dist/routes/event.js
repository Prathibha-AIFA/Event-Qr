"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// You can extend this later to fetch multiple events
router.get("/", (req, res) => {
    res.json({
        id: "tech2025",
        title: "Tech Event 2025",
        description: "Explore new technologies, network with peers, and gain insights."
    });
});
exports.default = router;
