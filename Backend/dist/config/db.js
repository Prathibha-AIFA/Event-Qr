"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
        const dbName = process.env.DB_NAME || "tech_event_dev";
        await mongoose_1.default.connect(uri, { dbName });
        console.log(`[INFO] MongoDB connected: ${uri}/${dbName}`);
    }
    catch (err) {
        console.error("[ERROR] MongoDB connection error:", err);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
