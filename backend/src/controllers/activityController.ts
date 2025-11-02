import { Request, Response, NextFunction } from "express";
import { activityModel } from "../models/activityModel";
import { fileModel } from "../models/fileModel";

export const activityController = {
  // Get activity feed for current user
  getActivityFeed: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const limit = parseInt(req.query.limit as string) || 20;

      const activities = activityModel.findRecentWithDetails(userId, limit);

      res.json({ activities });
    } catch (error) {
      next(error);
    }
  },

  // Get activities for a specific file
  getFileActivities: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fileId } = req.params;
      const userId = req.user!.userId;
      const limit = parseInt(req.query.limit as string) || 50;

      // Check if file exists and user has access
      const file = fileModel.findById(fileId);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      // For now, only allow owner to view file activities
      // TODO: Add share permission check
      if (file.owner_id !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const activities = activityModel.findByFile(fileId, limit);

      res.json({ activities });
    } catch (error) {
      next(error);
    }
  },

  // Get user's own activities (simplified)
  getUserActivities: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const limit = parseInt(req.query.limit as string) || 50;

      const activities = activityModel.findByUser(userId, limit);

      res.json({ activities });
    } catch (error) {
      next(error);
    }
  },

  // Get activity stats for user
  getActivityStats: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;

      const allActivities = activityModel.findByUser(userId, 1000);

      // Count activities by action type
      const stats = allActivities.reduce((acc: any, activity) => {
        acc[activity.action] = (acc[activity.action] || 0) + 1;
        return acc;
      }, {});

      // Get total count
      const totalActivities = allActivities.length;

      // Get most recent activity
      const mostRecentActivity = allActivities[0] || null;

      res.json({
        total: totalActivities,
        by_action: stats,
        most_recent: mostRecentActivity,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default activityController;
