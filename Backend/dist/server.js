"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const auth_1 = __importDefault(require("./routes/auth"));
const ticket_1 = __importDefault(require("./routes/ticket"));
const admin_1 = __importDefault(require("./routes/admin"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// API routes
app.use("/api/auth", auth_1.default);
app.use("/", auth_1.default);
app.use("/api/tickets", ticket_1.default);
app.use('/api/admin', admin_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({ msg: "Route not found" });
});
const PORT = process.env.PORT || 5000;
(0, db_1.connectDB)().then(() => {
    app.listen(PORT, () => console.log(`[Server] Running on port ${PORT} `));
});
