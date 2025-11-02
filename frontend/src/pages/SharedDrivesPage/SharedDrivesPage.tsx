import { Box, Typography } from "@mui/material";
import { Devices as DevicesIcon } from "@mui/icons-material";

export const SharedDrivesPage = () => {
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
      <DevicesIcon sx={{ fontSize: 80, color: "#5f6368" }} />
      <Typography variant="h5" color="#202124" fontWeight={400}>
        Shared drives
      </Typography>
      <Typography
        variant="body1"
        color="#5f6368"
        textAlign="center"
        maxWidth={400}
      >
        Shared drives that you are a member of will appear here
      </Typography>
    </Box>
  );
};
