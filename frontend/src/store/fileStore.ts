import { create } from "zustand";
import type {
  DriveItem,
  SortField,
  SortOrder,
  ViewMode,
  BreadcrumbItem,
  BackendFile,
} from "../types/file.types";
import { fileService } from "../services/fileService";
import { mapBackendFile as mapFile } from "../types/file.types";

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

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  data: DriveItem[];
  timestamp: number;
}

interface FileCache {
  [key: string]: CacheEntry;
}

interface FileStore {
  files: DriveItem[];
  cache: FileCache;
  selectedFiles: string[];
  currentFolderId: string | null;
  breadcrumbs: BreadcrumbItem[];
  viewMode: ViewMode;
  sortField: SortField;
  sortOrder: SortOrder;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;

  // Filters
  typeFilter: FileTypeFilter;
  peopleFilter: PeopleFilter;
  modifiedFilter: ModifiedFilter;

  // API Actions
  fetchFiles: (folderId?: string | null) => Promise<void>;
  createFolder: (name: string, parentId?: string | null) => Promise<DriveItem>;
  uploadFile: (file: File, parentId?: string | null, onProgress?: (progress: number) => void) => Promise<DriveItem>;
  renameFile: (id: string, newName: string) => Promise<void>;
  moveFile: (id: string, newParentId: string | null) => Promise<void>;
  toggleStar: (id: string) => Promise<void>;
  moveToTrash: (id: string) => Promise<void>;
  restoreFromTrash: (id: string) => Promise<void>;
  permanentlyDelete: (id: string) => Promise<void>;
  downloadFile: (id: string, name: string) => Promise<void>;
  fetchStarredFiles: () => Promise<void>;
  fetchTrashedFiles: () => Promise<void>;
  fetchRecentFiles: () => Promise<void>;
  fetchSharedFiles: () => Promise<void>;

  // Batch operations
  batchMoveFiles: (fileIds: string[], newParentId: string | null) => Promise<void>;
  batchDeleteFiles: (fileIds: string[]) => Promise<void>;
  batchRestoreFiles: (fileIds: string[]) => Promise<void>;
  batchStarFiles: (fileIds: string[], isStarred: boolean) => Promise<void>;
  batchPermanentDeleteFiles: (fileIds: string[]) => Promise<void>;

  // State Actions
  setFiles: (files: DriveItem[]) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
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

  // Cache management
  getCacheKey: (view: string, folderId?: string | null) => string;
  getCachedData: (cacheKey: string) => DriveItem[] | null;
  setCachedData: (cacheKey: string, data: DriveItem[]) => void;
  invalidateCache: (pattern?: string) => void;

  // Computed
  getFileById: (id: string) => DriveItem | undefined;
  getCurrentFolderFiles: () => DriveItem[];
  getSelectedFilesData: () => DriveItem[];
}

export const useFileStore = create<FileStore>((set, get) => ({
  files: [],
  cache: {},
  selectedFiles: [],
  currentFolderId: null,
  breadcrumbs: [{ id: "root", name: "My Drive" }],
  viewMode: "list",
  sortField: "name",
  sortOrder: "asc",
  searchQuery: "",
  isLoading: false,
  error: null,

  // Filters
  typeFilter: "all",
  peopleFilter: "all",
  modifiedFilter: "all",

  // Cache management
  getCacheKey: (view: string, folderId = null) => {
    return `${view}:${folderId || 'root'}`;
  },

  getCachedData: (cacheKey: string) => {
    const entry = get().cache[cacheKey];
    if (!entry) return null;

    const now = Date.now();
    const age = now - entry.timestamp;

    // Return cache if it's still valid
    if (age < CACHE_DURATION) {
      return entry.data;
    }

    // Cache expired
    return null;
  },

  setCachedData: (cacheKey: string, data: DriveItem[]) => {
    set((state) => ({
      cache: {
        ...state.cache,
        [cacheKey]: {
          data,
          timestamp: Date.now(),
        },
      },
    }));
  },

  invalidateCache: (pattern?: string) => {
    if (!pattern) {
      // Clear all cache
      set({ cache: {} });
      return;
    }

    // Clear cache entries matching pattern
    set((state) => {
      const newCache: FileCache = {};
      Object.keys(state.cache).forEach((key) => {
        if (!key.includes(pattern)) {
          newCache[key] = state.cache[key];
        }
      });
      return { cache: newCache };
    });
  },

  // API Actions
  fetchFiles: async (folderId) => {
    const cacheKey = get().getCacheKey('files', folderId);
    const cachedData = get().getCachedData(cacheKey);

    // If we have cached data, use it immediately for fast rendering
    if (cachedData) {
      set({ files: cachedData, isLoading: false });
    } else {
      set({ isLoading: true, error: null });
    }

    // Always fetch from API to ensure fresh data
    try {
      const response = await fileService.listFiles({
        parent_id: folderId,
      });
      const mappedFiles = response.files.map((file: BackendFile) => mapFile(file));

      // Update cache
      get().setCachedData(cacheKey, mappedFiles);

      // Update state
      set({ files: mappedFiles, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch files';
      // Only set error if we don't have cached data
      if (!cachedData) {
        set({ error: errorMessage, isLoading: false });
      } else {
        set({ isLoading: false });
      }
      throw error;
    }
  },

  createFolder: async (name, parentId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fileService.createFolder(name, parentId);
      const mappedFile = mapFile(response.file);

      // Only add to state if creating in current folder
      const currentFolderId = get().currentFolderId;
      const targetParentId = parentId === undefined ? currentFolderId : parentId;

      // Invalidate cache for the target folder
      const cacheKey = get().getCacheKey('files', targetParentId);
      get().invalidateCache(cacheKey);

      if (targetParentId === currentFolderId) {
        set((state) => ({
          files: [...state.files, mappedFile],
          isLoading: false,
        }));
      } else {
        set({ isLoading: false });
      }

      return mappedFile;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create folder';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  uploadFile: async (file, parentId, onProgress) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fileService.uploadFile(file, parentId, onProgress);
      const mappedFile = mapFile(response.file);

      // Only add to state if uploading to current folder
      const currentFolderId = get().currentFolderId;
      const targetParentId = parentId === undefined ? currentFolderId : parentId;

      // Invalidate cache for the target folder and recent files
      const cacheKey = get().getCacheKey('files', targetParentId);
      get().invalidateCache(cacheKey);
      get().invalidateCache('recent');

      if (targetParentId === currentFolderId) {
        set((state) => ({
          files: [...state.files, mappedFile],
          isLoading: false,
        }));
      } else {
        set({ isLoading: false });
      }

      return mappedFile;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to upload file';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  renameFile: async (id, newName) => {
    set({ error: null });
    try {
      const response = await fileService.renameFile(id, newName);
      const mappedFile = mapFile(response.file);

      // Invalidate all caches as the file could appear in multiple views
      get().invalidateCache();

      set((state) => ({
        files: state.files.map((file) => (file.id === id ? mappedFile : file)),
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to rename file';
      set({ error: errorMessage });
      throw error;
    }
  },

  moveFile: async (id, newParentId) => {
    set({ error: null });
    try {
      const file = get().files.find((f) => f.id === id);
      const response = await fileService.moveFile(id, newParentId);
      const mappedFile = mapFile(response.file);
      const currentFolderId = get().currentFolderId;

      // Invalidate cache for old and new parent folders
      if (file) {
        const oldCacheKey = get().getCacheKey('files', file.parentId);
        get().invalidateCache(oldCacheKey);
      }
      const newCacheKey = get().getCacheKey('files', newParentId);
      get().invalidateCache(newCacheKey);

      // If moving file out of current folder, remove from state
      // If moving within current folder (no parent change), update the file
      if (mappedFile.parentId !== currentFolderId) {
        set((state) => ({
          files: state.files.filter((file) => file.id !== id),
        }));
      } else {
        set((state) => ({
          files: state.files.map((file) => (file.id === id ? mappedFile : file)),
        }));
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to move file';
      set({ error: errorMessage });
      throw error;
    }
  },

  toggleStar: async (id) => {
    const file = get().files.find((f) => f.id === id);
    if (!file) return;

    set({ error: null });
    try {
      const response = await fileService.starFile(id, !file.isStarred);
      const mappedFile = mapFile(response.file);

      // Invalidate starred files cache
      get().invalidateCache('starred');

      set((state) => ({
        files: state.files.map((f) => (f.id === id ? mappedFile : f)),
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to toggle star';
      set({ error: errorMessage });
      throw error;
    }
  },

  moveToTrash: async (id) => {
    set({ error: null });
    try {
      await fileService.deleteFile(id);
      set((state) => ({
        files: state.files.map((file) =>
          file.id === id ? ({ ...file, isTrashed: true } as DriveItem) : file
        ),
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to move to trash';
      set({ error: errorMessage });
      throw error;
    }
  },

  restoreFromTrash: async (id) => {
    set({ error: null });
    try {
      const response = await fileService.restoreFile(id);
      const mappedFile = mapFile(response.file);
      set((state) => ({
        files: state.files.map((file) => (file.id === id ? mappedFile : file)),
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to restore file';
      set({ error: errorMessage });
      throw error;
    }
  },

  permanentlyDelete: async (id) => {
    set({ error: null });
    try {
      await fileService.permanentDelete(id);
      set((state) => ({
        files: state.files.filter((file) => file.id !== id),
        selectedFiles: state.selectedFiles.filter((selectedId) => selectedId !== id),
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to delete file';
      set({ error: errorMessage });
      throw error;
    }
  },

  downloadFile: async (id, name) => {
    set({ error: null });
    try {
      await fileService.downloadFile(id, name);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to download file';
      set({ error: errorMessage });
      throw error;
    }
  },

  fetchStarredFiles: async () => {
    const cacheKey = get().getCacheKey('starred');
    const cachedData = get().getCachedData(cacheKey);

    // If we have cached data, use it immediately
    if (cachedData) {
      set({ files: cachedData, isLoading: false });
    } else {
      set({ isLoading: true, error: null });
    }

    // Always fetch from API
    try {
      const response = await fileService.getStarredFiles();
      const mappedFiles = response.files.map((file: BackendFile) => mapFile(file));

      // Update cache
      get().setCachedData(cacheKey, mappedFiles);

      set({ files: mappedFiles, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch starred files';
      if (!cachedData) {
        set({ error: errorMessage, isLoading: false });
      } else {
        set({ isLoading: false });
      }
      throw error;
    }
  },

  fetchTrashedFiles: async () => {
    const cacheKey = get().getCacheKey('trash');
    const cachedData = get().getCachedData(cacheKey);

    // If we have cached data, use it immediately
    if (cachedData) {
      set({ files: cachedData, isLoading: false });
    } else {
      set({ isLoading: true, error: null });
    }

    // Always fetch from API
    try {
      const response = await fileService.getTrashFiles();
      const mappedFiles = response.files.map((file: BackendFile) => mapFile(file));

      // Update cache
      get().setCachedData(cacheKey, mappedFiles);

      set({ files: mappedFiles, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch trashed files';
      if (!cachedData) {
        set({ error: errorMessage, isLoading: false });
      } else {
        set({ isLoading: false });
      }
      throw error;
    }
  },

  fetchRecentFiles: async () => {
    const cacheKey = get().getCacheKey('recent');
    const cachedData = get().getCachedData(cacheKey);

    // If we have cached data, use it immediately
    if (cachedData) {
      set({ files: cachedData, isLoading: false });
    } else {
      set({ isLoading: true, error: null });
    }

    // Always fetch from API
    try {
      const response = await fileService.getRecentFiles();
      const mappedFiles = response.files.map((file: BackendFile) => mapFile(file));

      // Update cache
      get().setCachedData(cacheKey, mappedFiles);

      set({ files: mappedFiles, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch recent files';
      if (!cachedData) {
        set({ error: errorMessage, isLoading: false });
      } else {
        set({ isLoading: false });
      }
      throw error;
    }
  },

  fetchSharedFiles: async () => {
    const cacheKey = get().getCacheKey('shared');
    const cachedData = get().getCachedData(cacheKey);

    // If we have cached data, use it immediately
    if (cachedData) {
      set({ files: cachedData, isLoading: false });
    } else {
      set({ isLoading: true, error: null });
    }

    // Always fetch from API
    try {
      const response = await fileService.getSharedFiles();
      const mappedFiles = response.files.map((file: BackendFile) => mapFile(file));

      // Update cache
      get().setCachedData(cacheKey, mappedFiles);

      set({ files: mappedFiles, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch shared files';
      if (!cachedData) {
        set({ error: errorMessage, isLoading: false });
      } else {
        set({ isLoading: false });
      }
      throw error;
    }
  },

  // Batch operations
  batchMoveFiles: async (fileIds, newParentId) => {
    set({ error: null });
    try {
      await fileService.batchMove(fileIds, newParentId);

      // Remove moved files from state (they're no longer in current folder)
      set((state) => ({
        files: state.files.filter((file) => !fileIds.includes(file.id)),
        selectedFiles: state.selectedFiles.filter((id) => !fileIds.includes(id)),
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to move files';
      set({ error: errorMessage });
      throw error;
    }
  },

  batchDeleteFiles: async (fileIds) => {
    set({ error: null });
    try {
      await fileService.batchDelete(fileIds);

      // Mark files as trashed in state
      set((state) => ({
        files: state.files.map((file) =>
          fileIds.includes(file.id) ? { ...file, isTrashed: true } as DriveItem : file
        ),
        selectedFiles: state.selectedFiles.filter((id) => !fileIds.includes(id)),
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to delete files';
      set({ error: errorMessage });
      throw error;
    }
  },

  batchRestoreFiles: async (fileIds) => {
    set({ error: null });
    try {
      await fileService.batchRestore(fileIds);

      // Mark files as not trashed in state
      set((state) => ({
        files: state.files.map((file) =>
          fileIds.includes(file.id) ? { ...file, isTrashed: false } as DriveItem : file
        ),
        selectedFiles: state.selectedFiles.filter((id) => !fileIds.includes(id)),
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to restore files';
      set({ error: errorMessage });
      throw error;
    }
  },

  batchStarFiles: async (fileIds, isStarred) => {
    set({ error: null });
    try {
      await fileService.batchStar(fileIds, isStarred);

      // Update star status in state
      set((state) => ({
        files: state.files.map((file) =>
          fileIds.includes(file.id) ? { ...file, isStarred } as DriveItem : file
        ),
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to star files';
      set({ error: errorMessage });
      throw error;
    }
  },

  batchPermanentDeleteFiles: async (fileIds) => {
    set({ error: null });
    try {
      await fileService.batchPermanentDelete(fileIds);

      // Remove files from state
      set((state) => ({
        files: state.files.filter((file) => !fileIds.includes(file.id)),
        selectedFiles: state.selectedFiles.filter((id) => !fileIds.includes(id)),
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to permanently delete files';
      set({ error: errorMessage });
      throw error;
    }
  },

  // State Actions
  setFiles: (files) => set({ files }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

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
