import { Request, Response, NextFunction } from "express";
import { userModel } from "../models/userModel";

export const userController = {
  // Get current user info
  getCurrentUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;

      const user = userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const userResponse = userModel.toResponse(user);

      res.json({ user: userResponse });
    } catch (error) {
      next(error);
    }
  },

  // Get all users (for sharing)
  getAllUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;

      const users = userModel.findAll();

      // Filter out current user
      const filteredUsers = users.filter((u) => u.id !== userId);

      res.json({ users: filteredUsers });
    } catch (error) {
      next(error);
    }
  },

  // Get user by ID
  getUserById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = parseInt(id);

      const user = userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const userResponse = userModel.toResponse(user);

      res.json({ user: userResponse });
    } catch (error) {
      next(error);
    }
  },

  // Update user profile
  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = parseInt(id);
      const currentUserId = req.user!.userId;

      // Users can only update their own profile
      if (userId !== currentUserId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const { name, avatar_url } = req.body;

      const updates: any = {};
      if (name !== undefined) updates.name = name;
      if (avatar_url !== undefined) updates.avatar_url = avatar_url;

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No updates provided" });
      }

      const updatedUser = userModel.update(userId, updates);

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const userResponse = userModel.toResponse(updatedUser);

      res.json({ user: userResponse });
    } catch (error) {
      next(error);
    }
  },

  // Get storage analytics
  getStorageAnalytics: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.userId;

      const analytics = userModel.getStorageAnalytics(userId);

      if (!analytics) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ analytics });
    } catch (error) {
      next(error);
    }
  },

  // Get storage history
  getStorageHistory: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.userId;
      const months = parseInt(req.query.months as string) || 6;

      const history = userModel.getStorageHistory(userId, months);

      res.json({ history });
    } catch (error) {
      next(error);
    }
  },

  // Get basic storage info
  getStorageInfo: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;

      const user = userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        storage_used: user.storage_used,
        storage_limit: user.storage_limit,
        storage_percentage: (user.storage_used / user.storage_limit) * 100,
        available_storage: user.storage_limit - user.storage_used,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
