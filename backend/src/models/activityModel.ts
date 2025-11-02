import db from "../config/database";
import { Activity } from "./database.types";

export const activityModel = {
  // Create new activity
  create: (
    userId: number,
    fileId: string | null,
    action: string,
    details?: string
  ): Activity => {
    const stmt = db.prepare(`
      INSERT INTO activities (user_id, file_id, action, details)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(userId, fileId, action, details || null);
    return activityModel.findById(result.lastInsertRowid as number)!;
  },

  // Find activity by ID
  findById: (id: number): Activity | undefined => {
    const stmt = db.prepare("SELECT * FROM activities WHERE id = ?");
    return stmt.get(id) as Activity | undefined;
  },

  // Get activities for a user
  findByUser: (userId: number, limit: number = 50): Activity[] => {
    const stmt = db.prepare(`
      SELECT * FROM activities
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `);
    return stmt.all(userId, limit) as Activity[];
  },

  // Get activities for a file
  findByFile: (fileId: string, limit: number = 50): Activity[] => {
    const stmt = db.prepare(`
      SELECT * FROM activities
      WHERE file_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `);
    return stmt.all(fileId, limit) as Activity[];
  },

  // Get recent activities with file and user info
  findRecentWithDetails: (userId: number, limit: number = 20): any[] => {
    const stmt = db.prepare(`
      SELECT
        a.*,
        f.name as file_name,
        f.type as file_type,
        u.name as user_name,
        u.email as user_email,
        u.avatar_url as user_avatar
      FROM activities a
      LEFT JOIN files f ON a.file_id = f.id
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.user_id = ?
      ORDER BY a.created_at DESC
      LIMIT ?
    `);
    return stmt.all(userId, limit);
  },
};

export default activityModel;
