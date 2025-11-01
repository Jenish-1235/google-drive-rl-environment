import { Box, Typography } from "@mui/material";

export const SharedPage = () => {
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
        Shared with me
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Files and folders shared with you will appear here.
      </Typography>
    </Box>
  );
};
