import { 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Typography,
} from '@mui/material';
import {
  DriveFileMove as MoveIcon,
  AddLink as AddShortcutIcon,
  Star as StarIcon,
} from '@mui/icons-material';

interface OrganiseSubmenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  file: any;
}

export const OrganiseSubmenu = ({
  anchorEl,
  open,
  onClose,
  file,
}: OrganiseSubmenuProps) => {
  const handleAction = (action: string) => {
    console.log(`Organise action: ${action} for file:`, file?.name);
    onClose();
    // TODO: Implement organise actions
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
            minWidth: 240,
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
      {/* Move */}
      <MenuItem onClick={() => handleAction('move')}>
        <ListItemIcon>
          <MoveIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText 
          primary="Move"
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
          Ctrl+Alt+M
        </Typography>
      </MenuItem>

      {/* Add shortcut */}
      <MenuItem onClick={() => handleAction('add-shortcut')}>
        <ListItemIcon>
          <AddShortcutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText 
          primary="Add shortcut"
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
          Ctrl+Alt+R
        </Typography>
      </MenuItem>

      {/* Add to starred */}
      <MenuItem onClick={() => handleAction('add-to-starred')}>
        <ListItemIcon>
          <StarIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText 
          primary="Add to starred"
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
          Ctrl+Alt+S
        </Typography>
      </MenuItem>
    </Menu>
  );
};