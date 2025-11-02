import express from "express";
import { versionController } from "../controllers/versionController";
import { authenticate } from "../middleware/auth";
import { upload } from "../config/multer";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all versions for a file
router.get("/:fileId", versionController.getVersions);

// Create a new version (re-upload file)
router.post("/:fileId", upload.single("file"), versionController.createVersion);

// Download a specific version
router.get("/:fileId/:versionNumber/download", versionController.downloadVersion);

// Restore a specific version (make it current)
router.post("/:fileId/:versionNumber/restore", versionController.restoreVersion);

export default router;
