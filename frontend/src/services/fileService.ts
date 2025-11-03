import api from "./api";

export interface FileFilters {
  parent_id?: string | null;
  starred?: boolean;
  trashed?: boolean;
  type?: "file" | "folder";
  search?: string;
}

export const fileService = {
  // List files with filters
  listFiles: async (filters?: FileFilters) => {
    const params: any = {};
    if (filters) {
      if (filters.parent_id !== undefined) {
        // Send null as string "null" for backend to understand
        params.parent_id = filters.parent_id === null ? "null" : filters.parent_id;
      }
      if (filters.starred !== undefined) params.starred = filters.starred;
      if (filters.trashed !== undefined) params.trashed = filters.trashed;
      if (filters.type) params.type = filters.type;
      if (filters.search) params.search = filters.search;
    }

    const response = await api.get("/files", { params });
    return response.data;
  },

  // Get file by ID
  getFile: async (id: string) => {
    const response = await api.get(`/files/${id}`);
    return response.data;
  },

  // Create folder
  createFolder: async (name: string, parentId?: string | null) => {
    const response = await api.post("/files", {
      name,
      parent_id: parentId || null,
    });
    return response.data;
  },

  // Upload file
  uploadFile: async (
    file: File,
    parentId?: string | null,
    onProgress?: (progress: number) => void
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    // Always send parent_id, use "null" string for root folder
    formData.append("parent_id", (parentId === null || parentId === undefined) ? "null" : parentId);

    const response = await api.post("/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });
    return response.data;
  },

  // Update file (rename, move, star)
  updateFile: async (
    id: string,
    updates: {
      name?: string;
      parent_id?: string | null;
      is_starred?: boolean;
    }
  ) => {
    const response = await api.patch(`/files/${id}`, updates);
    return response.data;
  },

  // Rename file
  renameFile: async (id: string, newName: string) => {
    return fileService.updateFile(id, { name: newName });
  },

  // Move file
  moveFile: async (id: string, newParentId: string | null) => {
    return fileService.updateFile(id, { parent_id: newParentId });
  },

  // Star/unstar file
  starFile: async (id: string, starred: boolean) => {
    return fileService.updateFile(id, { is_starred: starred });
  },

  // Delete file (move to trash)
  deleteFile: async (id: string) => {
    const response = await api.delete(`/files/${id}`);
    return response.data;
  },

  // Restore from trash
  restoreFile: async (id: string) => {
    const response = await api.post(`/files/${id}/restore`);
    return response.data;
  },

  // Permanent delete
  permanentDelete: async (id: string) => {
    const response = await api.delete(`/files/${id}/permanent`);
    return response.data;
  },

  // Download file
  downloadFile: async (id: string, filename: string) => {
    const response = await api.get(`/files/${id}/download`, {
      responseType: "blob",
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Get recent files
  getRecentFiles: async (limit?: number) => {
    const params = limit ? { limit } : undefined;
    const response = await api.get("/files/recent", { params });
    return response.data;
  },

  // Get starred files
  getStarredFiles: async () => {
    const response = await api.get("/files/starred");
    return response.data;
  },

  // Get shared files
  getSharedFiles: async () => {
    const response = await api.get("/files/shared");
    return response.data;
  },

  // Get trash files
  getTrashFiles: async () => {
    const response = await api.get("/files/trash");
    return response.data;
  },

  // Get folder path (for breadcrumbs)
  getFolderPath: async (folderId: string) => {
    const response = await api.get(`/files/${folderId}/path`);
    return response.data;
  },

  // Preview file
  previewFile: async (id: string): Promise<Blob> => {
    const response = await api.get(`/files/${id}/preview`, {
      responseType: "blob",
    });
    return response.data;
  },

  // Batch operations
  batchMove: async (fileIds: string[], parentId: string | null) => {
    const response = await api.post("/files/batch/move", {
      file_ids: fileIds,
      parent_id: parentId === null ? "null" : parentId,
    });
    return response.data;
  },

  batchDelete: async (fileIds: string[]) => {
    const response = await api.post("/files/batch/delete", {
      file_ids: fileIds,
    });
    return response.data;
  },

  batchRestore: async (fileIds: string[]) => {
    const response = await api.post("/files/batch/restore", {
      file_ids: fileIds,
    });
    return response.data;
  },

  batchStar: async (fileIds: string[], isStarred: boolean) => {
    const response = await api.post("/files/batch/star", {
      file_ids: fileIds,
      is_starred: isStarred,
    });
    return response.data;
  },

  batchPermanentDelete: async (fileIds: string[]) => {
    const response = await api.post("/files/batch/permanent", {
      file_ids: fileIds,
    });
    return response.data;
  },
};

export default fileService;
