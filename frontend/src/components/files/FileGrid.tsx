import { useState } from "react";
import {
  Box,
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
  Folder as FolderIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { DriveItem } from "../../types/file.types";
import { useFileStore } from "../../store/fileStore";
import { getFileIcon } from "../../utils/fileIcons";
import { animations, getStaggerDelay } from "../../utils/animations";
import { EmptyState } from "../common/EmptyState";

interface FileGridProps {
  files: DriveItem[];
  onContextMenu?: (event: React.MouseEvent, file: DriveItem) => void;
  onFileClick?: (file: DriveItem) => void;
  onRename?: (file: DriveItem) => void;
  onDelete?: (files: DriveItem[]) => void;
  onShare?: (file: DriveItem) => void;
  onDownload?: (file: DriveItem) => void;
}

export const FileGrid = ({
  files,
  onContextMenu,
  onFileClick,
  onRename,
  onDelete,
  onShare,
  onDownload,
}: FileGridProps) => {
  const navigate = useNavigate();
  const selectedFiles = useFileStore((state) => state.selectedFiles);
  const setSelectedFiles = useFileStore((state) => state.setSelectedFiles);

  const [actionMenuAnchor, setActionMenuAnchor] = useState<{
    element: HTMLElement;
    fileId: string;
  } | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [clickTimeout, setClickTimeout] = useState<number | null>(null);

  // Separate folders and files
  const folders = files.filter((f) => f.type === "folder");
  const documents = files.filter((f) => f.type !== "folder");

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
    if (!actionMenuAnchor) return;

    const file = files.find((f) => f.id === actionMenuAnchor.fileId);
    if (!file) return;

    handleActionMenuClose();

    switch (action) {
      case "rename":
        onRename?.(file);
        break;
      case "delete":
        onDelete?.([file]);
        break;
      case "share":
        onShare?.(file);
        break;
      case "download":
        onDownload?.(file);
        break;
      case "move":
        // Move is handled via drag-drop or context menu
        break;
      case "details":
        // Details panel - to be implemented
        break;
    }
  };

  const isSelected = (fileId: string) => selectedFiles.includes(fileId);

  const renderCard = (file: DriveItem, index: number) => {
    const selected = isSelected(file.id);
    const hovered = hoveredCard === file.id;
    const isFolder = file.type === "folder";

    return (
      <Box
        key={file.id}
        onMouseEnter={() => setHoveredCard(file.id)}
        onMouseLeave={() => setHoveredCard(null)}
        onClick={(e) => handleFileClick(file, e)}
        onContextMenu={(e) => {
          e.preventDefault();
          onContextMenu?.(e, file);
        }}
        sx={{
          width: 256,
          height: isFolder ? 40 : 232,
          border: "1px solid #e8eaed",
          borderRadius: "8px",
          cursor: "pointer",
          position: "relative",
          backgroundColor: selected ? "#e8f0fe" : "white",
          transition: "all 0.2s",
          "&:hover": {
            boxShadow:
              "0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)",
            borderColor: "#d3d3d3",
          },
          ...animations.fadeIn,
          ...getStaggerDelay(index, 20),
        }}
      >
        {isFolder ? (
          // Folder Card
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              px: 2,
              height: "100%",
            }}
          >
            <FolderIcon sx={{ fontSize: 24, color: "#5f6368" }} />
            <Typography
              fontSize={14}
              fontWeight={400}
              color="#202124"
              noWrap
              sx={{ flex: 1 }}
            >
              {file.name}
            </Typography>
            <IconButton
              size="small"
              onClick={(e) => handleActionMenuOpen(e, file.id)}
              sx={{
                opacity: hovered ? 1 : 0,
                transition: "opacity 0.2s",
                color: "#5f6368",
              }}
            >
              <MoreVertIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        ) : (
          // File Card
          <>
            {/* Thumbnail Area */}
            <Box
              sx={{
                height: 180,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: file.thumbnailUrl ? "transparent" : "#f8f9fa",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {file.thumbnailUrl ? (
                <img
                  src={file.thumbnailUrl}
                  alt={file.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Box sx={{ "& > svg": { fontSize: 48 } }}>
                  {getFileIcon(file.type)}
                </Box>
              )}

              {/* More Actions Button */}
              <IconButton
                size="small"
                onClick={(e) => handleActionMenuOpen(e, file.id)}
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  opacity: hovered ? 1 : 0,
                  transition: "opacity 0.2s",
                  backgroundColor: "white",
                  boxShadow: "0 1px 2px 0 rgba(60,64,67,0.3)",
                  "&:hover": {
                    backgroundColor: "#f8f9fa",
                  },
                }}
              >
                <MoreVertIcon sx={{ fontSize: 18, color: "#5f6368" }} />
              </IconButton>
            </Box>

            {/* File Info */}
            <Box
              sx={{
                px: 2,
                py: 1.5,
                borderTop: "1px solid #e8eaed",
              }}
            >
              <Tooltip title={file.name} placement="bottom-start">
                <Typography
                  fontSize={14}
                  fontWeight={400}
                  color="#202124"
                  noWrap
                >
                  {file.name}
                </Typography>
              </Tooltip>
            </Box>
          </>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ px: 3, py: 2 }}>
      {/* Folders Section */}
      {folders.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {folders.map((folder, index) => renderCard(folder, index))}
          </Box>
        </Box>
      )}

      {/* Files Section */}
      {documents.length > 0 && (
        <Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {documents.map((file, index) =>
              renderCard(file, folders.length + index)
            )}
          </Box>
        </Box>
      )}

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
