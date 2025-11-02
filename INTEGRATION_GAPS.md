# Frontend-Backend Integration Gaps

Quick reference for missing integrations between frontend and backend.

---

## 📊 Feature Matrix

| Feature | Backend | Frontend Service | Frontend UI | Integration | Priority |
|---------|---------|------------------|-------------|-------------|----------|
| **Authentication** |
| Login/Signup | ✅ | ✅ | ✅ | ✅ | - |
| Get Current User | ✅ | ✅ | ✅ | ✅ | - |
| **File Management** |
| List Files (Basic) | ✅ | ✅ | ✅ | ✅ | - |
| List Files (Advanced Filters) | ✅ | ❌ | ✅ | ❌ | 🔴 HIGH |
| Create Folder | ✅ | ✅ | ✅ | ✅ | - |
| Upload File | ✅ | ✅ | ✅ | ✅ | - |
| Rename File | ✅ | ✅ | ✅ | ✅ | - |
| Delete/Trash | ✅ | ✅ | ✅ | ✅ | - |
| Restore | ✅ | ✅ | ✅ | ✅ | - |
| Download | ✅ | ✅ | ✅ | ✅ | - |
| Star/Unstar | ✅ | ✅ | ✅ | ✅ | - |
| **Sharing** |
| Share with User | ✅ | ❌ | ⚠️ | ❌ | 🔴 HIGH |
| Generate Link | ✅ | ❌ | ⚠️ | ❌ | 🔴 HIGH |
| Get Shares | ✅ | ❌ | ❌ | ❌ | 🟡 MEDIUM |
| Update Permission | ✅ | ❌ | ❌ | ❌ | 🟡 MEDIUM |
| Revoke Share | ✅ | ❌ | ❌ | ❌ | 🟡 MEDIUM |
| Shared With Me | ✅ | ✅ | ✅ | ✅ | - |
| **Comments** |
| Get Comments | ✅ | ❌ | ❌ | ❌ | 🟡 MEDIUM |
| Create Comment | ✅ | ❌ | ❌ | ❌ | 🟡 MEDIUM |
| Update Comment | ✅ | ❌ | ❌ | ❌ | 🟢 LOW |
| Delete Comment | ✅ | ❌ | ❌ | ❌ | 🟢 LOW |
| **Versions** |
| Get Versions | ✅ | ❌ | ❌ | ❌ | 🟡 MEDIUM |
| Create Version | ✅ | ❌ | ❌ | ❌ | 🟡 MEDIUM |
| Download Version | ✅ | ❌ | ❌ | ❌ | 🟢 LOW |
| Restore Version | ✅ | ❌ | ❌ | ❌ | 🟢 LOW |
| **Activity** |
| Activity Feed | ✅ | ❌ | ❌ | ❌ | 🟡 MEDIUM |
| Activity Stats | ✅ | ❌ | ❌ | ❌ | 🟢 LOW |
| File Activities | ✅ | ❌ | ❌ | ❌ | 🟢 LOW |
| User Activities | ✅ | ❌ | ❌ | ❌ | 🟢 LOW |
| **Users** |
| Get All Users | ✅ | ❌ | ❌ | ❌ | 🔴 HIGH |
| Get User by ID | ✅ | ❌ | ❌ | ❌ | 🟢 LOW |
| Update Profile | ✅ | ❌ | ❌ | ❌ | 🟢 LOW |
| **Storage** |
| Storage Info | ✅ | ❌ | ⚠️ | ❌ | 🟡 MEDIUM |
| Storage Analytics | ✅ | ❌ | ❌ | ❌ | 🟡 MEDIUM |
| Storage History | ✅ | ❌ | ❌ | ❌ | 🟢 LOW |

**Legend**:
- ✅ = Fully implemented
- ⚠️ = Partially implemented
- ❌ = Not implemented
- 🔴 HIGH = Critical for core functionality
- 🟡 MEDIUM = Important for full experience
- 🟢 LOW = Nice to have, not critical

---

## 🔴 Critical Missing (HIGH Priority)

### 1. Advanced File Filtering
**Backend**: ✅ Fully implemented
**Frontend**: ❌ Not connected

**Backend Supports**:
```typescript
GET /api/files?parent_id=null
  &search=test
  &type=file
  &mime_type=image
  &size_min=1000
  &size_max=1000000
  &created_after=2025-01-01
  &sort_by=size
  &sort_order=desc
```

**Frontend Only Uses**:
```typescript
{
  parent_id,
  starred,
  trashed,
  type,
  search  // basic only
}
```

**Gap**: Missing 9 filter parameters!

**Fix Required**:
1. Update `FileFilters` interface in `fileService.ts`
2. Update `listFiles()` to pass all params
3. Connect AdvancedSearchModal to use real filters

---

### 2. User List for Sharing
**Backend**: ✅ `GET /api/users`
**Frontend**: ❌ No service

**Why Critical**: ShareModal can't show user list

**Fix Required**:
```typescript
// Create src/services/userService.ts
export const userService = {
  getAllUsers: async () => {
    const response = await api.get("/users");
    return response.data.users;
  }
};
```

---

### 3. Share Management
**Backend**: ✅ 7 endpoints ready
**Frontend**: ⚠️ UI exists but not connected

**Gap**:
- ShareModal exists but doesn't call backend
- No share creation flow
- No share link generation
- No permission management

**Fix Required**: Create `shareService.ts` with all 7 endpoints

---

## 🟡 Important Missing (MEDIUM Priority)

### 4. Comments System
**Backend**: ✅ 5 endpoints ready
**Frontend**: ❌ Complete missing

**Impact**: No collaboration features

**Fix Required**:
1. Create `commentService.ts`
2. Create `CommentsSection.tsx` component
3. Create `CommentItem.tsx` component
4. Add to file details sidebar

---

### 5. Version History
**Backend**: ✅ 4 endpoints ready
**Frontend**: ❌ Complete missing

**Impact**: No file version tracking

**Fix Required**:
1. Create `versionService.ts`
2. Create `VersionHistory.tsx` component
3. Add to file details sidebar
4. Add version restore UI

---

### 6. Activity Feed
**Backend**: ✅ 4 endpoints ready
**Frontend**: ❌ Complete missing

**Impact**: Users don't see file history

**Fix Required**:
1. Create `activityService.ts`
2. Create `ActivityFeed.tsx` component
3. Add to home dashboard or sidebar
4. Show recent activities

---

### 7. Storage Analytics
**Backend**: ✅ Full analytics ready
**Frontend**: ⚠️ Basic UI exists, no data

**Impact**: Users don't see storage breakdown

**Current State**: StoragePage exists but shows dummy data

**Fix Required**:
1. Create `userService.getStorageAnalytics()`
2. Connect StoragePage to real data
3. Add charts for breakdown
4. Show largest files

---

## 🔧 Required Service Files

Create these 5 new service files:

### 1. `src/services/commentService.ts`
```typescript
export const commentService = {
  getComments: async (fileId: string) => {...},
  createComment: async (fileId: string, text: string) => {...},
  updateComment: async (commentId: number, text: string) => {...},
  deleteComment: async (commentId: number) => {...},
  getRecentComments: async (limit?: number) => {...}
};
```

### 2. `src/services/versionService.ts`
```typescript
export const versionService = {
  getVersions: async (fileId: string) => {...},
  createVersion: async (fileId: string, file: File) => {...},
  downloadVersion: async (fileId: string, versionNumber: number) => {...},
  restoreVersion: async (fileId: string, versionNumber: number) => {...}
};
```

### 3. `src/services/shareService.ts`
```typescript
export const shareService = {
  getShares: async (fileId: string) => {...},
  createShare: async (fileId, userId, permission) => {...},
  updateSharePermission: async (shareId, permission) => {...},
  revokeShare: async (shareId: number) => {...},
  generateShareLink: async (fileId, permission) => {...},
  accessViaLink: async (token: string) => {...},
  getSharedWithMe: async () => {...}
};
```

### 4. `src/services/activityService.ts`
```typescript
export const activityService = {
  getActivityFeed: async (limit?: number) => {...},
  getActivityStats: async () => {...},
  getUserActivities: async (limit?: number) => {...},
  getFileActivities: async (fileId: string, limit?: number) => {...}
};
```

### 5. `src/services/userService.ts`
```typescript
export const userService = {
  getAllUsers: async () => {...},
  getUserById: async (id: string) => {...},
  updateUserProfile: async (id: string, data) => {...},
  getStorageInfo: async () => {...},
  getStorageAnalytics: async () => {...},
  getStorageHistory: async (months?: number) => {...}
};
```

---

## 🔧 Required UI Components

Create these components:

### Comments
- `src/components/files/CommentsSection.tsx`
- `src/components/files/CommentItem.tsx`
- `src/components/files/CommentInput.tsx`

### Versions
- `src/components/files/VersionHistory.tsx`
- `src/components/files/VersionItem.tsx`

### Activity
- `src/components/activity/ActivityFeed.tsx`
- `src/components/activity/ActivityItem.tsx`

### Storage
- `src/components/storage/StorageChart.tsx`
- `src/components/storage/StorageBreakdown.tsx`
- `src/components/storage/LargestFiles.tsx`

### Sharing
- `src/components/share/UserPicker.tsx` (autocomplete)
- `src/components/share/ShareLinkGenerator.tsx`
- `src/components/share/ShareList.tsx`

---

## 📝 Type Definitions Needed

### Comments
```typescript
export interface Comment {
  id: number;
  file_id: string;
  user_id: number;
  comment_text: string;
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_email?: string;
  user_avatar?: string;
}
```

### Versions
```typescript
export interface FileVersion {
  id: number;
  file_id: string;
  version_number: number;
  file_path: string;
  size: number;
  uploaded_by: number;
  created_at: string;
  uploaded_by_name?: string;
  uploaded_by_email?: string;
}
```

### Storage Analytics
```typescript
export interface StorageAnalytics {
  total_storage: number;
  storage_limit: number;
  storage_percentage: number;
  available_storage: number;
  breakdown: {
    category: string;
    total_size: number;
    file_count: number;
  }[];
  largest_files: Array<{
    id: string;
    name: string;
    mime_type: string;
    size: number;
    created_at: string;
  }>;
  recent_uploads: Array<any>;
  type_distribution: Array<{
    type: string;
    count: number;
  }>;
  trashed_storage: number;
}
```

---

## ⚡ Quick Win Tasks

These can be done quickly:

1. **Add .env file** (5 mins)
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

2. **Extend fileService filters** (30 mins)
   - Add all missing filter params
   - Update TypeScript interface

3. **Create userService** (1 hour)
   - Copy pattern from authService
   - Add 6 endpoints

4. **Connect storage page** (2 hours)
   - Call getStorageAnalytics()
   - Display real data
   - Add simple charts

5. **Add toast notifications** (1 hour)
   - Use existing Snackbar component
   - Add to all operations
   - Show success/error messages

---

## 📈 Integration Roadmap

### Week 1: Core Integrations
- Day 1: Create all 5 service files
- Day 2: Update types & fix mismatches
- Day 3: Connect advanced search
- Day 4: Add storage analytics
- Day 5: Testing & bug fixes

### Week 2: UI Components
- Day 1-2: Comments system
- Day 3: Version history
- Day 4: Activity feed
- Day 5: Share management

### Week 3: Polish & Testing
- Day 1-2: Error handling improvements
- Day 3: Keyboard shortcuts
- Day 4: Mobile responsiveness
- Day 5: Testing & documentation

---

## 🎯 Success Metrics

Integration complete when:
- [ ] All backend endpoints have frontend service methods
- [ ] All UI components call real APIs (no mock data)
- [ ] Type definitions match backend responses
- [ ] Error handling covers all failure cases
- [ ] Loading states during API calls
- [ ] Success/error notifications for all actions
- [ ] No console errors in browser
- [ ] All features from backend accessible in UI

---

**Current Integration Score**: 40% → **Target**: 100%
**Estimated Time to Full Integration**: 2-3 weeks
