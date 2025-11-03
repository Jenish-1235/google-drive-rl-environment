import { Box, Typography, Button, IconButton } from "@mui/material";
import {
  InfoOutlined as InfoIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useUIStore } from "../../store/uiStore";
import { FileList } from "../../components/files/FileList";
import { FileGrid } from "../../components/files/FileGrid";
import { FileListSkeleton } from "../../components/loading/FileListSkeleton";
import { FileGridSkeleton } from "../../components/loading/FileGridSkeleton";
import { shareService, type SharedFile } from "../../services";
import type { DriveItem, FileType } from "../../types/file.types";

// Map SharedFile to DriveItem
const mapSharedFileToDriverItem = (sharedFile: SharedFile): DriveItem => ({
  id: sharedFile.id,
  name: sharedFile.name,
  type: sharedFile.type as FileType,
  mimeType: sharedFile.mime_type,
  size: sharedFile.size,
  ownerId: sharedFile.shared_by.id.toString(),
  ownerName: sharedFile.shared_by.name,
  ownerEmail: sharedFile.shared_by.email,
  createdTime: new Date(sharedFile.created_at),
  modifiedTime: new Date(sharedFile.updated_at),
  parentId: null,
  path: [],
  isStarred: false,
  isTrashed: false,
  isShared: true,
  permissions: [],
});

export const SharedPage = () => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [files, setFiles] = useState<DriveItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const showSnackbar = useUIStore((state) => state.showSnackbar);

  // Fetch shared with me files on mount
  useEffect(() => {
    const fetchSharedWithMe = async () => {
      setIsLoading(true);
      try {
        const response = await shareService.getSharedWithMe();
        const mappedFiles = response.files.map(mapSharedFileToDriverItem);
        setFiles(mappedFiles);
      } catch (error: any) {
        showSnackbar(error.message || "Failed to load shared files", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedWithMe();
  }, [showSnackbar]);

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
        {/* Title */}
        <Typography
          sx={{
            fontSize: 22,
            fontWeight: 500,
            color: "#202124",
          }}
        >
          Shared with me
        </Typography>

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

      {/* Filter Buttons */}
      <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
        {["Type", "People", "Modified"].map((filter) => (
          <Button
            key={filter}
            variant="outlined"
            endIcon={<ArrowDownIcon sx={{ fontSize: 18 }} />}
            sx={{
              textTransform: "none",
              color: "#202124",
              borderColor: "#dadce0",
              backgroundColor: "transparent",
              borderRadius: 1,
              px: 2,
              py: 0.5,
              fontSize: 14,
              fontWeight: 500,
              minHeight: 36,
              "&:hover": {
                borderColor: "#dadce0",
                backgroundColor: "#f8f9fa",
              },
            }}
          >
            {filter}
          </Button>
        ))}
      </Box>

      {/* Content Area */}
      {isLoading ? (
        viewMode === "list" ? (
          <FileListSkeleton />
        ) : (
          <FileGridSkeleton />
        )
      ) : files.length === 0 ? (
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
            <Typography
              variant="h6"
              sx={{
                fontSize: 22,
                fontWeight: 400,
                color: "#202124",
                textAlign: "center",
              }}
            >
              No files shared with you
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
              When others share files with you, they will appear here
            </Typography>
          </Box>
        </Box>
      ) : viewMode === "list" ? (
        <FileList files={files} />
      ) : (
        <FileGrid files={files} />
      )}
    </Box>
  );
};
