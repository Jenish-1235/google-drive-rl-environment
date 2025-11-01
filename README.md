# Google Drive Reinforcement Learning Environment

## Overview
You are tasked with building a high-fidelity fullstack clone of Google Drive, focusing on real-time collaboration, file management, and seamless user interaction.

The goal is to evaluate your ability to design and implement a complete cloud storage web application that integrates:
- Visually accurate design  
- Smooth transitions  
- Logically consistent backend operations for file upload, sharing, and organization  

---

## Objective

### Build a system that replicates the core functionality of Google Drive, including:

#### Authentication & Workspace
- Simulated user authentication (mocked or basic auth)  
- Personal workspace for each user  
- Support for multiple user accounts (optional multi-user mode)

#### File Management
- Upload, rename, delete, and move files/folders  
- Support for multiple file types (documents, images, videos, PDFs, etc.)  
- Show file metadata — name, type, size, modified date, owner  
- Inline preview for common file types (PDF, image, text)

#### Folder Hierarchy
- Create and manage nested folders  
- Drag-and-drop files between folders  
- Breadcrumb navigation for easy traversal

#### Search & Filters
- Global search for files and folders  
- Filters by file type, owner, date modified, or shared status  
- Support for advanced queries (e.g., `type:pdf owner:me`)

#### File Sharing & Permissions
- Share files/folders with other users in namespace  
- Set permissions: Viewer, Commenter, Editor  
- Revoke access and manage shared users  
- Generate shareable links (mocked)

#### Recent & Starred Views
- “Recent” view for recently opened or modified files  
- “Starred” view for bookmarked files/folders  

#### Trash & Restore
- Soft deletion (move to Trash)  
- Restore or permanently delete files from Trash  

#### Activity & Version History
- Activity feed for uploads, shares, deletions, and edits  
- Maintain version history for files (upload versioning simulation)

#### File Preview & Collaboration
- Inline file preview with toolbar actions (zoom, download, share)  
- Commenting on shared files (simulated collaboration)

#### Storage Analytics
- Show storage usage summary (used vs available)  
- Optional: Visualize usage by file type  

#### Offline & Caching Support (Optional Bonus)
- Basic offline caching for recently opened files  

#### Smooth User Interactions
- Realistic transitions for modals, navigation, uploads  
- Drag-and-drop uploads with animated progress bars  
- Responsive and visually consistent across devices  

#### Backend Logic
- File and folder CRUD operations  
- Persist metadata and simulate storage (DB or filesystem)  
- Implement sharing logic and permission management  

> **Focus:** UX precision, organization logic, and real-time interaction smoothness.

---

## Requirements

### 1. Frontend Development
- Responsive, high-fidelity UI resembling Google Drive  
- Use any modern framework (React, Next.js, Vue, etc.)  
- Implement drag-drop, upload indicators, and transitions  
- Ensure accessibility and optimized performance  

### 2. Backend Development
- APIs for user, file, folder, and sharing management  
- Use any backend stack (Node.js, Django, Go, etc.)  
- Persist metadata in database (PostgreSQL, MongoDB, SQLite)  
- Handle file uploads (local storage or simulated cloud)  
- Real-time updates for shared operations (WebSockets or polling)  

### 3. Documentation
Include a comprehensive `README.md` with:
- Setup and run instructions  
- Architecture and technology choices  
- Schema design for file, folder, sharing models  
- Synchronization, upload flow, and versioning logic  
- Edge cases handled (e.g., circular sharing, duplicate names)  
- Suggestions for future enhancements (AI-based search, cloud storage integration)  

---

## Deliverables

**GitHub Repository:**  
Share with:  
- [https://github.com/Naman-Bhalla/](https://github.com/Naman-Bhalla/)  
- [https://github.com/raun/](https://github.com/raun/)

### The repository must include:
- Source code for frontend and backend  
- A detailed `README.md` as described above  
- (Optional) Screenshots or a short demo video of major workflows  

---

> **Goal:** Deliver a visually accurate, logically consistent, and interaction-smooth Google Drive clone demonstrating full-stack design excellence.
