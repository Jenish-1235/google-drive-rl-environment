import { Router } from "express";
import { activityController } from "../controllers/activityController";
import { authenticate } from "../middleware/auth";

const router = Router();

// All activity routes require authentication
router.use(authenticate);

// GET /api/activities - Get activity feed for current user
router.get("/", activityController.getActivityFeed);

// GET /api/activities/stats - Get activity statistics
router.get("/stats", activityController.getActivityStats);

// GET /api/activities/user - Get user's own activities
router.get("/user", activityController.getUserActivities);

// GET /api/activities/file/:fileId - Get activities for a specific file
router.get("/file/:fileId", activityController.getFileActivities);

export default router;
