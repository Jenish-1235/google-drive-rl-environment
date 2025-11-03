import express from "express";
import { commentController } from "../controllers/commentController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get recent comments by current user (MUST come before /:fileId)
router.get("/user/recent", commentController.getRecentComments);

// Get all comments for a file
router.get("/:fileId", commentController.getComments);

// Create a new comment
router.post("/", commentController.createComment);

// Update a comment
router.patch("/:id", commentController.updateComment);

// Delete a comment
router.delete("/:id", commentController.deleteComment);

export default router;
