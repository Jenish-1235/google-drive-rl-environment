import type { FileType } from "../types/file.types";

// API endpoints (for future backend integration)
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:5000/api');

// Dummy user credentials for auto-login
export const DUMMY_USER_CREDENTIALS = {
  email: import.meta.env.VITE_DUMMY_USER_EMAIL || 'demo@drive.com',
  password: import.meta.env.VITE_DUMMY_USER_PASSWORD || 'demo123',
};

export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  LOGOUT: "/auth/logout",
  ME: "/auth/me",

  // Files
  FILES: "/files",
  FILE_BY_ID: (id: string) => `/files/${id}`,
  FILE_COPY: (id: string) => `/files/${id}/copy`,
  FILE_MOVE: (id: string) => `/files/${id}/move`,
  FILE_STAR: (id: string) => `/files/${id}/star`,

  // Folders
  FOLDERS: "/folders",
  FOLDER_BY_ID: (id: string) => `/folders/${id}`,

  // Sharing
  PERMISSIONS: (fileId: string) => `/files/${fileId}/permissions`,
  PERMISSION_BY_ID: (fileId: string, permissionId: string) =>
    `/files/${fileId}/permissions/${permissionId}`,

  // Search
  SEARCH: "/search",

  // Storage
  STORAGE_USAGE: "/storage/usage",

  // Trash
  TRASH: "/trash",
  TRASH_RESTORE: (id: string) => `/trash/${id}/restore`,
  TRASH_EMPTY: "/trash",
};

// File type to MIME type mapping
export const MIME_TYPES: Record<string, FileType> = {
  // Folders
  "application/vnd.google-apps.folder": "folder",

  // Documents
  "application/vnd.google-apps.document": "document",
  "application/msword": "document",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "document",
  "text/plain": "document",
  "application/rtf": "document",

  // Spreadsheets
  "application/vnd.google-apps.spreadsheet": "spreadsheet",
  "application/vnd.ms-excel": "spreadsheet",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    "spreadsheet",
  "text/csv": "spreadsheet",

  // Presentations
  "application/vnd.google-apps.presentation": "presentation",
  "application/vnd.ms-powerpoint": "presentation",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "presentation",

  // PDF
  "application/pdf": "pdf",

  // Images
  "image/jpeg": "image",
  "image/jpg": "image",
  "image/png": "image",
  "image/gif": "image",
  "image/svg+xml": "image",
  "image/webp": "image",
  "image/bmp": "image",

  // Videos
  "video/mp4": "video",
  "video/quicktime": "video",
  "video/x-msvideo": "video",
  "video/webm": "video",
  "video/mpeg": "video",

  // Audio
  "audio/mpeg": "audio",
  "audio/mp3": "audio",
  "audio/wav": "audio",
  "audio/ogg": "audio",
  "audio/webm": "audio",

  // Archives
  "application/zip": "archive",
  "application/x-rar-compressed": "archive",
  "application/x-7z-compressed": "archive",
  "application/x-tar": "archive",
  "application/gzip": "archive",
};

export const getFileType = (mimeType: string): FileType => {
  return MIME_TYPES[mimeType] || "other";
};

// File size limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB
export const MAX_UPLOAD_BATCH = 100;

// Storage
export const DEFAULT_STORAGE_LIMIT = 15 * 1024 * 1024 * 1024; // 15GB

// View modes
export const VIEW_MODES = {
  LIST: "list" as const,
  GRID: "grid" as const,
};

// Routes
export const ROUTES = {
  HOME: "/home",
  DRIVE: "/drive",
  SHARED: "/shared",
  RECENT: "/recent",
  STARRED: "/starred",
  TRASH: "/trash",
  STORAGE: "/storage",
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  FOLDER: (id: string) => `/folder/${id}`,
};

// Sidebar navigation items
export const SIDEBAR_ITEMS = [
  { id: "home", label: "Home", icon: "home", path: ROUTES.HOME },
  { id: "my-drive", label: "My Drive", icon: "folder", path: ROUTES.DRIVE },
  {
    id: "shared",
    label: "Shared with me",
    icon: "people",
    path: ROUTES.SHARED,
  },
  { id: "recent", label: "Recent", icon: "schedule", path: ROUTES.RECENT },
  { id: "starred", label: "Starred", icon: "star", path: ROUTES.STARRED },
  { id: "trash", label: "Trash", icon: "delete", path: ROUTES.TRASH },
];

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  SELECT_ALL: "ctrl+a",
  COPY: "ctrl+c",
  PASTE: "ctrl+v",
  DELETE: "delete",
  PERMANENT_DELETE: "shift+delete",
  OPEN: "enter",
  RENAME: "f2",
  SEARCH: "ctrl+f",
  HELP: "shift+?",
  ESCAPE: "escape",
};

// Animation durations (ms)
export const ANIMATION = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 350,
};

// Breakpoints (matches MUI defaults)
export const BREAKPOINTS = {
  XS: 0,
  SM: 600,
  MD: 960,
  LG: 1280,
  XL: 1920,
};

// Z-index layers
export const Z_INDEX = {
  SIDEBAR: 100,
  TOPBAR: 110,
  MODAL: 1300,
  TOOLTIP: 1500,
  CONTEXT_MENU: 1400,
};

// Date formats
export const DATE_FORMATS = {
  FULL: "MMM dd, yyyy hh:mm a",
  SHORT: "MMM dd, yyyy",
  TIME: "hh:mm a",
  RELATIVE: "relative", // Today, Yesterday, etc.
};

// Search operators
export const SEARCH_OPERATORS = {
  TYPE: "type:",
  OWNER: "owner:",
  IS: "is:",
  MODIFIED: "modified:",
};

// Permission roles
export const PERMISSION_ROLES = {
  VIEWER: {
    id: "viewer",
    label: "Viewer",
    description: "Can view and download",
  },
  COMMENTER: {
    id: "commenter",
    label: "Commenter",
    description: "Can view, comment, and download",
  },
  EDITOR: {
    id: "editor",
    label: "Editor",
    description: "Can view, comment, edit, and share",
  },
  OWNER: { id: "owner", label: "Owner", description: "Full access" },
};

// Mock data (for initial development)
export const MOCK_USER_ID = "user-001";
export const MOCK_USER = {
  id: MOCK_USER_ID,
  name: "John Doe",
  email: "john.doe@example.com",
  photoUrl: "",
  createdAt: new Date("2024-01-01"),
  lastLoginAt: new Date(),
};
