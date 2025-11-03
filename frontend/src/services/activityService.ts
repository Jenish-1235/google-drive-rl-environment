import api from "./api";

export type ActivityAction =
  | "create"
  | "upload"
  | "update"
  | "rename"
  | "move"
  | "delete"
  | "restore"
  | "permanent_delete"
  | "share"
  | "update_share"
  | "revoke_share"
  | "create_link"
  | "comment"
  | "download"
  | "preview"
  | "star"
  | "unstar";

export interface Activity {
  id: number;
  user_id: number;
  file_id: string | null;
  action: ActivityAction;
  details: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
    avatar_url: string;
  };
  file?: {
    id: string;
    name: string;
    type: string;
    mime_type: string;
  };
}

export interface ActivityStats {
  total: number;
  by_action: Record<ActivityAction, number>;
  most_recent: Activity | null;
}

export const activityService = {
  // Get activity feed for current user
  getActivityFeed: async (limit: number = 20): Promise<{ activities: Activity[] }> => {
    const response = await api.get("/activities", {
      params: { limit },
    });
    return response.data;
  },

  // Get activity statistics for current user
  getActivityStats: async (): Promise<ActivityStats> => {
    const response = await api.get("/activities/stats");
    return response.data;
  },

  // Get user's own activities
  getUserActivities: async (limit: number = 50): Promise<{ activities: Activity[] }> => {
    const response = await api.get("/activities/user", {
      params: { limit },
    });
    return response.data;
  },

  // Get activities for a specific file
  getFileActivities: async (
    fileId: string,
    limit: number = 50
  ): Promise<{ activities: Activity[] }> => {
    const response = await api.get(`/activities/file/${fileId}`, {
      params: { limit },
    });
    return response.data;
  },
};

export default activityService;
