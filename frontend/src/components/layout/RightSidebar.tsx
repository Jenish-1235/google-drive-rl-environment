import { useState } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Drawer,
  Typography,
  Divider,
} from "@mui/material";
import {
  CalendarMonth as CalendarIcon,
  CheckCircleOutline as TasksIcon,
  ContactPage as ContactsIcon,
  Notes as NotesIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { colors } from "../../theme/theme";

const RIGHT_SIDEBAR_WIDTH = 56;
const RIGHT_SIDEBAR_EXPANDED_WIDTH = 320;

interface SidebarItem {
  id: string;
  icon: React.ReactNode;
  label: string;
}

const sidebarItems: SidebarItem[] = [
  {
    id: "calendar",
    icon: <CalendarIcon />,
    label: "Calendar",
  },
  {
    id: "keep",
    icon: <NotesIcon />,
    label: "Keep",
  },
  {
    id: "tasks",
    icon: <TasksIcon />,
    label: "Tasks",
  },
  {
    id: "contacts",
    icon: <ContactsIcon />,
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
        sx={{
          position: "fixed",
          right: 0,
          top: 64, // Match TopBar height
          width: RIGHT_SIDEBAR_WIDTH,
          height: "calc(100vh - 64px)",
          borderLeft: "none",
          backgroundColor: "#F9FAFD",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 1,
          zIndex: (theme) => theme.zIndex.drawer - 1,
        }}
      >
        {sidebarItems.map((item) => (
          <Tooltip key={item.id} title={item.label} placement="left">
            <IconButton
              onClick={() => handleItemClick(item.id)}
              sx={{
                width: 40,
                height: 40,
                my: 0.5,
                color:
                  selectedItem === item.id ? colors.primary : "text.secondary",
                backgroundColor:
                  selectedItem === item.id ? colors.selected : "transparent",
                "&:hover": {
                  backgroundColor:
                    selectedItem === item.id ? colors.selected : colors.hover,
                },
              }}
            >
              {item.icon}
            </IconButton>
          </Tooltip>
        ))}

        <Divider sx={{ width: "80%", my: 1 }} />

        <Tooltip title="Get Add-ons" placement="left">
          <IconButton
            sx={{
              width: 40,
              height: 40,
              my: 0.5,
              color: "text.secondary",
              "&:hover": {
                backgroundColor: colors.hover,
              },
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
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
            backgroundColor: "#F9FAFD",
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
