import { create } from "zustand";

interface Modal {
  type:
    | "share"
    | "details"
    | "move"
    | "rename"
    | "delete"
    | "upload"
    | "createFolder"
    | null;
  data?: any;
}

interface ContextMenu {
  isOpen: boolean;
  x: number;
  y: number;
  fileId: string | null;
}

interface UIStore {
  sidebarOpen: boolean;
  detailsPanelOpen: boolean;
  modal: Modal;
  contextMenu: ContextMenu;
  snackbar: {
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  };

  // Sidebar
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Details Panel
  toggleDetailsPanel: () => void;
  setDetailsPanelOpen: (open: boolean) => void;

  // Modal
  openModal: (type: Modal["type"], data?: any) => void;
  closeModal: () => void;

  // Context Menu
  openContextMenu: (x: number, y: number, fileId: string) => void;
  closeContextMenu: () => void;

  // Snackbar
  showSnackbar: (
    message: string,
    severity?: "success" | "error" | "warning" | "info"
  ) => void;
  hideSnackbar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  detailsPanelOpen: false,
  modal: { type: null },
  contextMenu: {
    isOpen: false,
    x: 0,
    y: 0,
    fileId: null,
  },
  snackbar: {
    open: false,
    message: "",
    severity: "info",
  },

  // Sidebar
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Details Panel
  toggleDetailsPanel: () => set((state) => ({ detailsPanelOpen: !state.detailsPanelOpen })),
  setDetailsPanelOpen: (open) => set({ detailsPanelOpen: open }),

  // Modal
  openModal: (type, data) => set({ modal: { type, data } }),
  closeModal: () => set({ modal: { type: null } }),

  // Context Menu
  openContextMenu: (x, y, fileId) =>
    set({ contextMenu: { isOpen: true, x, y, fileId } }),
  closeContextMenu: () =>
    set({ contextMenu: { isOpen: false, x: 0, y: 0, fileId: null } }),

  // Snackbar
  showSnackbar: (message, severity = "info") =>
    set({ snackbar: { open: true, message, severity } }),
  hideSnackbar: () =>
    set((state) => ({ snackbar: { ...state.snackbar, open: false } })),
}));
