import { Router } from "express";
import {
  getSharesForFile,
  createShare,
  updateSharePermission,
  revokeShare,
  generateShareLink,
  accessViaShareLink,
  getSharedWithMe,
} from "../controllers/shareController";
import { authenticate } from "../middleware/auth";

const router = Router();

// All share routes require authentication except accessing via public link
router.get("/shared-with-me", authenticate, getSharedWithMe);
router.get("/file/:fileId", authenticate, getSharesForFile);
router.post("/", authenticate, createShare);
router.patch("/:id", authenticate, updateSharePermission);
router.delete("/:id", authenticate, revokeShare);
router.post("/link", authenticate, generateShareLink);
router.get("/link/:token", accessViaShareLink); // Public access - no auth required

export default router;
