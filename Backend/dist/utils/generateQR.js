"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQR = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
const generateQR = async (text) => {
    try {
        const qrCodeData = await qrcode_1.default.toDataURL(text);
        return qrCodeData;
    }
    catch (err) {
        console.error("Failed to generate QR code:", err);
        throw err;
    }
};
exports.generateQR = generateQR;
