import { Request, Response, NextFunction } from "express";
import { versionModel } from "../models/versionModel";
import { fileModel } from "../models/fileModel";
import { userModel } from "../models/userModel";
import { shareModel } from "../models/shareModel";
import { activityLogger } from "../services/activityLogger";
import { storageService } from "../services/storageService";
import { getMimeType } from "../utils/fileHelpers";
import fs from "fs";
import path from "path";

export const versionController = {
  // Get all versions for a file
  getVersions: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fileId } = req.params;
      const userId = req.user!.userId;

      // Check if file exists
      const file = fileModel.findById(fileId);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      if (file.type === "folder") {
        return res.status(400).json({ error: "Folders do not have versions" });
      }

      // Check if user has access
      const isOwner = fileModel.isOwner(fileId, userId);
      const hasAccess = isOwner || shareModel.hasAccess(fileId, userId);

      if (!hasAccess) {
        return res.status(403).json({ error: "Access denied" });
      }

      const versions = versionModel.findByFileIdWithDetails(fileId);

      res.json({ versions, count: versions.length });
    } catch (error) {
      next(error);
    }
  },

  // Create a new version (re-upload file)
  createVersion: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fileId } = req.params;
      const userId = req.user!.userId;

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Check if file exists
      const file = fileModel.findById(fileId);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      if (file.type === "folder") {
        return res.status(400).json({ error: "Cannot create version for a folder" });
      }

      // Check if user has editor permission
      const isOwner = fileModel.isOwner(fileId, userId);
      const hasEditorPermission =
        isOwner || shareModel.hasPermission(fileId, userId, "editor");

      if (!hasEditorPermission) {
        return res.status(403).json({
          error: "You don't have permission to edit this file",
        });
      }

      const { filename, size, mimetype } = req.file;

      // Check storage limit
      const user = userModel.findById(userId)!;
      if (user.storage_used + size > user.storage_limit) {
        // Delete uploaded file
        storageService.deleteFile(filename);
        return res.status(400).json({ error: "Storage limit exceeded" });
      }

      // Get current version count
      const currentVersionCount = versionModel.getVersionCount(fileId);
      const latestVersion = versionModel.getLatestVersionNumber(fileId);

      // Save old version before updating current file (only on first version upload)
      if (file.file_path && currentVersionCount === 0) {
        // This is the first version being created, so save the current file as version 1
        const oldFilePath = file.file_path;
        const versionDir = path.join(storageService.getUploadDir(), "versions");

        // Create versions directory if it doesn't exist
        if (!fs.existsSync(versionDir)) {
          fs.mkdirSync(versionDir, { recursive: true });
        }

        // Copy current file to versions directory
        const versionFileName = `${fileId}_v1_${path.basename(oldFilePath)}`;
        const versionPath = path.join(versionDir, versionFileName);
        const sourcePath = storageService.getFilePath(oldFilePath);

        if (fs.existsSync(sourcePath)) {
          fs.copyFileSync(sourcePath, versionPath);
          // Create version record for original file
          versionModel.create(fileId, 1, versionFileName, file.size, file.owner_id);
        }
      }

      // Get next version number (after possibly creating version 1)
      const nextVersion = versionModel.getLatestVersionNumber(fileId) + 1;

      // Create new version record
      const version = versionModel.create(
        fileId,
        nextVersion,
        filename,
        size,
        userId
      );

      // Update the current file record
      const oldSize = file.size;
      fileModel.update(fileId, {
        // We don't update name or mime_type from the version upload
        // to preserve the original file name
      });

      // Update the file's current path and size
      const updateStmt = storageService.getDatabase().prepare(`
        UPDATE files
        SET file_path = ?, size = ?, mime_type = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      updateStmt.run(filename, size, mimetype || getMimeType(file.name), fileId);

      // Delete old file from main storage (but keep in versions)
      if (file.file_path && nextVersion > 1) {
        storageService.deleteFile(file.file_path);
      }

      // Update user storage (add new version size, remove old file size)
      const storageDiff = size - oldSize;
      userModel.updateStorageUsed(userId, storageDiff);

      // Log activity
      activityLogger.logUpload(userId, fileId, file.name);

      res.status(201).json({ version, message: "New version created successfully" });
    } catch (error) {
      next(error);
    }
  },

  // Download a specific version
  downloadVersion: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fileId, versionNumber } = req.params;
      const userId = req.user!.userId;

      const versionNum = parseInt(versionNumber);

      // Check if file exists
      const file = fileModel.findById(fileId);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      // Check if user has access
      const isOwner = fileModel.isOwner(fileId, userId);
      const hasAccess = isOwner || shareModel.hasAccess(fileId, userId);

      if (!hasAccess) {
        return res.status(403).json({ error: "Access denied" });
      }

      // Get the version
      const version = versionModel.findVersion(fileId, versionNum);
      if (!version) {
        return res.status(404).json({ error: "Version not found" });
      }

      // Get the file path
      let filePath: string;

      // If it's not the latest version, look in versions directory
      if (versionNum < versionModel.getLatestVersionNumber(fileId)) {
        filePath = path.join(
          storageService.getUploadDir(),
          "versions",
          version.file_path
        );
      } else {
        // Latest version is in the main uploads directory
        filePath = storageService.getFilePath(version.file_path);
      }

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Version file not found on server" });
      }

      // Log download activity
      activityLogger.logDownload(userId, fileId, `${file.name} (v${versionNum})`);

      // Send file
      res.download(filePath, `${file.name}_v${versionNum}`);
    } catch (error) {
      next(error);
    }
  },

  // Restore a specific version (make it the current version)
  restoreVersion: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fileId, versionNumber } = req.params;
      const userId = req.user!.userId;

      const versionNum = parseInt(versionNumber);

      // Check if file exists
      const file = fileModel.findById(fileId);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      // Check if user has editor permission
      const isOwner = fileModel.isOwner(fileId, userId);
      const hasEditorPermission =
        isOwner || shareModel.hasPermission(fileId, userId, "editor");

      if (!hasEditorPermission) {
        return res.status(403).json({
          error: "You don't have permission to edit this file",
        });
      }

      // Get the version to restore
      const version = versionModel.findVersion(fileId, versionNum);
      if (!version) {
        return res.status(404).json({ error: "Version not found" });
      }

      // Get the current latest version number
      const currentLatestVersion = versionModel.getLatestVersionNumber(fileId);

      // Copy the version file to main storage with a new name
      const versionFilePath = path.join(
        storageService.getUploadDir(),
        "versions",
        version.file_path
      );

      if (!fs.existsSync(versionFilePath)) {
        return res.status(404).json({ error: "Version file not found on server" });
      }

      // Generate new filename for restored version
      const newFileName = `restored_${Date.now()}_${path.basename(version.file_path)}`;
      const newFilePath = path.join(storageService.getUploadDir(), "files", newFileName);

      // Copy version file to main storage
      fs.copyFileSync(versionFilePath, newFilePath);

      // Create a new version record for this restoration
      const nextVersion = currentLatestVersion + 1;
      versionModel.create(
        fileId,
        nextVersion,
        newFileName,
        version.size,
        userId
      );

      // Update the file record
      const updateStmt = storageService.getDatabase().prepare(`
        UPDATE files
        SET file_path = ?, size = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      updateStmt.run(newFileName, version.size, fileId);

      // Log activity
      activityLogger.logRestore(userId, fileId, `${file.name} to v${versionNum}`);

      res.json({ success: true, message: `Restored to version ${versionNum}` });
    } catch (error) {
      next(error);
    }
  },
};

export default versionController;
