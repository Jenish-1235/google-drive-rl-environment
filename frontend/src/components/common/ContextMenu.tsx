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
import { useState } from 'react';
import { OpenWithSubmenu } from './OpenWithSubmenu';
import { ShareSubmenu } from './ShareSubmenu';
import { OrganiseSubmenu } from './OrganiseSubmenu';
import { FileInformationSubmenu } from './FileInformationSubmenu';
import type { DriveItem } from '../../types/file.types';

interface ContextMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  file: DriveItem | null;
  onClose: () => void;
  showOpenWith?: boolean;
  onDownload?: (file: DriveItem) => void;
  onRename?: (file: DriveItem) => void;
  onCopy?: (file: DriveItem) => void;
  onShare?: (file: DriveItem) => void;
  onOrganise?: (file: DriveItem) => void;
  onDetails?: (file: DriveItem) => void;
  onDelete?: (file: DriveItem) => void;
}

export const ContextMenu = ({
  anchorEl,
  open,
  file,
  onClose,
  showOpenWith = true,
  onDownload,
  onRename,
  onCopy,
  onShare,
  onOrganise,
  onDetails,
  onDelete,
}: ContextMenuProps) => {
  const [openWithAnchor, setOpenWithAnchor] = useState<HTMLElement | null>(null);
  const [shareAnchor, setShareAnchor] = useState<HTMLElement | null>(null);
  const [organiseAnchor, setOrganiseAnchor] = useState<HTMLElement | null>(null);
  const [infoAnchor, setInfoAnchor] = useState<HTMLElement | null>(null);

  const handleAction = (action?: (file: DriveItem) => void) => {
    onClose();
    setOpenWithAnchor(null);
    setShareAnchor(null);
    setOrganiseAnchor(null);
    setInfoAnchor(null);
    if (action && file) {
      action(file);
    }
  };

  const handleOpenWithHover = (event: React.MouseEvent<HTMLElement>) => {
    // Clear other submenus
    setShareAnchor(null);
    setOrganiseAnchor(null);
    setInfoAnchor(null);
    setOpenWithAnchor(event.currentTarget);
  };

  const handleShareHover = (event: React.MouseEvent<HTMLElement>) => {
    // Clear other submenus
    setOpenWithAnchor(null);
    setOrganiseAnchor(null);
    setInfoAnchor(null);
    setShareAnchor(event.currentTarget);
  };

  const handleOrganiseHover = (event: React.MouseEvent<HTMLElement>) => {
    // Clear other submenus
    setOpenWithAnchor(null);
    setShareAnchor(null);
    setInfoAnchor(null);
    setOrganiseAnchor(event.currentTarget);
  };

  const handleInfoHover = (event: React.MouseEvent<HTMLElement>) => {
    // Clear other submenus
    setOpenWithAnchor(null);
    setShareAnchor(null);
    setOrganiseAnchor(null);
    setInfoAnchor(event.currentTarget);
  };

  const handleSubmenuClose = () => {
    setOpenWithAnchor(null);
    setShareAnchor(null);
    setOrganiseAnchor(null);
    setInfoAnchor(null);
  };

  const handleMainMenuClose = () => {
    onClose();
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
        open={open}
        onClose={handleMainMenuClose}
      slotProps={{
        paper: {
          elevation: 8,
          sx: {
            minWidth: 240,
            borderRadius: '8px',
            border: '1px solid #dadce0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1.25,
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
    >
      {/* Open with - only for files, not folders */}
      {showOpenWith && file.type !== 'folder' && (
        <>
          <MenuItem 
            onMouseEnter={handleOpenWithHover}
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

      <MenuItem onClick={() => handleAction(onDownload)}>
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
      
      <MenuItem onClick={() => handleAction(onRename)}>
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

      <MenuItem onClick={() => handleAction(onCopy)}>
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

      <MenuItem onMouseEnter={handleShareHover}>
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

      <MenuItem onMouseEnter={handleOrganiseHover}>
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

      <MenuItem onMouseEnter={handleInfoHover}>
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

      <Divider />

      <MenuItem onClick={() => handleAction(onDelete)}>
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
    />

    {/* Share Submenu */}
    <ShareSubmenu
      anchorEl={shareAnchor}
      open={Boolean(shareAnchor)}
      onClose={handleSubmenuClose}
      file={file}
    />

    {/* Organise Submenu */}
    <OrganiseSubmenu
      anchorEl={organiseAnchor}
      open={Boolean(organiseAnchor)}
      onClose={handleSubmenuClose}
      file={file}
    />

    {/* File Information Submenu */}
    <FileInformationSubmenu
      anchorEl={infoAnchor}
      open={Boolean(infoAnchor)}
      onClose={handleSubmenuClose}
      file={file}
    />
    </>
  );
};