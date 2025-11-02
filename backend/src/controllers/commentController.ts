import { Request, Response, NextFunction } from "express";
import { commentModel } from "../models/commentModel";
import { fileModel } from "../models/fileModel";
import { shareModel } from "../models/shareModel";
import { activityLogger } from "../services/activityLogger";

export const commentController = {
  // Get all comments for a file
  getComments: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fileId } = req.params;
      const userId = req.user!.userId;

      // Check if file exists
      const file = fileModel.findById(fileId);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      // Check if user has access (owner or shared)
      const isOwner = fileModel.isOwner(fileId, userId);
      const hasAccess = isOwner || shareModel.hasAccess(fileId, userId);

      if (!hasAccess) {
        return res.status(403).json({ error: "Access denied" });
      }

      const comments = commentModel.findByFileId(fileId);

      res.json({ comments, count: comments.length });
    } catch (error) {
      next(error);
    }
  },

  // Create a new comment
  createComment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { file_id, comment_text } = req.body;
      const userId = req.user!.userId;

      // Validation
      if (!file_id || !comment_text) {
        return res.status(400).json({
          error: "file_id and comment_text are required",
        });
      }

      if (comment_text.trim().length === 0) {
        return res.status(400).json({ error: "Comment cannot be empty" });
      }

      // Check if file exists
      const file = fileModel.findById(file_id);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      // Check if user has access (owner or shared with commenter/editor permission)
      const isOwner = fileModel.isOwner(file_id, userId);
      const hasCommentPermission =
        isOwner ||
        shareModel.hasPermission(file_id, userId, "commenter") ||
        shareModel.hasPermission(file_id, userId, "editor");

      if (!hasCommentPermission) {
        return res.status(403).json({
          error: "You don't have permission to comment on this file",
        });
      }

      // Create comment
      const comment = commentModel.create(file_id, userId, comment_text);

      // Log activity
      activityLogger.logComment(userId, file_id, file.name);

      res.status(201).json({ comment });
    } catch (error) {
      next(error);
    }
  },

  // Update a comment
  updateComment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { comment_text } = req.body;
      const userId = req.user!.userId;

      // Validation
      if (!comment_text) {
        return res.status(400).json({ error: "comment_text is required" });
      }

      if (comment_text.trim().length === 0) {
        return res.status(400).json({ error: "Comment cannot be empty" });
      }

      const commentId = parseInt(id);
      const comment = commentModel.findById(commentId);

      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      // Check if user owns the comment
      if (!commentModel.isOwner(commentId, userId)) {
        return res.status(403).json({ error: "Access denied" });
      }

      // Update comment
      const updatedComment = commentModel.update(commentId, comment_text);

      res.json({ comment: updatedComment });
    } catch (error) {
      next(error);
    }
  },

  // Delete a comment
  deleteComment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      const commentId = parseInt(id);
      const comment = commentModel.findById(commentId);

      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      // Check if user owns the comment or owns the file
      const isCommentOwner = commentModel.isOwner(commentId, userId);
      const isFileOwner = fileModel.isOwner(comment.file_id, userId);

      if (!isCommentOwner && !isFileOwner) {
        return res.status(403).json({ error: "Access denied" });
      }

      // Delete comment
      const success = commentModel.delete(commentId);

      if (!success) {
        return res.status(500).json({ error: "Failed to delete comment" });
      }

      res.json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
      next(error);
    }
  },

  // Get recent comments by user
  getRecentComments: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.userId;
      const limit = parseInt(req.query.limit as string) || 10;

      const comments = commentModel.getRecentComments(userId, limit);

      res.json({ comments });
    } catch (error) {
      next(error);
    }
  },
};

export default commentController;
