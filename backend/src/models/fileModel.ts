import db from "../config/database";
import { File } from "./database.types";
import { v4 as uuidv4 } from "uuid";

export interface FileFilters {
  parentId?: string | null;
  ownerId?: number;
  isStarred?: boolean;
  isTrashed?: boolean;
  type?: "file" | "folder";
  search?: string;
  mimeType?: string;
  createdAfter?: string;
  createdBefore?: string;
  modifiedAfter?: string;
  modifiedBefore?: string;
  sizeMin?: number;
  sizeMax?: number;
  sortBy?: "name" | "created_at" | "updated_at" | "size";
  sortOrder?: "asc" | "desc";
}

export const fileModel = {
  // Create a new folder
  createFolder: (name: string, ownerId: number, parentId: string | null = null): File => {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO files (id, name, type, owner_id, parent_id, mime_type, size)
      VALUES (?, ?, 'folder', ?, ?, NULL, 0)
    `);
    stmt.run(id, name, ownerId, parentId);
    return fileModel.findById(id)!;
  },

  // Create a new file record
  createFile: (
    name: string,
    mimeType: string,
    size: number,
    filePath: string,
    ownerId: number,
    parentId: string | null = null
  ): File => {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO files (id, name, type, mime_type, size, file_path, owner_id, parent_id)
      VALUES (?, ?, 'file', ?, ?, ?, ?, ?)
    `);
    stmt.run(id, name, mimeType, size, filePath, ownerId, parentId);
    return fileModel.findById(id)!;
  },

  // Find file by ID
  findById: (id: string): File | undefined => {
    const stmt = db.prepare("SELECT * FROM files WHERE id = ?");
    return stmt.get(id) as File | undefined;
  },

  // List files with filters
  findAll: (filters: FileFilters = {}): File[] => {
    let query = "SELECT * FROM files WHERE 1=1";
    const params: any[] = [];

    // Filter by parent ID
    if (filters.parentId !== undefined) {
      if (filters.parentId === null) {
        query += " AND parent_id IS NULL";
      } else {
        query += " AND parent_id = ?";
        params.push(filters.parentId);
      }
    }

    // Filter by owner
    if (filters.ownerId) {
      query += " AND owner_id = ?";
      params.push(filters.ownerId);
    }

    // Filter by starred
    if (filters.isStarred !== undefined) {
      query += " AND is_starred = ?";
      params.push(filters.isStarred ? 1 : 0);
    }

    // Filter by trashed
    if (filters.isTrashed !== undefined) {
      query += " AND is_trashed = ?";
      params.push(filters.isTrashed ? 1 : 0);
    }

    // Filter by type
    if (filters.type) {
      query += " AND type = ?";
      params.push(filters.type);
    }

    // Filter by mime type
    if (filters.mimeType) {
      query += " AND mime_type LIKE ?";
      params.push(`%${filters.mimeType}%`);
    }

    // Search by name (case-insensitive)
    if (filters.search) {
      query += " AND name LIKE ?";
      params.push(`%${filters.search}%`);
    }

    // Filter by creation date range
    if (filters.createdAfter) {
      query += " AND created_at >= ?";
      params.push(filters.createdAfter);
    }

    if (filters.createdBefore) {
      query += " AND created_at <= ?";
      params.push(filters.createdBefore);
    }

    // Filter by modification date range
    if (filters.modifiedAfter) {
      query += " AND updated_at >= ?";
      params.push(filters.modifiedAfter);
    }

    if (filters.modifiedBefore) {
      query += " AND updated_at <= ?";
      params.push(filters.modifiedBefore);
    }

    // Filter by file size range
    if (filters.sizeMin !== undefined) {
      query += " AND size >= ?";
      params.push(filters.sizeMin);
    }

    if (filters.sizeMax !== undefined) {
      query += " AND size <= ?";
      params.push(filters.sizeMax);
    }

    // Sorting
    const sortBy = filters.sortBy || "name";
    const sortOrder = filters.sortOrder || "asc";

    // Special handling for default sort (folders first, then by name)
    if (!filters.sortBy) {
      query += " ORDER BY type DESC, name ASC";
    } else {
      query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
    }

    const stmt = db.prepare(query);
    return stmt.all(...params) as File[];
  },

  // Get files shared with user
  findSharedWithUser: (userId: number): File[] => {
    const stmt = db.prepare(`
      SELECT DISTINCT f.*
      FROM files f
      INNER JOIN shares s ON f.id = s.file_id
      WHERE s.shared_with_user_id = ? AND f.is_trashed = 0
      ORDER BY f.updated_at DESC
    `);
    return stmt.all(userId) as File[];
  },

  // Get recently accessed files
  findRecent: (userId: number, limit: number = 20): File[] => {
    const stmt = db.prepare(`
      SELECT * FROM files
      WHERE owner_id = ? AND is_trashed = 0 AND last_opened_at IS NOT NULL
      ORDER BY last_opened_at DESC
      LIMIT ?
    `);
    return stmt.all(userId, limit) as File[];
  },

  // Update file
  update: (id: string, updates: Partial<File>): File | undefined => {
    const allowedFields = [
      "name",
      "parent_id",
      "is_starred",
      "is_trashed",
      "trashed_at",
      "last_opened_at",
    ];

    const fields = Object.keys(updates)
      .filter((key) => allowedFields.includes(key))
      .map((key) => `${key} = ?`)
      .join(", ");

    if (!fields) {
      return fileModel.findById(id);
    }

    const values = Object.keys(updates)
      .filter((key) => allowedFields.includes(key))
      .map((key) => (updates as any)[key]);

    const stmt = db.prepare(`
      UPDATE files SET ${fields}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(...values, id);
    return fileModel.findById(id);
  },

  // Toggle star
  toggleStar: (id: string): File | undefined => {
    const file = fileModel.findById(id);
    if (!file) return undefined;

    const newStarred = file.is_starred === 1 ? 0 : 1;
    return fileModel.update(id, { is_starred: newStarred });
  },

  // Move to trash (soft delete)
  moveToTrash: (id: string): File | undefined => {
    return fileModel.update(id, {
      is_trashed: 1,
      trashed_at: new Date().toISOString(),
    });
  },

  // Restore from trash
  restoreFromTrash: (id: string): File | undefined => {
    return fileModel.update(id, {
      is_trashed: 0,
      trashed_at: null,
    });
  },

  // Permanent delete
  permanentDelete: (id: string): boolean => {
    const stmt = db.prepare("DELETE FROM files WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  },

  // Get children count for a folder
  getChildrenCount: (folderId: string): number => {
    const stmt = db.prepare(
      "SELECT COUNT(*) as count FROM files WHERE parent_id = ? AND is_trashed = 0"
    );
    const result = stmt.get(folderId) as { count: number };
    return result.count;
  },

  // Update last opened time
  updateLastOpened: (id: string): void => {
    const stmt = db.prepare(`
      UPDATE files SET last_opened_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(id);
  },

  // Check if user owns file
  isOwner: (fileId: string, userId: number): boolean => {
    const file = fileModel.findById(fileId);
    return file?.owner_id === userId;
  },

  // Get file with owner info
  findByIdWithOwner: (id: string): any => {
    const stmt = db.prepare(`
      SELECT
        f.*,
        u.id as owner_id,
        u.email as owner_email,
        u.name as owner_name,
        u.avatar_url as owner_avatar
      FROM files f
      LEFT JOIN users u ON f.owner_id = u.id
      WHERE f.id = ?
    `);
    return stmt.get(id);
  },

  // Get storage used by user
  getStorageUsed: (userId: number): number => {
    const stmt = db.prepare(`
      SELECT SUM(size) as total
      FROM files
      WHERE owner_id = ? AND type = 'file' AND is_trashed = 0
    `);
    const result = stmt.get(userId) as { total: number | null };
    return result.total || 0;
  },

  // Get folder path (breadcrumb trail) for a given folder
  getFolderPath: (folderId: string | null): Array<{ id: string; name: string }> => {
    if (!folderId) {
      // Root folder - return just "My Drive"
      return [{ id: 'root', name: 'My Drive' }];
    }

    const path: Array<{ id: string; name: string }> = [];
    let currentId: string | null = folderId;

    // Recursively build path from folder to root
    while (currentId) {
      const folder = fileModel.findById(currentId);

      if (!folder) {
        // Folder not found, return root
        return [{ id: 'root', name: 'My Drive' }];
      }

      // Add folder to beginning of path
      path.unshift({ id: folder.id, name: folder.name });

      // Move to parent folder
      currentId = folder.parent_id;
    }

    // Add root folder at the beginning
    path.unshift({ id: 'root', name: 'My Drive' });

    return path;
  },
};

export default fileModel;
