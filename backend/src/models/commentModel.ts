import db from "../config/database";
import { Comment } from "./database.types";

export const commentModel = {
  // Create a new comment
  create: (
    fileId: string,
    userId: number,
    commentText: string
  ): Comment => {
    const stmt = db.prepare(`
      INSERT INTO comments (file_id, user_id, comment_text)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(fileId, userId, commentText);
    return commentModel.findById(result.lastInsertRowid as number)!;
  },

  // Find comment by ID
  findById: (id: number): Comment | undefined => {
    const stmt = db.prepare("SELECT * FROM comments WHERE id = ?");
    return stmt.get(id) as Comment | undefined;
  },

  // Find all comments for a file with user details
  findByFileId: (fileId: string): any[] => {
    const stmt = db.prepare(`
      SELECT
        c.*,
        u.name as user_name,
        u.email as user_email,
        u.avatar_url as user_avatar
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.file_id = ?
      ORDER BY c.created_at DESC
    `);
    return stmt.all(fileId) as any[];
  },

  // Find all comments by a user
  findByUserId: (userId: number): Comment[] => {
    const stmt = db.prepare(`
      SELECT * FROM comments
      WHERE user_id = ?
      ORDER BY created_at DESC
    `);
    return stmt.all(userId) as Comment[];
  },

  // Update comment text
  update: (id: number, commentText: string): Comment | undefined => {
    const stmt = db.prepare(`
      UPDATE comments
      SET comment_text = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(commentText, id);
    return commentModel.findById(id);
  },

  // Delete comment
  delete: (id: number): boolean => {
    const stmt = db.prepare("DELETE FROM comments WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  },

  // Check if user owns comment
  isOwner: (commentId: number, userId: number): boolean => {
    const comment = commentModel.findById(commentId);
    return comment?.user_id === userId;
  },

  // Get comment count for a file
  getCommentCount: (fileId: string): number => {
    const stmt = db.prepare(
      "SELECT COUNT(*) as count FROM comments WHERE file_id = ?"
    );
    const result = stmt.get(fileId) as { count: number };
    return result.count;
  },

  // Get recent comments for a user (across all files they have access to)
  getRecentComments: (userId: number, limit: number = 10): any[] => {
    const stmt = db.prepare(`
      SELECT
        c.*,
        u.name as user_name,
        u.email as user_email,
        u.avatar_url as user_avatar,
        f.name as file_name,
        f.type as file_type
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN files f ON c.file_id = f.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
      LIMIT ?
    `);
    return stmt.all(userId, limit) as any[];
  },
};

export default commentModel;
