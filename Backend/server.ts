import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";

import authRoutes from "./routes/auth";
import ticketRoutes from "./routes/ticket";

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());

// Base route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running 🚀" });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ msg: "Route not found" });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("[ERROR]", err.stack || err);
  res.status(500).json({ msg: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;


connectDB().then(() => {
  app.listen(PORT, () => console.log(`[Server] Running on port ${PORT} `));
});
