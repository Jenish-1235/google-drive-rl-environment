import { 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Typography,
} from '@mui/material';
import {
  InfoOutlined as DetailsIcon,
  Security as SecurityIcon,
  Timeline as ActivityIcon,
  FolderOpen as ShowLocationIcon,
  History as ManageVersionsIcon,
  Lock as LockIcon,
} from '@mui/icons-material';

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
  const handleAction = (action: string) => {
    console.log(`File information action: ${action} for file:`, file?.name);
    onClose();
    // TODO: Implement file information actions
  };

  if (!file) return null;

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
              px: 1,
              py: 0.5,
              fontSize: '14px',
              color: '#202124',
              '&:hover': {
                backgroundColor: '#f8f9fa',
              },
            },
            '& .MuiListItemIcon-root': {
              minWidth: 32,
              color: '#5f6368',
            },
          },
        },
      }}
      TransitionProps={{
        timeout: 200,
      }}
    >
      {/* Details */}
      <MenuItem onClick={() => handleAction('details')}>
        <ListItemIcon>
          <DetailsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText 
          primary="Details"
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
          Alt+V then D
        </Typography>
      </MenuItem>

      {/* Security limitations */}
      <MenuItem onClick={() => handleAction('security')}>
        <ListItemIcon>
          <SecurityIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText 
          primary="Security limitations"
          primaryTypographyProps={{
            fontSize: '14px',
            fontWeight: 400,
            color: '#202124',
          }}
        />
      </MenuItem>

      {/* Activity */}
      <MenuItem onClick={() => handleAction('activity')}>
        <ListItemIcon>
          <ActivityIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText 
          primary="Activity"
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
          Alt+V then A
        </Typography>
      </MenuItem>

      {/* Show file location */}
      <MenuItem onClick={() => handleAction('show-location')}>
        <ListItemIcon>
          <ShowLocationIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText 
          primary="Show file location"
          primaryTypographyProps={{
            fontSize: '14px',
            fontWeight: 400,
            color: '#202124',
          }}
        />
      </MenuItem>

      {/* Manage versions */}
      <MenuItem onClick={() => handleAction('manage-versions')}>
        <ListItemIcon>
          <ManageVersionsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText 
          primary="Manage versions"
          primaryTypographyProps={{
            fontSize: '14px',
            fontWeight: 400,
            color: '#202124',
          }}
        />
      </MenuItem>

      {/* Lock */}
      <MenuItem onClick={() => handleAction('lock')}>
        <ListItemIcon>
          <LockIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText 
          primary="Lock"
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