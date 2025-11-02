export const FILE_TYPES = {
  FOLDER: "folder",
  FILE: "file",
} as const;

export const PERMISSIONS = {
  VIEWER: "viewer",
  COMMENTER: "commenter",
  EDITOR: "editor",
} as const;

export const ACTIONS = {
  UPLOAD: "upload",
  CREATE: "create",
  DELETE: "delete",
  RESTORE: "restore",
  RENAME: "rename",
  MOVE: "move",
  COPY: "copy",
  SHARE: "share",
  UNSHARE: "unshare",
  STAR: "star",
  UNSTAR: "unstar",
  COMMENT: "comment",
  DOWNLOAD: "download",
  VIEW: "view",
} as const;

export const MIME_TYPES = {
  FOLDER: null,
  PDF: "application/pdf",
  IMAGE: "image/*",
  VIDEO: "video/*",
  DOCUMENT: "application/vnd.google-apps.document",
  SPREADSHEET: "application/vnd.google-apps.spreadsheet",
  PRESENTATION: "application/vnd.google-apps.presentation",
} as const;
