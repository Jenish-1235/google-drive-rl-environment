import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { RightSidebar } from "./RightSidebar";
import { DragDropOverlay } from "../files/DragDropOverlay";
import { UploadProgress } from "../files/UploadProgress";
import { Snackbar } from "../common/Snackbar";
import { initMockUser } from "../../utils/initMockUser";

export const MainLayout = () => {
  useEffect(() => {
    // Initialize mock user for development
    initMockUser();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <TopBar />
      <Box
        sx={{ display: "flex", flexGrow: 1, overflow: "hidden", pt: "56px" }}
      >
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: "auto",
            backgroundColor: "background.default",
            width: "100%",
            minWidth: 0, // Allows flex item to shrink below content size
            pr: "56px", // Add padding for fixed right sidebar
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* Right Sidebar - Fixed to right edge */}
      <RightSidebar />

      {/* Global components */}
      <DragDropOverlay />
      <UploadProgress />
      <Snackbar />
    </Box>
  );
};
