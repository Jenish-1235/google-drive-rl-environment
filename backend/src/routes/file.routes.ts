import { Router } from "express";
import { body } from "express-validator";
import { fileController } from "../controllers/fileController";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { upload } from "../config/multer";

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/files - List files with filters
router.get("/", fileController.listFiles);

// GET /api/files/recent - Get recent files
router.get("/recent", fileController.getRecentFiles);

// GET /api/files/starred - Get starred files
router.get("/starred", fileController.getStarredFiles);

// GET /api/files/shared - Get shared files
router.get("/shared", fileController.getSharedFiles);

// GET /api/files/trash - Get trash files
router.get("/trash", fileController.getTrashFiles);

// GET /api/files/:folderId/path - Get folder path (for breadcrumbs)
router.get("/:folderId/path", fileController.getFolderPath);

// GET /api/files/:id/preview - Preview file (returns file content for browser preview)
router.get("/:id/preview", fileController.previewFile);

// GET /api/files/:id/download - Download file
router.get("/:id/download", fileController.downloadFile);

// GET /api/files/:id - Get file by ID
router.get("/:id", fileController.getFileById);

// POST /api/files - Create folder
router.post(
  "/",
  [
    body("name").notEmpty().trim().withMessage("Name is required"),
    validate,
  ],
  fileController.createFolder
);

// POST /api/files/upload - Upload file
router.post(
  "/upload",
  upload.single("file"),
  fileController.uploadFile
);

// PATCH /api/files/:id - Update file (rename, move, star)
router.patch("/:id", fileController.updateFile);

// DELETE /api/files/:id - Move to trash
router.delete("/:id", fileController.deleteFile);

// POST /api/files/:id/restore - Restore from trash
router.post("/:id/restore", fileController.restoreFile);

// DELETE /api/files/:id/permanent - Permanent delete
router.delete("/:id/permanent", fileController.permanentDelete);

// POST /api/files/batch/move - Batch move files
router.post("/batch/move", fileController.batchMove);

// POST /api/files/batch/delete - Batch delete files (move to trash)
router.post("/batch/delete", fileController.batchDelete);

// POST /api/files/batch/restore - Batch restore files from trash
router.post("/batch/restore", fileController.batchRestore);

// POST /api/files/batch/star - Batch star/unstar files
router.post("/batch/star", fileController.batchStar);

// POST /api/files/batch/permanent - Batch permanent delete
router.post("/batch/permanent", fileController.batchPermanentDelete);

export default router;
