import { Box, Typography, IconButton } from "@mui/material";
import { InfoOutlined as InfoIcon } from "@mui/icons-material";

export const SpamPage = () => {
  // Get spam files - for now showing empty state
  // In real implementation, this would filter files marked as spam
  const spamFiles: never[] = [];

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
        {/* Title */}
        <Typography
          sx={{
            fontSize: 22,
            fontWeight: 500,
            color: "#202124",
          }}
        >
          Spam
        </Typography>

        {/* Right Side: Info */}
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

      {/* Content Area */}
      {spamFiles.length === 0 ? (
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
              maxWidth: 600,
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
                {/* Person with shredder */}
                {/* Head */}
                <circle cx="120" cy="80" r="25" fill="#E8710A" />
                <ellipse cx="105" cy="75" rx="3" ry="4" fill="#5F6368" />
                <ellipse cx="135" cy="75" rx="3" ry="4" fill="#5F6368" />

                {/* Hair */}
                <path
                  d="M95 75 Q95 55, 120 50 Q145 55, 145 75"
                  fill="#5F6368"
                />

                {/* Body */}
                <ellipse cx="120" cy="130" rx="35" ry="40" fill="#4285F4" />

                {/* Arms */}
                <ellipse
                  cx="85"
                  cy="115"
                  rx="12"
                  ry="30"
                  fill="#F9AB00"
                  transform="rotate(-30 85 115)"
                />
                <ellipse
                  cx="155"
                  cy="115"
                  rx="12"
                  ry="30"
                  fill="#F9AB00"
                  transform="rotate(30 155 115)"
                />

                {/* Paper shredder */}
                <rect
                  x="95"
                  y="140"
                  width="50"
                  height="45"
                  rx="4"
                  fill="#DADCE0"
                />
                <rect x="95" y="140" width="50" height="10" fill="#BDC1C6" />

                {/* Paper going in */}
                <rect
                  x="110"
                  y="125"
                  width="20"
                  height="20"
                  fill="#FFFFFF"
                  stroke="#5F6368"
                  strokeWidth="1"
                />

                {/* Shredded paper coming out */}
                <rect x="100" y="185" width="2" height="10" fill="#AECBFA" />
                <rect x="105" y="185" width="2" height="12" fill="#AECBFA" />
                <rect x="110" y="185" width="2" height="11" fill="#AECBFA" />
                <rect x="115" y="185" width="2" height="13" fill="#AECBFA" />
                <rect x="120" y="185" width="2" height="10" fill="#AECBFA" />
                <rect x="125" y="185" width="2" height="12" fill="#AECBFA" />
                <rect x="130" y="185" width="2" height="11" fill="#AECBFA" />
                <rect x="135" y="185" width="2" height="10" fill="#AECBFA" />

                {/* Small papers flying around */}
                <rect
                  x="70"
                  y="150"
                  width="8"
                  height="10"
                  rx="1"
                  fill="#E8F0FE"
                  transform="rotate(-15 74 155)"
                />
                <rect
                  x="160"
                  y="145"
                  width="8"
                  height="10"
                  rx="1"
                  fill="#E8F0FE"
                  transform="rotate(20 164 150)"
                />
                <rect
                  x="75"
                  y="175"
                  width="6"
                  height="8"
                  rx="1"
                  fill="#D2E3FC"
                  transform="rotate(-25 78 179)"
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
              Your spam is empty
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
              Files in spam won't appear anywhere else in Drive. Files are
              permanently removed after 30 days.
            </Typography>
          </Box>
        </Box>
      ) : (
        // TODO: Add list/grid view for spam files when data is available
        <Box sx={{ width: "100%" }}>
          {/* Spam files list/grid will go here */}
        </Box>
      )}
    </Box>
  );
};
