import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth";
import ticketRoutes from "./routes/ticket";
import adminRoutes from "./routes/admin"

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());

// API routes
app.use("/api/auth", authRoutes);
app.use("/", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use('/api/admin', adminRoutes)


// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ msg: "Route not found" });
});



const PORT = process.env.PORT || 5000;


connectDB().then(() => {
  app.listen(PORT, () => console.log(`[Server] Running on port ${PORT} `));
});
