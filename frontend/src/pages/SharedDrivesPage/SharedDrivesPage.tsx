import {
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Link,
} from "@mui/material";
import { Info as InfoIcon, Search as SearchIcon } from "@mui/icons-material";
import { useState } from "react";

interface SharedDrive {
  id: string;
  name: string;
}

export const SharedDrivesPage = () => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - empty for now
  const sharedDrives: SharedDrive[] = [];

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
      {/* Top Section */}
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
          variant="h5"
          sx={{
            fontSize: 22,
            fontWeight: 500,
            color: "#202124",
          }}
        >
          Shared drives
        </Typography>

        {/* Right Side: Hidden drives link + View Toggle + Info */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link
            href="#"
            underline="none"
            sx={{
              fontSize: 14,
              color: "#1a73e8",
              fontWeight: 500,
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Hidden shared drives
          </Link>

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

      {/* Search Box */}
      <Box sx={{ mb: 1, width: "100%" }}>
        <TextField
          placeholder="Shared drive name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#5f6368", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: 280,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
              borderRadius: "24px",
              "& fieldset": {
                borderColor: "#dadce0",
              },
              "&:hover fieldset": {
                borderColor: "#dadce0",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#1a73e8",
              },
            },
            "& .MuiOutlinedInput-input": {
              fontSize: 14,
              py: 1,
            },
          }}
        />
      </Box>

      {/* Content Area - Full Width Container */}
      <Box sx={{ width: "100%", mt: 2 }}>
        {sharedDrives.length === 0 ? (
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
                maxWidth: 400,
              }}
            >
              {/* Illustration placeholder */}
              <Box
                sx={{
                  width: 200,
                  height: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <svg
                  width="200"
                  height="200"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Simple illustration placeholder */}
                  <circle cx="100" cy="80" r="40" fill="#E8F0FE" />
                  <rect
                    x="60"
                    y="120"
                    width="80"
                    height="60"
                    rx="4"
                    fill="#E8F0FE"
                  />
                  <circle cx="80" cy="60" r="8" fill="#1A73E8" />
                  <circle cx="120" cy="60" r="8" fill="#1A73E8" />
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
                A place for teamwork
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
                A shared drive is a place for teamwork. When you're added to
                one, it will show up here.
              </Typography>
            </Box>
          </Box>
        ) : (
          // Shared drives list/grid will go here
          <Box sx={{ width: "100%" }}>
            {/* Shared drives list/grid content */}
          </Box>
        )}
      </Box>
    </Box>
  );
};
