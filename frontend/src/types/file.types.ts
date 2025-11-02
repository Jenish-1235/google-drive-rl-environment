export type FileType =
  | 'folder'
  | 'document'
  | 'spreadsheet'
  | 'presentation'
  | 'pdf'
  | 'image'
  | 'video'
  | 'audio'
  | 'archive'
  | 'other';

export type ViewMode = 'list' | 'grid';

export type SortField = 'name' | 'modifiedTime' | 'size' | 'owner';
export type SortOrder = 'asc' | 'desc';

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  mimeType: string;
  size: number;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  createdTime: Date;
  modifiedTime: Date;
  lastOpenedTime?: Date;
  parentId: string | null;
  path: string[];
  isStarred: boolean;
  isTrashed: boolean;
  isShared: boolean;
  permissions: Permission[];
  thumbnailUrl?: string;
  downloadUrl?: string;
  webViewUrl?: string;
  description?: string;
  version?: number;
}

export interface FolderItem extends Omit<FileItem, 'type' | 'size' | 'mimeType'> {
  type: 'folder';
  childrenCount: number;
  isExpanded?: boolean;
}

export type DriveItem = FileItem | FolderItem;

export type PermissionRole = 'viewer' | 'commenter' | 'editor' | 'owner';

export interface Permission {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhotoUrl?: string;
  role: PermissionRole;
  createdTime: Date;
}

export interface ShareSettings {
  generalAccess: 'restricted' | 'anyone-with-link';
  linkRole?: PermissionRole;
  allowCommenting?: boolean;
  allowDownload?: boolean;
  expirationTime?: Date;
}

export interface UploadProgress {
  id: string;
  file: File;
  fileName: string;
  fileSize: number;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error' | 'cancelled';
  error?: string;
  parentId: string | null;
}

export interface FileFilter {
  types?: FileType[];
  owner?: 'me' | 'anyone' | string;
  modifiedDate?: {
    start?: Date;
    end?: Date;
  };
  isStarred?: boolean;
  isShared?: boolean;
  isTrashed?: boolean;
}

export interface BreadcrumbItem {
  id: string;
  name: string;
}

// Backend file type
export interface BackendFile {
  id: string;
  name: string;
  type: "file" | "folder";
  mime_type: string | null;
  size: number;
  parent_id: string | null;
  owner_id: number;
  file_path: string | null;
  thumbnail_path: string | null;
  is_starred: 0 | 1;
  is_trashed: 0 | 1;
  trashed_at: string | null;
  created_at: string;
  updated_at: string;
  last_opened_at: string | null;
}

// Helper to get FileType from mime type
export function getFileTypeFromMime(mimeType: string | null, type: "file" | "folder"): FileType {
  if (type === "folder") return "folder";
  if (!mimeType) return "other";

  if (mimeType.includes("pdf")) return "pdf";
  if (mimeType.includes("document") || mimeType.includes("word")) return "document";
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return "spreadsheet";
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) return "presentation";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("tar")) return "archive";

  return "other";
}

// Helper to convert backend file to frontend DriveItem
export function mapBackendFile(backendFile: BackendFile): DriveItem {
  const fileType = getFileTypeFromMime(backendFile.mime_type, backendFile.type);

  const baseItem = {
    id: backendFile.id,
    name: backendFile.name,
    ownerId: String(backendFile.owner_id),
    ownerName: "Unknown", // Will be populated from owner info if needed
    ownerEmail: "",
    createdTime: new Date(backendFile.created_at),
    modifiedTime: new Date(backendFile.updated_at),
    lastOpenedTime: backendFile.last_opened_at ? new Date(backendFile.last_opened_at) : undefined,
    parentId: backendFile.parent_id,
    path: [], // Will be calculated if needed
    isStarred: backendFile.is_starred === 1,
    isTrashed: backendFile.is_trashed === 1,
    isShared: false, // Will be updated based on shares
    permissions: [],
  };

  if (backendFile.type === "folder") {
    return {
      ...baseItem,
      type: "folder",
      childrenCount: 0, // Will be updated if needed
    } as FolderItem;
  }

  return {
    ...baseItem,
    type: fileType,
    mimeType: backendFile.mime_type || "application/octet-stream",
    size: backendFile.size,
  } as FileItem;
}

export interface StorageQuota {
  limit: number;
  usage: number;
  usageInDrive: number;
  usageInTrash: number;
}

export interface ActivityItem {
  id: string;
  type: 'upload' | 'edit' | 'share' | 'delete' | 'restore' | 'move' | 'rename' | 'comment';
  userId: string;
  userName: string;
  userPhotoUrl?: string;
  fileId: string;
  fileName: string;
  timestamp: Date;
  details?: string;
}
