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

export const StarredPage = () => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const files = useFileStore((state) => state.files);

  // Get starred files
  const starredFiles = files.filter((file) => file.isStarred);

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
          Starred
        </Typography>

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
        {["Type", "People", "Modified", "Source"].map((filter) => (
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
      {starredFiles.length === 0 ? (
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
                {/* Person holding/reaching for star */}
                {/* Head */}
                <ellipse cx="105" cy="95" rx="28" ry="32" fill="#8D6E63" />

                {/* Hair - dark puff style */}
                <circle cx="85" cy="75" r="18" fill="#424242" />
                <circle cx="105" cy="68" r="20" fill="#424242" />
                <circle cx="125" cy="75" r="18" fill="#424242" />
                <circle cx="95" cy="60" r="16" fill="#424242" />
                <circle cx="115" cy="62" r="16" fill="#424242" />

                {/* Face details */}
                <ellipse cx="95" cy="95" rx="3" ry="4" fill="#5F6368" />
                <ellipse cx="115" cy="95" rx="3" ry="4" fill="#5F6368" />

                {/* Body */}
                <ellipse cx="105" cy="155" rx="40" ry="45" fill="#A3D4F7" />

                {/* Left arm reaching up */}
                <ellipse
                  cx="70"
                  cy="130"
                  rx="15"
                  ry="35"
                  fill="#8D6E63"
                  transform="rotate(-45 70 130)"
                />

                {/* Right arm */}
                <ellipse
                  cx="140"
                  cy="145"
                  rx="15"
                  ry="30"
                  fill="#8D6E63"
                  transform="rotate(20 140 145)"
                />

                {/* Star - large yellow star */}
                <g transform="translate(165, 75)">
                  <path
                    d="M 0,-35 L 8,-10 L 35,-10 L 13,5 L 21,30 L 0,13 L -21,30 L -13,5 L -35,-10 L -8,-10 Z"
                    fill="#FDD663"
                  />
                  <path
                    d="M 0,-28 L 6,-8 L 28,-8 L 10,4 L 17,24 L 0,10 L -17,24 L -10,4 L -28,-8 L -6,-8 Z"
                    fill="#FBBC04"
                  />
                </g>

                {/* Small sparkles around */}
                <circle cx="180" cy="120" r="3" fill="#FDD663" />
                <circle cx="155" cy="130" r="2" fill="#FDD663" />
                <circle cx="195" cy="95" r="2.5" fill="#FDD663" />
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
              No starred files
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
              Add stars to things that you want to easily find later
            </Typography>
          </Box>
        </Box>
      ) : (
        // TODO: Add list/grid view for starred files when data is available
        <Box sx={{ width: "100%" }}>
          {/* Starred files list/grid will go here */}
        </Box>
      )}
    </Box>
  );
};
