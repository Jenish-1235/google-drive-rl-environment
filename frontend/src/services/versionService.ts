import api from "./api";

export interface FileVersion {
  id: number;
  file_id: string;
  version_number: number;
  file_path: string;
  size: number;
  created_by_user_id: number;
  created_at: string;
  created_by?: {
    id: number;
    name: string;
    email: string;
    avatar_url: string;
  };
}

export const versionService = {
  // Get all versions for a file
  getVersions: async (fileId: string): Promise<{ versions: FileVersion[]; count: number }> => {
    const response = await api.get(`/versions/${fileId}`);
    return response.data;
  },

  // Create a new version (re-upload file)
  createVersion: async (
    fileId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{ version: FileVersion; message: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`/versions/${fileId}`, formData, {
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

  // Download a specific version
  downloadVersion: async (
    fileId: string,
    versionNumber: number,
    filename: string
  ): Promise<void> => {
    const response = await api.get(`/versions/${fileId}/${versionNumber}/download`, {
      responseType: "blob",
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${filename}_v${versionNumber}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Restore a specific version (make it current)
  restoreVersion: async (
    fileId: string,
    versionNumber: number
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(`/versions/${fileId}/${versionNumber}/restore`);
    return response.data;
  },
};

export default versionService;
