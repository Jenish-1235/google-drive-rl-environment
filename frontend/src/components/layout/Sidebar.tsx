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
  Computer as ComputerIcon,
  Devices as DevicesIcon,
  Report as SpamIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useUIStore } from "../../store/uiStore";
import { useUploadStore } from "../../store/uploadStore";
import { useFileStore } from "../../store/fileStore";
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

const topNavItems: NavItem[] = [
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
    id: "shared-drives",
    label: "Shared drives",
    icon: <DevicesIcon />,
    path: "/shared-drives",
  },
  {
    id: "computers",
    label: "Computers",
    icon: <ComputerIcon />,
    path: "/computers",
  },
];

const bottomNavItems: NavItem[] = [
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
];

const utilityNavItems: NavItem[] = [
  {
    id: "spam",
    label: "Spam",
    icon: <SpamIcon />,
    path: "/spam",
  },
  {
    id: "trash",
    label: "Trash",
    icon: <DeleteIcon />,
    path: "/trash",
  },
  {
    id: "storage",
    label: "Storage",
    icon: <CloudIcon />,
    path: "/storage",
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
  const openModal = useUIStore((state) => state.openModal);
  const currentFolderId = useFileStore((state) => state.currentFolderId);
  const uploadFile = useFileStore((state) => state.uploadFile);

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
    openModal("createFolder");
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
        parentId: currentFolderId || null,
      });

      // Start real upload
      handleRealUpload(uploadId, file, currentFolderId || null);
    });

    showSnackbar(
      `Uploading ${fileArray.length} file${fileArray.length > 1 ? "s" : ""}`,
      "info"
    );
  };

  const handleRealUpload = async (uploadId: string, file: File, parentId: string | null) => {
    try {
      updateUpload(uploadId, { status: "uploading" });

      await uploadFile(file, parentId, (progress) => {
        updateUpload(uploadId, { progress });
      });

      updateUpload(uploadId, { progress: 100, status: "completed" });
      showSnackbar(`${file.name} uploaded successfully`, "success");
    } catch (error: any) {
      updateUpload(uploadId, { status: "error", error: error.message || "Upload failed" });
      showSnackbar(`Failed to upload ${file.name}`, "error");
    }
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
          <Box sx={{ px: 2, mb: 1 }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleNewMenuOpen}
              sx={{
                height: 48,
                borderRadius: "8px",
                textTransform: "none",
                fontSize: 14,
                fontWeight: 500,
                backgroundColor: "white",
                border: "none",
                color: "#202124",
                boxShadow:
                  "0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)",
                "&:hover": {
                  backgroundColor: "#fafafa",
                  border: "none",
                  boxShadow:
                    "0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)",
                },
                justifyContent: "flex-start",
                px: 2.5,
                minWidth: "auto",
              }}
            >
              New
            </Button>

            <Menu
              anchorEl={newMenuAnchor}
              open={Boolean(newMenuAnchor)}
              onClose={handleNewMenuClose}
              transformOrigin={{ horizontal: "left", vertical: "top" }}
              anchorOrigin={{ horizontal: "left", vertical: "top" }}
              PaperProps={{
                sx: {
                  mt: -0.5,
                  minWidth: 260,
                  borderRadius: 2,
                  boxShadow:
                    "0 2px 10px rgba(0,0,0,0.2), 0 0 1px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                },
              }}
            >
              {/* Folder & Upload Section */}
              <MenuItem onClick={handleNewFolder}>
                <ListItemIcon>
                  <FolderIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="New folder" />
              </MenuItem>

              <Divider />

              <MenuItem onClick={handleFileUpload}>
                <ListItemIcon>
                  <UploadFileIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="File upload" />
              </MenuItem>

              <MenuItem onClick={handleFolderUpload}>
                <ListItemIcon>
                  <FolderUploadIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Folder upload" />
              </MenuItem>

              <Divider sx={{ my: 0.5 }} />

              {/* Google File Types Section */}
              <MenuItem>
                <ListItemIcon>
                  <img
                    src="https://www.gstatic.com/images/branding/product/1x/docs_2020q4_48dp.png"
                    alt=""
                    width={20}
                    height={20}
                  />
                </ListItemIcon>
                <ListItemText primary="Google Docs" />
                <Typography variant="body2" color="text.secondary">
                  ▶
                </Typography>
              </MenuItem>

              <MenuItem>
                <ListItemIcon>
                  <img
                    src="https://www.gstatic.com/images/branding/product/1x/sheets_2020q4_48dp.png"
                    alt=""
                    width={20}
                    height={20}
                  />
                </ListItemIcon>
                <ListItemText primary="Google Sheets" />
                <Typography variant="body2" color="text.secondary">
                  ▶
                </Typography>
              </MenuItem>

              <MenuItem>
                <ListItemIcon>
                  <img
                    src="https://www.gstatic.com/images/branding/product/1x/slides_2020q4_48dp.png"
                    alt=""
                    width={20}
                    height={20}
                  />
                </ListItemIcon>
                <ListItemText primary="Google Slides" />
                <Typography variant="body2" color="text.secondary">
                  ▶
                </Typography>
              </MenuItem>

              <MenuItem>
                <ListItemIcon>
                  <img
                    src="https://www.gstatic.com/images/branding/product/2x/vids_48dp.png"
                    alt=""
                    width={20}
                    height={20}
                  />
                </ListItemIcon>
                <ListItemText primary="Google Vids" />
                <Typography variant="body2" color="text.secondary">
                  ▶
                </Typography>
              </MenuItem>

              <MenuItem>
                <ListItemIcon>
                  <img
                    src="https://www.gstatic.com/images/branding/product/1x/forms_2020q4_48dp.png"
                    alt=""
                    width={20}
                    height={20}
                  />
                </ListItemIcon>
                <ListItemText primary="Google Forms" />
                <Typography variant="body2" color="text.secondary">
                  ▶
                </Typography>
              </MenuItem>

              <MenuItem>
                <ListItemText primary="More" />
              </MenuItem>
            </Menu>
          </Box>

          {/* Top Navigation Items */}
          <List sx={{ px: 0.75, py: 0 }}>
            {topNavItems.map((item) => {
              const active = isActive(item.path);
              return (
                <ListItem key={item.id} disablePadding sx={{ mb: 0 }}>
                  <ListItemButton
                    selected={active}
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: active ? "0 24px 24px 0" : 0,
                      height: 36,
                      px: 3,
                      py: 0,
                      justifyContent: sidebarOpen ? "flex-start" : "center",
                      backgroundColor: active ? "#c2e7ff" : "transparent",
                      "&:hover": {
                        backgroundColor: active ? "#c2e7ff" : "#f1f3f4",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 32,
                        color: active ? "#041e49" : "#202124",
                        justifyContent: "flex-start",
                        "& .MuiSvgIcon-root": {
                          fontSize: 20,
                        },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {sidebarOpen && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: 14,
                          fontWeight: 400,
                          color: active ? "#041e49" : "#202124",
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          <Divider sx={{ my: 0.25, borderColor: "#e8eaed" }} />

          {/* Bottom Navigation Items */}
          <List sx={{ px: 0.75, py: 0 }}>
            {bottomNavItems.map((item) => {
              const active = isActive(item.path);
              return (
                <ListItem key={item.id} disablePadding sx={{ mb: 0 }}>
                  <ListItemButton
                    selected={active}
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: active ? "0 24px 24px 0" : 0,
                      height: 36,
                      px: 3,
                      py: 0,
                      justifyContent: sidebarOpen ? "flex-start" : "center",
                      backgroundColor: active ? "#c2e7ff" : "transparent",
                      "&:hover": {
                        backgroundColor: active ? "#c2e7ff" : "#f1f3f4",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 32,
                        color: active ? "#041e49" : "#202124",
                        justifyContent: "flex-start",
                        "& .MuiSvgIcon-root": {
                          fontSize: 20,
                        },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {sidebarOpen && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: 14,
                          fontWeight: 400,
                          color: active ? "#041e49" : "#202124",
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          <Divider sx={{ my: 0.25, borderColor: "#e8eaed" }} />

          {/* Utility Navigation Items */}
          <List sx={{ px: 0.75, py: 0 }}>
            {utilityNavItems.map((item) => {
              const active = isActive(item.path);
              return (
                <ListItem key={item.id} disablePadding sx={{ mb: 0 }}>
                  <ListItemButton
                    selected={active}
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: active ? "0 24px 24px 0" : 0,
                      height: 36,
                      px: 3,
                      py: 0,
                      justifyContent: sidebarOpen ? "flex-start" : "center",
                      backgroundColor: active ? "#c2e7ff" : "transparent",
                      "&:hover": {
                        backgroundColor: active ? "#c2e7ff" : "#f1f3f4",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 32,
                        color: active ? "#041e49" : "#202124",
                        justifyContent: "flex-start",
                        "& .MuiSvgIcon-root": {
                          fontSize: 20,
                        },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {sidebarOpen && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: 14,
                          fontWeight: 400,
                          color: active ? "#041e49" : "#202124",
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          {/* Storage Section */}
          {sidebarOpen && (
            <Box sx={{ px: 3, py: 1.5 }}>
              <LinearProgress
                variant="determinate"
                value={storagePercentage}
                sx={{
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: "#e8eaed",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor:
                      storagePercentage > 90
                        ? "#ea4335"
                        : storagePercentage > 75
                        ? "#fbbc04"
                        : "#1a73e8",
                    borderRadius: 2,
                  },
                  mb: 1,
                }}
              />

              <Typography fontSize={13} color="#5f6368" sx={{ mb: 1 }}>
                {formatFileSize(mockStorageQuota.usage)} of{" "}
                {formatFileSize(mockStorageQuota.limit)} used
              </Typography>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate("/storage")}
                sx={{
                  textTransform: "none",
                  borderColor: "#dadce0",
                  color: "#1a73e8",
                  fontSize: 14,
                  fontWeight: 500,
                  height: 36,
                  borderRadius: "18px",
                  "&:hover": {
                    borderColor: "#dadce0",
                    backgroundColor: "#f8f9fa",
                  },
                }}
              >
                Get more storage
              </Button>
            </Box>
          )}

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />
        </Box>
      </Drawer>
    </>
  );
};
