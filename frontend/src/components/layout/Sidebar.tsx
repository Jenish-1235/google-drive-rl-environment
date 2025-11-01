import { useState, useRef, useEffect } from "react";
import {
  Drawer,
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  LinearProgress,
  Typography,
  Divider,
  alpha,
} from "@mui/material";
import {
  Add as AddIcon,
  Home as HomeIcon,
  Folder as FolderIcon,
  UploadFile as UploadFileIcon,
  DriveFolderUpload as FolderUploadIcon,
  PeopleAlt as PeopleIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  Delete as DeleteIcon,
  CloudQueue as CloudIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useUIStore } from "../../store/uiStore";
import { useUploadStore } from "../../store/uploadStore";
import { colors } from "../../theme/theme";
import {
  formatFileSize,
  formatStoragePercentage,
} from "../../utils/formatters";
import { mockStorageQuota } from "../../utils/mockData";

const SIDEBAR_WIDTH = 256;
const SIDEBAR_COLLAPSED_WIDTH = 72;

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  {
    id: "home",
    label: "Home",
    icon: <HomeIcon />,
    path: "/home",
  },
  {
    id: "my-drive",
    label: "My Drive",
    icon: <FolderIcon />,
    path: "/drive",
  },
  {
    id: "shared",
    label: "Shared with me",
    icon: <PeopleIcon />,
    path: "/shared",
  },
  {
    id: "recent",
    label: "Recent",
    icon: <ScheduleIcon />,
    path: "/recent",
  },
  {
    id: "starred",
    label: "Starred",
    icon: <StarIcon />,
    path: "/starred",
  },
  {
    id: "trash",
    label: "Trash",
    icon: <DeleteIcon />,
    path: "/trash",
  },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);
  const addUpload = useUploadStore((state) => state.addUpload);
  const updateUpload = useUploadStore((state) => state.updateUpload);
  const showSnackbar = useUIStore((state) => state.showSnackbar);

  // Ensure sidebar is always open on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 900) {
        // md breakpoint
        setSidebarOpen(true);
      }
    };

    handleResize(); // Call once on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);

  const [newMenuAnchor, setNewMenuAnchor] = useState<null | HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleNewMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNewMenuAnchor(event.currentTarget);
  };

  const handleNewMenuClose = () => {
    setNewMenuAnchor(null);
  };

  const handleNewFolder = () => {
    handleNewMenuClose();
    // TODO: Open new folder modal
    showSnackbar("New folder feature coming soon", "info");
  };

  const handleFileUpload = () => {
    handleNewMenuClose();
    fileInputRef.current?.click();
  };

  const handleFolderUpload = () => {
    handleNewMenuClose();
    folderInputRef.current?.click();
  };

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const maxSize = 5 * 1024 * 1024 * 1024; // 5GB

    fileArray.forEach((file) => {
      if (file.size > maxSize) {
        showSnackbar(`${file.name} is too large (max 5GB)`, "error");
        return;
      }

      const uploadId = `upload-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      addUpload({
        id: uploadId,
        file,
        fileName: file.name,
        fileSize: file.size,
        progress: 0,
        status: "pending",
        parentId: null,
      });

      // Simulate upload
      simulateUpload(uploadId, file);
    });

    showSnackbar(
      `Uploading ${fileArray.length} file${fileArray.length > 1 ? "s" : ""}`,
      "info"
    );
  };

  const simulateUpload = (uploadId: string, file: File) => {
    updateUpload(uploadId, { status: "uploading" });

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;

      if (progress >= 100) {
        clearInterval(interval);
        updateUpload(uploadId, { progress: 100, status: "completed" });
        showSnackbar(`${file.name} uploaded successfully`, "success");
      } else {
        updateUpload(uploadId, { progress: Math.min(progress, 99) });
      }
    }, 300);
  };

  const isActive = (path: string) => {
    if (path === "/drive") {
      return (
        location.pathname === "/drive" ||
        location.pathname.startsWith("/folder")
      );
    }
    return location.pathname === path;
  };

  const storagePercentage = formatStoragePercentage(
    mockStorageQuota.usage,
    mockStorageQuota.limit
  );

  return (
    <>
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={(e) => handleFilesSelected(e.target.files)}
      />
      <input
        ref={folderInputRef}
        type="file"
        multiple
        // @ts-expect-error - webkitdirectory is not in the TS definitions
        webkitdirectory=""
        directory=""
        style={{ display: "none" }}
        onChange={(e) => handleFilesSelected(e.target.files)}
      />

      <Drawer
        variant="permanent"
        sx={{
          width: sidebarOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
          flexShrink: 0,
          display: { xs: sidebarOpen ? "block" : "none", md: "block" }, // Always show on desktop
          "& .MuiDrawer-paper": {
            width: sidebarOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
            boxSizing: "border-box",
            border: "none",
            borderRight: `1px solid ${colors.border}`,
            transition: "width 0.2s",
            overflowX: "hidden",
            position: "relative", // Changed from absolute positioning
            height: "100%",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            py: 2,
          }}
        >
          {/* New Button */}
          <Box sx={{ px: 2, mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNewMenuOpen}
              sx={{
                width: sidebarOpen ? 120 : 56,
                height: 56,
                borderRadius: 28,
                textTransform: "none",
                fontSize: 14,
                fontWeight: 500,
                boxShadow:
                  "0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)",
                "&:hover": {
                  boxShadow:
                    "0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)",
                },
                minWidth: 56,
                px: sidebarOpen ? 3 : 0,
                justifyContent: sidebarOpen ? "flex-start" : "center",
              }}
            >
              {sidebarOpen && "New"}
            </Button>

            <Menu
              anchorEl={newMenuAnchor}
              open={Boolean(newMenuAnchor)}
              onClose={handleNewMenuClose}
              transformOrigin={{ horizontal: "left", vertical: "top" }}
              anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
              PaperProps={{
                sx: { mt: 1, minWidth: 200 },
              }}
            >
              <MenuItem onClick={handleNewFolder}>
                <ListItemIcon>
                  <FolderIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>New folder</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleFileUpload}>
                <ListItemIcon>
                  <UploadFileIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>File upload</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleFolderUpload}>
                <ListItemIcon>
                  <FolderUploadIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Folder upload</ListItemText>
              </MenuItem>
            </Menu>
          </Box>

          {/* Navigation Items */}
          <List sx={{ flexGrow: 1, px: 1 }}>
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    selected={active}
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: active ? "0 24px 24px 0" : 4,
                      height: active ? 48 : 40,
                      px: sidebarOpen ? 2 : 1,
                      justifyContent: sidebarOpen ? "flex-start" : "center",
                      backgroundColor: active ? colors.selected : "transparent",
                      "&:hover": {
                        backgroundColor: active
                          ? alpha(colors.primary, 0.16)
                          : colors.hover,
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: sidebarOpen ? 40 : "auto",
                        color: active ? colors.primary : "text.secondary",
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {sidebarOpen && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: 14,
                          fontWeight: active ? 700 : 400,
                          color: active ? colors.primary : "text.primary",
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          {/* Storage Indicator */}
          {sidebarOpen && (
            <Box sx={{ px: 3, pb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1,
                  cursor: "pointer",
                  "&:hover": {
                    "& .storage-icon": {
                      color: colors.primary,
                    },
                  },
                }}
                onClick={() => navigate("/storage")}
              >
                <CloudIcon
                  className="storage-icon"
                  sx={{
                    fontSize: 20,
                    color: "text.secondary",
                    transition: "color 0.2s",
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  Storage
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={storagePercentage}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: colors.surfaceVariant,
                  "& .MuiLinearProgress-bar": {
                    backgroundColor:
                      storagePercentage > 90
                        ? colors.error
                        : storagePercentage > 75
                        ? colors.warning
                        : colors.primary,
                  },
                  mb: 1,
                }}
              />

              <Typography variant="caption" color="text.secondary">
                {formatFileSize(mockStorageQuota.usage)} of{" "}
                {formatFileSize(mockStorageQuota.limit)} used
              </Typography>

              <Button
                variant="outlined"
                fullWidth
                size="small"
                sx={{
                  mt: 1.5,
                  textTransform: "none",
                  borderColor: colors.border,
                  color: "text.primary",
                  "&:hover": {
                    borderColor: colors.border,
                    backgroundColor: colors.hover,
                  },
                }}
              >
                Get more storage
              </Button>
            </Box>
          )}

          {/* Collapsed Storage Icon */}
          {!sidebarOpen && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                pb: 2,
              }}
            >
              <CloudIcon
                sx={{
                  fontSize: 24,
                  color: "text.secondary",
                  cursor: "pointer",
                  "&:hover": {
                    color: colors.primary,
                  },
                }}
                onClick={() => navigate("/storage")}
              />
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
};
