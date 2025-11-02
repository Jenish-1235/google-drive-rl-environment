import { 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Typography,
  Divider,
  Box,
} from '@mui/material';
import {
  Visibility as PreviewIcon,
  OpenInNew as OpenInNewIcon,
  Add as ConnectMoreIcon,
} from '@mui/icons-material';

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
  const handleAction = (action: string) => {
    console.log(`Open with action: ${action} for file:`, file?.name);
    onClose();
    // TODO: Implement open with actions
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
            minWidth: 260,
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
            '& .MuiDivider-root': {
              borderColor: '#e8eaed',
              my: 0.5,
            },
          },
        },
      }}
      TransitionProps={{
        timeout: 200,
      }}
    >
      {/* Preview */}
      <MenuItem onClick={() => handleAction('preview')}>
        <ListItemIcon>
          <PreviewIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText 
          primary="Preview"
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
          Ctrl+Alt+P
        </Typography>
      </MenuItem>

      {/* Open in new tab */}
      <MenuItem onClick={() => handleAction('open-new-tab')}>
        <ListItemIcon>
          <OpenInNewIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText 
          primary="Open in new tab"
          primaryTypographyProps={{
            fontSize: '14px',
            fontWeight: 400,
            color: '#202124',
          }}
        />
      </MenuItem>

      <Divider />

      {/* Google Docs */}
      <MenuItem onClick={() => handleAction('google-docs')}>
        <ListItemIcon>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '2px',
              backgroundColor: '#4285f4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
            fontSize: '14px',
            fontWeight: 400,
            color: '#202124',
          }}
        />
      </MenuItem>

      <Divider />

      {/* Suggested apps header */}
      <Box sx={{ px: 2, py: 1 }}>
        <Typography
          sx={{
            fontSize: '12px',
            fontWeight: 500,
            color: '#5f6368',
            textTransform: 'none',
          }}
        >
          Suggested apps
        </Typography>
      </Box>

      {/* Lumin PDF */}
      <MenuItem onClick={() => handleAction('lumin-pdf')}>
        <ListItemIcon>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '2px',
              backgroundColor: '#e53e3e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: '10px',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              L
            </Typography>
          </Box>
        </ListItemIcon>
        <ListItemText 
          primary="Lumin PDF - Edit or Sign Documents"
          primaryTypographyProps={{
            fontSize: '14px',
            fontWeight: 400,
            color: '#202124',
          }}
        />
      </MenuItem>

      {/* DocHub */}
      <MenuItem onClick={() => handleAction('dochub')}>
        <ListItemIcon>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '2px',
              backgroundColor: '#4285f4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: '10px',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              D
            </Typography>
          </Box>
        </ListItemIcon>
        <ListItemText 
          primary="DocHub - PDF Sign and Edit"
          primaryTypographyProps={{
            fontSize: '14px',
            fontWeight: 400,
            color: '#202124',
          }}
        />
      </MenuItem>

      <Divider />

      {/* Connect more apps */}
      <MenuItem onClick={() => handleAction('connect-more')}>
        <ListItemIcon>
          <ConnectMoreIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText 
          primary="Connect more apps"
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