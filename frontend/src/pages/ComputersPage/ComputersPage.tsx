import { Box, Typography } from "@mui/material";
import { Computer as ComputerIcon } from "@mui/icons-material";

export const ComputersPage = () => {
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
      <ComputerIcon sx={{ fontSize: 80, color: "#5f6368" }} />
      <Typography variant="h5" color="#202124" fontWeight={400}>
        Computers
      </Typography>
      <Typography
        variant="body1"
        color="#5f6368"
        textAlign="center"
        maxWidth={400}
      >
        Access files from your computers with Drive for desktop
      </Typography>
    </Box>
  );
};
