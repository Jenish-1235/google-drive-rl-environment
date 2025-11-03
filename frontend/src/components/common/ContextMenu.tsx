import { 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Typography,
  Divider,
} from '@mui/material';
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
} from '@mui/icons-material';
import { useState, useRef } from 'react';
import { OpenWithSubmenu } from './OpenWithSubmenu';
import { ShareSubmenu } from './ShareSubmenu';
import { OrganiseSubmenu } from './OrganiseSubmenu';
import { FileInformationSubmenu } from './FileInformationSubmenu';
import type { DriveItem } from '../../types/file.types';

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
  const [openWithAnchor, setOpenWithAnchor] = useState<HTMLElement | null>(null);
  const [shareAnchor, setShareAnchor] = useState<HTMLElement | null>(null);
  const [organiseAnchor, setOrganiseAnchor] = useState<HTMLElement | null>(null);
  const [infoAnchor, setInfoAnchor] = useState<HTMLElement | null>(null);

  // Simple timer refs - one per submenu
  const openWithTimerRef = useRef<number | null>(null);
  const shareTimerRef = useRef<number | null>(null);
  const organiseTimerRef = useRef<number | null>(null);
  const infoTimerRef = useRef<number | null>(null);

  // Delay before closing submenu
  const CLOSE_DELAY = 300; // ms

  // Helper to clear a specific timer
  const clearTimer = (timerRef: React.MutableRefObject<number | null>) => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Helper to schedule closing a specific submenu
  const scheduleClose = (
    timerRef: React.MutableRefObject<number | null>,
    closeAction: () => void
  ) => {
    clearTimer(timerRef);
    timerRef.current = window.setTimeout(() => {
      closeAction();
      timerRef.current = null;
    }, CLOSE_DELAY);
  };

  const handleAction = (action?: (file: DriveItem) => void) => {
    onClose();
    clearTimer(openWithTimerRef);
    clearTimer(shareTimerRef);
    clearTimer(organiseTimerRef);
    clearTimer(infoTimerRef);
    setOpenWithAnchor(null);
    setShareAnchor(null);
    setOrganiseAnchor(null);
    setInfoAnchor(null);
    if (action && file) {
      action(file);
    }
  };

  // OpenWith submenu handlers
  const handleOpenWithHover = (event: React.MouseEvent<HTMLElement>) => {
    clearTimer(openWithTimerRef);
    setShareAnchor(null);
    setOrganiseAnchor(null);
    setInfoAnchor(null);
    setOpenWithAnchor(event.currentTarget);
  };
  const handleOpenWithLeave = () => {
    scheduleClose(openWithTimerRef, () => setOpenWithAnchor(null));
  };
  const handleOpenWithSubmenuEnter = () => {
    clearTimer(openWithTimerRef);
  };
  const handleOpenWithSubmenuLeave = () => {
    scheduleClose(openWithTimerRef, () => setOpenWithAnchor(null));
  };

  // Share submenu handlers
  const handleShareHover = (event: React.MouseEvent<HTMLElement>) => {
    clearTimer(shareTimerRef);
    setOpenWithAnchor(null);
    setOrganiseAnchor(null);
    setInfoAnchor(null);
    setShareAnchor(event.currentTarget);
  };
  const handleShareLeave = () => {
    scheduleClose(shareTimerRef, () => setShareAnchor(null));
  };
  const handleShareSubmenuEnter = () => {
    clearTimer(shareTimerRef);
  };
  const handleShareSubmenuLeave = () => {
    scheduleClose(shareTimerRef, () => setShareAnchor(null));
  };

  // Organise submenu handlers
  const handleOrganiseHover = (event: React.MouseEvent<HTMLElement>) => {
    clearTimer(organiseTimerRef);
    setOpenWithAnchor(null);
    setShareAnchor(null);
    setInfoAnchor(null);
    setOrganiseAnchor(event.currentTarget);
  };
  const handleOrganiseLeave = () => {
    scheduleClose(organiseTimerRef, () => setOrganiseAnchor(null));
  };
  const handleOrganiseSubmenuEnter = () => {
    clearTimer(organiseTimerRef);
  };
  const handleOrganiseSubmenuLeave = () => {
    scheduleClose(organiseTimerRef, () => setOrganiseAnchor(null));
  };

  // Info submenu handlers
  const handleInfoHover = (event: React.MouseEvent<HTMLElement>) => {
    clearTimer(infoTimerRef);
    setOpenWithAnchor(null);
    setShareAnchor(null);
    setOrganiseAnchor(null);
    setInfoAnchor(event.currentTarget);
  };
  const handleInfoLeave = () => {
    scheduleClose(infoTimerRef, () => setInfoAnchor(null));
  };
  const handleInfoSubmenuEnter = () => {
    clearTimer(infoTimerRef);
  };
  const handleInfoSubmenuLeave = () => {
    scheduleClose(infoTimerRef, () => setInfoAnchor(null));
  };

  const handleRegularItemHover = () => {
    // Clear all timers and close all submenus immediately
    clearTimer(openWithTimerRef);
    clearTimer(shareTimerRef);
    clearTimer(organiseTimerRef);
    clearTimer(infoTimerRef);
    setOpenWithAnchor(null);
    setShareAnchor(null);
    setOrganiseAnchor(null);
    setInfoAnchor(null);
  };

  const handleSubmenuClose = () => {
    clearTimer(openWithTimerRef);
    clearTimer(shareTimerRef);
    clearTimer(organiseTimerRef);
    clearTimer(infoTimerRef);
    setOpenWithAnchor(null);
    setShareAnchor(null);
    setOrganiseAnchor(null);
    setInfoAnchor(null);
  };

  const handleMainMenuClose = () => {
    onClose();
    clearTimer(openWithTimerRef);
    clearTimer(shareTimerRef);
    clearTimer(organiseTimerRef);
    clearTimer(infoTimerRef);
    setOpenWithAnchor(null);
    setShareAnchor(null);
    setOrganiseAnchor(null);
    setInfoAnchor(null);
  };

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
            borderRadius: '4px',
            border: '1px solid #dadce0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            py: 0.5,
            pointerEvents: 'auto',
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1,
              fontSize: '14px',
              color: '#202124',
              '&:hover': {
                backgroundColor: '#f8f9fa',
              },
            },
            '& .MuiListItemIcon-root': {
              minWidth: 40,
              color: '#5f6368',
            },
            '& .MuiDivider-root': {
              borderColor: '#e8eaed',
              my: 0,
            },
          },
        },
      }}
      TransitionProps={{
        timeout: 100,
      }}
    >
      {/* Open with - only for files, not folders */}
      {showOpenWith && file.type !== 'folder' && (
        <>
          <MenuItem 
            onMouseEnter={handleOpenWithHover}
            onMouseLeave={handleOpenWithLeave}
          >
            <ListItemIcon>
              <OpenWithIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Open with"
              primaryTypographyProps={{
                fontSize: '14px',
                fontWeight: 400,
                color: '#202124',
              }}
            />
            <ChevronRightIcon fontSize="small" sx={{ color: '#5f6368', ml: 'auto' }} />
          </MenuItem>
          <Divider />
        </>
      )}

      <MenuItem onClick={() => handleAction(onDownload)} onMouseEnter={handleRegularItemHover}>
        <ListItemIcon>
          <DownloadIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText 
          primary="Download"
          primaryTypographyProps={{
            fontSize: '14px',
            fontWeight: 400,
            color: '#202124',
          }}
        />
      </MenuItem>
      
      <MenuItem onClick={() => handleAction(onRename)} onMouseEnter={handleRegularItemHover}>
        <ListItemIcon>
          <RenameIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText 
          primary="Rename"
          primaryTypographyProps={{
            fontSize: '14px',
            fontWeight: 400,
            color: '#202124',
          }}
        />
        <Typography
          variant="caption"
          sx={{
            fontSize: '12px',
            color: '#5f6368',
            fontWeight: 400,
            ml: 'auto',
          }}
        >
          Ctrl+Alt+E
        </Typography>
      </MenuItem>

      <MenuItem onClick={() => handleAction(onCopy)} onMouseEnter={handleRegularItemHover}>
        <ListItemIcon>
          <CopyIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText 
          primary="Make a copy"
          primaryTypographyProps={{
            fontSize: '14px',
            fontWeight: 400,
            color: '#202124',
          }}
        />
        <Typography
          variant="caption"
          sx={{
            fontSize: '12px',
            color: '#5f6368',
            fontWeight: 400,
            ml: 'auto',
          }}
        >
          Ctrl+C Ctrl+V
        </Typography>
      </MenuItem>

      <Divider />

  <MenuItem onMouseEnter={handleShareHover} onMouseLeave={handleShareLeave}>
        <ListItemIcon>
          <ShareIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText 
          primary="Share"
          primaryTypographyProps={{
            fontSize: '14px',
            fontWeight: 400,
            color: '#202124',
          }}
        />
        <ChevronRightIcon fontSize="small" sx={{ color: '#5f6368', ml: 'auto' }} />
      </MenuItem>

  <MenuItem onMouseEnter={handleOrganiseHover} onMouseLeave={handleOrganiseLeave}>
        <ListItemIcon>
          <OrganiseIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText 
          primary="Organise"
          primaryTypographyProps={{
            fontSize: '14px',
            fontWeight: 400,
            color: '#202124',
          }}
        />
        <ChevronRightIcon fontSize="small" sx={{ color: '#5f6368', ml: 'auto' }} />
      </MenuItem>

  <MenuItem onMouseEnter={handleInfoHover} onMouseLeave={handleInfoLeave}>
        <ListItemIcon>
          <InfoIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText 
          primary="File information"
          primaryTypographyProps={{
            fontSize: '14px',
            fontWeight: 400,
            color: '#202124',
          }}
        />
        <ChevronRightIcon fontSize="small" sx={{ color: '#5f6368', ml: 'auto' }} />
      </MenuItem>

      <Divider sx={{ my: 0.5 }} />

      <MenuItem onClick={() => handleAction(onDelete)} onMouseEnter={handleRegularItemHover}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" sx={{ color: '#5f6368' }} />
        </ListItemIcon>
        <ListItemText 
          primary="Move to bin"
          primaryTypographyProps={{
            fontSize: '14px',
            fontWeight: 400,
            color: '#202124',
          }}
        />
        <Typography
          variant="caption"
          sx={{
            fontSize: '12px',
            color: '#5f6368',
            fontWeight: 400,
            ml: 'auto',
          }}
        >
          Delete
        </Typography>
      </MenuItem>
    </Menu>

    {/* Open With Submenu */}
    <OpenWithSubmenu
      anchorEl={openWithAnchor}
      open={Boolean(openWithAnchor)}
      onClose={handleSubmenuClose}
      file={file}
      onMouseEnter={handleOpenWithSubmenuEnter}
      onMouseLeave={handleOpenWithSubmenuLeave}
    />

    {/* Share Submenu */}
    <ShareSubmenu
      anchorEl={shareAnchor}
      open={Boolean(shareAnchor)}
      onClose={handleSubmenuClose}
      file={file}
      onMouseEnter={handleShareSubmenuEnter}
      onMouseLeave={handleShareSubmenuLeave}
    />

    {/* Organise Submenu */}
    <OrganiseSubmenu
      anchorEl={organiseAnchor}
      open={Boolean(organiseAnchor)}
      onClose={handleSubmenuClose}
      file={file}
      onMouseEnter={handleOrganiseSubmenuEnter}
      onMouseLeave={handleOrganiseSubmenuLeave}
    />

    {/* File Information Submenu */}
    <FileInformationSubmenu
      anchorEl={infoAnchor}
      open={Boolean(infoAnchor)}
      onClose={handleSubmenuClose}
      file={file}
      onMouseEnter={handleInfoSubmenuEnter}
      onMouseLeave={handleInfoSubmenuLeave}
    />
    </>
  );
};