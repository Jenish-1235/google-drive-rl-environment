# Visual Guide - Google Drive Clone UI

## Current Implementation Status

### ✅ Phase 1: Main Layout (COMPLETE)

---

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  TopBar (64px height)                                           │
│  ┌──┐  Drive    [        Search in Drive...      ]  ◊ ? ⚙ 👤  │
└─────────────────────────────────────────────────────────────────┘
┌──────────────┬──────────────────────────────────────────────────┐
│              │                                                   │
│  Sidebar     │  Main Content Area                               │
│  (256px)     │                                                   │
│              │                                                   │
│  [  New  ]   │  ┌─────────────────────────────────────────┐   │
│              │  │                                           │   │
│  📁 My Drive │  │         Page Content                     │   │
│  👥 Shared   │  │         (Outlet)                         │   │
│  🕐 Recent   │  │                                           │   │
│  ⭐ Starred  │  │                                           │   │
│  🗑 Trash    │  │                                           │   │
│              │  │                                           │   │
│  ☁ Storage   │  └─────────────────────────────────────────┘   │
│  ▓▓▓░░ 56%   │                                                   │
│  8.5 GB used │                                                   │
│              │                                                   │
└──────────────┴──────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. TopBar

```
┌──────────────────────────────────────────────────────────────────────┐
│ ☰  [Drive Logo] Drive    [🔍 Search...]  ◊  ?  ⚙  [JD]             │
│                                                                       │
│ └─ Menu          └─ Search Bar      │   │  │  └─ User Menu         │
│                                      │   │  └─ Settings              │
│                                      │   └─ Help                     │
│                                      └─ View Toggle (List/Grid)      │
└──────────────────────────────────────────────────────────────────────┘
```

**Interactive Elements:**
- ☰ Menu: Toggle sidebar
- Search bar: Focus state with blue border
- ◊ View toggle: Switch between list/grid
- ? Help: Help resources
- ⚙ Settings: App settings
- [JD] Avatar: User menu dropdown

### 2. Sidebar

```
┌─────────────────┐
│                 │
│  [   + New   ]  │  ← Elevated button with dropdown
│                 │
├─────────────────┤
│                 │
│  📁 My Drive    │  ← Active state (blue background)
│  👥 Shared      │
│  🕐 Recent      │
│  ⭐ Starred     │
│  🗑 Trash       │
│                 │
├─────────────────┤
│                 │
│  ☁ Storage      │
│  ████████░░░░░  │  ← Progress bar (color-coded)
│  8.5 GB of 15 GB│
│                 │
│  [Get storage]  │  ← Outlined button
│                 │
└─────────────────┘
```

**States:**
- Expanded: 256px width (full labels)
- Collapsed: 72px width (icons only)
- Smooth transition animation

### 3. New Button Dropdown

```
When clicked:
┌────────────────────┐
│ 📁 New folder      │
├────────────────────┤
│ 📄 File upload     │
│ 📂 Folder upload   │
└────────────────────┘
```

### 4. User Menu Dropdown

```
When avatar clicked:
┌─────────────────────────────┐
│  [JD]  John Doe             │
│        john.doe@example.com │
├─────────────────────────────┤
│  👤 Manage Google Account   │
├─────────────────────────────┤
│  ⎋  Sign out                │
└─────────────────────────────┘
```

---

## Color Reference

### Primary Colors
- **Google Blue**: `#1a73e8` - Primary actions, active states
- **Surface**: `#ffffff` - Cards, papers
- **Background**: `#f8f9fa` - Page background
- **Border**: `#e8eaed` - Dividers, borders

### Interaction Colors
- **Hover**: `rgba(26, 115, 232, 0.08)` - 8% blue overlay
- **Selected**: `rgba(26, 115, 232, 0.12)` - 12% blue overlay
- **Active**: `#1a73e8` - Full blue for text/icons

### Status Colors
- **Success**: `#1e8e3e` - Green
- **Warning**: `#f9ab00` - Orange
- **Error**: `#d93025` - Red

---

## Typography

### Font Hierarchy
```
Display (28px)  - Page titles
Title (22px)    - "Drive" in TopBar
Headline (16px) - Section headers
Body (14px)     - Main text, buttons
Caption (12px)  - Helper text, file sizes
```

### Font Family
- Primary: "Google Sans"
- Fallback: "Roboto", "Arial", sans-serif

---

## Spacing System

Based on 8px grid:
- `xs`: 8px
- `sm`: 16px
- `md`: 24px
- `lg`: 32px
- `xl`: 48px

---

## Interactive States

### Buttons

**New Button:**
```
Normal: White bg, elevation-2 shadow
Hover:  White bg, elevation-3 shadow
Active: Slightly darker shadow
```

**Icon Buttons:**
```
Normal: Transparent
Hover:  8% blue overlay, rounded
Active: 12% blue overlay
```

**Navigation Items:**
```
Normal: Transparent
Hover:  8% blue overlay
Active: 12% blue overlay, blue text/icon
```

### Search Bar

```
Normal:  Gray background, no border
Hover:   White background, subtle shadow
Focus:   White background, blue border, elevation-1 shadow
```

---

## Measurements

### Key Dimensions
- TopBar height: **64px**
- Sidebar width (expanded): **256px**
- Sidebar width (collapsed): **72px**
- New button: **120px × 56px** (28px border-radius)
- Search bar max-width: **720px**
- User avatar: **32px**

### Border Radius
- Small elements: **4px**
- Medium elements: **8px**
- Large elements: **12px**
- New button: **28px** (pill shape)
- Navigation items: **0 24px 24px 0** (right-rounded)

---

## Animations

All transitions: **0.2s ease**

### Sidebar Toggle
```css
width: 256px → 72px (or reverse)
duration: 0.2s
```

### Hover States
```css
background-color change
box-shadow change
duration: 0.2s
```

### Menu Open/Close
```css
opacity: 0 → 1
transform: scale(0.95) → scale(1)
duration: 0.15s
```

---

## Accessibility

### Keyboard Navigation
- Tab: Navigate through interactive elements
- Enter: Activate buttons/links
- Escape: Close menus
- Arrow keys: Navigate menu items

### ARIA Labels
- All icon buttons have tooltips
- Menu items properly labeled
- Search bar has placeholder

### Focus States
- Visible focus rings on all interactive elements
- Logical tab order

---

## Current Views Available

### Routes
1. **/** - My Drive (home)
2. **/shared** - Shared with me
3. **/recent** - Recent files
4. **/starred** - Starred files
5. **/trash** - Trash
6. **/storage** - Storage analytics
7. **/auth/login** - Login page
8. **/auth/signup** - Signup page

---

## What's Next?

### Phase 2: File Views

Need to implement:

1. **FileList Component** (Table View)
   ```
   ┌─────────────────────────────────────────────────┐
   │ ☐  📄  Project.pdf      Me    Oct 30   2.4 MB  │
   │ ☐  📊  Budget.xlsx      Me    Oct 29   145 KB  │
   │ ☐  📁  Documents        Me    Oct 28   -       │
   └─────────────────────────────────────────────────┘
   ```

2. **FileGrid Component** (Card View)
   ```
   ┌──────┐  ┌──────┐  ┌──────┐
   │ 📄   │  │ 📊   │  │ 📁   │
   │      │  │      │  │      │
   │Project│  │Budget│  │ Docs │
   └──────┘  └──────┘  └──────┘
   ```

3. **File Actions**
   - Select, rename, delete, move, share, download
   - Context menus
   - Bulk operations

4. **Drag & Drop**
   - Upload files
   - Move files to folders

---

## Testing Checklist

### Visual Testing ✅
- [x] TopBar renders correctly
- [x] Sidebar renders correctly
- [x] Logo displays
- [x] Icons render
- [x] Colors match design
- [x] Spacing is accurate

### Interaction Testing ✅
- [x] Sidebar toggle works
- [x] Navigation works
- [x] View toggle works
- [x] User menu opens
- [x] New button menu opens
- [x] Search bar focus states

### Responsive Testing (Pending)
- [ ] Mobile view (< 600px)
- [ ] Tablet view (600-960px)
- [ ] Desktop view (> 960px)

---

**Current Status:** Phase 1 Complete ✅
**Development Server:** http://localhost:5173/
**Last Updated:** November 1, 2025
