# API Quick Reference

Quick reference for all backend API endpoints.

Base URL: `http://localhost:5000`

---

## Authentication

```bash
# Register
POST /api/auth/register
Body: { "email": "user@example.com", "name": "User", "password": "password" }

# Login
POST /api/auth/login
Body: { "email": "user@example.com", "password": "password" }
Response: { "token": "...", "user": {...} }

# Get current user
GET /api/auth/me
Headers: Authorization: Bearer <token>
```

---

## Files

```bash
# List files (with filters)
GET /api/files?parent_id=null&search=test&type=file&sort_by=name
Headers: Authorization: Bearer <token>
Query params:
  - parent_id: null or folder ID
  - search: search term
  - type: file | folder
  - mime_type: partial match (e.g., "text", "image")
  - starred: true | false
  - trashed: true | false
  - size_min, size_max: bytes
  - created_after, created_before: ISO date
  - modified_after, modified_before: ISO date
  - sort_by: name | created_at | updated_at | size
  - sort_order: asc | desc

# Get file details
GET /api/files/:id
Headers: Authorization: Bearer <token>

# Create folder
POST /api/files
Headers: Authorization: Bearer <token>
Body: { "name": "Folder Name", "parent_id": null }

# Upload file
POST /api/files/upload
Headers: Authorization: Bearer <token>
Form Data: file=@path/to/file, parent_id=<folder_id>

# Update file (rename/move/star)
PATCH /api/files/:id
Headers: Authorization: Bearer <token>
Body: { "name": "New Name", "parent_id": "folder_id", "is_starred": true }

# Move to trash
DELETE /api/files/:id
Headers: Authorization: Bearer <token>

# Restore from trash
POST /api/files/:id/restore
Headers: Authorization: Bearer <token>

# Permanent delete
DELETE /api/files/:id/permanent
Headers: Authorization: Bearer <token>

# Download file
GET /api/files/:id/download
Headers: Authorization: Bearer <token>

# Recent files
GET /api/files/recent?limit=20
Headers: Authorization: Bearer <token>

# Starred files
GET /api/files/starred
Headers: Authorization: Bearer <token>

# Shared with me
GET /api/files/shared
Headers: Authorization: Bearer <token>

# Trash
GET /api/files/trash
Headers: Authorization: Bearer <token>
```

---

## Sharing

```bash
# Get files shared with me
GET /api/shares/shared-with-me
Headers: Authorization: Bearer <token>

# Get shares for a file
GET /api/shares/file/:fileId
Headers: Authorization: Bearer <token>

# Create share with user
POST /api/shares
Headers: Authorization: Bearer <token>
Body: { "file_id": "...", "shared_with_user_id": 2, "permission": "viewer" }
Permissions: viewer | commenter | editor

# Update share permission
PATCH /api/shares/:id
Headers: Authorization: Bearer <token>
Body: { "permission": "editor" }

# Revoke share
DELETE /api/shares/:id
Headers: Authorization: Bearer <token>

# Generate shareable link
POST /api/shares/link
Headers: Authorization: Bearer <token>
Body: { "file_id": "...", "permission": "viewer" }
Response: { "share": { "share_link": "abc123..." } }

# Access via shareable link (no auth required)
GET /api/shares/link/:token
```

---

## Activities

```bash
# Activity feed
GET /api/activities?limit=20
Headers: Authorization: Bearer <token>

# Activity statistics
GET /api/activities/stats
Headers: Authorization: Bearer <token>
Response: { "total": 10, "by_action": {...}, "most_recent": {...} }

# User activities
GET /api/activities/user?limit=10
Headers: Authorization: Bearer <token>

# File activities
GET /api/activities/file/:fileId?limit=10
Headers: Authorization: Bearer <token>
```

---

## Comments

```bash
# Get comments for file
GET /api/comments/:fileId
Headers: Authorization: Bearer <token>
Response: { "comments": [...], "count": 5 }

# Create comment
POST /api/comments
Headers: Authorization: Bearer <token>
Body: { "file_id": "...", "comment_text": "Great file!" }
Note: Requires commenter or editor permission

# Update comment
PATCH /api/comments/:id
Headers: Authorization: Bearer <token>
Body: { "comment_text": "Updated comment" }
Note: Only comment owner can update

# Delete comment
DELETE /api/comments/:id
Headers: Authorization: Bearer <token>
Note: Comment owner or file owner can delete

# Recent comments by user
GET /api/comments/user/recent?limit=10
Headers: Authorization: Bearer <token>
```

---

## File Versions

```bash
# Get version history
GET /api/versions/:fileId
Headers: Authorization: Bearer <token>
Response: { "versions": [...], "count": 3 }

# Create new version (re-upload)
POST /api/versions/:fileId
Headers: Authorization: Bearer <token>
Form Data: file=@path/to/file
Note: First upload saves original as v1, new file as v2

# Download specific version
GET /api/versions/:fileId/:versionNumber/download
Headers: Authorization: Bearer <token>
Example: GET /api/versions/abc123/2/download

# Restore to specific version
POST /api/versions/:fileId/:versionNumber/restore
Headers: Authorization: Bearer <token>
Example: POST /api/versions/abc123/1/restore
```

---

## Users & Storage

```bash
# Get all users (for sharing)
GET /api/users
Headers: Authorization: Bearer <token>
Response: { "users": [...] } (excludes current user)

# Get current user
GET /api/users/me
Headers: Authorization: Bearer <token>

# Get user by ID
GET /api/users/:id
Headers: Authorization: Bearer <token>

# Update user profile
PATCH /api/users/:id
Headers: Authorization: Bearer <token>
Body: { "name": "New Name", "avatar_url": "https://..." }
Note: Can only update own profile

# Basic storage info
GET /api/users/storage
Headers: Authorization: Bearer <token>
Response: {
  "storage_used": 1024,
  "storage_limit": 2199023255552,
  "storage_percentage": 0.00001,
  "available_storage": 2199023254528
}

# Detailed storage analytics
GET /api/users/storage/analytics
Headers: Authorization: Bearer <token>
Response: {
  "total_storage": 1024,
  "storage_limit": 2199023255552,
  "breakdown": [
    { "category": "Images", "total_size": 512, "file_count": 5 },
    { "category": "Documents", "total_size": 256, "file_count": 3 }
  ],
  "largest_files": [...],
  "recent_uploads": [...],
  "type_distribution": [...],
  "trashed_storage": 100
}

# Storage history
GET /api/users/storage/history?months=6
Headers: Authorization: Bearer <token>
Response: {
  "history": [
    { "month": "2025-11", "storage_added": 1024, "files_added": 8 }
  ]
}
```

---

## File Categories in Storage Analytics

- **Images**: image/*
- **Videos**: video/*
- **Audio**: audio/*
- **PDFs**: application/pdf
- **Documents**: *document*, *word*, *wordprocessing*
- **Spreadsheets**: *spreadsheet*, *excel*
- **Presentations**: *presentation*, *powerpoint*
- **Text Files**: text/*
- **Archives**: zip, x-* compressions
- **Other**: Everything else

---

## Activity Action Types

- `upload` - File uploaded
- `create` - Folder created
- `delete` - Moved to trash
- `restore` - Restored from trash
- `rename` - File/folder renamed
- `move` - File/folder moved
- `star` / `unstar` - Starred/unstarred
- `download` - File downloaded
- `share` - File shared
- `comment` - Comment added

---

## Permission Levels

1. **viewer** - Can view and download
2. **commenter** - Can view, download, and comment
3. **editor** - Can view, download, comment, and edit

---

## Error Responses

All endpoints return errors in this format:
```json
{
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad request (validation error)
- `401` - Unauthorized (no/invalid token)
- `403` - Forbidden (no permission)
- `404` - Not found
- `500` - Server error

---

## Testing

Use the test scripts in `/tmp/`:
```bash
/tmp/test_share_apis.sh           # Test sharing
/tmp/test_activity_search.sh      # Test activity & search
/tmp/test_all_new_features.sh     # Test comments, versions, storage
```

---

**Base URL**: `http://localhost:5000`
**Authentication**: All endpoints (except `/api/shares/link/:token`) require `Authorization: Bearer <token>` header
