# Complete Context Analysis - Google Drive Clone

## Executive Summary

After thorough exploration of both backend and frontend codebases, here's the complete context and identified issues.

---

## Backend Implementation

### Architecture
- **Framework**: Express.js + TypeScript
- **Database**: SQLite with 6 tables
- **Authentication**: JWT (7-day tokens) with bcryptjs
- **File Storage**: Local filesystem in `uploads/` directory
- **Pattern**: Clean MVC architecture

### API Endpoints (43 total)

#### File Operations
1. `GET /api/files` - List files with filters (parent_id, starred, trashed, etc.)
2. `GET /api/files/:id` - Get file by ID
3. `GET /api/files/:id/download` - Download file (⚠️ ISSUE IDENTIFIED)
4. `GET /api/files/recent` - Get recent files
5. `GET /api/files/starred` - Get starred files
6. `GET /api/files/shared` - Get shared files
7. `GET /api/files/trash` - Get trashed files
8. `GET /api/files/:folderId/path` - Get folder breadcrumb path
9. `POST /api/files` - Create folder
10. `POST /api/files/upload` - Upload file
11. `PATCH /api/files/:id` - Update file (rename, move, star)
12. `DELETE /api/files/:id` - Move to trash (soft delete)
13. `POST /api/files/:id/restore` - Restore from trash
14. `DELETE /api/files/:id/permanent` - Permanent delete

#### Batch Operations
15. `POST /api/files/batch/move` - Batch move files
16. `POST /api/files/batch/delete` - Batch delete (trash)
17. `POST /api/files/batch/restore` - Batch restore
18. `POST /api/files/batch/star` - Batch star/unstar
19. `POST /api/files/batch/permanent` - Batch permanent delete

### Database Schema

```sql
-- users table
id, email, password_hash, full_name, storage_used, storage_limit, created_at

-- files table
id, name, type (file|folder), mime_type, size, parent_id, owner_id,
file_path, thumbnail_path, is_starred, is_trashed, trashed_at,
created_at, updated_at, last_opened_at

-- shares table (for file sharing)
-- activities table (audit log)
-- file_versions table (version history)
-- comments table (file comments)
```

### Backend File Locations
- Routes: `backend/src/routes/file.routes.ts`
- Controller: `backend/src/controllers/fileController.ts` (lines 261-293 for download)
- Models: `backend/src/models/fileModel.ts`
- Storage Service: `backend/src/services/storageService.ts`

---

## Frontend Implementation

### Architecture
- **Framework**: React 18 + TypeScript + Vite
- **UI Library**: Material-UI (MUI)
- **State Management**: Zustand (4 stores)
- **HTTP Client**: Axios with JWT interceptors
- **Routing**: React Router v6

### State Management (Zustand)

#### 1. File Store (`frontend/src/store/fileStore.ts` - 770 lines)
**State:**
```typescript
- files: DriveItem[]
- cache: FileCache (5-minute TTL)
- selectedFiles: string[]
- currentFolderId: string | null
- breadcrumbs: BreadcrumbItem[]
- viewMode: 'list' | 'grid'
- sortField, sortOrder
- searchQuery
- typeFilter, peopleFilter, modifiedFilter
```

**Key Actions:**
- `fetchFiles(folderId)` - Lines 194-227: Fetches files with caching
- `createFolder()`, `uploadFile()`, `renameFile()`, `moveFile()`
- `toggleStar()`, `moveToTrash()`, `restoreFromTrash()`, `permanentlyDelete()`
- `batchMoveFiles()`, `batchDeleteFiles()`, etc.

#### 2. Auth Store
- Manages user authentication, JWT token
- Persists to localStorage

#### 3. UI Store
- Manages modals, snackbars, sidebars
- Context menus, selection state

#### 4. Upload Store
- Tracks upload progress for multiple files

### Key Components

#### HomePage (My Drive) - `frontend/src/pages/HomePage/HomePage.tsx`
**Lines 25-78: Initialization & Data Fetching**
```typescript
// Gets folderId from URL params
const { folderId } = useParams()

// Fetch files on mount and when folder changes
useEffect(() => {
  fetchFiles(currentFolderId).catch((error) => {
    showSnackbar(error.message || "Failed to load files", "error")
  })
}, [currentFolderId, fetchFiles, showSnackbar])
```

**Lines 92-96: File Preview Handler**
```typescript
const handleFilePreview = (file: DriveItem) => {
  if (file.type !== "folder") {
    setPreviewFile(file)
  }
}
```

✅ **My Drive API calls are correctly implemented**

#### FileGrid Component - `frontend/src/components/files/FileGrid.tsx`
**Lines 78-101: Click Handling**
```typescript
const handleDoubleClick = (file: DriveItem) => {
  // Double click = navigate or preview
  if (file.type === "folder") {
    navigate(`/folder/${file.id}`)
  } else if (onFileClick) {
    onFileClick(file)  // Opens preview modal
  }
}

const handleFileClick = (file: DriveItem, event: React.MouseEvent) => {
  if (clickTimeout) {
    // Double click detected
    clearTimeout(clickTimeout)
    setClickTimeout(null)
    handleDoubleClick(file)
  } else {
    // Single click - wait 250ms to see if double click follows
    const timeout = window.setTimeout(() => {
      handleSingleClick(file, event)
      setClickTimeout(null)
    }, 250)
    setClickTimeout(timeout)
  }
}
```

✅ **Double-click functionality is correctly implemented**
- Single click: Selects file
- Ctrl/Cmd+Click: Toggle selection
- Double click on folder: Navigate to folder
- Double click on file: Open preview modal

#### FilePreviewModal - `frontend/src/components/modals/FilePreviewModal.tsx`
**Lines 54-98: File Content Fetching**
```typescript
useEffect(() => {
  if (!file || !open || file.type === 'folder') {
    setPreviewUrl(null)
    setLoading(false)
    return
  }

  // Only fetch for previewable file types
  const previewableTypes = ['image', 'video', 'audio', 'pdf']
  if (!previewableTypes.includes(file.type)) {
    setPreviewUrl(null)
    setLoading(false)
    return
  }

  setLoading(true)
  setError(null)

  // Fetch file as blob
  api
    .get(`/files/${file.id}/download`, {
      responseType: 'blob',  // ⚠️ Expects blob response
    })
    .then((response) => {
      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      setPreviewUrl(url)
      setLoading(false)
    })
    .catch((err) => {
      console.error('Failed to load file preview:', err)
      setError('Failed to load preview')
      setLoading(false)
    })

  // Cleanup: revoke object URL
  return () => {
    setPreviewUrl((currentUrl) => {
      if (currentUrl) {
        window.URL.revokeObjectURL(currentUrl)
      }
      return null
    })
  }
}, [file?.id, open])
```

**Supported Preview Types:**
- ✅ Images: Rendered with zoom (50-200%)
- ✅ PDFs: Rendered in iframe
- ✅ Videos: Native video player with controls
- ✅ Audio: Native audio player with controls
- ❌ Documents/Spreadsheets/Presentations: Placeholder (requires Google Drive API)

---

## Identified Issues

### 🔴 CRITICAL ISSUE: File Preview Download Endpoint Incompatibility

**Location**: `backend/src/controllers/fileController.ts` lines 261-293

**Problem**:
The backend's `downloadFile` endpoint uses `res.download(filePath, file.name)` which is designed for triggering browser file downloads. This sets specific HTTP headers:
```
Content-Disposition: attachment; filename="file.pdf"
```

However, the frontend expects to receive the file content as a **blob response** to create an object URL for preview purposes. The `res.download()` method triggers a download prompt in the browser instead of returning the file content in the response body.

**Current Backend Code**:
```typescript
// backend/src/controllers/fileController.ts:288
res.download(filePath, file.name)
```

**Impact**:
- ❌ File preview modal fails to display file content
- ❌ Images, PDFs, videos cannot be previewed
- ❌ Browser tries to download files instead of showing preview

**Solution Required**:
We need to **modify the download endpoint** or **create a separate preview endpoint** that:
1. Returns file content directly as response body
2. Sets appropriate `Content-Type` header based on MIME type
3. Does NOT set `Content-Disposition: attachment` header
4. Allows blob creation in frontend

---

### ⚠️ MINOR ISSUES

#### 1. StarredPage Missing UI
**Location**: `frontend/src/pages/StarredPage/StarredPage.tsx:384`
```typescript
{/* TODO: Add list/grid view for starred files when data is available */}
```
- API call works correctly
- Data is fetched
- Missing: Rendering of FileGrid/FileList components

#### 2. Download Button Shows Placeholder
**Multiple locations**:
```typescript
onDownload={() => showSnackbar("Download feature coming soon", "info")}
```
- Backend API exists and works
- Frontend just needs to wire up the download handler

#### 3. Search Not Connected
- AdvancedSearchModal exists
- Not connected to fileStore search functionality

---

## API Call Flow Analysis

### My Drive File Fetching (✅ Working Correctly)

**Flow**:
```
1. User navigates to /drive or /folder/:id
   ↓
2. HomePage reads folderId from URL params
   ↓
3. useEffect calls fetchFiles(currentFolderId)
   ↓
4. fileStore.fetchFiles() in store
   ↓
5. Checks cache (5-minute TTL)
   ↓
6. Calls fileService.listFiles({ parent_id: folderId })
   ↓
7. Axios GET /api/files?parent_id=:id
   ↓
8. Backend fileController.listFiles()
   ↓
9. fileModel.findAll(filters)
   ↓
10. Returns { files: BackendFile[] }
   ↓
11. Frontend maps BackendFile → DriveItem
   ↓
12. Updates cache and state
   ↓
13. getCurrentFolderFiles() applies filters
   ↓
14. FileGrid/FileList renders files
```

**Verification**:
- ✅ API endpoint exists: `GET /api/files` (line 13, file.routes.js)
- ✅ Controller handles parent_id properly (lines 22-28, fileController.ts)
- ✅ Frontend calls API on mount (lines 74-78, HomePage.tsx)
- ✅ Caching strategy implemented
- ✅ Error handling in place

### File Preview Flow (❌ BROKEN - Issue Identified)

**Flow**:
```
1. User double-clicks file in FileGrid
   ↓
2. handleDoubleClick() calls onFileClick(file)
   ↓
3. HomePage.handleFilePreview() sets previewFile state
   ↓
4. FilePreviewModal opens (open={!!previewFile})
   ↓
5. useEffect detects file change
   ↓
6. Checks if file type is previewable
   ↓
7. Calls api.get(`/files/${file.id}/download`, { responseType: 'blob' })
   ↓
8. Backend downloadFile() uses res.download()
   ↓
❌ ISSUE: res.download() triggers browser download instead of returning blob
   ↓
9. Frontend expects Blob in response.data
   ↓
10. Creates object URL with URL.createObjectURL(blob)
   ↓
11. Sets previewUrl for rendering
```

**Verification**:
- ✅ Double-click handler works (lines 78-85, FileGrid.tsx)
- ✅ Preview modal opens correctly
- ✅ API call is made with correct endpoint
- ❌ **Backend returns download instead of blob content**
- ❌ Preview fails to display

---

## Required Fixes

### Priority 1: Fix File Preview Download Endpoint

**Option A: Modify Existing Endpoint**
Add a query parameter to distinguish download vs preview:
```typescript
// GET /api/files/:id/download?preview=true
if (req.query.preview === 'true') {
  // Send file content as response body
  res.set('Content-Type', file.mime_type)
  res.sendFile(filePath)
} else {
  // Trigger download
  res.download(filePath, file.name)
}
```

**Option B: Create Separate Preview Endpoint** (Recommended)
```typescript
// GET /api/files/:id/preview - For previewing in browser
res.set('Content-Type', file.mime_type)
res.set('Content-Length', file.size)
res.sendFile(filePath)

// GET /api/files/:id/download - For downloading
res.download(filePath, file.name)
```

### Priority 2: Wire Up Download Button
Connect the download button to the actual download endpoint

### Priority 3: Add FileGrid/FileList to StarredPage
Render starred files using existing components

---

## Technology Stack Summary

### Backend
- Node.js + Express.js
- TypeScript
- SQLite (better-sqlite3)
- JWT (jsonwebtoken)
- bcryptjs (password hashing)
- Multer (file uploads)
- CORS enabled

### Frontend
- React 18.3
- TypeScript
- Vite (build tool)
- Material-UI (MUI) v6
- Zustand (state management)
- React Router v6
- Axios (HTTP client)

### Development
- ESLint + Prettier
- TypeScript strict mode
- Hot module replacement (Vite)

---

## File Structure

```
google-drive/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── fileController.ts (⚠️ Issue here)
│   │   ├── routes/
│   │   │   └── file.routes.ts
│   │   ├── models/
│   │   │   └── fileModel.ts
│   │   ├── services/
│   │   │   ├── storageService.ts
│   │   │   └── activityLogger.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── errorHandler.ts
│   │   └── server.ts
│   ├── dist/ (compiled JS)
│   ├── uploads/ (file storage)
│   └── database.sqlite
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   └── HomePage/
    │   │       └── HomePage.tsx (✅ My Drive)
    │   ├── components/
    │   │   ├── files/
    │   │   │   ├── FileGrid.tsx (✅ Double-click)
    │   │   │   └── FileList.tsx
    │   │   └── modals/
    │   │       └── FilePreviewModal.tsx (⚠️ Affected by issue)
    │   ├── store/
    │   │   ├── fileStore.ts (✅ API calls)
    │   │   ├── authStore.ts
    │   │   └── uiStore.ts
    │   └── services/
    │       ├── api.ts (Axios config)
    │       └── fileService.ts (API methods)
    └── dist/ (build output)
```

---

## Next Steps

1. **Fix the download/preview endpoint** - Create separate preview endpoint or modify existing one
2. **Test file preview** - Verify images, PDFs, videos display correctly
3. **Wire up download button** - Connect to actual download functionality
4. **Complete StarredPage UI** - Add FileGrid/FileList rendering
5. **Test My Drive API** - Verify all CRUD operations work correctly

---

## Conclusion

**What's Working:**
- ✅ Complete backend API implementation with 43 endpoints
- ✅ My Drive page fetches and displays files correctly
- ✅ Double-click behavior properly implemented
- ✅ File operations (upload, rename, move, delete, trash, restore)
- ✅ Batch operations for multiple files
- ✅ Authentication and authorization
- ✅ State management with caching
- ✅ Keyboard shortcuts (Ctrl+A, F2, Delete, Escape)

**What Needs Fixing:**
- ❌ File preview fails due to download endpoint incompatibility
- ⚠️ StarredPage missing UI rendering
- ⚠️ Download button not wired up
- ⚠️ Search not connected to store

**Primary Issue**: The backend's `downloadFile` endpoint uses `res.download()` which triggers browser downloads instead of returning file content for preview. This breaks the FilePreviewModal functionality.
