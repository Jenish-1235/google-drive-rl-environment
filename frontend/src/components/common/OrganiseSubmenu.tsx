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
  DriveFileMove as MoveIcon,
  AddLink as AddShortcutIcon,
  Star as StarIcon,
} from '@mui/icons-material';

interface OrganiseSubmenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  file: any;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

import { useState } from 'react';

export const OrganiseSubmenu = ({
  anchorEl,
  open,
  onClose,
  file,
  onMouseEnter,
  onMouseLeave,
}: OrganiseSubmenuProps) => {
  // Simple local selection state; integrate with store later if needed
  const FOLDER_COLORS: string[] = [
    '#8B6552', '#C16B68', '#F44336', '#FF6E40', '#FF9800', '#FFB300', '#FDD663', '#F4D06F',
    '#3D6DEB', '#7BAAF7', '#81D4FA', '#80CBC4', '#4CAF50', '#00897B', '#7CB342', '#C0CA33',
    '#1F1F1F', '#C8BEBB', '#C9A1A7', '#F48FB1', '#BA68C8', '#9575CD', '#7986CB', '#9FA8DA'
  ];
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleSelectColor = (color: string) => {
    setSelectedColor(color);
    console.log('Folder color selected:', color, 'for', file?.name);
    // TODO: Wire to persistence/store when available
  };
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
            minWidth: 260,
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

      <Divider />

      {/* Folder colour section */}
      <Box sx={{ px: 1, pt: 0.5, pb: 1 }}>
        <Typography
          sx={{
            fontSize: '12px',
            fontWeight: 400,
            color: '#202124',
            mb: 0.75,
          }}
        >
          Folder colour
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 26px)',
            gap: '6px',
            width: 'fit-content',
            mx: 'auto',
          }}
        >
          {FOLDER_COLORS.map((c, idx) => (
            <Box
              key={`${c}-${idx}`}
              role="button"
              aria-label={`Choose folder colour ${c}`}
              tabIndex={0}
              onClick={() => handleSelectColor(c)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleSelectColor(c);
              }}
              sx={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                backgroundColor: c,
                border: '1.5px solid #fff',
                boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                cursor: 'pointer',
                position: 'relative',
                outline: 'none',
                transition: 'transform 0.1s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
                '&:focus-visible': {
                  boxShadow: '0 0 0 2px #1a73e8',
                },
              }}
            >
              {selectedColor === c && (
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 20.3 7.7l-1.4-1.4z" fill="#ffffff" />
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