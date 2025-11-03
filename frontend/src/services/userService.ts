import api from "./api";

export interface User {
  id: number;
  email: string;
  name: string;
  avatar_url: string;
  storage_used: number;
  storage_limit: number;
  created_at: string;
  updated_at: string;
}

export interface StorageInfo {
  storage_used: number;
  storage_limit: number;
  storage_percentage: number;
  available_storage: number;
}

export interface StorageBreakdown {
  category: string;
  total_size: number;
  file_count: number;
}

export interface LargestFile {
  id: string;
  name: string;
  mime_type: string;
  size: number;
  created_at: string;
}

export interface StorageAnalytics {
  total_storage: number;
  storage_limit: number;
  storage_percentage: number;
  available_storage: number;
  breakdown: StorageBreakdown[];
  largest_files: LargestFile[];
  recent_uploads: LargestFile[];
  type_distribution: {
    type: string;
    count: number;
  }[];
  trashed_storage: number;
}

export interface StorageHistory {
  month: string;
  storage_added: number;
  files_added: number;
}

export const userService = {
  // Get all users (for sharing autocomplete)
  getAllUsers: async (): Promise<{ users: User[] }> => {
    const response = await api.get("/users");
    return response.data;
  },

  // Get current user info
  getCurrentUser: async (): Promise<{ user: User }> => {
    const response = await api.get("/users/me");
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: number): Promise<{ user: User }> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Update user profile
  updateUser: async (
    id: number,
    updates: {
      name?: string;
      avatar_url?: string;
    }
  ): Promise<{ user: User }> => {
    const response = await api.patch(`/users/${id}`, updates);
    return response.data;
  },

  // Get detailed storage analytics
  getStorageAnalytics: async (): Promise<{ analytics: StorageAnalytics }> => {
    const response = await api.get("/users/storage/analytics");
    return response.data;
  },

  // Get storage usage history
  getStorageHistory: async (months: number = 6): Promise<{ history: StorageHistory[] }> => {
    const response = await api.get("/users/storage/history", {
      params: { months },
    });
    return response.data;
  },

  // Get basic storage info
  getStorageInfo: async (): Promise<StorageInfo> => {
    const response = await api.get("/users/storage");
    return response.data;
  },
};

export default userService;
