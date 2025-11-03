# Google Drive Clone - Complete End-to-End Documentation

**Last Updated:** 2025-11-03
**Version:** 1.0
**Project:** Full-Stack Google Drive Clone with React, Node.js, and SQLite

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Database Design](#database-design)
5. [Backend Implementation](#backend-implementation)
6. [Frontend Implementation](#frontend-implementation)
7. [API Documentation](#api-documentation)
8. [Authentication & Authorization](#authentication--authorization)
9. [Data Flow & Integration](#data-flow--integration)
10. [File Upload & Storage](#file-upload--storage)
11. [Sharing & Permissions](#sharing--permissions)
12. [Key Features](#key-features)
13. [Deployment](#deployment)
14. [Development Setup](#development-setup)
15. [Testing](#testing)
16. [Security Considerations](#security-considerations)
17. [Performance Optimizations](#performance-optimizations)
18. [Future Enhancements](#future-enhancements)

---

## Executive Summary

This is a high-fidelity, full-stack clone of Google Drive that replicates core cloud storage functionality including file management, sharing, collaboration, and version control. The application is built with modern web technologies and follows industry best practices for security, performance, and user experience.

### Key Metrics

- **Backend Files:** 38 TypeScript files
- **Frontend Files:** 65+ React components and supporting files
- **Database Tables:** 6 tables with 12 indexes
- **API Endpoints:** 50+ REST endpoints
- **Lines of Code:** ~15,000+ LOC
- **Features:** 15+ major feature categories

### Core Capabilities

- Complete file and folder management with drag-and-drop
- Three-tier permission system (Viewer, Commenter, Editor)
- File versioning and restore capabilities
- Activity logging and audit trail
- Storage analytics and quota management
- Comments and collaboration
- Public link sharing
- Trash and permanent delete
- Batch operations
- Advanced search and filtering

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT TIER                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         React 19 + TypeScript + Material-UI            │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │ │
│  │  │  Pages   │  │Components│  │  Stores  │            │ │
│  │  │ (11+)    │  │  (32+)   │  │ (Zustand)│            │ │
│  │  └──────────┘  └──────────┘  └──────────┘            │ │
│  │                       ↓                                 │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │      API Services Layer (8 Services)             │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST (Axios)
┌─────────────────────────────────────────────────────────────┐
│                       APPLICATION TIER                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │        Node.js + Express + TypeScript                  │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │ │
│  │  │  Routes  │→ │Controllers│→ │ Models  │            │ │
│  │  │   (7)    │  │    (7)    │  │   (6)   │            │ │
│  │  └──────────┘  └──────────┘  └──────────┘            │ │
│  │         ↓              ↓              ↓                 │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │ │
│  │  │Middleware│  │ Services │  │ Utils    │            │ │
│  │  └──────────┘  └──────────┘  └──────────┘            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↕ better-sqlite3
┌─────────────────────────────────────────────────────────────┐
│                         DATA TIER                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              SQLite Database (drive.db)                │ │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │ │
│  │  │  users  │ │  files  │ │ shares  │ │comments │    │ │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘    │ │
│  │  ┌─────────┐ ┌─────────┐                             │ │
│  │  │activity │ │ versions│                             │ │
│  │  └─────────┘ └─────────┘                             │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         File System Storage (uploads/)                 │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Project Structure

```
google-drive/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   │   ├── database.ts  # SQLite connection
│   │   │   ├── env.ts       # Environment variables
│   │   │   └── multer.ts    # File upload config
│   │   ├── controllers/     # Business logic
│   │   │   ├── authController.ts
│   │   │   ├── fileController.ts
│   │   │   ├── shareController.ts
│   │   │   ├── userController.ts
│   │   │   ├── commentController.ts
│   │   │   ├── activityController.ts
│   │   │   └── versionController.ts
│   │   ├── middleware/      # Express middleware
│   │   │   ├── auth.ts      # JWT authentication
│   │   │   ├── validate.ts  # Request validation
│   │   │   └── errorHandler.ts
│   │   ├── models/          # Data models
│   │   │   ├── userModel.ts
│   │   │   ├── fileModel.ts
│   │   │   ├── shareModel.ts
│   │   │   ├── commentModel.ts
│   │   │   ├── activityModel.ts
│   │   │   ├── versionModel.ts
│   │   │   └── database.types.ts
│   │   ├── routes/          # API routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── file.routes.ts
│   │   │   ├── share.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── comment.routes.ts
│   │   │   ├── activity.routes.ts
│   │   │   └── version.routes.ts
│   │   ├── services/        # Business services
│   │   │   ├── activityLogger.ts
│   │   │   └── storageService.ts
│   │   ├── utils/           # Utility functions
│   │   │   ├── jwt.ts
│   │   │   ├── password.ts
│   │   │   ├── fileHelpers.ts
│   │   │   └── constants.ts
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Server entry point
│   ├── database/
│   │   ├── schema.sql       # Database schema
│   │   └── seed.sql         # Seed data
│   ├── uploads/             # File storage
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── layout/      # Layout components
│   │   │   │   ├── MainLayout.tsx
│   │   │   │   ├── TopBar.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── RightSidebar.tsx
│   │   │   │   └── DetailsPanel.tsx
│   │   │   ├── files/       # File-related components
│   │   │   │   ├── FileList.tsx
│   │   │   │   ├── FileGrid.tsx
│   │   │   │   ├── FileToolbar.tsx
│   │   │   │   ├── FileUploader.tsx
│   │   │   │   ├── UploadProgress.tsx
│   │   │   │   └── SelectionToolbar.tsx
│   │   │   ├── common/      # Shared components
│   │   │   │   ├── ContextMenu.tsx
│   │   │   │   ├── Breadcrumbs.tsx
│   │   │   │   ├── EmptyState.tsx
│   │   │   │   ├── Snackbar.tsx
│   │   │   │   └── UserProfilePopover.tsx
│   │   │   └── modals/      # Modal dialogs
│   │   │       ├── ShareModal.tsx
│   │   │       ├── MoveModal.tsx
│   │   │       ├── RenameModal.tsx
│   │   │       ├── DeleteModal.tsx
│   │   │       ├── FilePreviewModal.tsx
│   │   │       └── CreateFolderModal.tsx
│   │   ├── pages/           # Page components
│   │   │   ├── HomePage/
│   │   │   ├── AuthPage/
│   │   │   ├── StarredPage/
│   │   │   ├── RecentPage/
│   │   │   ├── SharedPage/
│   │   │   ├── StoragePage/
│   │   │   └── TrashPage/
│   │   ├── services/        # API services
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── fileService.ts
│   │   │   ├── userService.ts
│   │   │   ├── shareService.ts
│   │   │   ├── commentService.ts
│   │   │   ├── activityService.ts
│   │   │   └── versionService.ts
│   │   ├── store/           # State management
│   │   │   ├── authStore.ts
│   │   │   ├── fileStore.ts
│   │   │   ├── uiStore.ts
│   │   │   └── uploadStore.ts
│   │   ├── types/           # TypeScript types
│   │   │   ├── file.types.ts
│   │   │   └── user.types.ts
│   │   ├── utils/           # Utility functions
│   │   │   ├── fileIcons.tsx
│   │   │   ├── formatters.ts
│   │   │   └── constants.ts
│   │   ├── theme.ts         # MUI theme
│   │   ├── router.tsx       # Route configuration
│   │   ├── App.tsx          # App component
│   │   └── main.tsx         # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Technology Stack

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x | Runtime environment |
| **TypeScript** | 5.x | Type safety and better DX |
| **Express.js** | 4.x | Web framework |
| **better-sqlite3** | Latest | SQLite database driver |
| **express-validator** | 7.x | Request validation |
| **jsonwebtoken** | 9.x | JWT authentication |
| **bcryptjs** | 2.x | Password hashing |
| **multer** | 1.x | File upload handling |
| **uuid** | 10.x | Unique ID generation |
| **cors** | 2.x | Cross-origin resource sharing |

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.1 | UI library |
| **TypeScript** | 5.9.3 | Type safety |
| **Material-UI** | 7.3.4 | UI component library |
| **Zustand** | 5.0.8 | State management |
| **React Router** | 7.9.5 | Client-side routing |
| **Axios** | 1.13.1 | HTTP client |
| **Emotion** | 11.14 | CSS-in-JS styling |
| **Vite** | 7.1.7 | Build tool |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **Nginx** | Frontend web server (production) |
| **SQLite** | Database |

---

## Database Design

### Entity Relationship Diagram

```
┌─────────────────┐         ┌─────────────────┐
│     USERS       │         │      FILES      │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │◄────┐   │ id (PK)         │
│ email           │     │   │ name            │
│ name            │     │   │ type            │
│ password_hash   │     │   │ mime_type       │
│ avatar_url      │     │   │ size            │
│ storage_used    │     │   │ parent_id (FK)  │──┐
│ storage_limit   │     └───│ owner_id (FK)   │  │
│ created_at      │         │ file_path       │  │
│ updated_at      │         │ thumbnail_path  │  │
└─────────────────┘         │ is_starred      │  │
        │                   │ is_trashed      │  │
        │                   │ trashed_at      │  │
        │                   │ created_at      │  │
        │                   │ updated_at      │  │
        │                   │ last_opened_at  │  │
        │                   └─────────────────┘  │
        │                           │            │
        │                           └────────────┘
        │                                (self-ref)
        │
        ├───────────────┬───────────────┬───────────────┬───────────────┐
        │               │               │               │               │
        ▼               ▼               ▼               ▼               ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   SHARES    │ │  COMMENTS   │ │ ACTIVITIES  │ │FILE_VERSIONS│ │    ...      │
├─────────────┤ ├─────────────┤ ├─────────────┤ ├─────────────┤ └─────────────┘
│ id (PK)     │ │ id (PK)     │ │ id (PK)     │ │ id (PK)     │
│ file_id(FK) │ │ file_id(FK) │ │ user_id(FK) │ │ file_id(FK) │
│ shared_with │ │ user_id(FK) │ │ file_id(FK) │ │ version_no  │
│ shared_by   │ │ comment_txt │ │ action      │ │ file_path   │
│ permission  │ │ created_at  │ │ details     │ │ size        │
│ share_link  │ │ updated_at  │ │ created_at  │ │uploaded_by  │
│ created_at  │ └─────────────┘ └─────────────┘ │ created_at  │
└─────────────┘                                  └─────────────┘
```

### Table Schemas

#### 1. Users Table

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url TEXT DEFAULT 'https://i.pravatar.cc/150?img=1',
  storage_used INTEGER DEFAULT 0,
  storage_limit INTEGER DEFAULT 2199023255552, -- 2TB
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
- `idx_users_email` on `email` for fast login lookups

#### 2. Files Table (Unified Files & Folders)

```sql
CREATE TABLE files (
  id TEXT PRIMARY KEY,                          -- UUID
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('file', 'folder')),
  mime_type TEXT,
  size INTEGER DEFAULT 0,
  parent_id TEXT,                               -- FK to files (self-reference)
  owner_id INTEGER NOT NULL,                    -- FK to users
  file_path TEXT,                               -- Physical storage path
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
```

**Indexes:**
- `idx_files_owner` on `owner_id`
- `idx_files_parent` on `parent_id`
- `idx_files_starred` on `(is_starred, owner_id)`
- `idx_files_trashed` on `(is_trashed, owner_id)`
- `idx_files_type` on `type`
- `idx_files_name` on `name`

#### 3. Shares Table

```sql
CREATE TABLE shares (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_id TEXT NOT NULL,                        -- FK to files
  shared_with_user_id INTEGER,                  -- FK to users (NULL for public links)
  shared_by_user_id INTEGER NOT NULL,           -- FK to users
  permission TEXT NOT NULL CHECK(permission IN ('viewer', 'commenter', 'editor')),
  share_link TEXT UNIQUE,                       -- Public share token
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
  FOREIGN KEY (shared_with_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (shared_by_user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(file_id, shared_with_user_id)
);
```

**Indexes:**
- `idx_shares_file` on `file_id`
- `idx_shares_user` on `shared_with_user_id`
- `idx_shares_link` on `share_link`

#### 4. Activities Table

```sql
CREATE TABLE activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,                     -- FK to users
  file_id TEXT,                                 -- FK to files (nullable)
  action TEXT NOT NULL,
  details TEXT,                                 -- JSON string with extra data
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE SET NULL
);
```

**Indexes:**
- `idx_activities_user` on `(user_id, created_at DESC)`
- `idx_activities_file` on `(file_id, created_at DESC)`

#### 5. File Versions Table

```sql
CREATE TABLE file_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_id TEXT NOT NULL,                        -- FK to files
  version_number INTEGER NOT NULL,
  file_path TEXT NOT NULL,                      -- Physical path to version
  size INTEGER NOT NULL,
  uploaded_by INTEGER NOT NULL,                 -- FK to users
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(file_id, version_number)
);
```

**Indexes:**
- `idx_versions_file` on `(file_id, version_number DESC)`

#### 6. Comments Table

```sql
CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_id TEXT NOT NULL,                        -- FK to files
  user_id INTEGER NOT NULL,                     -- FK to users
  comment_text TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Indexes:**
- `idx_comments_file` on `(file_id, created_at DESC)`

---

## Backend Implementation

### Architecture Pattern: MVC (Model-View-Controller)

The backend follows a clean MVC architecture with additional layers:

```
Routes → Middleware → Controllers → Services → Models → Database
```

### 1. Routes Layer (7 Route Files)

Routes define API endpoints and attach middleware and controllers.

#### Authentication Routes (`auth.routes.ts`)

| Method | Endpoint | Controller | Middleware | Description |
|--------|----------|------------|------------|-------------|
| POST | `/api/auth/register` | `authController.register` | validate | Register new user |
| POST | `/api/auth/login` | `authController.login` | validate | Login user |
| GET | `/api/auth/me` | `authController.me` | authenticate | Get current user |

#### File Routes (`file.routes.ts`)

| Method | Endpoint | Controller | Middleware | Description |
|--------|----------|------------|------------|-------------|
| GET | `/api/files` | `fileController.listFiles` | authenticate | List files with filters |
| GET | `/api/files/recent` | `fileController.getRecentFiles` | authenticate | Get recent files |
| GET | `/api/files/starred` | `fileController.getStarredFiles` | authenticate | Get starred files |
| GET | `/api/files/shared` | `fileController.getSharedFiles` | authenticate | Get shared files |
| GET | `/api/files/trash` | `fileController.getTrashFiles` | authenticate | Get trash files |
| GET | `/api/files/:id` | `fileController.getFileById` | authenticate | Get file by ID |
| GET | `/api/files/:folderId/path` | `fileController.getFolderPath` | authenticate | Get breadcrumb path |
| GET | `/api/files/:id/preview` | `fileController.previewFile` | authenticate | Preview file |
| GET | `/api/files/:id/download` | `fileController.downloadFile` | authenticate | Download file |
| POST | `/api/files` | `fileController.createFolder` | authenticate, validate | Create folder |
| POST | `/api/files/upload` | `fileController.uploadFile` | authenticate, multer | Upload file |
| PATCH | `/api/files/:id` | `fileController.updateFile` | authenticate | Update file |
| DELETE | `/api/files/:id` | `fileController.deleteFile` | authenticate | Soft delete |
| POST | `/api/files/:id/restore` | `fileController.restoreFile` | authenticate | Restore from trash |
| DELETE | `/api/files/:id/permanent` | `fileController.permanentDelete` | authenticate | Hard delete |
| POST | `/api/files/batch/move` | `fileController.batchMove` | authenticate | Batch move |
| POST | `/api/files/batch/delete` | `fileController.batchDelete` | authenticate | Batch delete |
| POST | `/api/files/batch/restore` | `fileController.batchRestore` | authenticate | Batch restore |
| POST | `/api/files/batch/star` | `fileController.batchStar` | authenticate | Batch star |
| POST | `/api/files/batch/permanent` | `fileController.batchPermanentDelete` | authenticate | Batch permanent delete |

#### Share Routes (`share.routes.ts`)

| Method | Endpoint | Controller | Middleware | Description |
|--------|----------|------------|------------|-------------|
| GET | `/api/shares/shared-with-me` | `getSharedWithMe` | authenticate | Get files shared with me |
| GET | `/api/shares/file/:fileId` | `getSharesForFile` | authenticate | Get shares for a file |
| POST | `/api/shares` | `createShare` | authenticate | Share file with user |
| PATCH | `/api/shares/:id` | `updateSharePermission` | authenticate | Update permission |
| DELETE | `/api/shares/:id` | `revokeShare` | authenticate | Revoke share |
| POST | `/api/shares/link` | `generateShareLink` | authenticate | Generate public link |
| GET | `/api/shares/link/:token` | `accessViaShareLink` | - | Access via public link |

#### User Routes (`user.routes.ts`)

| Method | Endpoint | Controller | Middleware | Description |
|--------|----------|------------|------------|-------------|
| GET | `/api/users` | `userController.getAllUsers` | authenticate | Get all users |
| GET | `/api/users/me` | `userController.getCurrentUser` | authenticate | Get current user |
| GET | `/api/users/:id` | `userController.getUserById` | authenticate | Get user by ID |
| GET | `/api/users/storage` | `userController.getStorageInfo` | authenticate | Get storage info |
| GET | `/api/users/storage/analytics` | `userController.getStorageAnalytics` | authenticate | Get storage analytics |
| GET | `/api/users/storage/history` | `userController.getStorageHistory` | authenticate | Get storage history |
| PATCH | `/api/users/:id` | `userController.updateUser` | authenticate | Update user profile |

#### Comment Routes (`comment.routes.ts`)

| Method | Endpoint | Controller | Middleware | Description |
|--------|----------|------------|------------|-------------|
| GET | `/api/comments/file/:fileId` | `getFileComments` | authenticate | Get file comments |
| POST | `/api/comments` | `createComment` | authenticate, validate | Add comment |
| PATCH | `/api/comments/:id` | `updateComment` | authenticate, validate | Update comment |
| DELETE | `/api/comments/:id` | `deleteComment` | authenticate | Delete comment |

#### Activity Routes (`activity.routes.ts`)

| Method | Endpoint | Controller | Middleware | Description |
|--------|----------|------------|------------|-------------|
| GET | `/api/activities` | `getUserActivities` | authenticate | Get user activities |
| GET | `/api/activities/file/:fileId` | `getFileActivities` | authenticate | Get file activities |

#### Version Routes (`version.routes.ts`)

| Method | Endpoint | Controller | Middleware | Description |
|--------|----------|------------|------------|-------------|
| GET | `/api/versions/file/:fileId` | `getFileVersions` | authenticate | Get file versions |
| POST | `/api/versions/:versionId/restore` | `restoreVersion` | authenticate | Restore version |
| GET | `/api/versions/:versionId/download` | `downloadVersion` | authenticate | Download version |

### 2. Middleware Layer

#### Authentication Middleware (`auth.ts`)

```typescript
// Verifies JWT token and attaches user to request
export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ message: 'Invalid token' });

  const user = userModel.findById(decoded.userId);
  if (!user) return res.status(401).json({ message: 'User not found' });

  req.user = user;
  next();
};
```

#### Validation Middleware (`validate.ts`)

```typescript
// Uses express-validator results
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
```

#### Error Handler Middleware (`errorHandler.ts`)

```typescript
// Global error handling
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

### 3. Controllers Layer

Controllers handle HTTP requests, orchestrate business logic, and return responses.

**Key Controller Functions:**

- **authController**: `register()`, `login()`, `me()`
- **fileController**: `listFiles()`, `uploadFile()`, `createFolder()`, `updateFile()`, `deleteFile()`, `batchMove()`, etc.
- **shareController**: `createShare()`, `updatePermission()`, `revokeShare()`, `generateShareLink()`
- **userController**: `getCurrentUser()`, `getStorageAnalytics()`, `updateUser()`
- **commentController**: `getFileComments()`, `createComment()`, `updateComment()`, `deleteComment()`
- **activityController**: `getUserActivities()`, `getFileActivities()`
- **versionController**: `getFileVersions()`, `restoreVersion()`, `downloadVersion()`

### 4. Models Layer

Models interact with the database using SQL queries.

**Key Model Functions:**

- **userModel**: `create()`, `findByEmail()`, `findById()`, `updateStorageUsed()`
- **fileModel**: `create()`, `findById()`, `findByOwner()`, `update()`, `delete()`, `getChildren()`
- **shareModel**: `create()`, `findByFile()`, `findByUser()`, `update()`, `delete()`
- **commentModel**: `create()`, `findByFile()`, `update()`, `delete()`
- **activityModel**: `create()`, `findByUser()`, `findByFile()`
- **versionModel**: `create()`, `findByFile()`, `findById()`

### 5. Services Layer

**activityLogger.ts**
- Logs user activities (upload, delete, share, etc.)
- Creates activity records in database

**storageService.ts**
- Calculates storage usage
- Manages storage quotas
- Generates storage analytics

### 6. Utils Layer

**jwt.ts**: `generateToken()`, `verifyToken()`
**password.ts**: `hashPassword()`, `comparePassword()`
**fileHelpers.ts**: `generateUniqueFilename()`, `getFileExtension()`, `getMimeType()`
**constants.ts**: Constants for permissions, actions, etc.

---

## Frontend Implementation

### Architecture Pattern: Component-Based with Zustand State Management

```
Pages → Components → Services → API
           ↓
        Stores (Zustand)
```

### 1. State Management (Zustand Stores)

#### authStore.ts

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}
```

**Key Actions:**
- `login()`: Authenticates user and stores token
- `logout()`: Clears auth state
- `register()`: Creates new user account
- `checkAuth()`: Validates existing token

#### fileStore.ts (700+ lines - Core store)

```typescript
interface FileState {
  files: FileItem[];
  currentFolder: FileItem | null;
  selectedFiles: Set<string>;
  viewMode: 'list' | 'grid';
  sortBy: SortOption;
  searchQuery: string;
  filters: FilterOptions;

  // Actions
  fetchFiles: (folderId?: string) => Promise<void>;
  uploadFiles: (files: File[], parentId?: string) => Promise<void>;
  createFolder: (name: string, parentId?: string) => Promise<void>;
  renameFile: (id: string, newName: string) => Promise<void>;
  moveFiles: (fileIds: string[], targetFolderId: string) => Promise<void>;
  deleteFiles: (fileIds: string[]) => Promise<void>;
  starFiles: (fileIds: string[], starred: boolean) => Promise<void>;
  // ... many more actions
}
```

**Key Features:**
- File CRUD operations
- Selection management
- Filtering and sorting
- Caching with 5-minute TTL
- Batch operations

#### uiStore.ts

```typescript
interface UIState {
  activeModal: string | null;
  modalData: any;
  sidebarOpen: boolean;
  rightSidebarOpen: boolean;
  snackbar: { open: boolean; message: string; severity: string };

  openModal: (modal: string, data?: any) => void;
  closeModal: () => void;
  toggleSidebar: () => void;
  showSnackbar: (message: string, severity?: string) => void;
}
```

#### uploadStore.ts

```typescript
interface UploadState {
  uploads: UploadItem[];
  addUpload: (file: File) => string;
  updateProgress: (id: string, progress: number) => void;
  completeUpload: (id: string) => void;
  failUpload: (id: string, error: string) => void;
}
```

### 2. Services Layer (API Integration)

All services use Axios with interceptors for token injection and error handling.

#### api.ts (Base Configuration)

```typescript
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor: Inject JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);
```

#### Service Files

- **authService.ts**: `login()`, `register()`, `getCurrentUser()`
- **fileService.ts**: `getFiles()`, `uploadFile()`, `createFolder()`, `updateFile()`, `deleteFile()`, `batchMove()`, etc.
- **userService.ts**: `getUsers()`, `getStorageInfo()`, `getStorageAnalytics()`
- **shareService.ts**: `shareFile()`, `getShares()`, `updatePermission()`, `revokeShare()`, `generateLink()`
- **commentService.ts**: `getComments()`, `addComment()`, `updateComment()`, `deleteComment()`
- **activityService.ts**: `getActivities()`, `getFileActivities()`
- **versionService.ts**: `getVersions()`, `restoreVersion()`, `downloadVersion()`

### 3. Component Architecture

#### Layout Components

**MainLayout.tsx**
- Container for authenticated pages
- Includes TopBar, Sidebar, RightSidebar, and content area

**TopBar.tsx**
- Search bar
- Create button (new folder/upload)
- User profile menu
- Settings and help icons

**Sidebar.tsx**
- Navigation: My Drive, Starred, Recent, Shared, Trash, Storage
- Storage usage indicator

**RightSidebar.tsx**
- Details panel for selected file/folder
- Shows metadata, preview, sharing info

**DetailsPanel.tsx**
- File/folder information
- Share management
- Activity history
- Version history

#### File Management Components

**FileList.tsx**
- Table view with sortable columns
- Columns: Name, Owner, Modified, Size
- Row selection with checkboxes
- Context menu on right-click

**FileGrid.tsx**
- Card/tile view
- File thumbnails
- Name and basic info
- Hover actions

**FileToolbar.tsx**
- Breadcrumbs for navigation
- View switcher (list/grid)
- Sort options
- Filter button

**SelectionToolbar.tsx**
- Appears when files are selected
- Batch actions: Move, Delete, Star, Share, Download

**FileUploader.tsx**
- Drag-and-drop zone
- File input button
- Multiple file selection

**UploadProgress.tsx**
- Shows active uploads
- Progress bars
- Cancel button

#### Common Components

**ContextMenu.tsx**
- Right-click menu
- Actions: Open, Share, Move, Rename, Star, Delete, Get info
- Submenus for complex actions

**Breadcrumbs.tsx**
- Folder navigation path
- Clickable items
- Overflow handling

**EmptyState.tsx**
- Shows when no files exist
- Custom icon and message
- Call-to-action button

**Snackbar.tsx**
- Toast notifications
- Success/error/info variants
- Auto-dismiss

**UserProfilePopover.tsx**
- User info display
- Logout button
- Settings link

#### Modal Components

**ShareModal.tsx**
- Share with users or generate link
- Permission selector (viewer/commenter/editor)
- List of current shares

**MoveModal.tsx**
- Folder tree view
- Select destination folder
- Create new folder option

**RenameModal.tsx**
- Text input for new name
- Validation

**DeleteModal.tsx**
- Confirmation dialog
- Shows files to be deleted

**FilePreviewModal.tsx**
- Preview files (images, PDFs, text)
- Download and share buttons
- Navigate between files

**CreateFolderModal.tsx**
- Folder name input
- Parent folder selection

### 4. Pages

#### HomePage.tsx
- Main drive view
- Shows files in current folder
- Toolbar with actions
- Upload zone

#### AuthPage.tsx
- Login/Register forms
- Two-step form with transitions
- Auto-login for demo mode

#### StarredPage.tsx
- Shows all starred files
- Same interface as HomePage

#### RecentPage.tsx
- Shows recently opened files
- Sorted by `last_opened_at`

#### SharedPage.tsx
- Shows files shared with the user
- Displays owner information

#### StoragePage.tsx
- Storage usage breakdown
- Charts by file type
- Storage history graph

#### TrashPage.tsx
- Shows deleted files
- Restore and permanent delete actions
- Auto-delete warning (30 days)

### 5. Routing

```typescript
const router = createBrowserRouter([
  { path: '/auth/login', element: <AuthPage /> },
  { path: '/auth/register', element: <AuthPage /> },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/folder/:folderId', element: <HomePage /> },
      { path: '/starred', element: <StarredPage /> },
      { path: '/recent', element: <RecentPage /> },
      { path: '/shared', element: <SharedPage /> },
      { path: '/trash', element: <TrashPage /> },
      { path: '/storage', element: <StoragePage /> },
    ]
  }
]);
```

### 6. Theme

Custom Material-UI theme with Google Drive-inspired colors:

```typescript
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },    // Blue
    secondary: { main: '#5f6368' },   // Gray
    background: {
      default: '#f1f3f4',
      paper: '#ffffff'
    }
  },
  components: {
    MuiButton: { /* customizations */ },
    MuiIconButton: { /* customizations */ },
    // ... 20+ component customizations
  }
});
```

---

## API Documentation

### Complete API Reference

See [Backend Implementation](#backend-implementation) section for full endpoint listing.

### Request/Response Patterns

#### Authentication

**POST /api/auth/register**
```json
Request:
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123"
}

Response:
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "avatar_url": "...",
    "storage_used": 0,
    "storage_limit": 2199023255552
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**POST /api/auth/login**
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "user": { ... },
  "token": "eyJ..."
}
```

#### File Operations

**GET /api/files?parentId=xyz&type=folder**
```json
Response:
{
  "files": [
    {
      "id": "abc-123",
      "name": "Documents",
      "type": "folder",
      "owner_id": 1,
      "parent_id": null,
      "is_starred": 0,
      "is_trashed": 0,
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z",
      "owner": {
        "id": 1,
        "name": "John Doe",
        "email": "user@example.com"
      }
    }
  ]
}
```

**POST /api/files/upload**
```
Request: multipart/form-data
- file: [binary]
- parentId: "xyz-789"

Response:
{
  "file": {
    "id": "new-file-id",
    "name": "document.pdf",
    "type": "file",
    "mime_type": "application/pdf",
    "size": 1024000,
    "file_path": "uploads/user1/document-uuid.pdf",
    ...
  }
}
```

**PATCH /api/files/:id**
```json
Request:
{
  "name": "New Name",
  "is_starred": 1,
  "parent_id": "new-parent-id"
}

Response:
{
  "file": { ... }
}
```

#### Sharing

**POST /api/shares**
```json
Request:
{
  "fileId": "file-123",
  "sharedWithUserId": 2,
  "permission": "editor"
}

Response:
{
  "share": {
    "id": 1,
    "file_id": "file-123",
    "shared_with_user_id": 2,
    "shared_by_user_id": 1,
    "permission": "editor",
    "created_at": "..."
  }
}
```

**POST /api/shares/link**
```json
Request:
{
  "fileId": "file-123",
  "permission": "viewer"
}

Response:
{
  "share": {
    "id": 2,
    "file_id": "file-123",
    "share_link": "abc123def456",
    "permission": "viewer"
  },
  "url": "http://localhost:3000/share/abc123def456"
}
```

---

## Authentication & Authorization

### Authentication Flow

```
┌─────────┐                 ┌─────────┐                 ┌──────────┐
│ Client  │                 │ Backend │                 │ Database │
└────┬────┘                 └────┬────┘                 └────┬─────┘
     │                           │                           │
     │  POST /auth/login         │                           │
     │  { email, password }      │                           │
     ├──────────────────────────>│                           │
     │                           │  Query user by email      │
     │                           ├──────────────────────────>│
     │                           │                           │
     │                           │  User data                │
     │                           │<──────────────────────────┤
     │                           │                           │
     │                           │  Compare password hash    │
     │                           │  (bcryptjs)               │
     │                           │                           │
     │                           │  Generate JWT token       │
     │                           │  (jsonwebtoken)           │
     │                           │                           │
     │  { user, token }          │                           │
     │<──────────────────────────┤                           │
     │                           │                           │
     │  Store token in           │                           │
     │  localStorage             │                           │
     │                           │                           │
     │  GET /files               │                           │
     │  Authorization: Bearer... │                           │
     ├──────────────────────────>│                           │
     │                           │  Verify JWT               │
     │                           │  Extract userId           │
     │                           │                           │
     │                           │  Query files for user     │
     │                           ├──────────────────────────>│
     │                           │                           │
     │                           │  Files data               │
     │                           │<──────────────────────────┤
     │                           │                           │
     │  { files: [...] }         │                           │
     │<──────────────────────────┤                           │
     │                           │                           │
```

### JWT Token Structure

```typescript
{
  userId: number,
  email: string,
  iat: number,      // Issued at
  exp: number       // Expiration (24 hours)
}
```

### Authorization Levels

1. **Owner**: Full control (read, write, delete, share)
2. **Editor**: Can modify file/folder content
3. **Commenter**: Can view and add comments
4. **Viewer**: Read-only access

### Permission Checks

**File Access:**
```typescript
function canAccessFile(user, file) {
  // Owner always has access
  if (file.owner_id === user.id) return true;

  // Check if file is shared with user
  const share = shareModel.findByFileAndUser(file.id, user.id);
  if (share) return true;

  // Check parent folder permissions (recursive)
  if (file.parent_id) {
    const parent = fileModel.findById(file.parent_id);
    return canAccessFile(user, parent);
  }

  return false;
}
```

**File Modification:**
```typescript
function canModifyFile(user, file) {
  if (file.owner_id === user.id) return true;

  const share = shareModel.findByFileAndUser(file.id, user.id);
  return share?.permission === 'editor';
}
```

---

## Data Flow & Integration

### Frontend-Backend Data Flow

#### Example: Uploading a File

```
┌──────────┐         ┌──────────┐         ┌──────────┐         ┌──────────┐
│  React   │         │ Zustand  │         │ Service  │         │ Backend  │
│Component │         │  Store   │         │  Layer   │         │   API    │
└────┬─────┘         └────┬─────┘         └────┬─────┘         └────┬─────┘
     │                    │                     │                     │
     │  handleUpload()    │                     │                     │
     ├───────────────────>│                     │                     │
     │                    │                     │                     │
     │                    │ addUpload()         │                     │
     │                    │ (create progress    │                     │
     │                    │  tracker)           │                     │
     │                    │                     │                     │
     │                    │ uploadFile()        │                     │
     │                    ├────────────────────>│                     │
     │                    │                     │                     │
     │                    │                     │ POST /files/upload  │
     │                    │                     │ (multipart/form)    │
     │                    │                     ├────────────────────>│
     │                    │                     │                     │
     │                    │                     │  onUploadProgress   │
     │                    │ updateProgress()    │<────────────────────┤
     │                    │<────────────────────┤                     │
     │  Re-render with    │                     │                     │
     │  progress bar      │                     │                     │
     │<───────────────────┤                     │                     │
     │                    │                     │                     │
     │                    │                     │  { file: {...} }    │
     │                    │  completeUpload()   │<────────────────────┤
     │                    │<────────────────────┤                     │
     │                    │                     │                     │
     │                    │ addFileToStore()    │                     │
     │                    │ showSnackbar()      │                     │
     │                    │                     │                     │
     │  Re-render with    │                     │                     │
     │  new file          │                     │                     │
     │<───────────────────┤                     │                     │
```

#### Example: Loading Files for a Folder

```
1. User navigates to /folder/abc-123

2. HomePage component mounts
   - useEffect() calls fileStore.fetchFiles('abc-123')

3. fileStore.fetchFiles()
   - Check cache (is data fresh?)
   - If cache hit and fresh → return cached data
   - If cache miss or stale → proceed

4. Call fileService.getFiles(folderId)
   - Axios GET /api/files?parentId=abc-123
   - Request interceptor adds JWT token

5. Backend receives request
   - auth middleware verifies token
   - fileController.listFiles() executes
   - fileModel.findByParent('abc-123') queries DB
   - Returns files array

6. Frontend receives response
   - fileService returns data
   - fileStore updates state
   - Updates cache timestamp

7. React re-renders
   - FileList/FileGrid displays files
```

### State Synchronization Patterns

#### Optimistic Updates

```typescript
// Delete file with optimistic update
async deleteFile(fileId: string) {
  // 1. Immediately update UI
  const filesCopy = [...this.files];
  this.files = this.files.filter(f => f.id !== fileId);

  try {
    // 2. Send request to backend
    await fileService.deleteFile(fileId);

    // 3. Success - show notification
    uiStore.showSnackbar('File moved to trash', 'success');
  } catch (error) {
    // 4. Rollback on error
    this.files = filesCopy;
    uiStore.showSnackbar('Failed to delete file', 'error');
  }
}
```

#### Cache Invalidation

```typescript
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  data: FileItem[];
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

function getCachedFiles(folderId: string) {
  const entry = cache.get(folderId);
  if (!entry) return null;

  const age = Date.now() - entry.timestamp;
  if (age > CACHE_TTL) {
    cache.delete(folderId);
    return null;
  }

  return entry.data;
}

function invalidateCache(folderId: string) {
  cache.delete(folderId);
  // Also invalidate parent folder cache
  const file = fileStore.getFileById(folderId);
  if (file?.parent_id) {
    cache.delete(file.parent_id);
  }
}
```

---

## File Upload & Storage

### Upload Flow

#### 1. Client-Side (React)

```typescript
// FileUploader.tsx
const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  const currentFolderId = fileStore.currentFolder?.id;

  fileStore.uploadFiles(files, currentFolderId);
};
```

#### 2. File Store

```typescript
// fileStore.ts
async uploadFiles(files: File[], parentId?: string) {
  for (const file of files) {
    const uploadId = uploadStore.addUpload(file);

    try {
      const uploadedFile = await fileService.uploadFile(
        file,
        parentId,
        (progress) => {
          uploadStore.updateProgress(uploadId, progress);
        }
      );

      this.files.push(uploadedFile);
      uploadStore.completeUpload(uploadId);
    } catch (error) {
      uploadStore.failUpload(uploadId, error.message);
    }
  }
}
```

#### 3. Service Layer

```typescript
// fileService.ts
async uploadFile(
  file: File,
  parentId?: string,
  onProgress?: (progress: number) => void
): Promise<FileItem> {
  const formData = new FormData();
  formData.append('file', file);
  if (parentId) formData.append('parentId', parentId);

  const response = await api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      const progress = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgress?.(progress);
    }
  });

  return response.data.file;
}
```

#### 4. Backend (Express + Multer)

```typescript
// multer.ts - Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user.id;
    const userDir = path.join('uploads', `user${userId}`);
    fs.mkdirSync(userDir, { recursive: true });
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    // Add file type validation if needed
    cb(null, true);
  }
});
```

```typescript
// fileController.ts
async uploadFile(req, res) {
  const { file } = req;
  const { parentId } = req.body;
  const userId = req.user.id;

  // Create file record
  const fileRecord = await fileModel.create({
    id: uuidv4(),
    name: file.originalname,
    type: 'file',
    mime_type: file.mimetype,
    size: file.size,
    parent_id: parentId || null,
    owner_id: userId,
    file_path: file.path
  });

  // Update user storage
  await userModel.updateStorageUsed(userId, file.size);

  // Log activity
  await activityLogger.log(userId, 'upload', fileRecord.id);

  // Create version entry
  await versionModel.create({
    file_id: fileRecord.id,
    version_number: 1,
    file_path: file.path,
    size: file.size,
    uploaded_by: userId
  });

  res.json({ file: fileRecord });
}
```

### File Storage Structure

```
uploads/
├── user1/
│   ├── abc-123-document.pdf
│   ├── def-456-image.jpg
│   └── ghi-789-video.mp4
├── user2/
│   ├── ...
└── versions/
    ├── file-abc-123/
    │   ├── v1-abc-123-document.pdf
    │   ├── v2-abc-123-document.pdf
    │   └── v3-abc-123-document.pdf
    └── ...
```

---

## Sharing & Permissions

### Permission Model

```typescript
type Permission = 'viewer' | 'commenter' | 'editor';

interface Share {
  id: number;
  file_id: string;
  shared_with_user_id: number | null;  // null for public links
  shared_by_user_id: number;
  permission: Permission;
  share_link: string | null;
  created_at: string;
}
```

### Sharing Methods

#### 1. Share with Specific User

```typescript
// Frontend
async shareWithUser(fileId: string, userId: number, permission: Permission) {
  const share = await shareService.createShare({
    fileId,
    sharedWithUserId: userId,
    permission
  });

  uiStore.showSnackbar(`Shared with ${permission} access`, 'success');
  return share;
}

// Backend
async createShare(req, res) {
  const { fileId, sharedWithUserId, permission } = req.body;
  const userId = req.user.id;

  // Check if user owns the file or has editor permission
  const file = await fileModel.findById(fileId);
  const canShare = file.owner_id === userId ||
    await shareModel.hasPermission(fileId, userId, 'editor');

  if (!canShare) {
    return res.status(403).json({ message: 'No permission to share' });
  }

  // Create share
  const share = await shareModel.create({
    file_id: fileId,
    shared_with_user_id: sharedWithUserId,
    shared_by_user_id: userId,
    permission
  });

  // Log activity
  await activityLogger.log(userId, 'share', fileId, {
    sharedWith: sharedWithUserId,
    permission
  });

  res.json({ share });
}
```

#### 2. Generate Public Link

```typescript
// Frontend
async generatePublicLink(fileId: string, permission: Permission) {
  const result = await shareService.generateShareLink({
    fileId,
    permission
  });

  navigator.clipboard.writeText(result.url);
  uiStore.showSnackbar('Link copied to clipboard', 'success');

  return result;
}

// Backend
async generateShareLink(req, res) {
  const { fileId, permission } = req.body;
  const userId = req.user.id;

  const token = uuidv4();

  const share = await shareModel.create({
    file_id: fileId,
    shared_with_user_id: null,  // null = public
    shared_by_user_id: userId,
    permission,
    share_link: token
  });

  const url = `${process.env.APP_URL}/share/${token}`;

  res.json({ share, url });
}
```

#### 3. Access via Public Link

```typescript
// Backend
async accessViaShareLink(req, res) {
  const { token } = req.params;

  const share = await shareModel.findByShareLink(token);
  if (!share) {
    return res.status(404).json({ message: 'Share link not found' });
  }

  const file = await fileModel.findById(share.file_id);

  res.json({
    file,
    permission: share.permission
  });
}
```

### Permission Inheritance

Permissions are inherited from parent folders:

```typescript
async function getEffectivePermission(userId: number, fileId: string): Promise<Permission | null> {
  const file = await fileModel.findById(fileId);

  // Owner has full access
  if (file.owner_id === userId) {
    return 'editor';
  }

  // Check direct share
  const directShare = await shareModel.findByFileAndUser(fileId, userId);
  if (directShare) {
    return directShare.permission;
  }

  // Check parent folder permissions (recursive)
  if (file.parent_id) {
    return getEffectivePermission(userId, file.parent_id);
  }

  return null;
}
```

---

## Key Features

### 1. File Management
- ✅ Upload files (drag-and-drop, file picker)
- ✅ Create folders
- ✅ Rename files/folders
- ✅ Move files/folders (drag-and-drop, move modal)
- ✅ Delete files/folders (soft delete to trash)
- ✅ Restore from trash
- ✅ Permanent delete
- ✅ Star/unstar files
- ✅ Download files
- ✅ Preview files (images, PDFs, text)

### 2. Batch Operations
- ✅ Batch move
- ✅ Batch delete
- ✅ Batch restore
- ✅ Batch star/unstar
- ✅ Batch permanent delete

### 3. Sharing & Collaboration
- ✅ Share with specific users
- ✅ Three permission levels (viewer, commenter, editor)
- ✅ Generate public share links
- ✅ Manage existing shares
- ✅ Update permissions
- ✅ Revoke access

### 4. Comments
- ✅ Add comments to files
- ✅ Edit comments
- ✅ Delete comments
- ✅ View comment history

### 5. Version Control
- ✅ Automatic versioning on file upload
- ✅ View version history
- ✅ Restore previous versions
- ✅ Download specific versions

### 6. Activity Logging
- ✅ Track all user actions (upload, delete, share, etc.)
- ✅ View activity feed
- ✅ File-specific activity history

### 7. Search & Filtering
- ✅ Global search by filename
- ✅ Filter by type (file/folder)
- ✅ Filter by starred status
- ✅ Sort by name, date, size

### 8. Storage Management
- ✅ Storage quota tracking
- ✅ Storage analytics by file type
- ✅ Storage history over time
- ✅ Visual storage usage indicator

### 9. Views
- ✅ My Drive (all files)
- ✅ Recent (recently opened)
- ✅ Starred (bookmarked files)
- ✅ Shared with me
- ✅ Trash
- ✅ Storage analytics

### 10. UI/UX Features
- ✅ List and grid view modes
- ✅ Drag-and-drop upload
- ✅ Drag-and-drop file organization
- ✅ Context menus (right-click)
- ✅ Keyboard shortcuts
- ✅ Loading skeletons
- ✅ Toast notifications
- ✅ Progress bars for uploads
- ✅ Breadcrumb navigation
- ✅ Responsive design

---

## Deployment

### Docker Deployment

The application is fully containerized with Docker Compose.

#### docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    container_name: google-drive-backend
    ports:
      - "5000:5000"
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/data:/app/data
    environment:
      - NODE_ENV=production
      - PORT=5000
      - DATABASE_PATH=/app/data/drive.db
    restart: unless-stopped
    networks:
      - app-network

  frontend:
    build: ./frontend
    container_name: google-drive-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  uploads:
  data:
```

#### Backend Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

#### Frontend Dockerfile

```dockerfile
# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration

```nginx
server {
  listen 80;
  server_name localhost;

  root /usr/share/nginx/html;
  index index.html;

  # Frontend routes
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Backend API proxy
  location /api {
    proxy_pass http://backend:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

### Deployment Commands

```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Rebuild containers
docker-compose up -d --build
```

---

## Development Setup

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- SQLite3 (optional for CLI access)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
NODE_ENV=development
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
DATABASE_PATH=./database/drive.db
DUMMY_USER_EMAIL=demo@drive.com
DUMMY_USER_PASSWORD=demo123
DUMMY_USER_NAME=Demo User
EOF

# Initialize database
npm run db:init

# Seed database (optional)
npm run db:seed

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:5000/api
VITE_DUMMY_USER_EMAIL=demo@drive.com
VITE_DUMMY_USER_PASSWORD=demo123
EOF

# Start development server
npm run dev
```

### Database Management

```bash
# Initialize database schema
npm run db:init

# Seed with test data
npm run db:seed

# Reset database (drop and recreate)
npm run db:reset

# Access database CLI
sqlite3 database/drive.db
```

### Available Scripts

**Backend:**
- `npm run dev`: Start with nodemon (hot reload)
- `npm run build`: Compile TypeScript
- `npm start`: Run production server
- `npm run db:init`: Initialize database
- `npm run db:seed`: Seed test data

**Frontend:**
- `npm run dev`: Start Vite dev server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

---

## Testing

### Manual Testing Checklist

#### Authentication
- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Auto-login with demo account
- [ ] Logout
- [ ] Token expiration handling

#### File Operations
- [ ] Upload single file
- [ ] Upload multiple files
- [ ] Upload via drag-and-drop
- [ ] Create folder
- [ ] Rename file/folder
- [ ] Move file to folder
- [ ] Star/unstar file
- [ ] Delete file (to trash)
- [ ] Restore from trash
- [ ] Permanent delete
- [ ] Download file
- [ ] Preview file

#### Batch Operations
- [ ] Select multiple files
- [ ] Batch move
- [ ] Batch delete
- [ ] Batch star
- [ ] Batch restore

#### Sharing
- [ ] Share file with user (viewer)
- [ ] Share file with user (editor)
- [ ] Generate public link
- [ ] Access via public link
- [ ] Update permission
- [ ] Revoke share

#### Navigation
- [ ] Navigate into folder
- [ ] Breadcrumb navigation
- [ ] Sidebar navigation (Recent, Starred, Shared, Trash)

#### Views
- [ ] Toggle list/grid view
- [ ] Sort by name, date, size
- [ ] Filter by type
- [ ] Search files

#### UI/UX
- [ ] Context menu (right-click)
- [ ] Keyboard shortcuts
- [ ] Upload progress
- [ ] Toast notifications
- [ ] Loading states
- [ ] Error handling

### API Testing with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get files (with auth)
curl -X GET http://localhost:5000/api/files \
  -H "Authorization: Bearer YOUR_TOKEN"

# Upload file
curl -X POST http://localhost:5000/api/files/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/file.pdf" \
  -F "parentId=folder-id"
```

---

## Security Considerations

### 1. Authentication & Authorization
- ✅ JWT tokens with expiration
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Token validation on every protected route
- ✅ Permission checks before file operations

### 2. Input Validation
- ✅ express-validator for request validation
- ✅ Email format validation
- ✅ Password minimum length (6 characters)
- ✅ File size limits (100MB)
- ✅ SQL injection prevention (parameterized queries)

### 3. File Upload Security
- ✅ File size limits
- ✅ Unique filename generation (UUID)
- ✅ User-isolated storage directories
- ⚠️ TODO: File type whitelist/blacklist
- ⚠️ TODO: Malware scanning

### 4. Data Protection
- ✅ CORS configuration
- ✅ Foreign key constraints with CASCADE delete
- ✅ Soft delete pattern (trash before permanent delete)
- ⚠️ TODO: Encryption at rest
- ⚠️ TODO: HTTPS in production

### 5. Error Handling
- ✅ Global error handler
- ✅ Sensitive error info hidden in production
- ✅ Graceful error messages to users

### 6. Rate Limiting
- ⚠️ TODO: Implement rate limiting for API endpoints
- ⚠️ TODO: Upload throttling

### 7. Security Headers
- ⚠️ TODO: Add helmet middleware
- ⚠️ TODO: CSP headers
- ⚠️ TODO: XSS protection headers

---

## Performance Optimizations

### Backend Optimizations

1. **Database Indexing**
   - 12 indexes on frequently queried columns
   - Composite indexes for complex queries

2. **Query Optimization**
   - Use of prepared statements
   - Selective column fetching
   - Join optimization

3. **File Serving**
   - Streaming large files
   - Proper cache headers

### Frontend Optimizations

1. **State Management**
   - 5-minute cache TTL
   - Optimistic updates
   - Batch state updates

2. **Component Optimization**
   - React.memo for expensive components
   - useMemo for filtered/sorted lists
   - useCallback for event handlers

3. **Code Splitting**
   - React.lazy for route-based splitting
   - Dynamic imports for modals

4. **Asset Optimization**
   - Vite build optimization
   - Tree shaking
   - Minification

5. **Network Optimization**
   - Axios request cancellation
   - Debounced search
   - Upload progress tracking

### Potential Improvements

- [ ] Implement virtual scrolling for large file lists
- [ ] Add service worker for offline support
- [ ] Implement CDN for static assets
- [ ] Add Redis caching layer
- [ ] WebSocket for real-time updates
- [ ] Image thumbnail generation
- [ ] Lazy loading for file previews

---

## Future Enhancements

### Short-term (Next Sprint)

1. **Advanced Search**
   - Full-text search
   - Advanced query syntax (type:pdf owner:me)
   - Search filters UI

2. **File Type Support**
   - PDF viewer
   - Video player
   - Audio player
   - Code syntax highlighting

3. **Collaboration**
   - Real-time editing notifications
   - @mentions in comments
   - Notification system

4. **Mobile App**
   - React Native app
   - Mobile-optimized UI

### Medium-term

1. **AI Features**
   - Smart file categorization
   - Auto-tagging
   - Content-based search
   - Duplicate detection

2. **Cloud Storage Integration**
   - AWS S3 backend
   - Google Cloud Storage
   - Azure Blob Storage

3. **Enhanced Sharing**
   - Expiring share links
   - Password-protected links
   - Download limits

4. **Admin Dashboard**
   - User management
   - Storage analytics
   - System monitoring

### Long-term

1. **Enterprise Features**
   - Team workspaces
   - Admin roles
   - Audit logs
   - Compliance reports

2. **Advanced Security**
   - Two-factor authentication
   - End-to-end encryption
   - Data loss prevention

3. **Integrations**
   - Google Workspace
   - Microsoft 365
   - Slack/Teams notifications
   - Zapier/IFTTT

4. **Performance**
   - CDN integration
   - Database sharding
   - Microservices architecture
   - Kubernetes deployment

---

## Appendix

### A. Environment Variables

**Backend (.env)**
```
NODE_ENV=development|production
PORT=5000
JWT_SECRET=your-secret-key
DATABASE_PATH=./database/drive.db
DUMMY_USER_EMAIL=demo@drive.com
DUMMY_USER_PASSWORD=demo123
DUMMY_USER_NAME=Demo User
```

**Frontend (.env)**
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_DUMMY_USER_EMAIL=demo@drive.com
VITE_DUMMY_USER_PASSWORD=demo123
```

### B. Project Metrics

- **Total Files:** 100+
- **Total Lines of Code:** ~15,000
- **Backend TypeScript Files:** 38
- **Frontend TypeScript Files:** 65+
- **Database Tables:** 6
- **API Endpoints:** 50+
- **React Components:** 32+
- **Zustand Stores:** 4
- **Dependencies:** 25+ (backend), 30+ (frontend)

### C. File Extensions Supported

Documents: `.pdf`, `.doc`, `.docx`, `.txt`, `.md`
Images: `.jpg`, `.jpeg`, `.png`, `.gif`, `.svg`, `.webp`
Videos: `.mp4`, `.mov`, `.avi`, `.webm`
Audio: `.mp3`, `.wav`, `.ogg`
Archives: `.zip`, `.tar`, `.gz`, `.rar`
Code: `.js`, `.ts`, `.py`, `.java`, `.cpp`, `.html`, `.css`
Spreadsheets: `.xls`, `.xlsx`, `.csv`
Presentations: `.ppt`, `.pptx`

### D. Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### E. License

This project is for educational and demonstration purposes.

---

**End of Documentation**

*For questions or contributions, please refer to the repository README or contact the development team.*
