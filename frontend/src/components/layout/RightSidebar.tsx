import { useState } from "react";
import {
  Box,
  Tooltip,
  Drawer,
  Typography,
} from "@mui/material";

const RIGHT_SIDEBAR_WIDTH = 56;
const RIGHT_SIDEBAR_EXPANDED_WIDTH = 320;

interface SidebarItem {
  id: string;
  iconUrl: string;
  label: string;
}

const sidebarItems: SidebarItem[] = [
  {
    id: "calendar",
    iconUrl: "https://www.gstatic.com/companion/icon_assets/calendar_2020q4_2x.png",
    label: "Calendar",
  },
  {
    id: "keep",
    iconUrl: "https://www.gstatic.com/companion/icon_assets/keep_2020q4v3_2x.png",
    label: "Keep",
  },
  {
    id: "tasks",
    iconUrl: "https://www.gstatic.com/companion/icon_assets/tasks_2021_2x.png",
    label: "Tasks",
  },
  {
    id: "contacts",
    iconUrl: "https://www.gstatic.com/companion/icon_assets/contacts_2022_2x.png",
    label: "Contacts",
  },
];

export const RightSidebar = () => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleItemClick = (itemId: string) => {
    if (selectedItem === itemId) {
      setSelectedItem(null);
    } else {
      setSelectedItem(itemId);
    }
  };

  return (
    <>
      {/* Right Sidebar Icons Bar */}
      <Box
        role="tablist"
        tabIndex={0}
        sx={{
          position: "fixed",
          right: 0,
          top: 64, // Match TopBar height
          width: RIGHT_SIDEBAR_WIDTH,
          height: "calc(100vh - 64px)",
          borderLeft: "none",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          py: 1,
          zIndex: (theme) => theme.zIndex.drawer - 1,
          userSelect: "none",
        }}
      >
        {/* Icons Container - groups all icons together at top */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          {sidebarItems.map((item) => {
            const isSelected = selectedItem === item.id;

            return (
              <Tooltip key={item.id} title={item.label} placement="left">
                <Box
                  role="tab"
                  aria-label={item.label}
                  aria-selected={isSelected}
                  onClick={() => handleItemClick(item.id)}
                  sx={{
                    position: "relative",
                    width: 48,
                    height: 48,
                    minWidth: 48,
                    minHeight: 48,
                    my: 0.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    userSelect: "none",
                    borderRadius: "50%",
                    transition: "background-color 0.15s ease",
                    backgroundColor: isSelected
                      ? "rgba(26, 115, 232, 0.12)"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: isSelected
                        ? "rgba(26, 115, 232, 0.16)"
                        : "rgba(60, 64, 67, 0.08)",
                    },
                  }}
                >
                  {/* Icon */}
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundImage: `url("${item.iconUrl}")`,
                      backgroundSize: "24px 24px",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      userSelect: "none",
                      position: "relative",
                      zIndex: 1,
                    }}
                  />
                  {/* Selected indicator - blue dot on left */}
                  {isSelected && (
                    <Box
                      sx={{
                        position: "absolute",
                        left: 6,
                        width: 3,
                        height: 3,
                        borderRadius: "50%",
                        backgroundColor: "#1a73e8",
                        userSelect: "none",
                        zIndex: 2,
                      }}
                    />
                  )}
                </Box>
              </Tooltip>
            );
          })}

          {/* Separator */}
          <Box
            role="separator"
            aria-hidden="false"
            sx={{
              width: "80%",
              height: 1,
              backgroundColor: "#e8eaed",
              my: 1,
              userSelect: "none",
            }}
          />

          {/* Get Add-ons Button - appears right after separator */}
          <Tooltip title="Get Add-ons" placement="left">
            <Box
              role="tab"
              aria-label="Get Add-ons"
              aria-selected={false}
              sx={{
                position: "relative",
                width: 48,
                height: 48,
                minWidth: 48,
                minHeight: 48,
                my: 0.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                userSelect: "none",
                borderRadius: "50%",
                transition: "background-color 0.15s ease",
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "rgba(60, 64, 67, 0.08)",
                },
              }}
            >
              {/* White background circle behind icon */}
              <Box
                sx={{
                  position: "absolute",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  userSelect: "none",
                  zIndex: 0,
                }}
              />
              {/* Icon */}
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  backgroundImage:
                    'url("https://fonts.gstatic.com/s/i/googlematerialicons/add/v21/black-24dp/1x/gm_add_black_24dp.png")',
                  backgroundSize: "24px 24px",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  userSelect: "none",
                  position: "relative",
                  zIndex: 1,
                }}
              />
            </Box>
          </Tooltip>
        </Box>
      </Box>

      {/* Expanded Panel */}
      <Drawer
        anchor="right"
        open={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        variant="persistent"
        sx={{
          width: selectedItem ? RIGHT_SIDEBAR_EXPANDED_WIDTH : 0,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: RIGHT_SIDEBAR_EXPANDED_WIDTH,
            boxSizing: "border-box",
            border: "none",
            borderLeft: "none",
            backgroundColor: "#ffffff",
            position: "fixed",
            right: RIGHT_SIDEBAR_WIDTH, // Position next to the icon bar
            top: 64, // Match TopBar height
            height: `calc(100vh - 64px)`,
            zIndex: (theme) => theme.zIndex.drawer - 1,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {sidebarItems.find((item) => item.id === selectedItem)?.label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Content coming soon...
          </Typography>
        </Box>
      </Drawer>
    </>
  );
};
