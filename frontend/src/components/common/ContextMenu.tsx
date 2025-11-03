import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import {
  OpenInNew as OpenWithIcon,
  GetApp as DownloadIcon,
  Edit as RenameIcon,
  FileCopy as CopyIcon,
  Share as ShareIcon,
  Workspaces as OrganiseIcon,
  InfoOutlined as InfoIcon,
  DeleteOutline as DeleteIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { useState, useRef, useCallback } from "react";
import { OpenWithSubmenu } from "./OpenWithSubmenu";
import { ShareSubmenu } from "./ShareSubmenu";
import { OrganiseSubmenu } from "./OrganiseSubmenu";
import { FileInformationSubmenu } from "./FileInformationSubmenu";
import type { DriveItem } from "../../types/file.types";

interface ContextMenuProps {
  anchorEl?: HTMLElement | null;
  anchorPosition?: { top: number; left: number } | null;
  open: boolean;
  file: DriveItem | null;
  onClose: () => void;
  showOpenWith?: boolean;
  onOpen?: (file: DriveItem) => void;
  onDownload?: (file: DriveItem) => void;
  onRename?: (file: DriveItem) => void;
  onCopy?: (file: DriveItem) => void;
  onShare?: (file: DriveItem) => void;
  onOrganise?: (file: DriveItem) => void;
  onDetails?: (file: DriveItem) => void;
  onDelete?: (file: DriveItem) => void;
  onToggleStar?: (file: DriveItem) => void;
  onMove?: (file: DriveItem) => void;
  onMakeOffline?: (file: DriveItem) => void;
  onSummarize?: (file: DriveItem) => void;
}

export const ContextMenu = ({
  anchorEl,
  anchorPosition,
  open,
  file,
  onClose,
  showOpenWith = true,
  onOpen: _onOpen,
  onDownload,
  onRename,
  onCopy,
  onShare: _onShare,
  onOrganise: _onOrganise,
  onDetails: _onDetails,
  onDelete,
  onToggleStar: _onToggleStar,
  onMove: _onMove,
  onMakeOffline: _onMakeOffline,
  onSummarize: _onSummarize,
}: ContextMenuProps) => {
  const [openWithAnchor, setOpenWithAnchor] = useState<HTMLElement | null>(
    null
  );
  const [shareAnchor, setShareAnchor] = useState<HTMLElement | null>(null);
  const [organiseAnchor, setOrganiseAnchor] = useState<HTMLElement | null>(
    null
  );
  const [infoAnchor, setInfoAnchor] = useState<HTMLElement | null>(null);

  // Simplified hover state management
  const [hoveredMenuItem, setHoveredMenuItem] = useState<string | null>(null);
  const [isSubmenuHovered, setIsSubmenuHovered] = useState(false);
  const hoverTimeoutRef = useRef<number | null>(null);

  // Delays - reduced for more responsive feel like Google Drive
  const CLOSE_DELAY = 200; // ms - faster closing
  const OPEN_DELAY = 100; // ms - faster opening

  // Clear hover timeout
  const clearHoverTimeout = useCallback(() => {
    if (hoverTimeoutRef.current) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  // Handle menu item hover - unified for all submenu items
  const handleMenuItemHover = useCallback(
    (menuItem: string) => {
      clearHoverTimeout();
      setHoveredMenuItem(menuItem);

      // Schedule opening submenu with delay
      hoverTimeoutRef.current = window.setTimeout(() => {
        switch (menuItem) {
          case "open-with":
            setOpenWithAnchor(
              document.querySelector(
                `[data-menu-item="${menuItem}"]`
              ) as HTMLElement
            );
            break;
          case "share":
            setShareAnchor(
              document.querySelector(
                `[data-menu-item="${menuItem}"]`
              ) as HTMLElement
            );
            break;
          case "organise":
            setOrganiseAnchor(
              document.querySelector(
                `[data-menu-item="${menuItem}"]`
              ) as HTMLElement
            );
            break;
          case "info":
            setInfoAnchor(
              document.querySelector(
                `[data-menu-item="${menuItem}"]`
              ) as HTMLElement
            );
            break;
        }
      }, OPEN_DELAY);
    },
    [clearHoverTimeout]
  );

  // Handle menu item leave
  const handleMenuItemLeave = useCallback(() => {
    clearHoverTimeout();
    // Schedule closing submenu with delay
    hoverTimeoutRef.current = window.setTimeout(() => {
      if (!isSubmenuHovered) {
        setHoveredMenuItem(null);
        setOpenWithAnchor(null);
        setShareAnchor(null);
        setOrganiseAnchor(null);
        setInfoAnchor(null);
      }
    }, CLOSE_DELAY);
  }, [clearHoverTimeout, isSubmenuHovered, CLOSE_DELAY]);

  // Handle submenu enter
  const handleSubmenuEnter = useCallback(() => {
    clearHoverTimeout();
    setIsSubmenuHovered(true);
  }, [clearHoverTimeout]);

  // Handle submenu leave
  const handleSubmenuLeave = useCallback(() => {
    setIsSubmenuHovered(false);
    // Schedule closing submenu with delay
    hoverTimeoutRef.current = window.setTimeout(() => {
      if (!hoveredMenuItem) {
        setOpenWithAnchor(null);
        setShareAnchor(null);
        setOrganiseAnchor(null);
        setInfoAnchor(null);
      }
    }, CLOSE_DELAY);
  }, [hoveredMenuItem, CLOSE_DELAY]);

  const handleAction = useCallback(
    (action?: (file: DriveItem) => void) => {
      onClose();
      clearHoverTimeout();
      setOpenWithAnchor(null);
      setShareAnchor(null);
      setOrganiseAnchor(null);
      setInfoAnchor(null);
      setHoveredMenuItem(null);
      setIsSubmenuHovered(false);
      if (action && file) {
        action(file);
      }
    },
    [onClose, clearHoverTimeout, file]
  );

  // Click handlers for immediate submenu opening
  const handleOpenWithClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();
      clearHoverTimeout();
      setHoveredMenuItem("open-with");
      setOpenWithAnchor(event.currentTarget);
    },
    [clearHoverTimeout]
  );

  const handleShareClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();
      clearHoverTimeout();
      setHoveredMenuItem("share");
      setShareAnchor(event.currentTarget);
    },
    [clearHoverTimeout]
  );

  const handleOrganiseClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();
      clearHoverTimeout();
      setHoveredMenuItem("organise");
      setOrganiseAnchor(event.currentTarget);
    },
    [clearHoverTimeout]
  );

  const handleInfoClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();
      clearHoverTimeout();
      setHoveredMenuItem("info");
      setInfoAnchor(event.currentTarget);
    },
    [clearHoverTimeout]
  );

  const handleRegularItemHover = useCallback(() => {
    clearHoverTimeout();
    setHoveredMenuItem(null);
    setIsSubmenuHovered(false);
    setOpenWithAnchor(null);
    setShareAnchor(null);
    setOrganiseAnchor(null);
    setInfoAnchor(null);
  }, [clearHoverTimeout]);

  const handleSubmenuClose = useCallback(() => {
    clearHoverTimeout();
    setHoveredMenuItem(null);
    setIsSubmenuHovered(false);
    setOpenWithAnchor(null);
    setShareAnchor(null);
    setOrganiseAnchor(null);
    setInfoAnchor(null);
  }, [clearHoverTimeout]);

  const handleMainMenuClose = useCallback(() => {
    onClose();
    clearHoverTimeout();
    setHoveredMenuItem(null);
    setIsSubmenuHovered(false);
    setOpenWithAnchor(null);
    setShareAnchor(null);
    setOrganiseAnchor(null);
    setInfoAnchor(null);
  }, [onClose, clearHoverTimeout]);

  if (!file) return null;

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        anchorReference={anchorPosition ? "anchorPosition" : "anchorEl"}
        anchorPosition={anchorPosition || undefined}
        open={open}
        onClose={handleMainMenuClose}
        disableAutoFocusItem
        slotProps={{
          paper: {
            elevation: 8,
            sx: {
              minWidth: 260,
              borderRadius: "4px",
              border: "1px solid #dadce0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              py: 0.5,
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
                my: 0,
              },
            },
          },
        }}
        TransitionProps={{
          timeout: 100,
        }}
      >
        {[
          // Open with - only for files, not folders
          ...(showOpenWith && file.type !== "folder"
            ? [
                <MenuItem
                  key="open-with"
                  data-menu-item="open-with"
                  onMouseEnter={() => handleMenuItemHover("open-with")}
                  onMouseLeave={handleMenuItemLeave}
                  onClick={handleOpenWithClick}
                >
                  <ListItemIcon>
                    <OpenWithIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Open with"
                    primaryTypographyProps={{
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#202124",
                    }}
                  />
                  <ChevronRightIcon
                    fontSize="small"
                    sx={{ color: "#5f6368", ml: "auto" }}
                  />
                </MenuItem>,
                <Divider key="divider-1" />,
              ]
            : []),

          <MenuItem
            key="download"
            onClick={() => handleAction(onDownload)}
            onMouseEnter={handleRegularItemHover}
          >
            <ListItemIcon>
              <DownloadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Download"
              primaryTypographyProps={{
                fontSize: "14px",
                fontWeight: 400,
                color: "#202124",
              }}
            />
          </MenuItem>,

          <MenuItem
            key="rename"
            onClick={() => handleAction(onRename)}
            onMouseEnter={handleRegularItemHover}
          >
            <ListItemIcon>
              <RenameIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Rename"
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
              Ctrl+Alt+E
            </Typography>
          </MenuItem>,

          <MenuItem
            key="copy"
            onClick={() => handleAction(onCopy)}
            onMouseEnter={handleRegularItemHover}
          >
            <ListItemIcon>
              <CopyIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Make a copy"
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
              Ctrl+C Ctrl+V
            </Typography>
          </MenuItem>,

          <Divider key="divider-2" />,

          <MenuItem
            key="share"
            data-menu-item="share"
            onMouseEnter={() => handleMenuItemHover("share")}
            onMouseLeave={handleMenuItemLeave}
            onClick={handleShareClick}
          >
            <ListItemIcon>
              <ShareIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Share"
              primaryTypographyProps={{
                fontSize: "14px",
                fontWeight: 400,
                color: "#202124",
              }}
            />
            <ChevronRightIcon
              fontSize="small"
              sx={{ color: "#5f6368", ml: "auto" }}
            />
          </MenuItem>,

          <MenuItem
            key="organise"
            data-menu-item="organise"
            onMouseEnter={() => handleMenuItemHover("organise")}
            onMouseLeave={handleMenuItemLeave}
            onClick={handleOrganiseClick}
          >
            <ListItemIcon>
              <OrganiseIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Organise"
              primaryTypographyProps={{
                fontSize: "14px",
                fontWeight: 400,
                color: "#202124",
              }}
            />
            <ChevronRightIcon
              fontSize="small"
              sx={{ color: "#5f6368", ml: "auto" }}
            />
          </MenuItem>,

          <MenuItem
            key="info"
            data-menu-item="info"
            onMouseEnter={() => handleMenuItemHover("info")}
            onMouseLeave={handleMenuItemLeave}
            onClick={handleInfoClick}
          >
            <ListItemIcon>
              <InfoIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="File information"
              primaryTypographyProps={{
                fontSize: "14px",
                fontWeight: 400,
                color: "#202124",
              }}
            />
            <ChevronRightIcon
              fontSize="small"
              sx={{ color: "#5f6368", ml: "auto" }}
            />
          </MenuItem>,

          <Divider key="divider-3" sx={{ my: 0.5 }} />,

          <MenuItem
            key="delete"
            onClick={() => handleAction(onDelete)}
            onMouseEnter={handleRegularItemHover}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" sx={{ color: "#5f6368" }} />
            </ListItemIcon>
            <ListItemText
              primary="Move to bin"
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
              Delete
            </Typography>
          </MenuItem>,
        ]}
      </Menu>

      {/* Open With Submenu */}
      <OpenWithSubmenu
        anchorEl={openWithAnchor}
        open={Boolean(openWithAnchor)}
        onClose={handleSubmenuClose}
        file={file}
        onMouseEnter={handleSubmenuEnter}
        onMouseLeave={handleSubmenuLeave}
      />

      {/* Share Submenu */}
      <ShareSubmenu
        anchorEl={shareAnchor}
        open={Boolean(shareAnchor)}
        onClose={handleSubmenuClose}
        file={file}
        onMouseEnter={handleSubmenuEnter}
        onMouseLeave={handleSubmenuLeave}
      />

      {/* Organise Submenu */}
      <OrganiseSubmenu
        anchorEl={organiseAnchor}
        open={Boolean(organiseAnchor)}
        onClose={handleSubmenuClose}
        file={file}
        onMouseEnter={handleSubmenuEnter}
        onMouseLeave={handleSubmenuLeave}
      />

      {/* File Information Submenu */}
      <FileInformationSubmenu
        anchorEl={infoAnchor}
        open={Boolean(infoAnchor)}
        onClose={handleSubmenuClose}
        file={file}
        onMouseEnter={handleSubmenuEnter}
        onMouseLeave={handleSubmenuLeave}
      />
    </>
  );
};
