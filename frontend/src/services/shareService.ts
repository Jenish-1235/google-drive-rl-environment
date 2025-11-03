import api from "./api";

export type PermissionRole = "viewer" | "commenter" | "editor";

export interface Share {
  id: number;
  file_id: string;
  shared_by_user_id: number;
  shared_with_user_id: number | null;
  permission: PermissionRole;
  share_link: string | null;
  created_at: string;
  updated_at: string;
}

export interface ShareWithDetails extends Share {
  shared_with_user?: {
    id: number;
    email: string;
    name: string;
    avatar_url: string;
  };
}

export interface SharedFile {
  id: string;
  name: string;
  type: string;
  mime_type: string;
  size: number;
  permission: PermissionRole;
  shared_by: {
    id: number;
    email: string;
    name: string;
    avatar_url: string;
  };
  shared_at: string;
  created_at: string;
  updated_at: string;
}

export interface ShareLinkResponse {
  share_link: string;
  permission: PermissionRole;
  share_id: number;
}

export interface ShareLinkFileResponse {
  file: {
    id: string;
    name: string;
    type: string;
    mime_type: string;
    size: number;
    created_at: string;
    updated_at: string;
  };
  permission: PermissionRole;
  owner: {
    id: number;
    email: string;
    name: string;
    avatar_url: string;
  } | null;
}

export const shareService = {
  // Get all shares for a specific file
  getSharesForFile: async (fileId: string): Promise<{ shares: ShareWithDetails[] }> => {
    const response = await api.get(`/shares/file/${fileId}`);
    return response.data;
  },

  // Create a new share (share file with a specific user)
  createShare: async (
    fileId: string,
    sharedWithUserId: number,
    permission: PermissionRole = "viewer"
  ): Promise<{ share: Share }> => {
    const response = await api.post("/shares", {
      file_id: fileId,
      shared_with_user_id: sharedWithUserId,
      permission,
    });
    return response.data;
  },

  // Update share permission
  updateSharePermission: async (
    shareId: number,
    permission: PermissionRole
  ): Promise<{ share: Share }> => {
    const response = await api.patch(`/shares/${shareId}`, {
      permission,
    });
    return response.data;
  },

  // Revoke share access
  revokeShare: async (shareId: number): Promise<{ message: string }> => {
    const response = await api.delete(`/shares/${shareId}`);
    return response.data;
  },

  // Generate shareable link
  generateShareLink: async (
    fileId: string,
    permission: PermissionRole = "viewer"
  ): Promise<ShareLinkResponse> => {
    const response = await api.post("/shares/link", {
      file_id: fileId,
      permission,
    });
    return response.data;
  },

  // Access file via shareable link (public - no auth required)
  accessViaShareLink: async (token: string): Promise<ShareLinkFileResponse> => {
    const response = await api.get(`/shares/link/${token}`);
    return response.data;
  },

  // Get all files shared with me
  getSharedWithMe: async (): Promise<{ files: SharedFile[] }> => {
    const response = await api.get("/shares/shared-with-me");
    return response.data;
  },
};

export default shareService;
