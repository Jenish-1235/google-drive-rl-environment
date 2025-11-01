# Google Drive UI Clone - Implementation Plan

## Project Overview
Building a pixel-perfect Google Drive clone using React, TypeScript, Vite, and Material UI (Material 3 design system).

---

## Technology Stack

### Frontend Core
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing

### UI Framework
- **Material UI (MUI) v6** - Component library with Material 3 support
- **@emotion/react & @emotion/styled** - CSS-in-JS styling
- **@mui/icons-material** - Icon library

### State Management
- **Zustand** - Lightweight state management

### Additional Libraries
- **react-dropzone** - Drag-and-drop file uploads
- **axios** - HTTP client
- **date-fns** - Date formatting
- **@mui/x-date-pickers** - Date/time pickers

---

## Project Structure

```
frontend/
├── src/
│   ├── assets/              # Static assets (images, icons)
│   ├── components/          # Reusable components
│   │   ├── common/          # Generic UI components
│   │   │   ├── Button/
│   │   │   ├── SearchBar/
│   │   │   ├── Avatar/
│   │   │   └── IconButton/
│   │   ├── layout/          # Layout components
│   │   │   ├── Sidebar/
│   │   │   ├── TopBar/
│   │   │   ├── MainLayout/
│   │   │   └── ContextMenu/
│   │   ├── files/           # File-related components
│   │   │   ├── FileCard/
│   │   │   ├── FileList/
│   │   │   ├── FileGrid/
│   │   │   ├── FilePreview/
│   │   │   ├── FileUploader/
│   │   │   └── FolderTree/
│   │   ├── modals/          # Modal dialogs
│   │   │   ├── ShareModal/
│   │   │   ├── DetailsModal/
│   │   │   ├── MoveModal/
│   │   │   └── RenameModal/
│   │   └── auth/            # Authentication components
│   │       ├── LoginForm/
│   │       └── SignupForm/
│   ├── pages/               # Page components
│   │   ├── HomePage/        # Main drive page
│   │   ├── SharedPage/      # Shared with me
│   │   ├── RecentPage/      # Recent files
│   │   ├── StarredPage/     # Starred files
│   │   ├── TrashPage/       # Trash bin
│   │   ├── StoragePage/     # Storage analytics
│   │   └── AuthPage/        # Login/Signup
│   ├── hooks/               # Custom React hooks
│   │   ├── useFileOperations.ts
│   │   ├── useFileUpload.ts
│   │   ├── useSearch.ts
│   │   └── useContextMenu.ts
│   ├── store/               # Zustand stores
│   │   ├── authStore.ts
│   │   ├── fileStore.ts
│   │   ├── uiStore.ts
│   │   └── uploadStore.ts
│   ├── services/            # API services
│   │   ├── api.ts
│   │   ├── fileService.ts
│   │   ├── authService.ts
│   │   └── shareService.ts
│   ├── types/               # TypeScript types
│   │   ├── file.types.ts
│   │   ├── user.types.ts
│   │   └── api.types.ts
│   ├── utils/               # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   ├── theme/               # MUI theme configuration
│   │   ├── theme.ts
│   │   └── colors.ts
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   └── router.tsx           # Route configuration
├── public/                  # Static public assets
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── IMPLEMENTATION_PLAN.md
```

---

## Implementation Phases

### Phase 1: Project Setup & Configuration (Day 1)

#### 1.1 Configure Material UI Theme
- Create custom Material 3 theme matching Google Drive colors
- Define color palette (primary: #1a73e8, surface colors, etc.)
- Configure typography (Google Sans font family)
- Set up dark mode support
- Configure elevation and shadows

#### 1.2 Setup Routing
- Configure React Router with routes:
  - `/` - Home (My Drive)
  - `/shared` - Shared with me
  - `/recent` - Recent files
  - `/starred` - Starred files
  - `/trash` - Trash
  - `/storage` - Storage analytics
  - `/auth/login` - Login page
  - `/auth/signup` - Signup page

#### 1.3 Create Base Layout Structure
- Main layout wrapper with sidebar and top bar
- Responsive breakpoints
- Basic navigation structure

#### 1.4 Setup State Management
- Auth store (user, token, login/logout)
- File store (files, folders, current path)
- UI store (view mode, selected items, modals)
- Upload store (upload queue, progress)

---

### Phase 2: Core UI Components (Days 2-3)

#### 2.1 Top Navigation Bar
**Components:**
- Google Drive logo and title
- Global search bar with filters
- View switcher (list/grid)
- Settings menu
- User profile avatar with dropdown
- Help icon

**Features:**
- Sticky header on scroll
- Search with autocomplete
- Advanced search filters popup
- Smooth animations

#### 2.2 Sidebar Navigation
**Components:**
- "New" button with dropdown menu (New folder, File upload, Folder upload)
- Navigation items:
  - My Drive (with expand/collapse for folders)
  - Shared with me
  - Recent
  - Starred
  - Trash
  - Storage indicator at bottom

**Features:**
- Collapsible/expandable
- Active state highlighting
- Nested folder tree for My Drive
- Storage usage bar with colored segments
- Smooth transitions

#### 2.3 File List View (Default View)
**Columns:**
- Checkbox for selection
- File icon (type-specific icons)
- Name (with inline rename)
- Owner
- Last modified
- File size

**Features:**
- Sortable columns
- Multi-select with Shift+Click and Ctrl+Click
- Hover actions (share, delete, more)
- Context menu on right-click
- Drag-to-select
- Virtualized list for performance

#### 2.4 File Grid View
**Layout:**
- Card-based layout with thumbnail
- File type icon overlay
- File name below thumbnail
- Hover for quick actions

**Features:**
- Responsive grid (adjusts columns based on width)
- Lazy loading images
- Selection mode
- Smooth animations

---

### Phase 3: File Operations (Days 4-5)

#### 3.1 File Upload
**Components:**
- Drag-and-drop zone overlay
- Upload progress indicator (bottom-right)
- Multi-file upload support

**Features:**
- Drag files from desktop
- Click to browse files
- Progress bar per file
- Pause/cancel uploads
- Upload to current folder
- Show upload errors
- Success animations

#### 3.2 Folder Operations
**Features:**
- Create new folder (modal with name input)
- Rename folder (inline or modal)
- Move folder (tree picker modal)
- Delete folder (confirmation dialog)
- Folder breadcrumb navigation
- Expand/collapse folders in sidebar

#### 3.3 File Actions Menu
**Actions:**
- Preview
- Download
- Share
- Get link
- Move to
- Add to starred
- Rename
- Make a copy
- Move to trash
- File details

**Implementation:**
- Context menu (right-click)
- Action bar (when items selected)
- Three-dot menu on each file
- Keyboard shortcuts

#### 3.4 Drag and Drop
**Features:**
- Drag files/folders to move
- Visual feedback (ghost image)
- Drop zones (folders, sidebar items)
- Prevent invalid drops
- Smooth animations

---

### Phase 4: Search & Filters (Day 6)

#### 4.1 Search Bar
**Features:**
- Real-time search as you type
- Search in current folder or all files
- Recent searches dropdown
- Clear search button

#### 4.2 Advanced Search/Filters
**Filters:**
- File type (Documents, Spreadsheets, PDFs, Images, Videos, etc.)
- Owner (Me, Specific person, Anyone)
- Modified date (Today, Last 7 days, Last 30 days, Custom range)
- Shared status (Shared with me, Shared by me, Not shared)
- Location (My Drive, Shared drives, Trash)

**Search Operators:**
- `type:pdf` - Search by file type
- `owner:me` - Files owned by me
- `is:starred` - Starred files
- `modified:today` - Modified today

#### 4.3 Search Results Page
**Layout:**
- Results count
- File list/grid matching search
- Clear filters button
- No results state

---

### Phase 5: File Sharing & Permissions (Day 7)

#### 5.1 Share Modal
**Components:**
- User search/email input with autocomplete
- List of current users with access
- Permission dropdown per user (Viewer, Commenter, Editor)
- General access settings (Restricted, Anyone with link)
- Copy link button
- Notification settings

**Features:**
- Add multiple users
- Change permissions
- Remove access
- Generate shareable link
- Set link expiration (optional)

#### 5.2 Permissions System
**Levels:**
- **Viewer** - Can view and download
- **Commenter** - Can view, comment, and download
- **Editor** - Can view, comment, edit, and share

**Implementation:**
- Inherit permissions from parent folder
- Override permissions on individual files
- Revoke access
- Transfer ownership

#### 5.3 Shared With Me Page
**Features:**
- Show files/folders shared by others
- Filter by owner
- Group by owner option
- Quick access to shared items

---

### Phase 6: Additional Views (Day 8)

#### 6.1 Recent Files View
**Features:**
- Show recently opened/modified files
- Sort by date descending
- Time groupings (Today, Yesterday, Last 7 days, etc.)
- Open file preview

#### 6.2 Starred Files View
**Features:**
- Show all starred items
- Add/remove stars
- Organize starred items
- Sort options

#### 6.3 Trash Page
**Features:**
- Show deleted items
- Restore files/folders
- Permanently delete
- Empty trash (confirmation)
- Auto-delete after 30 days indicator
- Select all in trash

---

### Phase 7: File Preview & Details (Day 9)

#### 7.1 File Preview Modal
**Supported Types:**
- Images (PNG, JPG, GIF, SVG)
- PDFs (embedded viewer)
- Videos (HTML5 player)
- Text files (syntax highlighting)
- Documents (placeholder or iframe)

**Features:**
- Fullscreen mode
- Zoom in/out (images, PDFs)
- Previous/next file navigation
- Download button
- Share button
- Print button (PDFs, images)
- Close on ESC key

#### 7.2 File Details Panel
**Information:**
- File type and size
- Owner and location
- Created and modified dates
- Last opened
- Download permissions
- Description (editable)

**Tabs:**
- Details
- Activity (who accessed, when)
- Versions (if applicable)

---

### Phase 8: Storage & Analytics (Day 10)

#### 8.1 Storage Page
**Components:**
- Large storage usage donut chart
- Breakdown by category:
  - Drive files
  - Photos
  - Gmail
  - Trash
- List of large files
- Clean up suggestions

**Features:**
- Upgrade storage CTA (mocked)
- Review large files
- Empty trash quick action

#### 8.2 Storage Indicator in Sidebar
**Display:**
- Used storage / Total storage
- Colored progress bar
- Click to open storage page

---

### Phase 9: Polish & Animations (Day 11)

#### 9.1 Transitions & Animations
- Page transitions (fade, slide)
- Modal animations (scale up)
- List item hover effects
- Button ripple effects
- Loading skeletons
- Drag animations
- Upload progress animations
- Success/error toasts

#### 9.2 Responsive Design
**Breakpoints:**
- Mobile: < 600px (collapsible sidebar, simplified view)
- Tablet: 600px - 960px (responsive grid)
- Desktop: > 960px (full layout)

**Mobile Optimizations:**
- Bottom navigation bar (mobile)
- Hamburger menu for sidebar
- Touch-friendly buttons
- Swipe gestures
- Simplified action menus

#### 9.3 Accessibility
- Keyboard navigation
- ARIA labels
- Focus management
- Screen reader support
- High contrast mode
- Keyboard shortcuts overlay (Shift+?)

---

### Phase 10: Context Menus & Shortcuts (Day 12)

#### 10.1 Context Menu
**Implementation:**
- Right-click on files/folders
- Dynamic menu based on context
- Disabled states for invalid actions
- Keyboard support (Arrow keys, Enter)

#### 10.2 Keyboard Shortcuts
- `Ctrl+A` - Select all
- `Ctrl+C` - Copy
- `Ctrl+V` - Paste
- `Del` - Move to trash
- `Shift+Del` - Permanently delete
- `Enter` - Open/Preview
- `F2` - Rename
- `Ctrl+F` - Focus search
- `Shift+?` - Show keyboard shortcuts
- `Escape` - Clear selection / Close modal

---

## Design Specifications

### Color Palette (Google Drive Colors)
```typescript
{
  primary: '#1a73e8',        // Google Blue
  primaryDark: '#1557b0',
  primaryLight: '#4285f4',

  surface: '#ffffff',
  surfaceVariant: '#f1f3f4',

  background: '#ffffff',
  backgroundGray: '#f8f9fa',

  error: '#d93025',
  warning: '#f9ab00',
  success: '#1e8e3e',

  text: {
    primary: '#202124',
    secondary: '#5f6368',
    disabled: '#80868b',
  },

  border: '#e8eaed',
  divider: '#e8eaed',

  hover: 'rgba(26, 115, 232, 0.08)',
  selected: 'rgba(26, 115, 232, 0.12)',
}
```

### Typography
- **Font Family:** 'Google Sans', 'Roboto', 'Arial', sans-serif
- **Sizes:**
  - Display: 28px
  - Title: 22px
  - Headline: 16px
  - Body: 14px
  - Caption: 12px

### Spacing
- Base unit: 8px
- Common spacing: 8px, 16px, 24px, 32px, 48px

### Border Radius
- Small: 4px
- Medium: 8px
- Large: 12px
- Circular: 50%

### Elevation (Shadows)
- Level 1: Cards, raised buttons
- Level 2: Dropdowns, tooltips
- Level 3: Modals, dialogs
- Level 4: Top app bar (scrolled)

---

## Component Specifications

### Top Bar (Height: 64px)
- Logo: 40px
- Search bar: Max-width 720px, height 48px
- Icons: 24px with 48px touch target
- Avatar: 32px

### Sidebar (Width: 256px)
- New button: 120px width, 56px height, elevated
- Nav items: 48px height, 16px padding
- Icons: 20px
- Collapsible width: 72px (icons only)

### File List
- Row height: 48px
- Checkbox: 18px
- Icon: 24px
- Name column: Flexible width
- Other columns: Fixed width (120-160px)

### File Grid
- Card size: 180x180px (minimum)
- Thumbnail: 160x160px
- Gap: 16px
- Responsive columns: 2-8 based on screen width

### Modals
- Max-width: 560px (small), 840px (large)
- Padding: 24px
- Actions: Right-aligned, 8px gap

---

## API Integration Points (For Future Backend)

### Endpoints
```typescript
// Authentication
POST   /api/auth/login
POST   /api/auth/signup
POST   /api/auth/logout
GET    /api/auth/me

// Files & Folders
GET    /api/files                    // List files
GET    /api/files/:id                // Get file details
POST   /api/files                    // Upload file
PUT    /api/files/:id                // Update file
DELETE /api/files/:id                // Delete file
POST   /api/files/:id/copy           // Copy file
POST   /api/files/:id/move           // Move file
POST   /api/files/:id/star           // Star file
DELETE /api/files/:id/star           // Unstar file

// Folders
GET    /api/folders/:id              // Get folder contents
POST   /api/folders                  // Create folder
PUT    /api/folders/:id              // Update folder
DELETE /api/folders/:id              // Delete folder

// Sharing
GET    /api/files/:id/permissions    // Get file permissions
POST   /api/files/:id/permissions    // Share file
PUT    /api/files/:id/permissions/:permissionId  // Update permission
DELETE /api/files/:id/permissions/:permissionId  // Remove permission

// Search
GET    /api/search?q=:query          // Search files

// Storage
GET    /api/storage/usage             // Get storage usage

// Trash
GET    /api/trash                     // List trash items
POST   /api/trash/:id/restore         // Restore from trash
DELETE /api/trash/:id                 // Permanently delete
DELETE /api/trash                     // Empty trash
```

---

## Testing Strategy

### Unit Tests
- Component rendering
- State management (Zustand stores)
- Utility functions
- Custom hooks

### Integration Tests
- File operations flow
- Search and filter functionality
- Upload process
- Sharing workflow

### E2E Tests (Playwright/Cypress)
- Complete user journeys
- Authentication flow
- Upload and organize files
- Share and collaborate
- Search and filter

---

## Performance Optimizations

### Code Splitting
- Route-based splitting
- Lazy load modals
- Lazy load preview components

### Virtualization
- Large file lists (react-window)
- Folder tree (react-virtualized)

### Memoization
- React.memo for components
- useMemo for expensive calculations
- useCallback for event handlers

### Image Optimization
- Lazy loading
- Thumbnail generation
- Progressive loading

### Bundle Size
- Tree shaking
- Dynamic imports
- Analyze bundle (vite-bundle-visualizer)

---

## Browser Support
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 14+, Chrome Android

---

## Development Timeline

**Total Duration: 12 days**

- **Days 1:** Setup & configuration
- **Days 2-3:** Core UI components
- **Days 4-5:** File operations
- **Day 6:** Search & filters
- **Day 7:** Sharing & permissions
- **Day 8:** Additional views
- **Day 9:** File preview & details
- **Day 10:** Storage & analytics
- **Day 11:** Polish & animations
- **Day 12:** Context menus & shortcuts

---

## Next Steps

1. Review and approve implementation plan
2. Begin Phase 1: Project setup
3. Create Material UI theme configuration
4. Setup routing structure
5. Build base layout components
6. Iterate through phases sequentially

---

## References

- [Google Drive UI](https://drive.google.com)
- [Material UI Documentation](https://mui.com)
- [Material 3 Design Guidelines](https://m3.material.io)
- [React Documentation](https://react.dev)
