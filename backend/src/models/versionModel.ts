import db from "../config/database";
import { FileVersion } from "./database.types";

export const versionModel = {
  // Create a new file version
  create: (
    fileId: string,
    versionNumber: number,
    filePath: string,
    size: number,
    uploadedBy: number
  ): FileVersion => {
    const stmt = db.prepare(`
      INSERT INTO file_versions (file_id, version_number, file_path, size, uploaded_by)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(fileId, versionNumber, filePath, size, uploadedBy);
    return versionModel.findById(result.lastInsertRowid as number)!;
  },

  // Find version by ID
  findById: (id: number): FileVersion | undefined => {
    const stmt = db.prepare("SELECT * FROM file_versions WHERE id = ?");
    return stmt.get(id) as FileVersion | undefined;
  },

  // Find all versions for a file
  findByFileId: (fileId: string): FileVersion[] => {
    const stmt = db.prepare(`
      SELECT * FROM file_versions
      WHERE file_id = ?
      ORDER BY version_number DESC
    `);
    return stmt.all(fileId) as FileVersion[];
  },

  // Find versions with user details
  findByFileIdWithDetails: (fileId: string): any[] => {
    const stmt = db.prepare(`
      SELECT
        fv.*,
        u.name as uploaded_by_name,
        u.email as uploaded_by_email,
        u.avatar_url as uploaded_by_avatar
      FROM file_versions fv
      LEFT JOIN users u ON fv.uploaded_by = u.id
      WHERE fv.file_id = ?
      ORDER BY fv.version_number DESC
    `);
    return stmt.all(fileId) as any[];
  },

  // Get latest version number for a file
  getLatestVersionNumber: (fileId: string): number => {
    const stmt = db.prepare(`
      SELECT MAX(version_number) as latest
      FROM file_versions
      WHERE file_id = ?
    `);
    const result = stmt.get(fileId) as { latest: number | null };
    return result.latest || 0;
  },

  // Get specific version
  findVersion: (fileId: string, versionNumber: number): FileVersion | undefined => {
    const stmt = db.prepare(`
      SELECT * FROM file_versions
      WHERE file_id = ? AND version_number = ?
    `);
    return stmt.get(fileId, versionNumber) as FileVersion | undefined;
  },

  // Get version count for a file
  getVersionCount: (fileId: string): number => {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count
      FROM file_versions
      WHERE file_id = ?
    `);
    const result = stmt.get(fileId) as { count: number };
    return result.count;
  },

  // Delete all versions for a file
  deleteByFileId: (fileId: string): boolean => {
    const stmt = db.prepare("DELETE FROM file_versions WHERE file_id = ?");
    const result = stmt.run(fileId);
    return result.changes > 0;
  },

  // Delete specific version
  deleteVersion: (id: number): boolean => {
    const stmt = db.prepare("DELETE FROM file_versions WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  },

  // Get total storage used by all versions of a file
  getTotalVersionStorage: (fileId: string): number => {
    const stmt = db.prepare(`
      SELECT SUM(size) as total
      FROM file_versions
      WHERE file_id = ?
    `);
    const result = stmt.get(fileId) as { total: number | null };
    return result.total || 0;
  },

  // Get all versions uploaded by a user
  findByUserId: (userId: number, limit: number = 20): FileVersion[] => {
    const stmt = db.prepare(`
      SELECT * FROM file_versions
      WHERE uploaded_by = ?
      ORDER BY created_at DESC
      LIMIT ?
    `);
    return stmt.all(userId, limit) as FileVersion[];
  },
};

export default versionModel;
