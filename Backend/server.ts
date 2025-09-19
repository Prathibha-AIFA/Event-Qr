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
const allowedOrigins = [
  "http://localhost:5173",           // local frontend (vite)
  "https://event-qr-seven.vercel.app", // production frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// API routes
app.use("/api/auth", authRoutes);

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
