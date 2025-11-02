import db from "../config/database";
import { Share } from "./database.types";
import { randomBytes } from "crypto";

export const shareModel = {
  // Create a new share
  create: (
    fileId: string,
    sharedByUserId: number,
    sharedWithUserId: number | null,
    permission: "viewer" | "commenter" | "editor",
    shareLink: string | null = null
  ): Share => {
    const stmt = db.prepare(`
      INSERT INTO shares (file_id, shared_with_user_id, shared_by_user_id, permission, share_link)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      fileId,
      sharedWithUserId,
      sharedByUserId,
      permission,
      shareLink
    );

    return shareModel.findById(result.lastInsertRowid as number)!;
  },

  // Find share by ID
  findById: (id: number): Share | undefined => {
    const stmt = db.prepare("SELECT * FROM shares WHERE id = ?");
    return stmt.get(id) as Share | undefined;
  },

  // Get all shares for a file
  findByFileId: (fileId: string): Share[] => {
    const stmt = db.prepare("SELECT * FROM shares WHERE file_id = ?");
    return stmt.all(fileId) as Share[];
  },

  // Get files shared with a specific user
  findBySharedWithUserId: (userId: number): Share[] => {
    const stmt = db.prepare(`
      SELECT * FROM shares
      WHERE shared_with_user_id = ?
      ORDER BY created_at DESC
    `);
    return stmt.all(userId) as Share[];
  },

  // Get files shared by a specific user
  findBySharedByUserId: (userId: number): Share[] => {
    const stmt = db.prepare(`
      SELECT * FROM shares
      WHERE shared_by_user_id = ?
      ORDER BY created_at DESC
    `);
    return stmt.all(userId) as Share[];
  },

  // Find share by file and user
  findByFileAndUser: (
    fileId: string,
    userId: number
  ): Share | undefined => {
    const stmt = db.prepare(`
      SELECT * FROM shares
      WHERE file_id = ? AND shared_with_user_id = ?
    `);
    return stmt.get(fileId, userId) as Share | undefined;
  },

  // Find share by link token
  findByShareLink: (shareLink: string): Share | undefined => {
    const stmt = db.prepare("SELECT * FROM shares WHERE share_link = ?");
    return stmt.get(shareLink) as Share | undefined;
  },

  // Update share permission
  updatePermission: (
    id: number,
    permission: "viewer" | "commenter" | "editor"
  ): Share | undefined => {
    const stmt = db.prepare(`
      UPDATE shares
      SET permission = ?
      WHERE id = ?
    `);
    stmt.run(permission, id);
    return shareModel.findById(id);
  },

  // Delete share
  delete: (id: number): void => {
    const stmt = db.prepare("DELETE FROM shares WHERE id = ?");
    stmt.run(id);
  },

  // Delete all shares for a file
  deleteByFileId: (fileId: string): void => {
    const stmt = db.prepare("DELETE FROM shares WHERE file_id = ?");
    stmt.run(fileId);
  },

  // Generate a unique share link token
  generateShareLink: (): string => {
    // Generate a random 16-byte token and encode it as base64url
    const token = randomBytes(16).toString("base64url");
    return token;
  },

  // Check if user has permission to access file
  hasPermission: (
    fileId: string,
    userId: number,
    requiredPermission: "viewer" | "commenter" | "editor"
  ): boolean => {
    const share = shareModel.findByFileAndUser(fileId, userId);
    if (!share) return false;

    const permissionLevels = {
      viewer: 1,
      commenter: 2,
      editor: 3,
    };

    return (
      permissionLevels[share.permission] >=
      permissionLevels[requiredPermission]
    );
  },

  // Check if user has any access to file (any permission level)
  hasAccess: (fileId: string, userId: number): boolean => {
    const share = shareModel.findByFileAndUser(fileId, userId);
    return !!share;
  },

  // Get share with user details
  getShareWithDetails: (shareId: number) => {
    const stmt = db.prepare(`
      SELECT
        s.*,
        f.name as file_name,
        f.type as file_type,
        u_shared_by.name as shared_by_name,
        u_shared_by.email as shared_by_email,
        u_shared_with.name as shared_with_name,
        u_shared_with.email as shared_with_email
      FROM shares s
      JOIN files f ON s.file_id = f.id
      JOIN users u_shared_by ON s.shared_by_user_id = u_shared_by.id
      LEFT JOIN users u_shared_with ON s.shared_with_user_id = u_shared_with.id
      WHERE s.id = ?
    `);
    return stmt.get(shareId);
  },

  // Get all shares for a file with user details
  getSharesWithDetailsForFile: (fileId: string) => {
    const stmt = db.prepare(`
      SELECT
        s.*,
        u_shared_by.name as shared_by_name,
        u_shared_by.email as shared_by_email,
        u_shared_by.avatar_url as shared_by_avatar,
        u_shared_with.name as shared_with_name,
        u_shared_with.email as shared_with_email,
        u_shared_with.avatar_url as shared_with_avatar
      FROM shares s
      JOIN users u_shared_by ON s.shared_by_user_id = u_shared_by.id
      LEFT JOIN users u_shared_with ON s.shared_with_user_id = u_shared_with.id
      WHERE s.file_id = ?
      ORDER BY s.created_at DESC
    `);
    return stmt.all(fileId);
  },
};
