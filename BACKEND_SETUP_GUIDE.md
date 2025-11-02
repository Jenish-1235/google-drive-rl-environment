# Backend Setup Guide - Google Drive Clone

## Complete Implementation Guide for Claude Code

---

## 📋 Project Overview

Build a RESTful API backend using **Node.js + Express + TypeScript + SQLite** that provides all the functionality for a Google Drive clone. This backend will handle authentication, file management, sharing, activities, and storage tracking.

**No external cloud services required** - everything runs locally with SQLite database and filesystem storage.

---

## 🏗️ Project Structure - Create These Directories and Files

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts           # SQLite connection and initialization
│   │   ├── multer.ts             # File upload configuration
│   │   └── env.ts                # Environment variables
│   ├── middleware/
│   │   ├── auth.ts               # JWT authentication middleware
│   │   ├── errorHandler.ts      # Global error handling
│   │   ├── validate.ts           # Request validation
│   │   └── upload.ts             # File upload middleware
│   ├── models/
│   │   ├── database.types.ts    # TypeScript types for database
│   │   ├── userModel.ts         # User database operations
│   │   ├── fileModel.ts         # File database operations
│   │   ├── shareModel.ts        # Share database operations
│   │   ├── activityModel.ts     # Activity database operations
│   │   ├── versionModel.ts      # Version database operations
│   │   └── commentModel.ts      # Comment database operations
│   ├── controllers/
│   │   ├── authController.ts    # Authentication logic
│   │   ├── userController.ts    # User management logic
│   │   ├── fileController.ts    # File/folder CRUD logic
│   │   ├── shareController.ts   # Sharing logic
│   │   ├── activityController.ts # Activity feed logic
│   │   ├── versionController.ts  # Version history logic
│   │   └── commentController.ts  # Comments logic
│   ├── routes/
│   │   ├── auth.routes.ts       # Auth endpoints
│   │   ├── user.routes.ts       # User endpoints
│   │   ├── file.routes.ts       # File endpoints
│   │   ├── share.routes.ts      # Share endpoints
│   │   ├── activity.routes.ts   # Activity endpoints
│   │   ├── version.routes.ts    # Version endpoints
│   │   └── comment.routes.ts    # Comment endpoints
│   ├── services/
│   │   ├── storageService.ts    # File system operations
│   │   ├── searchService.ts     # Search and filter logic
│   │   └── activityLogger.ts    # Activity tracking helper
│   ├── utils/
│   │   ├── jwt.ts               # JWT token utilities
│   │   ├── password.ts          # Password hashing utilities
│   │   ├── fileHelpers.ts       # File type detection, mime types
│   │   ├── validators.ts        # Custom validators
│   │   └── constants.ts         # App constants
│   ├── types/
│   │   └── express.d.ts         # Express type extensions
│   ├── app.ts                   # Express app configuration
│   └── server.ts                # Server entry point
├── database/
│   ├── schema.sql               # Database schema
│   ├── seed.sql                 # Sample data
│   └── drive.db                 # SQLite database (auto-created)
├── uploads/
│   ├── files/                   # Uploaded files
│   ├── thumbnails/              # Thumbnails (optional)
│   └── versions/                # File versions
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
├── nodemon.json
└── README.md
```

---

## 📦 Step 1: Initialize Project and Install Dependencies

### 1.1 Create Backend Directory

```bash
mkdir backend
cd backend
npm init -y
```

### 1.2 Install Production Dependencies

```bash
npm install express cors dotenv
npm install better-sqlite3
npm install multer
npm install bcryptjs jsonwebtoken
npm install uuid
npm install express-validator
npm install morgan
```

### 1.3 Install Development Dependencies

```bash
npm install -D typescript @types/node @types/express
npm install -D @types/cors @types/multer @types/bcryptjs
npm install -D @types/jsonwebtoken @types/uuid @types/morgan
npm install -D @types/better-sqlite3
npm install -D nodemon ts-node
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier
```

### 1.4 Create `package.json` Scripts

```json
{
  "name": "google-drive-backend",
  "version": "1.0.0",
  "description": "Backend API for Google Drive Clone",
  "main": "dist/server.js",
  "scripts": {
    "dev": "nodemon",
    "build": "tsc",
    "start": "node dist/server.js",
    "db:init": "node -r ts-node/register src/scripts/initDatabase.ts",
    "db:seed": "node -r ts-node/register src/scripts/seedDatabase.ts",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write \"src/**/*.ts\""
  },
  "keywords": ["google-drive", "file-storage", "api"],
  "author": "",
  "license": "MIT"
}
```

### 1.5 Create `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "types": ["node", "express"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 1.6 Create `nodemon.json`

```json
{
  "watch": ["src"],
  "ext": "ts",
  "exec": "ts-node src/server.ts",
  "env": {
    "NODE_ENV": "development"
  }
}
```

### 1.7 Create `.gitignore`

```
node_modules/
dist/
.env
*.db
uploads/files/*
uploads/thumbnails/*
uploads/versions/*
!uploads/.gitkeep
*.log
.DS_Store
```

### 1.8 Create `.env.example`

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Database
DATABASE_PATH=./database/drive.db

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=104857600
ALLOWED_FILE_TYPES=*

# Storage Limits
DEFAULT_STORAGE_LIMIT=2199023255552
```

### 1.9 Create `.env` (Copy from .env.example and customize)

---

## 🗄️ Step 2: Database Schema - Exact SQL

Create `database/schema.sql`:

```sql
-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url TEXT DEFAULT 'https://i.pravatar.cc/150?img=1',
  storage_used INTEGER DEFAULT 0,
  storage_limit INTEGER DEFAULT 2199023255552,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- FILES TABLE (includes both files and folders)
-- ============================================
CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('file', 'folder')),
  mime_type TEXT,
  size INTEGER DEFAULT 0,
  parent_id TEXT,
  owner_id INTEGER NOT NULL,
  file_path TEXT,
  thumbnail_path TEXT,
  is_starred INTEGER DEFAULT 0 CHECK(is_starred IN (0, 1)),
  is_trashed INTEGER DEFAULT 0 CHECK(is_trashed IN (0, 1)),
  trashed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_opened_at DATETIME,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES files(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_files_owner ON files(owner_id);
CREATE INDEX IF NOT EXISTS idx_files_parent ON files(parent_id);
CREATE INDEX IF NOT EXISTS idx_files_starred ON files(is_starred, owner_id);
CREATE INDEX IF NOT EXISTS idx_files_trashed ON files(is_trashed, owner_id);
CREATE INDEX IF NOT EXISTS idx_files_type ON files(type);
CREATE INDEX IF NOT EXISTS idx_files_name ON files(name);

-- ============================================
-- SHARES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS shares (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_id TEXT NOT NULL,
  shared_with_user_id INTEGER,
  shared_by_user_id INTEGER NOT NULL,
  permission TEXT NOT NULL CHECK(permission IN ('viewer', 'commenter', 'editor')),
  share_link TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
  FOREIGN KEY (shared_with_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (shared_by_user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(file_id, shared_with_user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_shares_file ON shares(file_id);
CREATE INDEX IF NOT EXISTS idx_shares_user ON shares(shared_with_user_id);
CREATE INDEX IF NOT EXISTS idx_shares_link ON shares(share_link);

-- ============================================
-- ACTIVITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  file_id TEXT,
  action TEXT NOT NULL,
  details TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE SET NULL
);

-- Index for faster activity queries
CREATE INDEX IF NOT EXISTS idx_activities_user ON activities(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_file ON activities(file_id, created_at DESC);

-- ============================================
-- FILE_VERSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS file_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_id TEXT NOT NULL,
  version_number INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  size INTEGER NOT NULL,
  uploaded_by INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(file_id, version_number)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_versions_file ON file_versions(file_id, version_number DESC);

-- ============================================
-- COMMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_id TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  comment_text TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index
CREATE INDEX IF NOT EXISTS idx_comments_file ON comments(file_id, created_at DESC);
```

---

## 🌱 Step 3: Seed Data

Create `database/seed.sql`:

```sql
-- ============================================
-- SEED DATA FOR TESTING
-- ============================================

-- Create test users (passwords are all 'password123' hashed with bcrypt)
-- Hash: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

INSERT INTO users (id, email, name, password_hash, avatar_url, storage_used, storage_limit) VALUES
(1, 'john@example.com', 'John Doe', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://i.pravatar.cc/150?img=1', 0, 2199023255552),
(2, 'jane@example.com', 'Jane Smith', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://i.pravatar.cc/150?img=5', 0, 2199023255552),
(3, 'bob@example.com', 'Bob Johnson', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://i.pravatar.cc/150?img=12', 0, 2199023255552),
(4, 'alice@example.com', 'Alice Williams', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://i.pravatar.cc/150?img=9', 0, 2199023255552),
(5, 'charlie@example.com', 'Charlie Brown', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://i.pravatar.cc/150?img=15', 0, 2199023255552);

-- Create sample folder structure for John (user 1)
INSERT INTO files (id, name, type, mime_type, size, parent_id, owner_id, is_starred, is_trashed) VALUES
('folder-1', 'My Documents', 'folder', NULL, 0, NULL, 1, 0, 0),
('folder-2', 'Projects', 'folder', NULL, 0, NULL, 1, 1, 0),
('folder-3', 'Photos', 'folder', NULL, 0, NULL, 1, 0, 0),
('folder-4', 'Work', 'folder', NULL, 0, 'folder-1', 1, 0, 0),
('folder-5', 'Personal', 'folder', NULL, 0, 'folder-1', 1, 0, 0);

-- Sample activities
INSERT INTO activities (user_id, file_id, action, details) VALUES
(1, 'folder-1', 'create', 'Created folder "My Documents"'),
(1, 'folder-2', 'create', 'Created folder "Projects"'),
(1, 'folder-2', 'star', 'Starred folder "Projects"'),
(1, 'folder-3', 'create', 'Created folder "Photos"');

-- Note: Actual files will be created through API uploads
-- This seed data provides a basic structure to start with
```

---

## 🔧 Step 4: Core Configuration Files

### 4.1 Database Configuration (`src/config/database.ts`)

```typescript
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = process.env.DATABASE_PATH || "./database/drive.db";

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database connection
export const db = new Database(DB_PATH, {
  verbose: process.env.NODE_ENV === "development" ? console.log : undefined,
});

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Initialize database with schema
export function initializeDatabase() {
  const schemaPath = path.join(__dirname, "../../database/schema.sql");

  if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, "utf-8");
    db.exec(schema);
    console.log("✅ Database schema initialized");
  } else {
    console.error("❌ Schema file not found");
    throw new Error("Database schema file not found");
  }
}

// Seed database with test data
export function seedDatabase() {
  const seedPath = path.join(__dirname, "../../database/seed.sql");

  if (fs.existsSync(seedPath)) {
    const seed = fs.readFileSync(seedPath, "utf-8");
    db.exec(seed);
    console.log("✅ Database seeded with test data");
  } else {
    console.warn("⚠️ Seed file not found");
  }
}

// Close database connection
export function closeDatabase() {
  db.close();
  console.log("Database connection closed");
}

// Graceful shutdown
process.on("SIGINT", () => {
  closeDatabase();
  process.exit(0);
});

export default db;
```

### 4.2 Multer Configuration (`src/config/multer.ts`)

```typescript
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || "104857600"); // 100MB default

// Ensure upload directories exist
const directories = ["files", "thumbnails", "versions"];
directories.forEach((dir) => {
  const dirPath = path.join(UPLOAD_DIR, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destPath = path.join(UPLOAD_DIR, "files");
    cb(null, destPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// File filter
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Accept all file types by default
  // Can add restrictions here if needed
  cb(null, true);
};

// Multer configuration
export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
});

export default upload;
```

### 4.3 Environment Configuration (`src/config/env.ts`)

```typescript
import dotenv from "dotenv";

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "5000"),
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",

  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key-change-this",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  database: {
    path: process.env.DATABASE_PATH || "./database/drive.db",
  },

  upload: {
    dir: process.env.UPLOAD_DIR || "./uploads",
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "104857600"),
    allowedTypes: process.env.ALLOWED_FILE_TYPES || "*",
  },

  storage: {
    defaultLimit: parseInt(
      process.env.DEFAULT_STORAGE_LIMIT || "2199023255552"
    ),
  },
};

export default config;
```

---

## 🔐 Step 5: Utilities

### 5.1 JWT Utilities (`src/utils/jwt.ts`)

```typescript
import jwt from "jsonwebtoken";
import { config } from "../config/env";

export interface JWTPayload {
  userId: number;
  email: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, config.jwt.secret) as JWTPayload;
}
```

### 5.2 Password Utilities (`src/utils/password.ts`)

```typescript
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### 5.3 File Helpers (`src/utils/fileHelpers.ts`)

```typescript
import path from "path";
import mime from "mime-types";

export function getFileExtension(filename: string): string {
  return path.extname(filename).toLowerCase();
}

export function getMimeType(filename: string): string {
  return mime.lookup(filename) || "application/octet-stream";
}

export function getFileCategory(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.includes("document") || mimeType.includes("word"))
    return "document";
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
    return "spreadsheet";
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint"))
    return "presentation";
  if (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("tar")
  )
    return "archive";
  return "other";
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
```

### 5.4 Constants (`src/utils/constants.ts`)

```typescript
export const FILE_TYPES = {
  FOLDER: "folder",
  FILE: "file",
} as const;

export const PERMISSIONS = {
  VIEWER: "viewer",
  COMMENTER: "commenter",
  EDITOR: "editor",
} as const;

export const ACTIONS = {
  UPLOAD: "upload",
  CREATE: "create",
  DELETE: "delete",
  RESTORE: "restore",
  RENAME: "rename",
  MOVE: "move",
  COPY: "copy",
  SHARE: "share",
  UNSHARE: "unshare",
  STAR: "star",
  UNSTAR: "unstar",
  COMMENT: "comment",
  DOWNLOAD: "download",
  VIEW: "view",
} as const;

export const MIME_TYPES = {
  FOLDER: null,
  PDF: "application/pdf",
  IMAGE: "image/*",
  VIDEO: "video/*",
  DOCUMENT: "application/vnd.google-apps.document",
  SPREADSHEET: "application/vnd.google-apps.spreadsheet",
  PRESENTATION: "application/vnd.google-apps.presentation",
} as const;
```

---

## 🎨 Step 6: TypeScript Types

### 6.1 Database Types (`src/models/database.types.ts`)

```typescript
export interface User {
  id: number;
  email: string;
  name: string;
  password_hash: string;
  avatar_url: string | null;
  storage_used: number;
  storage_limit: number;
  created_at: string;
  updated_at: string;
}

export interface File {
  id: string;
  name: string;
  type: "file" | "folder";
  mime_type: string | null;
  size: number;
  parent_id: string | null;
  owner_id: number;
  file_path: string | null;
  thumbnail_path: string | null;
  is_starred: 0 | 1;
  is_trashed: 0 | 1;
  trashed_at: string | null;
  created_at: string;
  updated_at: string;
  last_opened_at: string | null;
}

export interface Share {
  id: number;
  file_id: string;
  shared_with_user_id: number | null;
  shared_by_user_id: number;
  permission: "viewer" | "commenter" | "editor";
  share_link: string | null;
  created_at: string;
}

export interface Activity {
  id: number;
  user_id: number;
  file_id: string | null;
  action: string;
  details: string | null;
  created_at: string;
}

export interface FileVersion {
  id: number;
  file_id: string;
  version_number: number;
  file_path: string;
  size: number;
  uploaded_by: number;
  created_at: string;
}

export interface Comment {
  id: number;
  file_id: string;
  user_id: number;
  comment_text: string;
  created_at: string;
  updated_at: string;
}

// Response types (without sensitive data)
export interface UserResponse {
  id: number;
  email: string;
  name: string;
  avatar_url: string | null;
  storage_used: number;
  storage_limit: number;
  created_at: string;
}

export interface FileResponse extends Omit<File, "file_path"> {
  owner?: UserResponse;
  shared_users?: UserResponse[];
  can_edit?: boolean;
}
```

### 6.2 Express Type Extensions (`src/types/express.d.ts`)

```typescript
import { JWTPayload } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}
```

---

## 🛡️ Step 7: Middleware

### 7.1 Auth Middleware (`src/middleware/auth.ts`)

```typescript
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);

    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
```

### 7.2 Error Handler (`src/middleware/errorHandler.ts`)

```typescript
import { Request, Response, NextFunction } from "express";

export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error:", error);

  const status = error.status || 500;
  const message = error.message || "Internal server error";

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
}
```

### 7.3 Validation Middleware (`src/middleware/validate.ts`)

```typescript
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export function validate(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
}
```

---

## 📡 Step 8: API Endpoints Specification

### 8.1 Authentication Routes

```typescript
// POST /api/auth/register
Request Body: {
  email: string,
  name: string,
  password: string
}
Response: {
  user: UserResponse,
  token: string
}

// POST /api/auth/login
Request Body: {
  email: string,
  password: string
}
Response: {
  user: UserResponse,
  token: string
}

// GET /api/auth/me
Headers: Authorization: Bearer <token>
Response: {
  user: UserResponse
}
```

### 8.2 File Routes

```typescript
// GET /api/files
Query Params: {
  parent_id?: string,
  search?: string,
  type?: string,
  starred?: boolean,
  trashed?: boolean,
  shared?: boolean
}
Response: {
  files: FileResponse[]
}

// GET /api/files/:id
Response: {
  file: FileResponse
}

// POST /api/files (Create Folder)
Request Body: {
  name: string,
  parent_id?: string
}
Response: {
  file: FileResponse
}

// POST /api/files/upload
Form Data: {
  file: File,
  parent_id?: string
}
Response: {
  file: FileResponse
}

// PATCH /api/files/:id
Request Body: {
  name?: string,
  parent_id?: string,
  is_starred?: boolean
}
Response: {
  file: FileResponse
}

// DELETE /api/files/:id (Move to trash)
Response: {
  success: boolean
}

// POST /api/files/:id/restore
Response: {
  file: FileResponse
}

// DELETE /api/files/:id/permanent
Response: {
  success: boolean
}

// GET /api/files/:id/download
Response: File stream

// GET /api/files/recent
Response: {
  files: FileResponse[]
}

// GET /api/files/starred
Response: {
  files: FileResponse[]
}

// GET /api/files/shared
Response: {
  files: FileResponse[]
}

// GET /api/files/trash
Response: {
  files: FileResponse[]
}
```

### 8.3 Share Routes

```typescript
// POST /api/shares
Request Body: {
  file_id: string,
  shared_with_user_id?: number,
  permission: 'viewer' | 'commenter' | 'editor'
}
Response: {
  share: Share
}

// GET /api/shares/:fileId
Response: {
  shares: Share[]
}

// PATCH /api/shares/:id
Request Body: {
  permission: 'viewer' | 'commenter' | 'editor'
}
Response: {
  share: Share
}

// DELETE /api/shares/:id
Response: {
  success: boolean
}
```

### 8.4 Activity Routes

```typescript
// GET /api/activities
Query Params: {
  file_id?: string,
  limit?: number
}
Response: {
  activities: Activity[]
}
```

### 8.5 Comment Routes

```typescript
// GET /api/comments/:fileId
Response: {
  comments: Comment[]
}

// POST /api/comments
Request Body: {
  file_id: string,
  comment_text: string
}
Response: {
  comment: Comment
}

// PATCH /api/comments/:id
Request Body: {
  comment_text: string
}
Response: {
  comment: Comment
}

// DELETE /api/comments/:id
Response: {
  success: boolean
}
```

---

## 🚀 Step 9: Main Application Files

### 9.1 Express App (`src/app.ts`)

```typescript
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";

// Import routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import fileRoutes from "./routes/file.routes";
import shareRoutes from "./routes/share.routes";
import activityRoutes from "./routes/activity.routes";
import commentRoutes from "./routes/comment.routes";

const app = express();

// Middleware
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/shares", shareRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/comments", commentRoutes);

// Error handling
app.use(errorHandler);

export default app;
```

### 9.2 Server Entry Point (`src/server.ts`)

```typescript
import app from "./app";
import { config } from "./config/env";
import { initializeDatabase } from "./config/database";

// Initialize database
try {
  initializeDatabase();
  console.log("✅ Database initialized successfully");
} catch (error) {
  console.error("❌ Failed to initialize database:", error);
  process.exit(1);
}

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${config.nodeEnv}`);
  console.log(`🌐 Frontend URL: ${config.frontendUrl}`);
});
```

---

## 📝 Step 10: Model Stubs (Database Operations)

Each model should have these basic operations:

### Example: `src/models/userModel.ts`

```typescript
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
};
```

Similar stubs needed for:

- `fileModel.ts` (create, findById, findByParent, update, delete, search, etc.)
- `shareModel.ts` (create, findByFile, findByUser, update, delete)
- `activityModel.ts` (create, findByUser, findByFile)
- `versionModel.ts` (create, findByFile)
- `commentModel.ts` (create, findByFile, update, delete)

---

## 🎯 Step 11: Controller Stubs

Each controller handles business logic for routes.

### Example: `src/controllers/authController.ts`

```typescript
import { Request, Response, NextFunction } from "express";
import { userModel } from "../models/userModel";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";

export const authController = {
  // Register new user
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, password } = req.body;

      // Check if user exists
      const existingUser = userModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create user
      const user = userModel.create(email, name, passwordHash);

      // Generate token
      const token = generateToken({ userId: user.id, email: user.email });

      // Remove password from response
      const { password_hash, ...userResponse } = user;

      res.status(201).json({ user: userResponse, token });
    } catch (error) {
      next(error);
    }
  },

  // Login user
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = userModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Check password
      const isValid = await comparePassword(password, user.password_hash);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate token
      const token = generateToken({ userId: user.id, email: user.email });

      // Remove password from response
      const { password_hash, ...userResponse } = user;

      res.json({ user: userResponse, token });
    } catch (error) {
      next(error);
    }
  },

  // Get current user
  me: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const user = userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password_hash, ...userResponse } = user;
      res.json({ user: userResponse });
    } catch (error) {
      next(error);
    }
  },
};
```

Similar controllers needed for:

- `fileController.ts` (list, create, upload, update, delete, download, etc.)
- `shareController.ts` (create, list, update, delete)
- `activityController.ts` (list)
- `commentController.ts` (create, list, update, delete)

---

## 🛣️ Step 12: Route Definitions

### Example: `src/routes/auth.routes.ts`

```typescript
import { Router } from "express";
import { body } from "express-validator";
import { authController } from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";

const router = Router();

// POST /api/auth/register
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("name").notEmpty().trim(),
    body("password").isLength({ min: 6 }),
    validate,
  ],
  authController.register
);

// POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty(),
    validate,
  ],
  authController.login
);

// GET /api/auth/me
router.get("/me", authenticate, authController.me);

export default router;
```

Similar routes needed for:

- `file.routes.ts`
- `share.routes.ts`
- `activity.routes.ts`
- `comment.routes.ts`
- `user.routes.ts`

---

## 🏃 Step 13: Running the Backend

### Initial Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Initialize database (creates schema)
npm run db:init

# Seed with test data
npm run db:seed

# Start development server
npm run dev
```

### Testing API

```bash
# Test health endpoint
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

---

## 📦 Step 14: Implementation Checklist

### Phase 1: Core Setup (Priority 1)

- [ ] Create project structure
- [ ] Install all dependencies
- [ ] Setup TypeScript configuration
- [ ] Create database schema
- [ ] Create seed data
- [ ] Setup database connection
- [ ] Create environment configuration

### Phase 2: Auth System (Priority 1)

- [ ] Implement password utilities
- [ ] Implement JWT utilities
- [ ] Create user model
- [ ] Create auth controller
- [ ] Create auth routes
- [ ] Test register/login/me endpoints

### Phase 3: File Management (Priority 1)

- [ ] Create file model
- [ ] Setup multer configuration
- [ ] Create file controller (CRUD)
- [ ] Create file routes
- [ ] Test create folder
- [ ] Test file upload
- [ ] Test list files
- [ ] Test rename/delete/restore

### Phase 4: Advanced Features (Priority 2)

- [ ] Implement sharing (model + controller + routes)
- [ ] Implement activities (model + controller + routes)
- [ ] Implement search and filters
- [ ] Implement file download
- [ ] Test all endpoints

### Phase 5: Optional Features (Priority 3)

- [ ] Implement comments
- [ ] Implement file versions
- [ ] Implement storage analytics
- [ ] Add file thumbnails

### Phase 6: Integration (Priority 1)

- [ ] Connect frontend to backend
- [ ] Replace mock data with API calls
- [ ] Test all workflows end-to-end
- [ ] Fix bugs and edge cases

### Phase 7: Deployment (Priority 2)

- [ ] Create Dockerfile for backend
- [ ] Create Dockerfile for frontend
- [ ] Create docker-compose.yml
- [ ] Test dockerized app
- [ ] Write deployment documentation

---

## 🚨 Important Notes

1. **Password for seed users**: All seed users have password `password123`
2. **JWT Secret**: Change the JWT_SECRET in production
3. **File Storage**: Files stored in `./uploads` directory
4. **Database**: SQLite file at `./database/drive.db`
5. **CORS**: Configure frontend URL in `.env`
6. **File Size Limit**: Default 100MB, configurable
7. **Error Handling**: All errors caught and returned as JSON
8. **Authentication**: JWT token in `Authorization: Bearer <token>` header

---

## 🎓 Key Concepts

### File Hierarchy

- Files with `parent_id = NULL` are at root level
- Folders can contain files and other folders
- Moving file = changing `parent_id`
- Deleting folder = cascades to children

### Sharing

- Share with specific user OR generate public link
- Permissions: viewer (read), commenter (read+comment), editor (read+write)
- Check permissions before operations

### Activities

- Log every important action
- Used for activity feed
- Includes user, file, action, and details

### Storage Tracking

- Update `storage_used` on upload/delete
- Calculate from actual file sizes
- Check limit before upload

---

## 📚 Next Steps After Setup

1. **Start with Auth** - Get login/register working first
2. **Then Files** - Implement file CRUD operations
3. **Connect Frontend** - Replace mock data incrementally
4. **Add Sharing** - Implement sharing features
5. **Polish** - Add activities, comments, search
6. **Docker** - Containerize everything

---

This guide provides everything needed to implement the backend. Start with Phase 1 and work incrementally!
