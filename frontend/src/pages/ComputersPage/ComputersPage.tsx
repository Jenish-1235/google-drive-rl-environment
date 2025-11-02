import { Box, Typography, IconButton, Alert } from "@mui/material";
import {
  InfoOutlined as InfoIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useState } from "react";

export const ComputersPage = () => {
  const [showBanner, setShowBanner] = useState(true);

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
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontSize: 22,
            fontWeight: 500,
            color: "#202124",
          }}
        >
          Computers
        </Typography>

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

      {/* Info Banner */}
      {showBanner && (
        <Alert
          severity="info"
          onClose={() => setShowBanner(false)}
          sx={{
            mb: 4,
            backgroundColor: "#d3e3fd",
            border: "1px solid #8ab4f8",
            borderRadius: "8px",
            "& .MuiAlert-icon": {
              color: "#1967d2",
            },
            "& .MuiAlert-message": {
              color: "#202124",
              fontSize: 14,
              py: 0.5,
            },
            "& .MuiAlert-action": {
              paddingTop: 0,
            },
          }}
          action={
            <IconButton
              size="small"
              onClick={() => setShowBanner(false)}
              sx={{
                color: "#5f6368",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          <Typography
            component="span"
            sx={{
              fontWeight: 500,
              fontSize: 14,
              color: "#202124",
            }}
          >
            Changes will automatically sync.
          </Typography>
          <Typography
            component="span"
            sx={{
              display: "block",
              fontSize: 13,
              color: "#5f6368",
              mt: 0.5,
            }}
          >
            If you add, edit, move, or delete files in folders currently syncing
            with Google Drive, those changes will also happen on your computer.{" "}
            <Box
              component="a"
              href="#"
              sx={{
                color: "#1967d2",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Learn more
            </Box>
          </Typography>
        </Alert>
      )}

      {/* Empty State */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 350px)",
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
              {/* Person with laptop - simplified illustration */}
              <circle cx="80" cy="80" r="25" fill="#E8F0FE" />
              <ellipse cx="80" cy="105" rx="30" ry="35" fill="#AECBFA" />
              <rect
                x="55"
                y="130"
                width="50"
                height="35"
                rx="4"
                fill="#D2E3FC"
              />
              <rect x="65" y="135" width="30" height="20" rx="2" fill="#fff" />

              {/* Person 2 */}
              <circle cx="160" cy="90" r="25" fill="#FDE293" />
              <ellipse cx="160" cy="115" rx="30" ry="35" fill="#FAD375" />
              <rect
                x="135"
                y="140"
                width="50"
                height="35"
                rx="4"
                fill="#FBBC04"
              />
              <circle cx="185" cy="155" r="15" fill="#FDE293" />

              {/* Sync arrows */}
              <path
                d="M 110 120 Q 125 100 140 120"
                stroke="#1A73E8"
                strokeWidth="3"
                fill="none"
                markerEnd="url(#arrowblue)"
              />
              <defs>
                <marker
                  id="arrowblue"
                  markerWidth="10"
                  markerHeight="10"
                  refX="5"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L9,3 z" fill="#1A73E8" />
                </marker>
              </defs>
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
            No computers syncing
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
            Folders on your computer that you sync with Drive using Drive for
            desktop will show up here.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
