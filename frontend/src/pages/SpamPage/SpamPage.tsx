import { Box, Typography } from "@mui/material";
import { Report as SpamIcon } from "@mui/icons-material";

export const SpamPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        gap: 2,
      }}
    >
      <SpamIcon sx={{ fontSize: 80, color: "#5f6368" }} />
      <Typography variant="h5" color="#202124" fontWeight={400}>
        Spam
      </Typography>
      <Typography
        variant="body1"
        color="#5f6368"
        textAlign="center"
        maxWidth={400}
      >
        Files marked as spam will appear here
      </Typography>
    </Box>
  );
};
