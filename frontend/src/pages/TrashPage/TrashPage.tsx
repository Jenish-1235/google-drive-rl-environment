import {
  Box,
  Typography,
  Button,
  IconButton,
  ButtonGroup,
} from "@mui/material";
import {
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  InfoOutlined as InfoIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useFileStore } from "../../store/fileStore";

export const TrashPage = () => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const files = useFileStore((state) => state.files);

  // Get trashed files
  const trashedFiles = files.filter((file) => file.isTrashed);

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
                borderRadius: "50%",
                width: 40,
                height: 40,
                border:
                  viewMode === "list"
                    ? "1px solid #1a73e8"
                    : "1px solid #dadce0",
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
                borderRadius: "50%",
                width: 40,
                height: 40,
                border:
                  viewMode === "grid"
                    ? "1px solid #1a73e8"
                    : "1px solid #dadce0",
                ml: 1,
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
              width: 40,
              height: 40,
              "&:hover": {
                backgroundColor: "#f8f9fa",
              },
            }}
          >
            <InfoIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Filter Buttons */}
      <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
        {["Type", "Modified", "Source"].map((filter) => (
          <Button
            key={filter}
            variant="outlined"
            endIcon={<ArrowDownIcon sx={{ fontSize: 18 }} />}
            sx={{
              textTransform: "none",
              color: "#202124",
              borderColor: "#dadce0",
              backgroundColor: "white",
              borderRadius: "18px",
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
      {trashedFiles.length === 0 ? (
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
      ) : (
        // TODO: Add list/grid view for trashed files when data is available
        <Box sx={{ width: "100%" }}>
          {/* Trashed files list/grid will go here */}
        </Box>
      )}
    </Box>
  );
};
