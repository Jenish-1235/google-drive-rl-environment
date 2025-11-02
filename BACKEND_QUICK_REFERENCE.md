# Quick Reference - Backend Implementation

## 🎯 What This Backend Does

Provides a complete REST API for Google Drive clone with:

- User authentication (JWT)
- File/folder management with hierarchy
- File upload/download
- Sharing and permissions
- Activity tracking
- Comments on files
- Search and filters
- Storage tracking

---

## 📊 Technology Summary

**Stack**: Node.js + Express + TypeScript + SQLite + Multer
**Database**: 6 tables (users, files, shares, activities, file_versions, comments)
**Storage**: Local filesystem in `./uploads` directory
**Auth**: JWT tokens with bcrypt password hashing

---

## 🗂️ Database Tables

```
users           → User accounts and storage info
files           → Both files AND folders (type field differentiates)
shares          → Sharing relationships and permissions
activities      → Activity log for all actions
file_versions   → File version history
comments        → Comments on files
```

---

## 🛣️ API Endpoints Summary

### Auth (3 endpoints)

```
POST   /api/auth/register       - Create account
POST   /api/auth/login          - Login and get JWT token
GET    /api/auth/me             - Get current user info
```

### Files (14+ endpoints)

```
GET    /api/files               - List files (with filters)
GET    /api/files/:id           - Get file details
POST   /api/files               - Create folder
POST   /api/files/upload        - Upload file
PATCH  /api/files/:id           - Update file (rename, move, star)
DELETE /api/files/:id           - Soft delete (to trash)
POST   /api/files/:id/restore   - Restore from trash
DELETE /api/files/:id/permanent - Permanent delete
GET    /api/files/:id/download  - Download file
GET    /api/files/recent        - Recently accessed files
GET    /api/files/starred       - Starred files
GET    /api/files/shared        - Files shared with me
GET    /api/files/trash         - Trashed files
```

### Shares (4 endpoints)

```
POST   /api/shares              - Share file with user
GET    /api/shares/:fileId      - Get shares for file
PATCH  /api/shares/:id          - Update permission
DELETE /api/shares/:id          - Revoke share
```

### Activities (1 endpoint)

```
GET    /api/activities          - Get activity feed
```

### Comments (4 endpoints)

```
GET    /api/comments/:fileId    - Get comments for file
POST   /api/comments            - Add comment
PATCH  /api/comments/:id        - Edit comment
DELETE /api/comments/:id        - Delete comment
```

---

## 🔧 Project Structure (What to Create)

```
backend/
├── src/
│   ├── config/          → database.ts, multer.ts, env.ts
│   ├── middleware/      → auth.ts, errorHandler.ts, validate.ts
│   ├── models/          → userModel.ts, fileModel.ts, shareModel.ts, etc.
│   ├── controllers/     → authController.ts, fileController.ts, etc.
│   ├── routes/          → auth.routes.ts, file.routes.ts, etc.
│   ├── services/        → storageService.ts, searchService.ts
│   ├── utils/           → jwt.ts, password.ts, fileHelpers.ts
│   ├── types/           → express.d.ts
│   ├── app.ts           → Express app setup
│   └── server.ts        → Entry point
├── database/
│   ├── schema.sql       → Database schema
│   ├── seed.sql         → Test data
│   └── drive.db         → SQLite database (auto-created)
├── uploads/
│   ├── files/           → Uploaded files
│   ├── thumbnails/      → Thumbnails
│   └── versions/        → File versions
├── .env                 → Environment variables
├── package.json
└── tsconfig.json
```

---

## 🚀 Quick Start Commands

```bash
# 1. Create backend directory and initialize
mkdir backend && cd backend
npm init -y

# 2. Install dependencies (see BACKEND_SETUP_GUIDE.md for full list)
npm install express cors dotenv better-sqlite3 multer bcryptjs jsonwebtoken uuid express-validator morgan

# 3. Install dev dependencies
npm install -D typescript @types/node @types/express nodemon ts-node
# ... (see guide for complete list)

# 4. Create all files as per structure (use BACKEND_SETUP_GUIDE.md)

# 5. Create .env file
cp .env.example .env
# Edit .env with your config

# 6. Initialize database
npm run db:init

# 7. Seed test data
npm run db:seed

# 8. Start development server
npm run dev
```

---

## 🔐 Authentication Flow

1. User registers → Password hashed with bcrypt → User created in DB
2. User logs in → Password validated → JWT token generated
3. Protected routes → Check `Authorization: Bearer <token>` header
4. Token verified → `req.user` populated with userId and email

---

## 📁 File Management Logic

### Files Table Design

- Both files AND folders stored in same table
- `type` field: 'file' or 'folder'
- `parent_id` creates hierarchy (NULL = root level)
- `owner_id` tracks who owns it
- `file_path` stores actual file location (NULL for folders)

### Key Operations

- **Create Folder**: Insert row with `type='folder'`, `parent_id=<parent>`
- **Upload File**: Use multer → Save to disk → Insert DB row with `file_path`
- **Move**: Update `parent_id` to new folder
- **Delete**: Set `is_trashed=1`, `trashed_at=NOW()`
- **Restore**: Set `is_trashed=0`, `trashed_at=NULL`
- **Permanent Delete**: Delete DB row + delete actual file

---

## 🔍 Search & Filter Logic

### Filter by Query Params

```typescript
GET /api/files?parent_id=xxx        // Files in folder
GET /api/files?search=report        // Search by name
GET /api/files?type=folder          // Only folders
GET /api/files?starred=true         // Only starred
GET /api/files?trashed=true         // Only trashed
```

### SQL Query Building

```sql
SELECT * FROM files
WHERE owner_id = ?
AND (parent_id = ? OR parent_id IS NULL)
AND (name LIKE '%' || ? || '%')
AND is_trashed = 0
AND is_starred = ?
ORDER BY updated_at DESC
```

---

## 🤝 Sharing Logic

### Share Types

1. **User Share**: `shared_with_user_id` = specific user
2. **Link Share**: `share_link` = unique token, `shared_with_user_id` = NULL

### Permissions

- **viewer**: Can view only
- **commenter**: Can view + comment
- **editor**: Can view + edit + comment

### Permission Checks

```typescript
// Before file operation, check:
1. Is user the owner? → Full access
2. Is file shared with user? → Check permission level
3. Otherwise → Deny access
```

---

## 📊 Storage Tracking

### On Upload

```typescript
1. Calculate file size
2. Check: user.storage_used + file.size <= user.storage_limit
3. If OK: Save file, update user.storage_used += file.size
4. If not: Return 400 "Storage limit exceeded"
```

### On Delete

```typescript
1. Get file size
2. Update user.storage_used -= file.size
3. Delete file from disk
```

---

## 🎯 Implementation Priority Order

### Phase 1: Must Have (Week 1)

1. ✅ Project setup + database schema
2. ✅ Auth endpoints (register, login, me)
3. ✅ File CRUD (create folder, upload, list, delete)
4. ✅ Basic file operations (rename, move, star)
5. ✅ Trash and restore

### Phase 2: Important (Week 2)

6. ✅ File download endpoint
7. ✅ Search and filters
8. ✅ Sharing with users
9. ✅ Activity logging
10. ✅ Frontend integration

### Phase 3: Nice to Have (If Time)

11. ⭐ Comments on files
12. ⭐ File versions
13. ⭐ Storage analytics
14. ⭐ File thumbnails

---

## 🧪 Testing Strategy

### Manual Testing with curl/Postman

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test","password":"password123"}'

# 2. Login (save token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 3. Create folder
curl -X POST http://localhost:5000/api/files \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"My Folder"}'

# 4. Upload file
curl -X POST http://localhost:5000/api/files/upload \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@/path/to/file.pdf"

# 5. List files
curl http://localhost:5000/api/files \
  -H "Authorization: Bearer <TOKEN>"
```

### Frontend Integration Testing

1. Connect frontend auth to backend
2. Test file operations from UI
3. Verify data persists in database
4. Check file storage on disk

---

## 🐳 Docker Strategy (Final Step)

### Backend Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### Frontend Dockerfile

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

### docker-compose.yml

```yaml
version: "3.8"
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    volumes:
      - ./backend/database:/app/database
      - ./backend/uploads:/app/uploads
    environment:
      - NODE_ENV=production

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

---

## 🚨 Common Pitfalls to Avoid

1. **❌ Don't forget foreign key constraints** → Enables cascade deletes
2. **❌ Don't store passwords in plain text** → Always hash with bcrypt
3. **❌ Don't forget to check permissions** → Verify user owns file before operations
4. **❌ Don't allow path traversal in file paths** → Sanitize filenames
5. **❌ Don't forget to update storage on upload/delete** → Track storage usage
6. **❌ Don't return password hashes in API responses** → Exclude from user objects
7. **❌ Don't forget CORS configuration** → Set frontend URL in .env

---

## 📝 Sample Test Data

After running `npm run db:seed`, you'll have:

**5 Test Users** (all with password `password123`):

- john@example.com - John Doe
- jane@example.com - Jane Smith
- bob@example.com - Bob Johnson
- alice@example.com - Alice Williams
- charlie@example.com - Charlie Brown

**Sample Folder Structure** (for John):

- My Documents (folder)
  - Work (subfolder)
  - Personal (subfolder)
- Projects (folder, starred)
- Photos (folder)

---

## 🎓 Key Files to Understand

1. **database/schema.sql** → Database structure
2. **src/config/database.ts** → SQLite connection
3. **src/middleware/auth.ts** → JWT authentication
4. **src/models/fileModel.ts** → File operations
5. **src/controllers/fileController.ts** → File business logic
6. **src/routes/file.routes.ts** → File endpoints

---

## 📚 Resources

- **SQLite Docs**: https://www.sqlite.org/docs.html
- **Express Docs**: https://expressjs.com/
- **Multer Docs**: https://github.com/expressjs/multer
- **JWT Docs**: https://jwt.io/
- **Better-SQLite3**: https://github.com/WiseLibs/better-sqlite3

---

## ✅ Success Criteria

- [ ] Can register and login users
- [ ] Can create folders and upload files
- [ ] Files persist in database and disk
- [ ] Can list, search, and filter files
- [ ] Can share files with other users
- [ ] Can move files to trash and restore
- [ ] Activity log tracks operations
- [ ] Frontend connects successfully
- [ ] All README requirements met

---

**Ready to build? Start with BACKEND_SETUP_GUIDE.md for detailed implementation!** 🚀
