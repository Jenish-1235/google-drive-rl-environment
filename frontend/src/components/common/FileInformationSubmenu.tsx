import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  InfoOutlined as DetailsIcon,
  Security as SecurityIcon,
  Timeline as ActivityIcon,
  FolderOpen as ShowLocationIcon,
  History as ManageVersionsIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { useUIStore } from "../../store/uiStore";

interface FileInformationSubmenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  file: any;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const FileInformationSubmenu = ({
  anchorEl,
  open,
  onClose,
  file,
  onMouseEnter,
  onMouseLeave,
}: FileInformationSubmenuProps) => {
  const showSnackbar = useUIStore((state) => state.showSnackbar);
  const openModal = useUIStore((state) => state.openModal);
  const setDetailsPanelOpen = useUIStore((state) => state.setDetailsPanelOpen);

  const handleDetails = () => {
    setDetailsPanelOpen(true);
    onClose();
  };

  const handleSecurity = () => {
    showSnackbar("Security limitations feature coming soon!", "info");
    onClose();
  };

  const handleActivity = () => {
    showSnackbar("Activity feature coming soon!", "info");
    onClose();
  };

  const handleShowLocation = () => {
    showSnackbar("Show file location feature coming soon!", "info");
    onClose();
  };

  const handleManageVersions = () => {
    showSnackbar("Manage versions feature coming soon!", "info");
    onClose();
  };

  const handleLock = () => {
    showSnackbar("Lock feature coming soon!", "info");
    onClose();
  };

  if (!file) return null;

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disableAutoFocusItem
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      slotProps={{
        paper: {
          elevation: 8,
          sx: {
            minWidth: 240,
            borderRadius: "4px",
            border: "1px solid #dadce0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            ml: 0, // Remove left margin to bring submenu closer
            pointerEvents: "auto",
            "& .MuiMenuItem-root": {
              px: 2,
              py: 1,
              fontSize: "14px",
              color: "#202124",
              "&:hover": {
                backgroundColor: "#f8f9fa",
              },
            },
            "& .MuiListItemIcon-root": {
              minWidth: 40,
              color: "#5f6368",
            },
          },
        },
      }}
      TransitionProps={{
        timeout: 100,
      }}
    >
      {/* Details */}
      <MenuItem onClick={handleDetails}>
        <ListItemIcon>
          <DetailsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary="Details"
          primaryTypographyProps={{
            fontSize: "14px",
            fontWeight: 400,
            color: "#202124",
          }}
        />
        <Typography
          variant="caption"
          sx={{
            fontSize: "12px",
            color: "#5f6368",
            fontWeight: 400,
            ml: "auto",
          }}
        >
          Alt+V then D
        </Typography>
      </MenuItem>

      {/* Security limitations */}
      <MenuItem onClick={handleSecurity}>
        <ListItemIcon>
          <SecurityIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary="Security limitations"
          primaryTypographyProps={{
            fontSize: "14px",
            fontWeight: 400,
            color: "#202124",
          }}
        />
      </MenuItem>

      {/* Activity */}
      <MenuItem onClick={handleActivity}>
        <ListItemIcon>
          <ActivityIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary="Activity"
          primaryTypographyProps={{
            fontSize: "14px",
            fontWeight: 400,
            color: "#202124",
          }}
        />
        <Typography
          variant="caption"
          sx={{
            fontSize: "12px",
            color: "#5f6368",
            fontWeight: 400,
            ml: "auto",
          }}
        >
          Alt+V then A
        </Typography>
      </MenuItem>

      {/* Show file location */}
      <MenuItem onClick={handleShowLocation}>
        <ListItemIcon>
          <ShowLocationIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary="Show file location"
          primaryTypographyProps={{
            fontSize: "14px",
            fontWeight: 400,
            color: "#202124",
          }}
        />
      </MenuItem>

      {/* Manage versions */}
      <MenuItem onClick={handleManageVersions}>
        <ListItemIcon>
          <ManageVersionsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary="Manage versions"
          primaryTypographyProps={{
            fontSize: "14px",
            fontWeight: 400,
            color: "#202124",
          }}
        />
      </MenuItem>

      {/* Lock */}
      <MenuItem onClick={handleLock}>
        <ListItemIcon>
          <LockIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary="Lock"
          primaryTypographyProps={{
            fontSize: "14px",
            fontWeight: 400,
            color: "#202124",
          }}
        />
      </MenuItem>
    </Menu>
  );
};
