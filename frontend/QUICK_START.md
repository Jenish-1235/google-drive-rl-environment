# Quick Start Guide - Google Drive Clone

## Overview
This is a pixel-perfect clone of Google Drive built with React, TypeScript, and Material UI.

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development Server
The app will run at: `http://localhost:5173`

## Project Status

### Completed
- [x] Frontend project initialization with Vite + React + TypeScript
- [x] Material UI and core dependencies installed
- [x] Comprehensive implementation plan created

### In Progress
- [ ] Project structure setup
- [ ] Material UI theme configuration

### Upcoming
- [ ] Base layout components
- [ ] File list/grid views
- [ ] File operations (upload, delete, rename, move)
- [ ] Search and filters
- [ ] Sharing and permissions
- [ ] File preview
- [ ] Storage analytics

## Tech Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Material UI v6** - Component Library (Material 3)
- **React Router DOM** - Routing
- **Zustand** - State Management
- **Axios** - HTTP Client
- **React Dropzone** - File Uploads

## Key Features to Implement

1. **File Management**
   - Upload, download, rename, delete files
   - Create, organize folders
   - Drag-and-drop support

2. **Views**
   - List view (default)
   - Grid view
   - Recent files
   - Starred files
   - Shared with me
   - Trash

3. **Search & Filter**
   - Global search
   - Advanced filters
   - Search operators

4. **Sharing**
   - Share files/folders
   - Permission levels (Viewer, Commenter, Editor)
   - Shareable links

5. **UI/UX**
   - Pixel-perfect Google Drive design
   - Smooth animations
   - Responsive design
   - Dark mode support

## Folder Structure

```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── hooks/         # Custom hooks
├── store/         # Zustand stores
├── services/      # API services
├── types/         # TypeScript types
├── utils/         # Utility functions
└── theme/         # MUI theme configuration
```

## Documentation

- See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for detailed implementation guide
- Phase-by-phase development approach
- Component specifications
- API integration points

## Design Specifications

### Colors
- Primary: `#1a73e8` (Google Blue)
- Surface: `#ffffff`
- Background: `#f8f9fa`

### Typography
- Font: Google Sans, Roboto
- Sizes: 12px, 14px, 16px, 22px, 28px

### Layout
- Top Bar: 64px height
- Sidebar: 256px width (collapsible to 72px)
- File row: 48px height

## Next Steps

1. Create folder structure (`src/components`, `src/pages`, etc.)
2. Configure Material UI theme with Google Drive colors
3. Setup React Router
4. Create Zustand stores
5. Build base layout (TopBar, Sidebar, MainLayout)
6. Implement file list/grid views
7. Add file operations
8. Polish with animations and responsive design

## Resources

- [Material UI Docs](https://mui.com)
- [Google Drive](https://drive.google.com) - Reference for UI
- [Material 3 Guidelines](https://m3.material.io)
