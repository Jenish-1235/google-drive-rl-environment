import { 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Typography,
} from '@mui/material';
import {
  Share as ShareIcon,
  Link as CopyLinkIcon,
} from '@mui/icons-material';

interface ShareSubmenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  file: any;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const ShareSubmenu = ({
  anchorEl,
  open,
  onClose,
  file,
  onMouseEnter,
  onMouseLeave,
}: ShareSubmenuProps) => {
  const handleAction = (action: string) => {
    console.log(`Share action: ${action} for file:`, file?.name);
    onClose();
    // TODO: Implement share actions
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
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      slotProps={{
        paper: {
          elevation: 8,
          sx: {
            minWidth: 180,
            borderRadius: '4px',
            border: '1px solid #dadce0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            ml: -0.5,
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
          },
        },
      }}
      TransitionProps={{
        timeout: 100,
      }}
    >
      {/* Share */}
      <MenuItem onClick={() => handleAction('share')}>
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
        <Typography
          variant="caption"
          sx={{
            fontSize: '12px',
            color: '#5f6368',
            fontWeight: 400,
            ml: 'auto',
          }}
        >
          Ctrl+Alt+A
        </Typography>
      </MenuItem>

      {/* Copy link */}
      <MenuItem onClick={() => handleAction('copy-link')}>
        <ListItemIcon>
          <CopyLinkIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText 
          primary="Copy link"
          primaryTypographyProps={{
            fontSize: '14px',
            fontWeight: 400,
            color: '#202124',
          }}
        />
      </MenuItem>
    </Menu>
  );
};