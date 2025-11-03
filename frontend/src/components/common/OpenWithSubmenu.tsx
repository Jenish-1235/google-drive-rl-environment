import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import {
  Visibility as PreviewIcon,
  OpenInNew as OpenInNewIcon,
  Add as ConnectMoreIcon,
} from "@mui/icons-material";
import { useUIStore } from "../../store/uiStore";

interface OpenWithSubmenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  file: any;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const OpenWithSubmenu = ({
  anchorEl,
  open,
  onClose,
  file,
  onMouseEnter,
  onMouseLeave,
}: OpenWithSubmenuProps) => {
  const showSnackbar = useUIStore((state) => state.showSnackbar);

  const handlePreview = () => {
    showSnackbar("Preview feature coming soon!", "info");
    onClose();
  };

  const handleOpenNewTab = () => {
    showSnackbar("Open in new tab feature coming soon!", "info");
    onClose();
  };

  const handleGoogleDocs = () => {
    showSnackbar("Google Docs integration coming soon!", "info");
    onClose();
  };

  const handleLuminPdf = () => {
    showSnackbar("Lumin PDF integration coming soon!", "info");
    onClose();
  };

  const handleDocHub = () => {
    showSnackbar("DocHub integration coming soon!", "info");
    onClose();
  };

  const handleConnectMore = () => {
    showSnackbar("Connect more apps feature coming soon!", "info");
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
            minWidth: 260,
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
            "& .MuiDivider-root": {
              borderColor: "#e8eaed",
              my: 0.5,
            },
          },
        },
      }}
      TransitionProps={{
        timeout: 100,
      }}
    >
      {/* Preview */}
      <MenuItem onClick={handlePreview}>
        <ListItemIcon>
          <PreviewIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary="Preview"
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
          Ctrl+Alt+P
        </Typography>
      </MenuItem>

      {/* Open in new tab */}
      <MenuItem onClick={handleOpenNewTab}>
        <ListItemIcon>
          <OpenInNewIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary="Open in new tab"
          primaryTypographyProps={{
            fontSize: "14px",
            fontWeight: 400,
            color: "#202124",
          }}
        />
      </MenuItem>

      <Divider />

      {/* Google Docs */}
      <MenuItem onClick={handleGoogleDocs}>
        <ListItemIcon>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: "2px",
              backgroundColor: "#4285f4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
          </Box>
        </ListItemIcon>
        <ListItemText
          primary="Google Docs"
          primaryTypographyProps={{
            fontSize: "14px",
            fontWeight: 400,
            color: "#202124",
          }}
        />
      </MenuItem>

      <Divider />

      {/* Suggested apps header */}
      <Box sx={{ px: 2, py: 1 }}>
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 500,
            color: "#5f6368",
            textTransform: "none",
          }}
        >
          Suggested apps
        </Typography>
      </Box>

      {/* Lumin PDF */}
      <MenuItem onClick={handleLuminPdf}>
        <ListItemIcon>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: "2px",
              backgroundColor: "#e53e3e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "10px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              L
            </Typography>
          </Box>
        </ListItemIcon>
        <ListItemText
          primary="Lumin PDF - Edit or Sign Documents"
          primaryTypographyProps={{
            fontSize: "14px",
            fontWeight: 400,
            color: "#202124",
          }}
        />
      </MenuItem>

      {/* DocHub */}
      <MenuItem onClick={handleDocHub}>
        <ListItemIcon>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: "2px",
              backgroundColor: "#4285f4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "10px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              D
            </Typography>
          </Box>
        </ListItemIcon>
        <ListItemText
          primary="DocHub - PDF Sign and Edit"
          primaryTypographyProps={{
            fontSize: "14px",
            fontWeight: 400,
            color: "#202124",
          }}
        />
      </MenuItem>

      <Divider />

      {/* Connect more apps */}
      <MenuItem onClick={handleConnectMore}>
        <ListItemIcon>
          <ConnectMoreIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary="Connect more apps"
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
