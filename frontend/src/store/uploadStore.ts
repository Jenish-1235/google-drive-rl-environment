import { create } from 'zustand';
import type { UploadProgress } from '../types/file.types';

interface UploadStore {
  uploads: UploadProgress[];
  isUploading: boolean;

  // Actions
  addUpload: (upload: UploadProgress) => void;
  updateUpload: (id: string, updates: Partial<UploadProgress>) => void;
  removeUpload: (id: string) => void;
  clearCompleted: () => void;
  cancelUpload: (id: string) => void;

  // Computed
  getActiveUploads: () => UploadProgress[];
  getCompletedUploads: () => UploadProgress[];
}

export const useUploadStore = create<UploadStore>((set, get) => ({
  uploads: [],
  isUploading: false,

  addUpload: (upload) =>
    set((state) => ({
      uploads: [...state.uploads, upload],
      isUploading: true,
    })),

  updateUpload: (id, updates) =>
    set((state) => {
      const uploads = state.uploads.map((upload) =>
        upload.id === id ? { ...upload, ...updates } : upload
      );
      const hasActiveUploads = uploads.some(
        (u) => u.status === 'uploading' || u.status === 'pending'
      );
      return {
        uploads,
        isUploading: hasActiveUploads,
      };
    }),

  removeUpload: (id) =>
    set((state) => ({
      uploads: state.uploads.filter((upload) => upload.id !== id),
    })),

  clearCompleted: () =>
    set((state) => ({
      uploads: state.uploads.filter((upload) => upload.status !== 'completed'),
    })),

  cancelUpload: (id) =>
    set((state) => ({
      uploads: state.uploads.map((upload) =>
        upload.id === id ? { ...upload, status: 'cancelled' as const } : upload
      ),
    })),

  getActiveUploads: () =>
    get().uploads.filter((u) => u.status === 'uploading' || u.status === 'pending'),

  getCompletedUploads: () =>
    get().uploads.filter((u) => u.status === 'completed'),
}));
