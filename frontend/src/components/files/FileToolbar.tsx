import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Skeleton,
} from "@mui/material";
import {
  ChevronRight as ChevronRightIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Folder as FolderIcon,
  CreateNewFolder as CreateNewFolderIcon,
  DriveFileMove as MoveIcon,
} from "@mui/icons-material";
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";
import { useFileStore } from "../../store/fileStore";
import { useUIStore } from "../../store/uiStore";
import { useEffect, useState } from "react";
import type { DriveItem } from "../../types/file.types";
import { SelectionToolbar } from "./SelectionToolbar";
import { DetailsPanel } from "../layout/DetailsPanel";
import { fileService } from "../../services/fileService";

interface FilterButtonProps {
  label: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  isActive?: boolean;
}

const FilterButton = ({ label, onClick, isActive }: FilterButtonProps) => (
  <Button
    variant="outlined"
    endIcon={<ArrowDownIcon sx={{ fontSize: 18 }} />}
    onClick={onClick}
    sx={{
      textTransform: "none",
      color: isActive ? "#1a73e8" : "#202124",
      borderColor: isActive ? "#1a73e8" : "#dadce0",
      backgroundColor: isActive ? "#e8f0fe" : "transparent",
      borderRadius: 1,
      px: 2,
      py: 0.5,
      fontSize: 14,
      fontWeight: 500,
      minHeight: 36,
      "&:hover": {
        borderColor: isActive ? "#1a73e8" : "#dadce0",
        backgroundColor: isActive ? "#e8f0fe" : "#f8f9fa",
      },
    }}
  >
    {label}
  </Button>
);

export const FileToolbar = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const files = useFileStore((state) => state.files);
  const breadcrumbs = useFileStore((state) => state.breadcrumbs);
  const setBreadcrumbs = useFileStore((state) => state.setBreadcrumbs);
  const viewMode = useFileStore((state) => state.viewMode);
  const setViewMode = useFileStore((state) => state.setViewMode);
  const selectedFiles = useFileStore((state) => state.selectedFiles);
  const clearSelection = useFileStore((state) => state.clearSelection);

  // Filters
  const typeFilter = useFileStore((state) => state.typeFilter);
  const setTypeFilter = useFileStore((state) => state.setTypeFilter);
  const peopleFilter = useFileStore((state) => state.peopleFilter);
  const setPeopleFilter = useFileStore((state) => state.setPeopleFilter);
  const modifiedFilter = useFileStore((state) => state.modifiedFilter);
  const setModifiedFilter = useFileStore((state) => state.setModifiedFilter);

  const [typeMenuAnchor, setTypeMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [peopleMenuAnchor, setPeopleMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [modifiedMenuAnchor, setModifiedMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [myDriveMenuAnchor, setMyDriveMenuAnchor] =
    useState<null | HTMLElement>(null);
  
  const detailsPanelOpen = useUIStore((state) => state.detailsPanelOpen);
  const toggleDetailsPanel = useUIStore((state) => state.toggleDetailsPanel);

  // Get all folders in current directory for "My Drive" dropdown
  const currentFolderFiles = files.filter((file) => {
    if (!folderId) {
      return !file.parentId || file.parentId === "root";
    }
    return file.parentId === folderId;
  });
  const currentFolders = currentFolderFiles.filter((f) => f.type === "folder");

  const [loadingBreadcrumbs, setLoadingBreadcrumbs] = useState(false);

  useEffect(() => {
    const buildBreadcrumbs = async () => {
      // Root folder - just show "My Drive"
      if (!folderId) {
        setBreadcrumbs([{ id: "root", name: "My Drive" }]);
        return;
      }

      // Try to get folder name from loaded files first for immediate feedback
      const currentFolder = files.find((f) => f.id === folderId);
      if (currentFolder) {
        // Show immediate breadcrumb with just current folder name
        setBreadcrumbs([
          { id: "root", name: "My Drive" },
          { id: currentFolder.id, name: currentFolder.name },
        ]);
      }

      // Fetch complete folder path from backend API
      try {
        setLoadingBreadcrumbs(true);
        const response = await fileService.getFolderPath(folderId);
        const pathBreadcrumbs = response.path.map((folder: any) => ({
          id: folder.id,
          name: folder.name,
        }));

        // Prepend "My Drive" to the path
        setBreadcrumbs([{ id: "root", name: "My Drive" }, ...pathBreadcrumbs]);
      } catch (error: any) {
        console.error("Failed to fetch folder path:", error);

        // If we already have current folder name from loaded files, keep it
        if (!currentFolder) {
          // Fallback
          setBreadcrumbs([
            { id: "root", name: "My Drive" },
            { id: folderId, name: "..." },
          ]);
        }
      } finally {
        setLoadingBreadcrumbs(false);
      }
    };

    buildBreadcrumbs();
  }, [folderId, setBreadcrumbs, files]);

  return (
    <Box sx={{ mb: 2.5 }}>
      {/* Top Row: Breadcrumbs + View Controls */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        {/* Breadcrumbs */}
        <MuiBreadcrumbs
          separator={
            <ChevronRightIcon sx={{ fontSize: 20, color: "#5f6368" }} />
          }
          sx={{
            "& .MuiBreadcrumbs-separator": {
              mx: 0.5,
            },
          }}
        >
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const to = crumb.id === "root" ? "/drive" : `/folder/${crumb.id}`;
            const isRoot = crumb.id === "root";
            const isAtRoot = !folderId; // Only show dropdown when at root

            return isLast ? (
              <Box
                key={crumb.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Typography
                  color="#202124"
                  fontSize={22}
                  fontWeight={500}
                  sx={{
                    cursor: isRoot && isAtRoot ? "pointer" : "default",
                  }}
                  onClick={
                    isRoot && isAtRoot
                      ? (e) => setMyDriveMenuAnchor(e.currentTarget)
                      : undefined
                  }
                >
                  {crumb.name}
                </Typography>
                {isRoot && isAtRoot && (
                  <IconButton
                    size="small"
                    onClick={(e) => setMyDriveMenuAnchor(e.currentTarget)}
                    sx={{
                      color: "#5f6368",
                      padding: 0.5,
                      "&:hover": {
                        backgroundColor: "#f8f9fa",
                      },
                    }}
                  >
                    <ArrowDownIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                )}
              </Box>
            ) : (
              <Box
                key={crumb.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Link
                  component={RouterLink}
                  to={to}
                  underline="hover"
                  color="#5f6368"
                  fontSize={22}
                  fontWeight={500}
                  sx={{
                    "&:hover": {
                      color: "#202124",
                    },
                  }}
                >
                  {crumb.name}
                </Link>
              </Box>
            );
          })}
        </MuiBreadcrumbs>

        {/* View Toggle and Info Button */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              display: "flex",
              backgroundColor: "#ffffff",
              borderRadius: "50px",
              padding: "3px",
              gap: "2px",
              position: "relative",
              border: "1.5px solid #5f6368",
              boxShadow: "0 1px 3px rgba(60, 64, 67, 0.3)",
              height: "36px",
            }}
          >
            <IconButton
              size="small"
              onClick={() => setViewMode("list")}
              disableRipple
              sx={{
                color: viewMode === "list" ? "#202124" : "#5f6368",
                backgroundColor:
                  viewMode === "list" ? "#d3e3fd" : "transparent",
                borderRadius: "18px",
                position: "relative",
                minWidth: "48px",
                height: "28px",
                px: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                border: "none",
                outline: "none",
                "&:hover": {
                  backgroundColor:
                    viewMode === "list" ? "#d3e3fd" : "rgba(0, 0, 0, 0.04)",
                },
                "&:focus": {
                  outline: "none",
                },
                "&:active": {
                  outline: "none",
                },
              }}
            >
              {viewMode === "list" && (
                <svg
                  viewBox="0 0 18 18"
                  aria-hidden="true"
                  width="12"
                  height="12"
                  style={{
                    flexShrink: 0,
                  }}
                >
                  <path
                    fill="none"
                    stroke="#5f6368"
                    strokeWidth="2.5"
                    d="M3 9.23529L6.84 13L15 5"
                  />
                </svg>
              )}
              <svg
                width="14"
                height="12"
                viewBox="0 0 14 12"
                fill="currentColor"
                style={{
                  flexShrink: 0,
                }}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1 0C0.447715 0 0 0.447715 0 1C0 1.55228 0.447715 2 1 2H13C13.5523 2 14 1.55228 14 1C14 0.447715 13.5523 0 13 0H1ZM0 6C0 5.44772 0.447715 5 1 5H13C13.5523 5 14 5.44772 14 6C14 6.55228 13.5523 7 13 7H1C0.447715 7 0 6.55228 0 6ZM1 10C0.447715 10 0 10.4477 0 11C0 11.5523 0.447715 12 1 12H13C13.5523 12 14 11.5523 14 11C14 10.4477 13.5523 10 13 10H1Z"
                  fill="currentColor"
                />
              </svg>
            </IconButton>
            {/* Separator Line */}
            <Box
              sx={{
                width: "1px",
                height: "24px",
                backgroundColor: "#dadce0",
                alignSelf: "center",
              }}
            />
            <IconButton
              size="small"
              onClick={() => setViewMode("grid")}
              disableRipple
              sx={{
                color: viewMode === "grid" ? "#202124" : "#5f6368",
                backgroundColor:
                  viewMode === "grid" ? "#d3e3fd" : "transparent",
                borderRadius: "18px",
                position: "relative",
                minWidth: "48px",
                height: "28px",
                px: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                border: "none",
                outline: "none",
                "&:hover": {
                  backgroundColor:
                    viewMode === "grid" ? "#d3e3fd" : "rgba(0, 0, 0, 0.04)",
                },
                "&:focus": {
                  outline: "none",
                },
                "&:active": {
                  outline: "none",
                },
              }}
            >
              {viewMode === "grid" && (
                <svg
                  viewBox="0 0 18 18"
                  aria-hidden="true"
                  width="12"
                  height="12"
                  style={{
                    flexShrink: 0,
                  }}
                >
                  <path
                    fill="none"
                    stroke="#5f6368"
                    strokeWidth="2.5"
                    d="M3 9.23529L6.84 13L15 5"
                  />
                </svg>
              )}
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  flexShrink: 0,
                }}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 1C0 0.447715 0.447715 0 1 0H5C5.55228 0 6 0.447715 6 1V5C6 5.55228 5.55228 6 5 6H1C0.447715 6 0 5.55228 0 5V1ZM2 2H4V4H2V2ZM0 9C0 8.44772 0.447715 8 1 8H5C5.55228 8 6 8.44772 6 9V13C6 13.5523 5.55228 14 5 14H1C0.447715 14 0 13.5523 0 13V9ZM2 10H4V12H2V10ZM9 0C8.44772 0 8 0.447715 8 1V5C8 5.55228 8.44772 6 9 6H13C13.5523 6 14 5.55228 14 5V1C14 0.447715 13.5523 0 13 0H9ZM12 2H10V4H12V2ZM8 9C8 8.44772 8.44772 8 9 8H13C13.5523 8 14 8.44772 14 9V13C14 13.5523 13.5523 14 13 14H9C8.44772 14 8 13.5523 8 13V9ZM10 10H12V12H10V10Z"
                  fill="currentColor"
                />
              </svg>
            </IconButton>
          </Box>

          <IconButton
            size="small"
            disableRipple
            onClick={toggleDetailsPanel}
            sx={{
              color: "#5f6368",
              padding: 0.5,
              "&:hover": {
                backgroundColor: "rgba(95, 99, 104, 0.1)",
              },
              "&:focus": {
                outline: "none",
              },
            }}
          >
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M0 0h24v24H0z" fill="none"></path>
              <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"></path>
            </svg>
          </IconButton>
        </Box>
      </Box>

      {/* Bottom Row: Filter Buttons or Selection Toolbar */}
      {selectedFiles.length > 0 ? (
        <SelectionToolbar onClose={clearSelection} />
      ) : (
        <Box sx={{ display: "flex", gap: 1 }}>
          <FilterButton
            label="Type"
            onClick={(e) => setTypeMenuAnchor(e.currentTarget)}
            isActive={typeFilter !== "all"}
          />
          <FilterButton
            label="People"
            onClick={(e) => setPeopleMenuAnchor(e.currentTarget)}
            isActive={peopleFilter !== "all"}
          />
          <FilterButton
            label="Modified"
            onClick={(e) => setModifiedMenuAnchor(e.currentTarget)}
            isActive={modifiedFilter !== "all"}
          />
          <FilterButton label="Source" onClick={() => {}} isActive={false} />
        </Box>
      )}

      {/* Filter Menus */}
      <Menu
        anchorEl={typeMenuAnchor}
        open={Boolean(typeMenuAnchor)}
        onClose={() => setTypeMenuAnchor(null)}
      >
        <MenuItem
          selected={typeFilter === "all"}
          onClick={() => {
            setTypeFilter("all");
            setTypeMenuAnchor(null);
          }}
        >
          All
        </MenuItem>
        <MenuItem
          selected={typeFilter === "folders"}
          onClick={() => {
            setTypeFilter("folders");
            setTypeMenuAnchor(null);
          }}
        >
          Folders
        </MenuItem>
        <MenuItem
          selected={typeFilter === "documents"}
          onClick={() => {
            setTypeFilter("documents");
            setTypeMenuAnchor(null);
          }}
        >
          Documents
        </MenuItem>
        <MenuItem
          selected={typeFilter === "spreadsheets"}
          onClick={() => {
            setTypeFilter("spreadsheets");
            setTypeMenuAnchor(null);
          }}
        >
          Spreadsheets
        </MenuItem>
        <MenuItem
          selected={typeFilter === "presentations"}
          onClick={() => {
            setTypeFilter("presentations");
            setTypeMenuAnchor(null);
          }}
        >
          Presentations
        </MenuItem>
        <MenuItem
          selected={typeFilter === "images"}
          onClick={() => {
            setTypeFilter("images");
            setTypeMenuAnchor(null);
          }}
        >
          Images
        </MenuItem>
        <MenuItem
          selected={typeFilter === "videos"}
          onClick={() => {
            setTypeFilter("videos");
            setTypeMenuAnchor(null);
          }}
        >
          Videos
        </MenuItem>
        <MenuItem
          selected={typeFilter === "pdfs"}
          onClick={() => {
            setTypeFilter("pdfs");
            setTypeMenuAnchor(null);
          }}
        >
          PDFs
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={peopleMenuAnchor}
        open={Boolean(peopleMenuAnchor)}
        onClose={() => setPeopleMenuAnchor(null)}
      >
        <MenuItem
          selected={peopleFilter === "all"}
          onClick={() => {
            setPeopleFilter("all");
            setPeopleMenuAnchor(null);
          }}
        >
          Anyone
        </MenuItem>
        <MenuItem
          selected={peopleFilter === "owned-by-me"}
          onClick={() => {
            setPeopleFilter("owned-by-me");
            setPeopleMenuAnchor(null);
          }}
        >
          Owned by me
        </MenuItem>
        <MenuItem
          selected={peopleFilter === "not-owned-by-me"}
          onClick={() => {
            setPeopleFilter("not-owned-by-me");
            setPeopleMenuAnchor(null);
          }}
        >
          Not owned by me
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={modifiedMenuAnchor}
        open={Boolean(modifiedMenuAnchor)}
        onClose={() => setModifiedMenuAnchor(null)}
      >
        <MenuItem
          selected={modifiedFilter === "all"}
          onClick={() => {
            setModifiedFilter("all");
            setModifiedMenuAnchor(null);
          }}
        >
          Any time
        </MenuItem>
        <MenuItem
          selected={modifiedFilter === "today"}
          onClick={() => {
            setModifiedFilter("today");
            setModifiedMenuAnchor(null);
          }}
        >
          Today
        </MenuItem>
        <MenuItem
          selected={modifiedFilter === "last-7-days"}
          onClick={() => {
            setModifiedFilter("last-7-days");
            setModifiedMenuAnchor(null);
          }}
        >
          Last 7 days
        </MenuItem>
        <MenuItem
          selected={modifiedFilter === "last-30-days"}
          onClick={() => {
            setModifiedFilter("last-30-days");
            setModifiedMenuAnchor(null);
          }}
        >
          Last 30 days
        </MenuItem>
        <MenuItem
          selected={modifiedFilter === "this-year"}
          onClick={() => {
            setModifiedFilter("this-year");
            setModifiedMenuAnchor(null);
          }}
        >
          This year
        </MenuItem>
      </Menu>

      {/* My Drive Dropdown Menu */}
      <MyDriveMenu
        anchorEl={myDriveMenuAnchor}
        open={Boolean(myDriveMenuAnchor)}
        onClose={() => setMyDriveMenuAnchor(null)}
        folders={currentFolders}
      />

      {/* Details Panel */}
      <DetailsPanel 
        open={detailsPanelOpen} 
        onClose={toggleDetailsPanel} 
      />
    </Box>
  );
};

// My Drive Dropdown Menu Component
interface MyDriveMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  folders: DriveItem[];
}

const MyDriveMenu = ({
  anchorEl,
  open,
  onClose,
  folders,
}: MyDriveMenuProps) => {
  const navigate = useNavigate();

  const openModal = useUIStore((state) => state.openModal);
  const showSnackbar = useUIStore((state) => state.showSnackbar);

  const handleFolderClick = (folderId: string) => {
    navigate(`/folder/${folderId}`);
    onClose();
  };

  const handleNewFolder = () => {
    openModal("createFolder");
    onClose();
  };

  const handleMoveToFolder = () => {
    showSnackbar("Move to folder feature coming soon!", "info");
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 320,
          maxHeight: 480,
          mt: 1,
          boxShadow:
            "0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)",
        },
      }}
    >
      <Box sx={{ py: 1 }}>
        {/* Action Items */}
        <MenuItem
          onClick={handleNewFolder}
          sx={{
            py: 1.5,
            px: 2,
            "&:hover": {
              backgroundColor: "#f8f9fa",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <CreateNewFolderIcon sx={{ fontSize: 20, color: "#5f6368" }} />
          </ListItemIcon>
          <ListItemText
            primary="New folder"
            primaryTypographyProps={{
              fontSize: 14,
              color: "#202124",
            }}
          />
        </MenuItem>

        <MenuItem
          onClick={handleMoveToFolder}
          sx={{
            py: 1.5,
            px: 2,
            "&:hover": {
              backgroundColor: "#f8f9fa",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <MoveIcon sx={{ fontSize: 20, color: "#5f6368" }} />
          </ListItemIcon>
          <ListItemText
            primary="Move to folder"
            primaryTypographyProps={{
              fontSize: 14,
              color: "#202124",
            }}
          />
        </MenuItem>

        {folders.length > 0 && (
          <>
            <Divider sx={{ my: 1 }} />

            {/* Folders List */}
            <Box sx={{ maxHeight: 320, overflowY: "auto" }}>
              {folders.map((folder) => (
                <MenuItem
                  key={folder.id}
                  onClick={() => handleFolderClick(folder.id)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    "&:hover": {
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <FolderIcon sx={{ fontSize: 20, color: "#5f6368" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={folder.name}
                    primaryTypographyProps={{
                      fontSize: 14,
                      color: "#202124",
                    }}
                  />
                </MenuItem>
              ))}
            </Box>
          </>
        )}
      </Box>
    </Menu>
  );
};
