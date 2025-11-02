# Backend Implementation Plan - Google Drive Clone

## 🎯 Overview

Build a simple, functional backend using **Node.js + Express** with **SQLite** for data persistence and mock file storage on the filesystem.

---

## 📚 Technology Stack

### Backend

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: SQLite3 (simple, file-based, perfect for demo)
- **ORM**: Better-SQLite3 or Sequelize (optional)
- **File Storage**: Local filesystem (`/uploads` directory)
- **Authentication**: JWT tokens (mocked/simple)
- **Validation**: express-validator
- **CORS**: cors middleware
- **File Upload**: multer

### Development Tools

- **TypeScript**: For type safety
- **Nodemon**: Hot reload during development
- **ESLint**: Code quality
- **Prettier**: Code formatting

---

## 🗄️ Database Schema

### 1. Users Table

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,  -- For demo, can be simple
  avatar_url TEXT,
  storage_used INTEGER DEFAULT 0,  -- in bytes
  storage_limit INTEGER DEFAULT 2199023255552,  -- 2TB default
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Files Table

```sql
CREATE TABLE files (
  id TEXT PRIMARY KEY,  -- UUID
  name TEXT NOT NULL,
  type TEXT NOT NULL,  -- 'file' or 'folder'
  mime_type TEXT,  -- e.g., 'application/pdf', 'image/png'
  size INTEGER DEFAULT 0,  -- in bytes
  parent_id TEXT,  -- NULL for root level
  owner_id INTEGER NOT NULL,
  file_path TEXT,  -- actual file location on disk (NULL for folders)
  thumbnail_path TEXT,  -- for images/videos
  is_starred INTEGER DEFAULT 0,  -- 0 or 1
  is_trashed INTEGER DEFAULT 0,  -- 0 or 1
  trashed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_opened_at DATETIME,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES files(id) ON DELETE CASCADE
);
```

### 3. Shares Table

```sql
CREATE TABLE shares (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_id TEXT NOT NULL,
  shared_with_user_id INTEGER,  -- NULL for public links
  shared_by_user_id INTEGER NOT NULL,
  permission TEXT NOT NULL,  -- 'viewer', 'commenter', 'editor'
  share_link TEXT UNIQUE,  -- for shareable links
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
  FOREIGN KEY (shared_with_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (shared_by_user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 4. Activities Table

```sql
CREATE TABLE activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  file_id TEXT,
  action TEXT NOT NULL,  -- 'upload', 'delete', 'share', 'rename', 'move', 'restore'
  details TEXT,  -- JSON string with additional info
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE SET NULL
);
```

### 5. File Versions Table

```sql
CREATE TABLE file_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_id TEXT NOT NULL,
  version_number INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  size INTEGER NOT NULL,
  uploaded_by INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
);
```

### 6. Comments Table (for collaboration)

```sql
CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_id TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  comment_text TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🛣️ API Routes Structure

### Authentication Routes (`/api/auth`)

```
POST   /api/auth/register       - Register new user (mocked)
POST   /api/auth/login          - Login user, return JWT
POST   /api/auth/logout         - Logout (optional, mainly client-side)
GET    /api/auth/me             - Get current user info
```

### User Routes (`/api/users`)

```
GET    /api/users               - Get all users (for sharing)
GET    /api/users/:id           - Get user by ID
PATCH  /api/users/:id           - Update user profile
GET    /api/users/:id/storage   - Get storage usage stats
```

### File/Folder Routes (`/api/files`)

```
GET    /api/files               - List files/folders (with filters, search)
GET    /api/files/:id           - Get file/folder details
POST   /api/files               - Create folder
POST   /api/files/upload        - Upload file(s)
PATCH  /api/files/:id           - Update file/folder (rename, move, star/unstar)
DELETE /api/files/:id           - Move to trash (soft delete)
POST   /api/files/:id/restore   - Restore from trash
DELETE /api/files/:id/permanent - Permanently delete

GET    /api/files/recent        - Get recently accessed files
GET    /api/files/starred       - Get starred files
GET    /api/files/shared        - Get files shared with me
GET    /api/files/trash         - Get trashed files

GET    /api/files/:id/download  - Download file
GET    /api/files/:id/preview   - Get file preview/thumbnail
POST   /api/files/:id/copy      - Copy file/folder
POST   /api/files/:id/move      - Move file/folder to different parent
```

### Sharing Routes (`/api/shares`)

```
GET    /api/shares/:fileId      - Get all shares for a file
POST   /api/shares              - Create new share
PATCH  /api/shares/:id          - Update share permission
DELETE /api/shares/:id          - Revoke share access
POST   /api/shares/link         - Generate shareable link
GET    /api/shares/link/:token  - Access file via shareable link
```

### Activity Routes (`/api/activities`)

```
GET    /api/activities          - Get activity feed for current user
GET    /api/activities/:fileId  - Get activities for specific file
```

### Version Routes (`/api/versions`)

```
GET    /api/versions/:fileId    - Get version history for file
POST   /api/versions/:fileId    - Create new version (re-upload)
GET    /api/versions/:fileId/:versionId/download - Download specific version
```

### Comment Routes (`/api/comments`)

```
GET    /api/comments/:fileId    - Get comments for file
POST   /api/comments            - Add comment to file
PATCH  /api/comments/:id        - Edit comment
DELETE /api/comments/:id        - Delete comment
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # SQLite connection setup
│   │   ├── multer.ts            # File upload configuration
│   │   └── jwt.ts               # JWT configuration
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication middleware
│   │   ├── errorHandler.ts     # Global error handler
│   │   ├── validator.ts         # Request validation middleware
│   │   └── upload.ts            # File upload middleware
│   ├── models/
│   │   ├── User.ts              # User model/repository
│   │   ├── File.ts              # File model/repository
│   │   ├── Share.ts             # Share model/repository
│   │   ├── Activity.ts          # Activity model/repository
│   │   ├── Version.ts           # Version model/repository
│   │   └── Comment.ts           # Comment model/repository
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── file.routes.ts
│   │   ├── share.routes.ts
│   │   ├── activity.routes.ts
│   │   ├── version.routes.ts
│   │   └── comment.routes.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── fileController.ts
│   │   ├── shareController.ts
│   │   ├── activityController.ts
│   │   ├── versionController.ts
│   │   └── commentController.ts
│   ├── services/
│   │   ├── fileService.ts       # File operations logic
│   │   ├── storageService.ts    # File system storage logic
│   │   ├── searchService.ts     # Search and filter logic
│   │   └── activityService.ts   # Activity tracking
│   ├── utils/
│   │   ├── logger.ts            # Logging utility
│   │   ├── fileHelpers.ts       # File type detection, thumbnails
│   │   ├── validators.ts        # Custom validators
│   │   └── constants.ts         # Constants (file types, sizes, etc.)
│   ├── types/
│   │   └── index.ts             # TypeScript types/interfaces
│   ├── app.ts                   # Express app setup
│   └── server.ts                # Server entry point
├── uploads/                     # File storage directory
│   ├── files/                   # Actual uploaded files
│   ├── thumbnails/              # Generated thumbnails
│   └── versions/                # File versions
├── database/
│   ├── schema.sql               # Database schema
│   ├── seed.sql                 # Seed data for testing
│   └── drive.db                 # SQLite database file (created)
├── tests/                       # Test files (optional)
├── .env.example
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
├── nodemon.json
└── README.md
```

---

## 🔧 Implementation Phases

### **Phase 1: Project Setup & Basic Infrastructure** (Day 1)

- ✅ Initialize Node.js + TypeScript project
- ✅ Setup Express server with CORS
- ✅ Configure SQLite database connection
- ✅ Create database schema and seed data
- ✅ Setup basic middleware (error handling, logging)
- ✅ Create mock users for testing
- ✅ Setup file upload directory structure

### **Phase 2: Authentication System** (Day 1-2)

- ✅ Implement user registration (mocked, simple)
- ✅ Implement login with JWT tokens
- ✅ Create auth middleware for protected routes
- ✅ Implement "Get Current User" endpoint
- ✅ Test authentication flow

### **Phase 3: File Management - Core CRUD** (Day 2-3)

- ✅ Create folder endpoint
- ✅ File upload endpoint with multer
- ✅ List files/folders (with parent_id filtering)
- ✅ Get file/folder by ID
- ✅ Rename file/folder
- ✅ Delete (soft delete to trash)
- ✅ Restore from trash
- ✅ Permanent delete
- ✅ Track activities for all operations

### **Phase 4: Advanced File Operations** (Day 3-4)

- ✅ Move files/folders (change parent_id)
- ✅ Copy files/folders
- ✅ Star/Unstar files
- ✅ Download file endpoint
- ✅ File preview endpoint (serve file)
- ✅ Thumbnail generation for images (optional, can be mocked)
- ✅ Update file metadata tracking

### **Phase 5: Search & Filters** (Day 4-5)

- ✅ Global search by filename
- ✅ Filter by file type (documents, images, PDFs, etc.)
- ✅ Filter by owner (owned by me, shared with me)
- ✅ Filter by date (modified, created)
- ✅ Filter by starred status
- ✅ Combine multiple filters
- ✅ Recent files endpoint (sort by last_opened_at)

### **Phase 6: Sharing & Permissions** (Day 5-6)

- ✅ Share file/folder with specific user
- ✅ Set permission levels (viewer, commenter, editor)
- ✅ List shares for a file
- ✅ Update share permissions
- ✅ Revoke share access
- ✅ Generate shareable link (mocked URL)
- ✅ Access file via share link
- ✅ Get "Shared with me" files
- ✅ Track sharing activities

### **Phase 7: Activity Feed & Versioning** (Day 6-7)

- ✅ Create activity log for all operations
- ✅ Get activity feed endpoint
- ✅ Get activities for specific file
- ✅ File version tracking on upload
- ✅ List file versions
- ✅ Download specific version
- ✅ Version comparison (metadata only)

### **Phase 8: Comments & Collaboration** (Day 7)

- ✅ Add comment to file
- ✅ List comments for file
- ✅ Edit/Delete comments
- ✅ Track comment activities

### **Phase 9: Storage Analytics** (Day 7-8)

- ✅ Calculate storage used per user
- ✅ Storage breakdown by file type
- ✅ Update storage on upload/delete
- ✅ Storage usage endpoint

### **Phase 10: Frontend Integration** (Day 8-12)

- ✅ Connect frontend to backend APIs
- ✅ Replace mock data with real API calls
- ✅ Implement file upload with progress
- ✅ Implement all file operations
- ✅ Implement sharing functionality
- ✅ Implement search and filters
- ✅ Test all workflows end-to-end

### **Phase 11: Polish & Edge Cases** (Day 12-13)

- ✅ Handle duplicate file names
- ✅ Validate file sizes
- ✅ Prevent circular folder references
- ✅ Handle concurrent operations
- ✅ Add proper error messages
- ✅ Optimize queries for performance

### **Phase 12: Documentation & Docker** (Day 13-14)

- ✅ Create comprehensive README
- ✅ Document API endpoints (Postman collection or OpenAPI)
- ✅ Create Dockerfile for backend
- ✅ Create Dockerfile for frontend
- ✅ Create docker-compose.yml
- ✅ Test dockerized application
- ✅ Add deployment instructions

---

## 🎭 Mocked vs Real Features

### ✅ Real Implementation

- User authentication (simple JWT)
- File/folder CRUD operations
- File upload to local filesystem
- SQLite database for all metadata
- Search and filtering
- Sharing with users in database
- Activity tracking
- Storage calculations
- Comments system
- Version history metadata

### 🎭 Mocked/Simplified

- **Google OAuth**: Simple email/password login
- **Cloud Storage**: Local filesystem instead of S3/GCS
- **Thumbnail Generation**: Mock thumbnails or simple image resizing
- **Real-time Updates**: Polling instead of WebSockets (optional upgrade)
- **Email Notifications**: Just database records, no actual emails
- **Advanced File Preview**: Basic preview, not full document rendering
- **AI Search**: Basic text search, not semantic search
- **Virus Scanning**: Skip this entirely
- **CDN**: Direct file serving

---

## 🔐 Security Considerations

### Implemented

- JWT token authentication
- Password hashing (bcrypt)
- File size limits
- File type validation
- Path traversal prevention
- SQL injection prevention (parameterized queries)
- CORS configuration
- Input validation

### Simplified for Demo

- Rate limiting (can add express-rate-limit)
- HTTPS (local HTTP is fine)
- Advanced authorization (basic permission checks)
- File encryption at rest
- Audit logging (basic activity log only)

---

## 📊 Sample Data

### Mock Users (3-5 users)

```json
[
  {
    "email": "john@example.com",
    "name": "John Doe",
    "password": "password123"
  },
  {
    "email": "jane@example.com",
    "name": "Jane Smith",
    "password": "password123"
  },
  {
    "email": "bob@example.com",
    "name": "Bob Johnson",
    "password": "password123"
  }
]
```

### Mock Files/Folders

- Sample folder structure
- Sample files (PDFs, images, documents)
- Pre-shared files between users
- Some starred items
- Some trashed items

---

## 🚀 Quick Start Commands

```bash
# Backend setup
cd backend
npm install
npm run db:init        # Create database and run migrations
npm run db:seed        # Seed with sample data
npm run dev            # Start development server

# Frontend (existing)
cd frontend
npm install
npm run dev

# Docker (later)
docker-compose up --build
```

---

## 📝 Environment Variables

```env
# Backend/.env
NODE_ENV=development
PORT=5000
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRES_IN=7d
DATABASE_PATH=./database/drive.db
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=104857600  # 100MB
ALLOWED_FILE_TYPES=*     # or specific types
FRONTEND_URL=http://localhost:5173
```

---

## 🧪 Testing Strategy

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Create/rename/delete folders
- [ ] Upload/download files
- [ ] Move files between folders
- [ ] Star/unstar files
- [ ] Trash and restore
- [ ] Share files with users
- [ ] Change permissions
- [ ] Search files
- [ ] Filter by type/date/owner
- [ ] View activity feed
- [ ] Add/view comments
- [ ] Check storage usage

### API Testing

- Use Postman or Thunder Client
- Create collection for all endpoints
- Test with multiple users
- Test edge cases

---

## 🎯 Success Metrics

✅ All README requirements implemented
✅ Frontend fully connected to backend
✅ Database persists data correctly
✅ File upload/download works smoothly
✅ Sharing and permissions functional
✅ Search and filters operational
✅ Activity tracking working
✅ Docker deployment successful
✅ Clean, documented codebase
✅ Demo-ready application

---

## 🔄 Iteration Strategy

1. **Build backend incrementally** (Phase 1-9)
2. **Start frontend integration early** (Phase 10)
3. **Keep UI refinements ongoing** (throughout)
4. **Test each feature before moving on**
5. **Document as you build**
6. **Docker at the end** (Phase 12)

---

## 📚 Next Steps

1. **Create backend project structure**
2. **Setup database schema**
3. **Implement authentication first**
4. **Build file CRUD operations**
5. **Connect frontend incrementally**
6. **Polish and dockerize**

---

**Timeline**: ~14 days for full implementation
**Focus**: Simplicity, functionality, and demo-readiness
**Motto**: Keep it simple, make it work, then make it pretty! 🚀
