import { create } from "zustand";
import type {
  DriveItem,
  SortField,
  SortOrder,
  ViewMode,
  BreadcrumbItem,
} from "../types/file.types";

interface FileStore {
  files: DriveItem[];
  selectedFiles: string[];
  currentFolderId: string | null;
  breadcrumbs: BreadcrumbItem[];
  viewMode: ViewMode;
  sortField: SortField;
  sortOrder: SortOrder;
  searchQuery: string;
  isLoading: boolean;

  // Actions
  setFiles: (files: DriveItem[]) => void;
  setIsLoading: (loading: boolean) => void;
  addFile: (file: DriveItem) => void;
  updateFile: (id: string, updates: Partial<DriveItem>) => void;
  deleteFile: (id: string) => void;

  setSelectedFiles: (ids: string[]) => void;
  toggleFileSelection: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;

  setCurrentFolder: (folderId: string | null) => void;
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;

  setViewMode: (mode: ViewMode) => void;
  setSortField: (field: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
  toggleSortOrder: () => void;

  setSearchQuery: (query: string) => void;

  // Computed
  getFileById: (id: string) => DriveItem | undefined;
  getCurrentFolderFiles: () => DriveItem[];
  getSelectedFilesData: () => DriveItem[];
}

export const useFileStore = create<FileStore>((set, get) => ({
  files: [],
  selectedFiles: [],
  currentFolderId: null,
  breadcrumbs: [{ id: "root", name: "My Drive" }],
  viewMode: "list",
  sortField: "name",
  sortOrder: "asc",
  searchQuery: "",
  isLoading: false,

  // Actions
  setFiles: (files) => set({ files }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  addFile: (file) => set((state) => ({ files: [...state.files, file] })),

  updateFile: (id, updates) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id ? ({ ...file, ...updates } as DriveItem) : file
      ),
    })),

  deleteFile: (id) =>
    set((state) => ({
      files: state.files.filter((file) => file.id !== id),
      selectedFiles: state.selectedFiles.filter(
        (selectedId) => selectedId !== id
      ),
    })),

  setSelectedFiles: (ids) => set({ selectedFiles: ids }),

  toggleFileSelection: (id) =>
    set((state) => ({
      selectedFiles: state.selectedFiles.includes(id)
        ? state.selectedFiles.filter((selectedId) => selectedId !== id)
        : [...state.selectedFiles, id],
    })),

  selectAll: () =>
    set(() => ({
      selectedFiles: get()
        .getCurrentFolderFiles()
        .map((file) => file.id),
    })),

  clearSelection: () => set({ selectedFiles: [] }),

  setCurrentFolder: (folderId) =>
    set({ currentFolderId: folderId, selectedFiles: [] }),

  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),

  setViewMode: (mode) => set({ viewMode: mode }),

  setSortField: (field) => set({ sortField: field }),

  setSortOrder: (order) => set({ sortOrder: order }),

  toggleSortOrder: () =>
    set((state) => ({
      sortOrder: state.sortOrder === "asc" ? "desc" : "asc",
    })),

  setSearchQuery: (query) => set({ searchQuery: query }),

  // Computed
  getFileById: (id) => get().files.find((file) => file.id === id),

  getCurrentFolderFiles: () => {
    const state = get();
    if (!state.currentFolderId) {
      // Root folder: show files with no parent or parent === 'root'
      return state.files.filter(
        (file) =>
          (!file.parentId || file.parentId === "root") && !file.isTrashed
      );
    }
    return state.files.filter(
      (file) => file.parentId === state.currentFolderId && !file.isTrashed
    );
  },

  getSelectedFilesData: () => {
    const state = get();
    return state.files.filter((file) => state.selectedFiles.includes(file.id));
  },
}));
