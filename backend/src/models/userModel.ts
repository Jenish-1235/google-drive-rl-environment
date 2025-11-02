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
};
