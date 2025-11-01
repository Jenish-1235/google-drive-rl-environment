import { Box, Typography } from "@mui/material";

export const TrashPage = () => {
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
        Trash
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Deleted files and folders will appear here.
      </Typography>
    </Box>
  );
};
