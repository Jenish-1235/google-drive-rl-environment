import { Box, IconButton, Button, Typography, Divider, Tooltip, CircularProgress } from "@mui/material";
import {
  Close as CloseIcon,
  Share as ShareIcon,
  GetApp as DownloadIcon,
  Delete as DeleteIcon,
  Link as LinkIcon,
  MoreVert as MoreVertIcon,
  Folder as FolderIcon,
} from "@mui/icons-material";
import { useFileStore } from "../../store/fileStore";
import { useUIStore } from "../../store/uiStore";
import { fileService } from "../../services/fileService";
import { shareService } from "../../services/shareService";
import { useState } from "react";

interface SelectionToolbarProps {
  onClose: () => void;
}

export const SelectionToolbar = ({ onClose }: SelectionToolbarProps) => {
  const selectedFiles = useFileStore((state) => state.selectedFiles);
  const getSelectedFilesData = useFileStore((state) => state.getSelectedFilesData);
  const refreshFiles = useFileStore((state) => state.refreshFiles);

  const showSnackbar = useUIStore((state) => state.showSnackbar);
  const openModal = useUIStore((state) => state.openModal);

  const [loading, setLoading] = useState(false);

  const selectedFilesData = getSelectedFilesData();
  const selectedCount = selectedFiles.length;

  // Share button - open share modal for single file
  const handleShare = () => {
    if (selectedCount === 1) {
      openModal('share', selectedFilesData[0]);
    } else {
      showSnackbar('Can only share one file at a time', 'info');
    }
  };

  // Download button - download all selected files
  const handleDownload = async () => {
    setLoading(true);
    try {
      let downloadCount = 0;
      for (const file of selectedFilesData) {
        if (file.type !== 'folder') {
          await fileService.downloadFile(file.id, file.name);
          downloadCount++;
        }
      }

      if (downloadCount > 0) {
        showSnackbar(`Downloaded ${downloadCount} file(s)`, 'success');
      } else {
        showSnackbar('No files to download (folders cannot be downloaded)', 'info');
      }
    } catch (error) {
      console.error('Download failed:', error);
      showSnackbar('Failed to download files', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Move button - open move modal
  const handleMove = () => {
    openModal('move', { files: selectedFilesData });
  };

  // Delete button - batch delete
  const handleDelete = async () => {
    setLoading(true);
    try {
      await fileService.batchDelete(selectedFiles);
      showSnackbar(`Moved ${selectedCount} item(s) to bin`, 'success');
      await refreshFiles();
      onClose();
    } catch (error) {
      console.error('Delete failed:', error);
      showSnackbar('Failed to delete files', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Copy link button - generate and copy share link
  const handleCopyLink = async () => {
    if (selectedCount !== 1) {
      showSnackbar('Can only copy link for one file at a time', 'info');
      return;
    }

    setLoading(true);
    try {
      const response = await shareService.generateShareLink(selectedFiles[0]);
      await navigator.clipboard.writeText(response.share_link);
      showSnackbar('Link copied to clipboard', 'success');
    } catch (error) {
      console.error('Copy link failed:', error);
      showSnackbar('Failed to copy link', 'error');
    } finally {
      setLoading(false);
    }
  };

  // More actions button
  const handleMore = () => {
    showSnackbar('Additional actions coming soon!', 'info');
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 1.5,
        py: 0.5,
        backgroundColor: "#f0f4f9",
        borderRadius: "24px",
        height: 40,
      }}
    >
      {/* Close Button */}
      <IconButton
        size="small"
        onClick={onClose}
        disabled={loading}
        sx={{
          color: "#5f6368",
          "&:hover": {
            backgroundColor: "#e8eaed",
          },
        }}
      >
        <CloseIcon sx={{ fontSize: 20 }} />
      </IconButton>

      {/* Selected Count */}
      <Typography fontSize={14} fontWeight={500} color="#202124">
        {selectedCount} selected
      </Typography>

      {/* Summarize Folder Button (only show for single folder selection) */}
      {selectedCount === 1 && selectedFilesData[0]?.type === "folder" && (
        <Button
          variant="outlined"
          startIcon={<FolderIcon sx={{ fontSize: 16 }} />}
          onClick={() => showSnackbar('Folder summary feature coming soon!', 'info')}
          disabled={loading}
          sx={{
            textTransform: "none",
            color: "#5f6368",
            borderColor: "#dadce0",
            backgroundColor: "white",
            borderRadius: "18px",
            px: 2,
            py: 0.5,
            fontSize: 13,
            fontWeight: 400,
            "&:hover": {
              borderColor: "#dadce0",
              backgroundColor: "#f8f9fa",
            },
          }}
        >
          Summarize this folder
        </Button>
      )}

      <Divider
        orientation="vertical"
        flexItem
        sx={{ borderColor: "#dadce0", height: 24, alignSelf: "center" }}
      />

      {/* Action Buttons */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        {loading ? (
          <CircularProgress size={20} sx={{ color: "#5f6368", mx: 1 }} />
        ) : (
          <>
            <Tooltip title="Share">
              <IconButton
                size="small"
                onClick={handleShare}
                disabled={loading}
                sx={{
                  color: "#5f6368",
                  "&:hover": {
                    backgroundColor: "#e8eaed",
                  },
                }}
              >
                <ShareIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Download">
              <IconButton
                size="small"
                onClick={handleDownload}
                disabled={loading}
                sx={{
                  color: "#5f6368",
                  "&:hover": {
                    backgroundColor: "#e8eaed",
                  },
                }}
              >
                <DownloadIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Move to folder">
              <IconButton
                size="small"
                onClick={handleMove}
                disabled={loading}
                sx={{
                  color: "#5f6368",
                  "&:hover": {
                    backgroundColor: "#e8eaed",
                  },
                }}
              >
                <FolderIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Move to bin">
              <IconButton
                size="small"
                onClick={handleDelete}
                disabled={loading}
                sx={{
                  color: "#5f6368",
                  "&:hover": {
                    backgroundColor: "#e8eaed",
                  },
                }}
              >
                <DeleteIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Copy link">
              <IconButton
                size="small"
                onClick={handleCopyLink}
                disabled={loading}
                sx={{
                  color: "#5f6368",
                  "&:hover": {
                    backgroundColor: "#e8eaed",
                  },
                }}
              >
                <LinkIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="More actions">
              <IconButton
                size="small"
                onClick={handleMore}
                disabled={loading}
                sx={{
                  color: "#5f6368",
                  "&:hover": {
                    backgroundColor: "#e8eaed",
                  },
                }}
              >
                <MoreVertIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>
    </Box>
  );
};
