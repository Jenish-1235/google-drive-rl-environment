import { Request, Response, NextFunction } from "express";
import { fileModel } from "../models/fileModel";
import { userModel } from "../models/userModel";
import { activityLogger } from "../services/activityLogger";
import { storageService } from "../services/storageService";
import { getMimeType } from "../utils/fileHelpers";
import fs from "fs";
import path from "path";

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
        mime_type,
        created_after,
        created_before,
        modified_after,
        modified_before,
        size_min,
        size_max,
        sort_by,
        sort_order,
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

      if (mime_type) {
        filters.mimeType = mime_type as string;
      }

      if (created_after) {
        filters.createdAfter = created_after as string;
      }

      if (created_before) {
        filters.createdBefore = created_before as string;
      }

      if (modified_after) {
        filters.modifiedAfter = modified_after as string;
      }

      if (modified_before) {
        filters.modifiedBefore = modified_before as string;
      }

      if (size_min) {
        filters.sizeMin = parseInt(size_min as string);
      }

      if (size_max) {
        filters.sizeMax = parseInt(size_max as string);
      }

      if (sort_by) {
        filters.sortBy = sort_by as string;
      }

      if (sort_order) {
        filters.sortOrder = sort_order as string;
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

      // Handle parent_id properly - convert "null" string to actual null
      const parentId = parent_id === "null" || !parent_id ? null : parent_id;
      const folder = fileModel.createFolder(name, userId, parentId);

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
      // Handle parent_id properly - convert "null" string to actual null
      const parent_id = req.body.parent_id === "null" || !req.body.parent_id ? null : req.body.parent_id;

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

  // Preview file (returns file content for in-browser preview)
  previewFile: async (req: Request, res: Response, next: NextFunction) => {
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
        return res.status(400).json({ error: "Cannot preview a folder" });
      }

      if (!file.file_path) {
        return res.status(404).json({ error: "File not found on server" });
      }

      const filePath = storageService.getFilePath(file.file_path);
      const absolutePath = path.resolve(filePath);

      if (!fs.existsSync(absolutePath)) {
        return res.status(404).json({ error: "File not found on server" });
      }

      // Update last opened
      fileModel.updateLastOpened(id);

      // Set proper content type based on file mime type
      if (file.mime_type) {
        res.set("Content-Type", file.mime_type);
      }

      // Set content length
      res.set("Content-Length", file.size.toString());

      // Enable CORS for preview
      res.set("Access-Control-Allow-Origin", "*");

      // Send file content (not as download) - must use absolute path
      res.sendFile(absolutePath);
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

  // Get folder path (for breadcrumbs)
  getFolderPath: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { folderId } = req.params;

      // Build breadcrumb path from folder to root
      const path: any[] = [];
      let currentFolderId: string | null = folderId;

      while (currentFolderId) {
        const folder = fileModel.findById(currentFolderId);

        if (!folder) {
          return res.status(404).json({ error: "Folder not found" });
        }

        // Check ownership
        if (folder.owner_id !== userId) {
          // TODO: Check if user has access via share
          return res.status(403).json({ error: "Access denied" });
        }

        path.unshift({
          id: folder.id,
          name: folder.name,
          parent_id: folder.parent_id,
        });

        currentFolderId = folder.parent_id;
      }

      res.json({ path });
    } catch (error) {
      next(error);
    }
  },

  // Batch move files
  batchMove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { file_ids, parent_id } = req.body;

      if (!Array.isArray(file_ids) || file_ids.length === 0) {
        return res.status(400).json({ error: "file_ids must be a non-empty array" });
      }

      // Convert "null" string to actual null
      const targetParentId = parent_id === "null" || !parent_id ? null : parent_id;

      const results = [];
      const errors = [];

      for (const fileId of file_ids) {
        try {
          const file = fileModel.findById(fileId);

          if (!file) {
            errors.push({ id: fileId, error: "File not found" });
            continue;
          }

          if (file.owner_id !== userId) {
            errors.push({ id: fileId, error: "Access denied" });
            continue;
          }

          fileModel.update(fileId, { parent_id: targetParentId });

          // Log activity
          const destination = targetParentId ? "folder" : "My Drive";
          activityLogger.logMove(userId, fileId, file.name, destination);

          results.push({ id: fileId, success: true });
        } catch (error: any) {
          errors.push({ id: fileId, error: error.message });
        }
      }

      res.json({
        success: errors.length === 0,
        results,
        errors,
        moved: results.length,
        failed: errors.length,
      });
    } catch (error) {
      next(error);
    }
  },

  // Batch delete (move to trash)
  batchDelete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { file_ids } = req.body;

      if (!Array.isArray(file_ids) || file_ids.length === 0) {
        return res.status(400).json({ error: "file_ids must be a non-empty array" });
      }

      const results = [];
      const errors = [];

      for (const fileId of file_ids) {
        try {
          const file = fileModel.findById(fileId);

          if (!file) {
            errors.push({ id: fileId, error: "File not found" });
            continue;
          }

          if (file.owner_id !== userId) {
            errors.push({ id: fileId, error: "Access denied" });
            continue;
          }

          fileModel.update(fileId, {
            is_trashed: 1,
            trashed_at: new Date().toISOString(),
          });

          // Log activity
          activityLogger.logDelete(userId, fileId, file.name);

          results.push({ id: fileId, success: true });
        } catch (error: any) {
          errors.push({ id: fileId, error: error.message });
        }
      }

      res.json({
        success: errors.length === 0,
        results,
        errors,
        deleted: results.length,
        failed: errors.length,
      });
    } catch (error) {
      next(error);
    }
  },

  // Batch restore from trash
  batchRestore: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { file_ids } = req.body;

      if (!Array.isArray(file_ids) || file_ids.length === 0) {
        return res.status(400).json({ error: "file_ids must be a non-empty array" });
      }

      const results = [];
      const errors = [];

      for (const fileId of file_ids) {
        try {
          const file = fileModel.findById(fileId);

          if (!file) {
            errors.push({ id: fileId, error: "File not found" });
            continue;
          }

          if (file.owner_id !== userId) {
            errors.push({ id: fileId, error: "Access denied" });
            continue;
          }

          fileModel.update(fileId, {
            is_trashed: 0,
            trashed_at: null,
          });

          // Log activity
          activityLogger.logRestore(userId, fileId, file.name);

          results.push({ id: fileId, success: true });
        } catch (error: any) {
          errors.push({ id: fileId, error: error.message });
        }
      }

      res.json({
        success: errors.length === 0,
        results,
        errors,
        restored: results.length,
        failed: errors.length,
      });
    } catch (error) {
      next(error);
    }
  },

  // Batch star/unstar
  batchStar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { file_ids, is_starred } = req.body;

      if (!Array.isArray(file_ids) || file_ids.length === 0) {
        return res.status(400).json({ error: "file_ids must be a non-empty array" });
      }

      if (typeof is_starred !== "boolean") {
        return res.status(400).json({ error: "is_starred must be a boolean" });
      }

      const results = [];
      const errors = [];

      for (const fileId of file_ids) {
        try {
          const file = fileModel.findById(fileId);

          if (!file) {
            errors.push({ id: fileId, error: "File not found" });
            continue;
          }

          if (file.owner_id !== userId) {
            errors.push({ id: fileId, error: "Access denied" });
            continue;
          }

          fileModel.update(fileId, { is_starred: is_starred ? 1 : 0 });

          // Log activity
          if (is_starred) {
            activityLogger.logStar(userId, fileId, file.name);
          } else {
            activityLogger.logUnstar(userId, fileId, file.name);
          }

          results.push({ id: fileId, success: true });
        } catch (error: any) {
          errors.push({ id: fileId, error: error.message });
        }
      }

      res.json({
        success: errors.length === 0,
        results,
        errors,
        updated: results.length,
        failed: errors.length,
      });
    } catch (error) {
      next(error);
    }
  },

  // Batch permanent delete
  batchPermanentDelete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { file_ids } = req.body;

      if (!Array.isArray(file_ids) || file_ids.length === 0) {
        return res.status(400).json({ error: "file_ids must be a non-empty array" });
      }

      const results = [];
      const errors = [];

      for (const fileId of file_ids) {
        try {
          const file = fileModel.findById(fileId);

          if (!file) {
            errors.push({ id: fileId, error: "File not found" });
            continue;
          }

          if (file.owner_id !== userId) {
            errors.push({ id: fileId, error: "Access denied" });
            continue;
          }

          // Delete physical file if it's a file (not folder)
          if (file.type === "file" && file.file_path) {
            try {
              await storageService.deleteFile(file.file_path);
            } catch (error) {
              console.error("Failed to delete physical file:", error);
            }

            // Update user's storage usage
            if (file.size) {
              userModel.updateStorageUsed(userId, -file.size);
            }
          }

          // Delete from database
          fileModel.permanentDelete(fileId);

          results.push({ id: fileId, success: true });
        } catch (error: any) {
          errors.push({ id: fileId, error: error.message });
        }
      }

      res.json({
        success: errors.length === 0,
        results,
        errors,
        deleted: results.length,
        failed: errors.length,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default fileController;
