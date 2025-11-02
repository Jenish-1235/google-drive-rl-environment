import { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Share as ShareIcon,
  GetApp as DownloadIcon,
  DriveFileMove as MoveIcon,
  Edit as RenameIcon,
  Delete as DeleteIcon,
  InfoOutlined as InfoIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { DriveItem, SortField } from "../../types/file.types";
import { useFileStore } from "../../store/fileStore";
import { getFileIcon } from "../../utils/fileIcons";
import { formatDate, formatFileSize } from "../../utils/formatters";
import { animations, getStaggerDelay } from "../../utils/animations";
import { EmptyState } from "../common/EmptyState";

interface FileListProps {
  files: DriveItem[];
  onSort?: (field: SortField) => void;
  onContextMenu?: (event: React.MouseEvent, file: DriveItem) => void;
  onFileClick?: (file: DriveItem) => void;
}

export const FileList = ({
  files,
  onSort,
  onContextMenu,
  onFileClick,
}: FileListProps) => {
  const navigate = useNavigate();
  const selectedFiles = useFileStore((state) => state.selectedFiles);
  const sortField = useFileStore((state) => state.sortField);
  const sortOrder = useFileStore((state) => state.sortOrder);
  const toggleSortOrder = useFileStore((state) => state.toggleSortOrder);
  const setSortField = useFileStore((state) => state.setSortField);
  const setSelectedFiles = useFileStore((state) => state.setSelectedFiles);

  const [actionMenuAnchor, setActionMenuAnchor] = useState<{
    element: HTMLElement;
    fileId: string;
  } | null>(null);
  const [clickTimeout, setClickTimeout] = useState<number | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      toggleSortOrder();
    } else {
      setSortField(field);
    }
    onSort?.(field);
  };

  const handleSingleClick = (file: DriveItem, event?: React.MouseEvent) => {
    // Single click = select (add to selection, not toggle)
    if (event?.ctrlKey || event?.metaKey) {
      // Ctrl/Cmd+Click toggles selection
      if (selectedFiles.includes(file.id)) {
        setSelectedFiles(selectedFiles.filter((id) => id !== file.id));
      } else {
        setSelectedFiles([...selectedFiles, file.id]);
      }
    } else {
      // Regular click = select only this item
      setSelectedFiles([file.id]);
    }
  };

  const handleDoubleClick = (file: DriveItem) => {
    // Double click = navigate or preview
    if (file.type === "folder") {
      navigate(`/folder/${file.id}`);
    } else if (onFileClick) {
      onFileClick(file);
    }
  };

  const handleFileClick = (file: DriveItem, event: React.MouseEvent) => {
    if (clickTimeout) {
      // Double click detected
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      handleDoubleClick(file);
    } else {
      // Single click - wait to see if double click follows
      const timeout = window.setTimeout(() => {
        handleSingleClick(file, event);
        setClickTimeout(null);
      }, 250);
      setClickTimeout(timeout);
    }
  };

  const handleActionMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    fileId: string
  ) => {
    event.stopPropagation();
    setActionMenuAnchor({ element: event.currentTarget, fileId });
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
  };

  const handleAction = (action: string) => {
    console.log(`Action: ${action} on file:`, actionMenuAnchor?.fileId);
    handleActionMenuClose();
    // TODO: Implement actions
  };

  const isSelected = (fileId: string) => selectedFiles.includes(fileId);

  return (
    <Box sx={{ width: "100%" }}>
      <TableContainer sx={{ width: "100%", backgroundColor: "transparent" }}>
        <Table sx={{ width: "100%", tableLayout: "fixed" }}>
          <TableHead>
            <TableRow
              sx={{
                borderBottom: `1px solid #e8eaed`,
              }}
            >
              <TableCell
                sx={{ width: 52, py: 1, borderBottom: "none", pl: 2.5 }}
              />
              <TableCell
                sx={{
                  width: "45%",
                  py: 1,
                  borderBottom: "none",
                  pl: 0,
                }}
              >
                <TableSortLabel
                  active={sortField === "name"}
                  direction={sortField === "name" ? sortOrder : "asc"}
                  onClick={() => handleSort("name")}
                  sx={{
                    "& .MuiTableSortLabel-root": {
                      fontSize: 12,
                      fontWeight: 500,
                    },
                  }}
                >
                  <Typography fontSize={12} fontWeight={500} color="#5f6368">
                    Name
                  </Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{
                  width: "18%",
                  py: 1,
                  borderBottom: "none",
                }}
              >
                <TableSortLabel
                  active={sortField === "owner"}
                  direction={sortField === "owner" ? sortOrder : "asc"}
                  onClick={() => handleSort("owner")}
                >
                  <Typography fontSize={12} fontWeight={500} color="#5f6368">
                    Owner
                  </Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{
                  width: "18%",
                  py: 1,
                  borderBottom: "none",
                }}
              >
                <TableSortLabel
                  active={sortField === "modifiedTime"}
                  direction={sortField === "modifiedTime" ? sortOrder : "asc"}
                  onClick={() => handleSort("modifiedTime")}
                >
                  <Typography fontSize={12} fontWeight={500} color="#5f6368">
                    Date modified
                  </Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{
                  width: "12%",
                  py: 1,
                  borderBottom: "none",
                }}
              >
                <TableSortLabel
                  active={sortField === "size"}
                  direction={sortField === "size" ? sortOrder : "asc"}
                  onClick={() => handleSort("size")}
                >
                  <Typography fontSize={12} fontWeight={500} color="#5f6368">
                    File size
                  </Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{
                  width: 80,
                  py: 1,
                  borderBottom: "none",
                  textAlign: "right",
                  pr: 2,
                }}
              >
                <Typography fontSize={12} fontWeight={500} color="#5f6368">
                  Sort
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file, index) => (
              <TableRow
                key={file.id}
                hover
                selected={isSelected(file.id)}
                onClick={(e) => handleFileClick(file, e)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  onContextMenu?.(e, file);
                }}
                sx={{
                  cursor: "pointer",
                  borderBottom: `1px solid #dadce0`,
                  "&:hover": {
                    backgroundColor: "#f6f9fc",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#e8f0fe",
                    "&:hover": {
                      backgroundColor: "#e8f0fe",
                    },
                  },
                  ...animations.fadeIn,
                  ...getStaggerDelay(index, 20),
                }}
              >
                <TableCell sx={{ py: 0.5, borderBottom: "none", pl: 2.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {getFileIcon(file.type)}
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 0.5, borderBottom: "none", pl: 0 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography fontSize={14} noWrap color="#202124">
                      {file.name}
                    </Typography>
                    {file.isShared && (
                      <Tooltip title="Shared">
                        <ShareIcon sx={{ fontSize: 16, color: "#5f6368" }} />
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 0.5, borderBottom: "none" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        backgroundColor: "#1a73e8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        color: "white",
                        fontWeight: 500,
                      }}
                    >
                      {file.ownerName?.charAt(0).toUpperCase() || "U"}
                    </Box>
                    <Typography fontSize={14} color="#5f6368" noWrap>
                      me
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 0.5, borderBottom: "none" }}>
                  <Typography fontSize={14} color="#5f6368">
                    {formatDate(file.modifiedTime)}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 0.5, borderBottom: "none" }}>
                  <Typography fontSize={14} color="#5f6368">
                    {file.type === "folder"
                      ? "—"
                      : formatFileSize(file.size || 0)}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    py: 0.5,
                    borderBottom: "none",
                    textAlign: "right",
                    pr: 1,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => handleActionMenuOpen(e, file.id)}
                    sx={{
                      opacity: 0,
                      transition: "opacity 0.2s",
                      ".MuiTableRow-root:hover &": {
                        opacity: 1,
                      },
                      color: "#5f6368",
                    }}
                  >
                    <MoreVertIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor?.element}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
        onClick={handleActionMenuClose}
      >
        <MenuItem onClick={() => handleAction("share")}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction("download")}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction("rename")}>
          <ListItemIcon>
            <RenameIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction("move")}>
          <ListItemIcon>
            <MoveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Move</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction("details")}>
          <ListItemIcon>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction("delete")}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: "error.main" }}>
            Move to trash
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* Empty State */}
      {files.length === 0 && <EmptyState type="no-files" />}
    </Box>
  );
};
