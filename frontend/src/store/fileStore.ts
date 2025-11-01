import { create } from "zustand";
import type {
  DriveItem,
  SortField,
  SortOrder,
  ViewMode,
  BreadcrumbItem,
} from "../types/file.types";

export type FileTypeFilter =
  | "all"
  | "folders"
  | "documents"
  | "spreadsheets"
  | "presentations"
  | "images"
  | "videos"
  | "pdfs";
export type PeopleFilter = "all" | "owned-by-me" | "not-owned-by-me";
export type ModifiedFilter =
  | "all"
  | "today"
  | "last-7-days"
  | "last-30-days"
  | "this-year";

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

  // Filters
  typeFilter: FileTypeFilter;
  peopleFilter: PeopleFilter;
  modifiedFilter: ModifiedFilter;

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

  // Filter actions
  setTypeFilter: (filter: FileTypeFilter) => void;
  setPeopleFilter: (filter: PeopleFilter) => void;
  setModifiedFilter: (filter: ModifiedFilter) => void;
  clearFilters: () => void;

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

  // Filters
  typeFilter: "all",
  peopleFilter: "all",
  modifiedFilter: "all",

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

  // Filter actions
  setTypeFilter: (filter) => set({ typeFilter: filter }),
  setPeopleFilter: (filter) => set({ peopleFilter: filter }),
  setModifiedFilter: (filter) => set({ modifiedFilter: filter }),
  clearFilters: () =>
    set({ typeFilter: "all", peopleFilter: "all", modifiedFilter: "all" }),

  // Computed
  getFileById: (id) => get().files.find((file) => file.id === id),

  getCurrentFolderFiles: () => {
    const state = get();
    let filteredFiles: DriveItem[];

    // First, filter by current folder
    if (!state.currentFolderId) {
      // Root folder: show files with no parent or parent === 'root'
      filteredFiles = state.files.filter(
        (file) =>
          (!file.parentId || file.parentId === "root") && !file.isTrashed
      );
    } else {
      filteredFiles = state.files.filter(
        (file) => file.parentId === state.currentFolderId && !file.isTrashed
      );
    }

    // Apply type filter
    if (state.typeFilter !== "all") {
      filteredFiles = filteredFiles.filter((file) => {
        switch (state.typeFilter) {
          case "folders":
            return file.type === "folder";
          case "documents":
            return file.type === "document";
          case "spreadsheets":
            return file.type === "spreadsheet";
          case "presentations":
            return file.type === "presentation";
          case "images":
            return file.type === "image";
          case "videos":
            return file.type === "video";
          case "pdfs":
            return file.type === "pdf";
          default:
            return true;
        }
      });
    }

    // Apply people filter
    if (state.peopleFilter !== "all") {
      filteredFiles = filteredFiles.filter((file) => {
        const currentUserId = "current-user"; // This should come from auth store
        switch (state.peopleFilter) {
          case "owned-by-me":
            return file.ownerId === currentUserId;
          case "not-owned-by-me":
            return file.ownerId !== currentUserId;
          default:
            return true;
        }
      });
    }

    // Apply modified filter
    if (state.modifiedFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      filteredFiles = filteredFiles.filter((file) => {
        const modifiedDate = new Date(file.modifiedTime);

        switch (state.modifiedFilter) {
          case "today":
            return modifiedDate >= today;
          case "last-7-days": {
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return modifiedDate >= sevenDaysAgo;
          }
          case "last-30-days": {
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return modifiedDate >= thirtyDaysAgo;
          }
          case "this-year": {
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            return modifiedDate >= startOfYear;
          }
          default:
            return true;
        }
      });
    }

    return filteredFiles;
  },

  getSelectedFilesData: () => {
    const state = get();
    return state.files.filter((file) => state.selectedFiles.includes(file.id));
  },
}));
