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
import { useUIStore } from "../../store/uiStore";

export const MainLayout = () => {
  const detailsPanelOpen = useUIStore((state) => state.detailsPanelOpen);

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
            backgroundColor: "#f9fafb",
            width: "100%",
            minWidth: 0, // Allows flex item to shrink below content size
            pr: "56px", // Add padding for fixed right sidebar
            marginRight: detailsPanelOpen ? "360px" : "0px", // Make space for details panel
            transition: "margin-right 0.225s cubic-bezier(0.4, 0.0, 0.2, 1)",
            // Reserve scrollbar gutter to avoid any flicker when content size changes
            scrollbarGutter: "stable both-edges",
            // Hide scrollbar while keeping scroll functionality
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            // Ensure no child shows a scrollbar during view toggles
            "& *::-webkit-scrollbar": {
              width: 0,
              height: 0,
              display: "none",
            },
            "& *": {
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
            },
            // Avoid browser overscroll effects
            overscrollBehavior: "contain",
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
