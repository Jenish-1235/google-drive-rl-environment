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
  alpha,
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
import { colors } from "../../theme/theme";
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

  const [actionMenuAnchor, setActionMenuAnchor] = useState<{
    element: HTMLElement;
    fileId: string;
  } | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      toggleSortOrder();
    } else {
      setSortField(field);
    }
    onSort?.(field);
  };

  const handleFileClick = (file: DriveItem) => {
    if (onFileClick) {
      onFileClick(file);
    } else if (file.type === "folder") {
      navigate(`/folder/${file.id}`);
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
      <TableContainer sx={{ width: "100%" }}>
        <Table sx={{ width: "100%", tableLayout: "fixed" }}>
          <TableHead>
            <TableRow
              sx={{
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <TableCell
                sx={{ width: 48, py: 0.75, borderBottom: "none", pl: 2 }}
              />
              <TableCell
                sx={{
                  width: "45%",
                  py: 0.75,
                  borderBottom: "none",
                }}
              >
                <TableSortLabel
                  active={sortField === "name"}
                  direction={sortField === "name" ? sortOrder : "asc"}
                  onClick={() => handleSort("name")}
                  sx={{
                    "& .MuiTableSortLabel-root": {
                      fontSize: 14,
                      fontWeight: 500,
                      color: "text.secondary",
                    },
                  }}
                >
                  <Typography
                    fontSize={12}
                    fontWeight={500}
                    color="text.secondary"
                  >
                    Name
                  </Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{
                  width: "18%",
                  py: 0.75,
                  borderBottom: "none",
                }}
              >
                <TableSortLabel
                  active={sortField === "owner"}
                  direction={sortField === "owner" ? sortOrder : "asc"}
                  onClick={() => handleSort("owner")}
                >
                  <Typography
                    fontSize={12}
                    fontWeight={500}
                    color="text.secondary"
                  >
                    Owner
                  </Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{
                  width: "18%",
                  py: 0.75,
                  borderBottom: "none",
                }}
              >
                <TableSortLabel
                  active={sortField === "modifiedTime"}
                  direction={sortField === "modifiedTime" ? sortOrder : "asc"}
                  onClick={() => handleSort("modifiedTime")}
                >
                  <Typography
                    fontSize={12}
                    fontWeight={500}
                    color="text.secondary"
                  >
                    Date modified
                  </Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{
                  width: "12%",
                  py: 0.75,
                  borderBottom: "none",
                }}
              >
                <TableSortLabel
                  active={sortField === "size"}
                  direction={sortField === "size" ? sortOrder : "asc"}
                  onClick={() => handleSort("size")}
                >
                  <Typography
                    fontSize={12}
                    fontWeight={500}
                    color="text.secondary"
                  >
                    File size
                  </Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{
                  width: 80,
                  py: 0.75,
                  borderBottom: "none",
                  textAlign: "right",
                  pr: 2,
                }}
              >
                <Typography
                  fontSize={12}
                  fontWeight={500}
                  color="text.secondary"
                >
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
                onClick={() => handleFileClick(file)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  onContextMenu?.(e, file);
                }}
                sx={{
                  cursor: "pointer",
                  borderBottom: `1px solid ${colors.border}`,
                  "&:hover": {
                    backgroundColor: alpha(colors.primary, 0.04),
                  },
                  "&.Mui-selected": {
                    backgroundColor: alpha(colors.primary, 0.08),
                    "&:hover": {
                      backgroundColor: alpha(colors.primary, 0.12),
                    },
                  },
                  ...animations.fadeIn,
                  ...getStaggerDelay(index, 20),
                }}
              >
                <TableCell sx={{ py: 0.75, borderBottom: "none", pl: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {getFileIcon(file.type)}
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 0.75, borderBottom: "none" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography fontSize={14} noWrap color="text.primary">
                      {file.name}
                    </Typography>
                    {file.isShared && (
                      <Tooltip title="Shared">
                        <ShareIcon
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 0.75, borderBottom: "none" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        backgroundColor: colors.primary,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        color: "white",
                        fontWeight: 500,
                      }}
                    >
                      {file.ownerName?.charAt(0).toUpperCase() || "U"}
                    </Box>
                    <Typography fontSize={14} color="text.secondary" noWrap>
                      me
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 0.75, borderBottom: "none" }}>
                  <Typography fontSize={14} color="text.secondary">
                    {formatDate(file.modifiedTime)}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 0.75, borderBottom: "none" }}>
                  <Typography fontSize={14} color="text.secondary">
                    {file.type === "folder"
                      ? "—"
                      : formatFileSize(file.size || 0)}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    py: 0.75,
                    borderBottom: "none",
                    textAlign: "right",
                    pr: 1,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => handleActionMenuOpen(e, file.id)}
                    sx={{
                      opacity: 0.6,
                      "&:hover": {
                        opacity: 1,
                      },
                    }}
                  >
                    <MoreVertIcon sx={{ fontSize: 20 }} />
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
