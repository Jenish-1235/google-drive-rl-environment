import fs from "fs";
import path from "path";
import { config } from "../config/env";

export const storageService = {
  // Delete file from filesystem
  deleteFile: (filePath: string): void => {
    const fullPath = path.join(config.upload.dir, "files", filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  },

  // Check if file exists
  fileExists: (filePath: string): boolean => {
    const fullPath = path.join(config.upload.dir, "files", filePath);
    return fs.existsSync(fullPath);
  },

  // Get file path
  getFilePath: (filePath: string): string => {
    return path.join(config.upload.dir, "files", filePath);
  },

  // Create directory if not exists
  ensureDir: (dirPath: string): void => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  },
};

export default storageService;
