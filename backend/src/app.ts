import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";

// Import routes
import authRoutes from "./routes/auth.routes";
import fileRoutes from "./routes/file.routes";

const app = express();

// Middleware
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

// Error handling
app.use(errorHandler);

export default app;
