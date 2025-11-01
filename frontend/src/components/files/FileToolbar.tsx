import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  Button,
  IconButton,
  ButtonGroup,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  ChevronRight as ChevronRightIcon,
  KeyboardArrowDown as ArrowDownIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Info as InfoIcon,
  Folder as FolderIcon,
  CreateNewFolder as CreateNewFolderIcon,
  DriveFileMove as MoveIcon,
} from "@mui/icons-material";
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";
import { useFileStore } from "../../store/fileStore";
import type {
  FileTypeFilter,
  PeopleFilter,
  ModifiedFilter,
} from "../../store/fileStore";
import { useUIStore } from "../../store/uiStore";
import { useEffect, useState } from "react";
import type { DriveItem } from "../../types/file.types";

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

  // Get all folders in current directory for "My Drive" dropdown
  const currentFolderFiles = files.filter((file) => {
    if (!folderId) {
      return !file.parentId || file.parentId === "root";
    }
    return file.parentId === folderId;
  });
  const currentFolders = currentFolderFiles.filter((f) => f.type === "folder");

  useEffect(() => {
    const buildBreadcrumbs = () => {
      const newBreadcrumbs = [{ id: "root", name: "My Drive" }];
      if (folderId) {
        let currentFolder = files.find((f) => f.id === folderId);
        const path = [];
        while (currentFolder) {
          path.unshift({ id: currentFolder.id, name: currentFolder.name });
          currentFolder = files.find((f) => f.id === currentFolder?.parentId);
        }
        newBreadcrumbs.push(...path);
      }
      setBreadcrumbs(newBreadcrumbs);
    };

    buildBreadcrumbs();
  }, [folderId, files, setBreadcrumbs]);

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
                    cursor: isRoot ? "pointer" : "default",
                  }}
                  onClick={
                    isRoot
                      ? (e) => setMyDriveMenuAnchor(e.currentTarget)
                      : undefined
                  }
                >
                  {crumb.name}
                </Typography>
                {isRoot && (
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
                  fontSize={14}
                  fontWeight={400}
                  sx={{
                    "&:hover": {
                      color: "#202124",
                    },
                  }}
                >
                  {crumb.name}
                </Link>
                {isRoot && (
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
                    <ArrowDownIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                )}
              </Box>
            );
          })}
        </MuiBreadcrumbs>

        {/* View Toggle and Info Button */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ButtonGroup
            variant="outlined"
            sx={{
              "& .MuiButtonGroup-grouped": {
                borderColor: "#dadce0",
                minWidth: 40,
                "&:hover": {
                  borderColor: "#dadce0",
                  backgroundColor: "#f8f9fa",
                },
              },
            }}
          >
            <IconButton
              size="small"
              onClick={() => setViewMode("list")}
              sx={{
                color: viewMode === "list" ? "#1a73e8" : "#5f6368",
                backgroundColor:
                  viewMode === "list" ? "#e8f0fe" : "transparent",
                borderRadius: "4px 0 0 4px",
                "&:hover": {
                  backgroundColor: viewMode === "list" ? "#e8f0fe" : "#f8f9fa",
                },
              }}
            >
              <ViewListIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setViewMode("grid")}
              sx={{
                color: viewMode === "grid" ? "#1a73e8" : "#5f6368",
                backgroundColor:
                  viewMode === "grid" ? "#e8f0fe" : "transparent",
                borderRadius: "0 4px 4px 0",
                "&:hover": {
                  backgroundColor: viewMode === "grid" ? "#e8f0fe" : "#f8f9fa",
                },
              }}
            >
              <ViewModuleIcon fontSize="small" />
            </IconButton>
          </ButtonGroup>

          <IconButton
            size="small"
            sx={{
              color: "#5f6368",
              border: `1px solid #dadce0`,
              borderRadius: 1,
              "&:hover": {
                backgroundColor: "#f8f9fa",
              },
            }}
          >
            <InfoIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Bottom Row: Filter Buttons */}
      <Box sx={{ display: "flex", gap: 1.5 }}>
        <FilterButton
          label={typeFilter === "all" ? "Type" : `Type: ${typeFilter}`}
          onClick={(e) => setTypeMenuAnchor(e.currentTarget)}
          isActive={typeFilter !== "all"}
        />
        <FilterButton
          label={
            peopleFilter === "all"
              ? "People"
              : `People: ${
                  peopleFilter === "owned-by-me"
                    ? "Owned by me"
                    : "Not owned by me"
                }`
          }
          onClick={(e) => setPeopleMenuAnchor(e.currentTarget)}
          isActive={peopleFilter !== "all"}
        />
        <FilterButton
          label={
            modifiedFilter === "all"
              ? "Modified"
              : `Modified: ${modifiedFilter.replace(/-/g, " ")}`
          }
          onClick={(e) => setModifiedMenuAnchor(e.currentTarget)}
          isActive={modifiedFilter !== "all"}
        />
      </Box>

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
