import { Box, Typography, Button, IconButton } from "@mui/material";
import {
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
        {["Type", "People", "Modified", "Source"].map((filter) => (
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
