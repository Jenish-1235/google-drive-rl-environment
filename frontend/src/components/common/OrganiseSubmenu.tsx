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
  DriveFileMove as MoveIcon,
  AddLink as AddShortcutIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useUIStore } from "../../store/uiStore";
import { fileService } from "../../services/fileService";
import { useFileStore } from "../../store/fileStore";

interface OrganiseSubmenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  file: any;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const OrganiseSubmenu = ({
  anchorEl,
  open,
  onClose,
  file,
  onMouseEnter,
  onMouseLeave,
}: OrganiseSubmenuProps) => {
  const FOLDER_COLORS: string[] = [
    "#8B6552",
    "#C16B68",
    "#F44336",
    "#FF6E40",
    "#FF9800",
    "#FFB300",
    "#FDD663",
    "#F4D06F",
    "#3D6DEB",
    "#7BAAF7",
    "#81D4FA",
    "#80CBC4",
    "#4CAF50",
    "#00897B",
    "#7CB342",
    "#C0CA33",
    "#1F1F1F",
    "#C8BEBB",
    "#C9A1A7",
    "#F48FB1",
    "#BA68C8",
    "#9575CD",
    "#7986CB",
    "#9FA8DA",
  ];

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const showSnackbar = useUIStore((state) => state.showSnackbar);
  const openModal = useUIStore((state) => state.openModal);
  const refreshFiles = useFileStore((state) => state.refreshFiles);

  const handleMove = () => {
    openModal("move", { files: [file] });
    onClose();
  };

  const handleStar = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      await fileService.starFile(file.id, !file.isStarred);
      showSnackbar(
        file.isStarred ? "Removed from starred" : "Added to starred",
        "success"
      );
      await refreshFiles();
      onClose();
    } catch (error) {
      console.error("Failed to update starred status:", error);
      showSnackbar(
        "Failed to update starred status. Please try again.",
        "error"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddShortcut = () => {
    showSnackbar("Shortcuts feature coming soon!", "info");
    onClose();
  };

  const handleSelectColor = (color: string) => {
    setSelectedColor(color);
    showSnackbar("Folder colors feature coming soon!", "info");
    onClose();
    // TODO: Implement folder color API when available
    // This could be stored in localStorage or as a file metadata field
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
              "&:disabled": {
                opacity: 0.5,
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
      {/* Move */}
      <MenuItem onClick={handleMove} disabled={isProcessing}>
        <ListItemIcon>
          <MoveIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary="Move"
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
          Ctrl+Alt+M
        </Typography>
      </MenuItem>

      {/* Add shortcut */}
      <MenuItem onClick={handleAddShortcut} disabled={isProcessing}>
        <ListItemIcon>
          <AddShortcutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary="Add shortcut"
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
          Ctrl+Alt+R
        </Typography>
      </MenuItem>

      {/* Add to/remove from starred */}
      <MenuItem onClick={handleStar} disabled={isProcessing}>
        <ListItemIcon>
          {file.isStarred ? (
            <StarIcon fontSize="small" sx={{ color: "#f4b400" }} />
          ) : (
            <StarBorderIcon fontSize="small" />
          )}
        </ListItemIcon>
        <ListItemText
          primary={file.isStarred ? "Remove from starred" : "Add to starred"}
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
          Ctrl+Alt+S
        </Typography>
      </MenuItem>

      <Divider />

      {/* Folder colour section */}
      <Box sx={{ px: 1, pt: 0.5, pb: 1 }}>
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 400,
            color: "#202124",
            mb: 0.75,
          }}
        >
          Folder colour
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(8, 26px)",
            gap: "6px",
            width: "fit-content",
            mx: "auto",
          }}
        >
          {FOLDER_COLORS.map((c, idx) => (
            <Box
              key={`${c}-${idx}`}
              role="button"
              aria-label={`Choose folder colour ${c}`}
              tabIndex={0}
              onClick={() => !isProcessing && handleSelectColor(c)}
              onKeyDown={(e) => {
                if (!isProcessing && (e.key === "Enter" || e.key === " ")) {
                  handleSelectColor(c);
                }
              }}
              sx={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                backgroundColor: c,
                border: "1.5px solid #fff",
                boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                cursor: isProcessing ? "not-allowed" : "pointer",
                position: "relative",
                outline: "none",
                transition: "transform 0.1s ease",
                opacity: isProcessing ? 0.5 : 1,
                "&:hover": {
                  transform: isProcessing ? "none" : "scale(1.1)",
                },
                "&:focus-visible": {
                  boxShadow: "0 0 0 2px #1a73e8",
                },
              }}
            >
              {selectedColor === c && (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 20.3 7.7l-1.4-1.4z"
                      fill="#ffffff"
                    />
                  </svg>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Menu>
  );
};
