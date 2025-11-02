import express from "express";
import { userController } from "../controllers/userController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all users (for sharing)
router.get("/", userController.getAllUsers);

// Get current user info
router.get("/me", userController.getCurrentUser);

// Get storage analytics
router.get("/storage/analytics", userController.getStorageAnalytics);

// Get storage history
router.get("/storage/history", userController.getStorageHistory);

// Get basic storage info
router.get("/storage", userController.getStorageInfo);

// Get user by ID
router.get("/:id", userController.getUserById);

// Update user profile
router.patch("/:id", userController.updateUser);

export default router;
