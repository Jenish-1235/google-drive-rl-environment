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
