import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";

// Import routes
import authRoutes from "./routes/auth.routes";
import fileRoutes from "./routes/file.routes";
import shareRoutes from "./routes/share.routes";
import activityRoutes from "./routes/activity.routes";
import commentRoutes from "./routes/comment.routes";
import versionRoutes from "./routes/version.routes";
import userRoutes from "./routes/user.routes";

const app = express();

// Middleware
app.use(
  cors({
    origin: true, // Allow all origins
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
app.use("/api/shares", shareRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/versions", versionRoutes);
app.use("/api/users", userRoutes);

// Error handling
app.use(errorHandler);

export default app;
