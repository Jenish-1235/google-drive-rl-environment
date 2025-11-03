// Export all services for easy importing
export { default as api } from "./api";
export { authService, default as authServiceDefault } from "./authService";
export { fileService, default as fileServiceDefault } from "./fileService";
export { shareService, default as shareServiceDefault } from "./shareService";
export { userService, default as userServiceDefault } from "./userService";
export { commentService, default as commentServiceDefault } from "./commentService";
export { activityService, default as activityServiceDefault } from "./activityService";
export { versionService, default as versionServiceDefault } from "./versionService";

// Export types
export type { FileFilters } from "./fileService";
export type {
  PermissionRole,
  Share,
  ShareWithDetails,
  SharedFile,
  ShareLinkResponse,
  ShareLinkFileResponse,
} from "./shareService";
export type {
  User,
  StorageInfo,
  StorageBreakdown,
  LargestFile,
  StorageAnalytics,
  StorageHistory,
} from "./userService";
export type { Comment } from "./commentService";
export type { ActivityAction, Activity, ActivityStats } from "./activityService";
export type { FileVersion } from "./versionService";
