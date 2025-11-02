import { Box, Typography, Button, IconButton } from "@mui/material";
import {
  InfoOutlined as InfoIcon,
  KeyboardArrowDown as ArrowDownIcon,
  RestoreFromTrash as RestoreIcon,
  DeleteForever as DeleteForeverIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useFileStore } from "../../store/fileStore";
import { useUIStore } from "../../store/uiStore";
import { FileList } from "../../components/files/FileList";
import { FileGrid } from "../../components/files/FileGrid";
import { FileListSkeleton } from "../../components/loading/FileListSkeleton";
import { FileGridSkeleton } from "../../components/loading/FileGridSkeleton";
import { RestoreModal } from "../../components/modals/RestoreModal";
import { DeleteModal } from "../../components/modals/DeleteModal";
import type { DriveItem } from "../../types/file.types";

export const TrashPage = () => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const files = useFileStore((state) => state.files);
  const isLoading = useFileStore((state) => state.isLoading);
  const fetchTrashedFiles = useFileStore((state) => state.fetchTrashedFiles);
  const restoreFromTrash = useFileStore((state) => state.restoreFromTrash);
  const permanentlyDelete = useFileStore((state) => state.permanentlyDelete);
  const selectedFiles = useFileStore((state) => state.selectedFiles);
  const clearSelection = useFileStore((state) => state.clearSelection);
  const showSnackbar = useUIStore((state) => state.showSnackbar);

  const [restoreFiles, setRestoreFiles] = useState<DriveItem[]>([]);
  const [deleteFiles, setDeleteFiles] = useState<DriveItem[]>([]);

  // Fetch trashed files on mount
  useEffect(() => {
    fetchTrashedFiles().catch((error) => {
      showSnackbar(error.message || "Failed to load trashed files", "error");
    });
  }, [fetchTrashedFiles, showSnackbar]);

  // Get trashed files
  const trashedFiles = files.filter((file) => file.isTrashed);
  const selectedTrashedFiles = trashedFiles.filter((f) =>
    selectedFiles.includes(f.id)
  );

  const handleRestore = (filesToRestore: DriveItem[]) => {
    setRestoreFiles(filesToRestore);
  };

  const handleRestoreConfirm = async () => {
    try {
      await Promise.all(restoreFiles.map((file) => restoreFromTrash(file.id)));
      showSnackbar(
        `Restored ${restoreFiles.length} item${
          restoreFiles.length > 1 ? "s" : ""
        }`,
        "success"
      );
      setRestoreFiles([]);
      clearSelection();
    } catch (error: any) {
      showSnackbar(error.message || "Failed to restore", "error");
    }
  };

  const handleDelete = (filesToDelete: DriveItem[]) => {
    setDeleteFiles(filesToDelete);
  };

  const handleDeleteConfirm = async () => {
    try {
      await Promise.all(deleteFiles.map((file) => permanentlyDelete(file.id)));
      showSnackbar(
        `Permanently deleted ${deleteFiles.length} item${
          deleteFiles.length > 1 ? "s" : ""
        }`,
        "success"
      );
      setDeleteFiles([]);
      clearSelection();
    } catch (error: any) {
      showSnackbar(error.message || "Failed to delete permanently", "error");
    }
  };

  const handleEmptyTrash = async () => {
    if (trashedFiles.length === 0) return;
    handleDelete(trashedFiles);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        py: 3,
        px: 3,
        backgroundColor: "#f9fafb",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        {/* Title with Dropdown */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography
            sx={{
              fontSize: 22,
              fontWeight: 500,
              color: "#202124",
            }}
          >
            Trash from
          </Typography>
          <Button
            endIcon={<ArrowDownIcon sx={{ fontSize: 20 }} />}
            sx={{
              textTransform: "none",
              fontSize: 22,
              fontWeight: 500,
              color: "#202124",
              minWidth: "auto",
              px: 1,
              "&:hover": {
                backgroundColor: "#f8f9fa",
              },
            }}
          >
            My Drive
          </Button>
        </Box>

        {/* Right Side: View Toggle + Info */}
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
            <InfoIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Action Buttons (when files are selected) */}
      {selectedTrashedFiles.length > 0 && (
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            mb: 2,
            backgroundColor: "#e8f0fe",
            borderRadius: 2,
            p: 1.5,
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: 500, mr: 1 }}>
            {selectedTrashedFiles.length} selected
          </Typography>
          <Button
            startIcon={<RestoreIcon />}
            onClick={() => handleRestore(selectedTrashedFiles)}
            sx={{
              textTransform: "none",
              color: "#1a73e8",
              fontSize: 14,
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "rgba(26, 115, 232, 0.1)",
              },
            }}
          >
            Restore
          </Button>
          <Button
            startIcon={<DeleteForeverIcon />}
            onClick={() => handleDelete(selectedTrashedFiles)}
            sx={{
              textTransform: "none",
              color: "#d93025",
              fontSize: 14,
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "rgba(217, 48, 37, 0.1)",
              },
            }}
          >
            Delete forever
          </Button>
        </Box>
      )}

      {/* Empty Trash Button (when not empty and no selection) */}
      {trashedFiles.length > 0 && selectedTrashedFiles.length === 0 && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            startIcon={<DeleteForeverIcon />}
            onClick={handleEmptyTrash}
            sx={{
              textTransform: "none",
              color: "#d93025",
              fontSize: 14,
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "rgba(217, 48, 37, 0.1)",
              },
            }}
          >
            Empty trash
          </Button>
        </Box>
      )}

      {/* Content Area */}
      {isLoading ? (
        viewMode === "list" ? (
          <FileListSkeleton />
        ) : (
          <FileGridSkeleton />
        )
      ) : trashedFiles.length === 0 ? (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "calc(100vh - 300px)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              maxWidth: 500,
            }}
          >
            {/* Illustration */}
            <Box
              sx={{
                width: 240,
                height: 240,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <svg
                width="240"
                height="240"
                viewBox="0 0 240 240"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Trash bin */}
                <rect
                  x="80"
                  y="120"
                  width="80"
                  height="80"
                  rx="4"
                  fill="#AECBFA"
                />
                <rect
                  x="75"
                  y="115"
                  width="90"
                  height="8"
                  rx="2"
                  fill="#D2E3FC"
                />

                {/* Person sitting and fishing */}
                <circle cx="160" cy="70" r="20" fill="#FDE293" />
                <ellipse cx="160" cy="92" rx="22" ry="25" fill="#FAD375" />
                <rect
                  x="140"
                  y="110"
                  width="40"
                  height="30"
                  rx="4"
                  fill="#FBBC04"
                />

                {/* Fishing rod */}
                <line
                  x1="165"
                  y1="75"
                  x2="100"
                  y2="140"
                  stroke="#5f6368"
                  strokeWidth="2"
                />

                {/* Hook and item */}
                <circle cx="95" cy="145" r="6" fill="#FBBC04" />
                <line
                  x1="95"
                  y1="151"
                  x2="95"
                  y2="165"
                  stroke="#5f6368"
                  strokeWidth="2"
                />
              </svg>
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontSize: 22,
                fontWeight: 400,
                color: "#202124",
                textAlign: "center",
              }}
            >
              Trash is empty
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: 14,
                color: "#5f6368",
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              Items moved to the trash will be deleted forever after 30 days
            </Typography>
          </Box>
        </Box>
      ) : viewMode === "list" ? (
        <FileList
          files={trashedFiles}
          onRename={undefined}
          onDelete={handleDelete}
          onShare={undefined}
          onDownload={undefined}
        />
      ) : (
        <FileGrid
          files={trashedFiles}
          onRename={undefined}
          onDelete={handleDelete}
          onShare={undefined}
          onDownload={undefined}
        />
      )}

      {/* Modals */}
      <RestoreModal
        open={restoreFiles.length > 0}
        files={restoreFiles}
        onClose={() => setRestoreFiles([])}
        onRestore={handleRestoreConfirm}
      />

      <DeleteModal
        open={deleteFiles.length > 0}
        files={deleteFiles}
        onClose={() => setDeleteFiles([])}
        onDelete={handleDeleteConfirm}
        permanent={true}
      />
    </Box>
  );
};
