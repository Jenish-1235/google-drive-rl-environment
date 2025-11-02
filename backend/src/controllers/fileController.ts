import { Request, Response, NextFunction } from "express";
import { fileModel } from "../models/fileModel";
import { userModel } from "../models/userModel";
import { activityLogger } from "../services/activityLogger";
import { storageService } from "../services/storageService";
import { getMimeType } from "../utils/fileHelpers";
import fs from "fs";

export const fileController = {
  // List files with filters
  listFiles: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const {
        parent_id,
        starred,
        trashed,
        type,
        search,
      } = req.query;

      const filters: any = {
        ownerId: userId,
      };

      // Handle parent_id (null for root, specific ID for folder)
      if (parent_id === "null" || parent_id === "") {
        filters.parentId = null;
      } else if (parent_id) {
        filters.parentId = parent_id as string;
      }

      if (starred !== undefined) {
        filters.isStarred = starred === "true" || starred === "1";
      }

      if (trashed !== undefined) {
        filters.isTrashed = trashed === "true" || trashed === "1";
      }

      if (type) {
        filters.type = type;
      }

      if (search) {
        filters.search = search as string;
      }

      const files = fileModel.findAll(filters);

      res.json({ files });
    } catch (error) {
      next(error);
    }
  },

  // Get file by ID
  getFileById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      const file = fileModel.findByIdWithOwner(id);

      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      // Check if user owns file or has access (TODO: add share check)
      if (file.owner_id !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      // Update last opened time
      fileModel.updateLastOpened(id);

      res.json({ file });
    } catch (error) {
      next(error);
    }
  },

  // Create folder
  createFolder: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { name, parent_id } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Folder name is required" });
      }

      const folder = fileModel.createFolder(name, userId, parent_id || null);

      // Log activity
      activityLogger.logCreateFolder(userId, folder.id, name);

      res.status(201).json({ file: folder });
    } catch (error) {
      next(error);
    }
  },

  // Upload file
  uploadFile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const parent_id = req.body.parent_id || null;

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { originalname, filename, size, mimetype } = req.file;

      // Check storage limit
      const user = userModel.findById(userId)!;
      if (user.storage_used + size > user.storage_limit) {
        // Delete uploaded file
        storageService.deleteFile(filename);
        return res.status(400).json({ error: "Storage limit exceeded" });
      }

      // Create file record
      const file = fileModel.createFile(
        originalname,
        mimetype || getMimeType(originalname),
        size,
        filename,
        userId,
        parent_id
      );

      // Update user storage
      userModel.updateStorageUsed(userId, size);

      // Log activity
      activityLogger.logUpload(userId, file.id, originalname);

      res.status(201).json({ file });
    } catch (error) {
      next(error);
    }
  },

  // Update file (rename, move, star)
  updateFile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;
      const { name, parent_id, is_starred } = req.body;

      const file = fileModel.findById(id);

      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      // Check ownership
      if (!fileModel.isOwner(id, userId)) {
        return res.status(403).json({ error: "Access denied" });
      }

      const updates: any = {};

      // Handle rename
      if (name !== undefined && name !== file.name) {
        updates.name = name;
        activityLogger.logRename(userId, id, file.name, name);
      }

      // Handle move
      if (parent_id !== undefined && parent_id !== file.parent_id) {
        updates.parent_id = parent_id || null;
        activityLogger.logMove(userId, id, file.name, parent_id ? "folder" : "root");
      }

      // Handle star/unstar
      if (is_starred !== undefined) {
        const newStarred = is_starred ? 1 : 0;
        if (newStarred !== file.is_starred) {
          updates.is_starred = newStarred;
          if (newStarred === 1) {
            activityLogger.logStar(userId, id, file.name);
          } else {
            activityLogger.logUnstar(userId, id, file.name);
          }
        }
      }

      const updatedFile = fileModel.update(id, updates);

      res.json({ file: updatedFile });
    } catch (error) {
      next(error);
    }
  },

  // Delete file (move to trash)
  deleteFile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      const file = fileModel.findById(id);

      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      // Check ownership
      if (!fileModel.isOwner(id, userId)) {
        return res.status(403).json({ error: "Access denied" });
      }

      fileModel.moveToTrash(id);

      // Log activity
      activityLogger.logDelete(userId, id, file.name);

      res.json({ success: true, message: "File moved to trash" });
    } catch (error) {
      next(error);
    }
  },

  // Restore from trash
  restoreFile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      const file = fileModel.findById(id);

      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      // Check ownership
      if (!fileModel.isOwner(id, userId)) {
        return res.status(403).json({ error: "Access denied" });
      }

      const restoredFile = fileModel.restoreFromTrash(id);

      // Log activity
      activityLogger.logRestore(userId, id, file.name);

      res.json({ file: restoredFile });
    } catch (error) {
      next(error);
    }
  },

  // Permanent delete
  permanentDelete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      const file = fileModel.findById(id);

      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      // Check ownership
      if (!fileModel.isOwner(id, userId)) {
        return res.status(403).json({ error: "Access denied" });
      }

      // Delete physical file if it exists
      if (file.type === "file" && file.file_path) {
        storageService.deleteFile(file.file_path);
        // Update user storage
        userModel.updateStorageUsed(userId, -file.size);
      }

      // Delete from database
      fileModel.permanentDelete(id);

      res.json({ success: true, message: "File permanently deleted" });
    } catch (error) {
      next(error);
    }
  },

  // Download file
  downloadFile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      const file = fileModel.findById(id);

      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      // Check ownership (TODO: add share check)
      if (!fileModel.isOwner(id, userId)) {
        return res.status(403).json({ error: "Access denied" });
      }

      if (file.type === "folder") {
        return res.status(400).json({ error: "Cannot download a folder" });
      }

      if (!file.file_path) {
        return res.status(404).json({ error: "File not found on server" });
      }

      const filePath = storageService.getFilePath(file.file_path);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found on server" });
      }

      // Log download activity
      activityLogger.logDownload(userId, id, file.name);

      // Update last opened
      fileModel.updateLastOpened(id);

      // Send file
      res.download(filePath, file.name);
    } catch (error) {
      next(error);
    }
  },

  // Get recent files
  getRecentFiles: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const limit = parseInt(req.query.limit as string) || 20;

      const files = fileModel.findRecent(userId, limit);

      res.json({ files });
    } catch (error) {
      next(error);
    }
  },

  // Get starred files
  getStarredFiles: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;

      const files = fileModel.findAll({
        ownerId: userId,
        isStarred: true,
        isTrashed: false,
      });

      res.json({ files });
    } catch (error) {
      next(error);
    }
  },

  // Get shared files
  getSharedFiles: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;

      const files = fileModel.findSharedWithUser(userId);

      res.json({ files });
    } catch (error) {
      next(error);
    }
  },

  // Get trash files
  getTrashFiles: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;

      const files = fileModel.findAll({
        ownerId: userId,
        isTrashed: true,
      });

      res.json({ files });
    } catch (error) {
      next(error);
    }
  },
};

export default fileController;
