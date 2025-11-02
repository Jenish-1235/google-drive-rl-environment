import db from "../config/database";
import { User, UserResponse } from "./database.types";

export const userModel = {
  // Create user
  create: (email: string, name: string, passwordHash: string): User => {
    const stmt = db.prepare(`
      INSERT INTO users (email, name, password_hash)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(email, name, passwordHash);
    return userModel.findById(result.lastInsertRowid as number)!;
  },

  // Find user by email
  findByEmail: (email: string): User | undefined => {
    const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
    return stmt.get(email) as User | undefined;
  },

  // Find user by ID
  findById: (id: number): User | undefined => {
    const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
    return stmt.get(id) as User | undefined;
  },

  // Get all users (for sharing)
  findAll: (): UserResponse[] => {
    const stmt = db.prepare(`
      SELECT id, email, name, avatar_url, storage_used, storage_limit, created_at
      FROM users
    `);
    return stmt.all() as UserResponse[];
  },

  // Update user
  update: (id: number, data: Partial<User>): User | undefined => {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(data);

    const stmt = db.prepare(`
      UPDATE users SET ${fields}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(...values, id);
    return userModel.findById(id);
  },

  // Update storage used
  updateStorageUsed: (userId: number, bytesChange: number): void => {
    const stmt = db.prepare(`
      UPDATE users
      SET storage_used = storage_used + ?
      WHERE id = ?
    `);
    stmt.run(bytesChange, userId);
  },

  // Convert User to UserResponse (remove password)
  toResponse: (user: User): UserResponse => {
    const { password_hash, ...userResponse } = user;
    return userResponse;
  },

  // Get detailed storage analytics for a user
  getStorageAnalytics: (userId: number): any => {
    // Get total storage
    const user = userModel.findById(userId);
    if (!user) return null;

    // Get storage breakdown by file type (mime type categories)
    const breakdownStmt = db.prepare(`
      SELECT
        CASE
          WHEN mime_type LIKE 'image/%' THEN 'Images'
          WHEN mime_type LIKE 'video/%' THEN 'Videos'
          WHEN mime_type LIKE 'audio/%' THEN 'Audio'
          WHEN mime_type IN ('application/pdf') THEN 'PDFs'
          WHEN mime_type LIKE '%document%' OR mime_type LIKE '%msword%' OR mime_type LIKE '%wordprocessing%' THEN 'Documents'
          WHEN mime_type LIKE '%spreadsheet%' OR mime_type LIKE '%excel%' THEN 'Spreadsheets'
          WHEN mime_type LIKE '%presentation%' OR mime_type LIKE '%powerpoint%' THEN 'Presentations'
          WHEN mime_type LIKE 'text/%' THEN 'Text Files'
          WHEN mime_type LIKE 'application/zip%' OR mime_type LIKE 'application/x-%' THEN 'Archives'
          ELSE 'Other'
        END as category,
        SUM(size) as total_size,
        COUNT(*) as file_count
      FROM files
      WHERE owner_id = ? AND type = 'file' AND is_trashed = 0
      GROUP BY category
      ORDER BY total_size DESC
    `);
    const breakdown = breakdownStmt.all(userId);

    // Get largest files
    const largestStmt = db.prepare(`
      SELECT id, name, mime_type, size, created_at
      FROM files
      WHERE owner_id = ? AND type = 'file' AND is_trashed = 0
      ORDER BY size DESC
      LIMIT 10
    `);
    const largestFiles = largestStmt.all(userId);

    // Get recent uploads
    const recentStmt = db.prepare(`
      SELECT id, name, mime_type, size, created_at
      FROM files
      WHERE owner_id = ? AND type = 'file' AND is_trashed = 0
      ORDER BY created_at DESC
      LIMIT 10
    `);
    const recentUploads = recentStmt.all(userId);

    // Get file type distribution
    const typeStmt = db.prepare(`
      SELECT
        type,
        COUNT(*) as count
      FROM files
      WHERE owner_id = ? AND is_trashed = 0
      GROUP BY type
    `);
    const typeDistribution = typeStmt.all(userId);

    // Get trashed files storage
    const trashedStmt = db.prepare(`
      SELECT SUM(size) as total_trashed
      FROM files
      WHERE owner_id = ? AND type = 'file' AND is_trashed = 1
    `);
    const trashedResult = trashedStmt.get(userId) as { total_trashed: number | null };

    return {
      total_storage: user.storage_used,
      storage_limit: user.storage_limit,
      storage_percentage: (user.storage_used / user.storage_limit) * 100,
      available_storage: user.storage_limit - user.storage_used,
      breakdown,
      largest_files: largestFiles,
      recent_uploads: recentUploads,
      type_distribution: typeDistribution,
      trashed_storage: trashedResult.total_trashed || 0,
    };
  },

  // Get storage usage over time (simplified - by month)
  getStorageHistory: (userId: number, months: number = 6): any[] => {
    const stmt = db.prepare(`
      SELECT
        strftime('%Y-%m', created_at) as month,
        SUM(size) as storage_added,
        COUNT(*) as files_added
      FROM files
      WHERE owner_id = ? AND type = 'file'
      GROUP BY month
      ORDER BY month DESC
      LIMIT ?
    `);
    return stmt.all(userId, months) as any[];
  },
};
