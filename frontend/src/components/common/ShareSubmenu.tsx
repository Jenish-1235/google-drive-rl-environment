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
}

export const ShareSubmenu = ({
  anchorEl,
  open,
  onClose,
  file,
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
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      slotProps={{
        paper: {
          elevation: 8,
          sx: {
            minWidth: 200,
            borderRadius: '8px',
            border: '1px solid #dadce0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out',
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
          },
        },
      }}
      TransitionProps={{
        timeout: 200,
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