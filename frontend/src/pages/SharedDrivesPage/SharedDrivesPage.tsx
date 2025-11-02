import {
  Box,
  Typography,
  IconButton,
  ButtonGroup,
  TextField,
  InputAdornment,
  Link,
} from "@mui/material";
import {
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Info as InfoIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
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
