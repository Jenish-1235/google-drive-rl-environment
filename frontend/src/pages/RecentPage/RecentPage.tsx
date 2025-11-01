import { Box, Typography } from "@mui/material";

export const RecentPage = () => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        py: 3,
        px: { xs: 2, sm: 4, md: 6 },
      }}
    >
      <Typography variant="h2" gutterBottom>
        Recent
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Recently opened or modified files will appear here.
      </Typography>
    </Box>
  );
};
