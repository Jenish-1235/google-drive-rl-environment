import { Menu, MenuItem, ListItemIcon, ListItemText, Divider, Typography, Chip } from '@mui/material';
import {
  OpenWith,
  GetApp,
  DriveFileRenameOutline,
  FileCopy,
  AutoAwesome,
  Share,
  DriveFileMove,
  InfoOutlined,
  CloudDownload,
  Delete,
  ChevronRight,
} from '@mui/icons-material';
import type { DriveItem } from '../../types/file.types';

interface ContextMenuProps {
  anchorPosition: { top: number; left: number } | null;
  file: DriveItem | null;
  open: boolean;
  onClose: () => void;
  onOpen?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  onMove?: () => void;
  onRename?: () => void;
  onCopy?: () => void;
  onToggleStar?: () => void;
  onDelete?: () => void;
  onDetails?: () => void;
  onOrganize?: () => void;
  onMakeOffline?: () => void;
  onSummarize?: () => void;
}

export const ContextMenu = ({
  anchorPosition,
  file,
  open,
  onClose,
  onOpen,
  onShare,
  onDownload,
  onMove,
  onRename,
  onCopy,
  onDelete,
  onDetails,
  onMakeOffline,
  onSummarize,
}: ContextMenuProps) => {
  if (!file) return null;

  const handleAction = (action?: () => void) => {
    onClose();
    if (action) action();
  };

  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition || undefined}
      slotProps={{
        paper: {
          sx: {
            minWidth: 280,
            maxWidth: 320,
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            borderRadius: '8px',
            '& .MuiList-root': {
              py: 0.5,
            },
          },
        },
      }}
    >
      {/* Open with */}
      {file.type !== 'folder' && (
        <MenuItem
          onClick={() => handleAction(onOpen)}
          sx={{
            px: 2,
            py: 1,
            minHeight: 36,
            '&:hover': {
              backgroundColor: '#f1f3f4',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <OpenWith sx={{ fontSize: 20, color: '#5f6368' }} />
          </ListItemIcon>
          <ListItemText
            primary="Open with"
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: 400,
              color: '#3c4043',
            }}
          />
          <ChevronRight sx={{ fontSize: 20, color: '#5f6368', ml: 1 }} />
        </MenuItem>
      )}

      {/* Download */}
      {file.type !== 'folder' && (
        <MenuItem
          onClick={() => handleAction(onDownload)}
          sx={{
            px: 2,
            py: 1,
            minHeight: 36,
            '&:hover': {
              backgroundColor: '#f1f3f4',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <GetApp sx={{ fontSize: 20, color: '#5f6368' }} />
          </ListItemIcon>
          <ListItemText
            primary="Download"
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: 400,
              color: '#3c4043',
            }}
          />
        </MenuItem>
      )}

      {/* Rename */}
      <MenuItem
        onClick={() => handleAction(onRename)}
        sx={{
          px: 2,
          py: 1,
          minHeight: 36,
          '&:hover': {
            backgroundColor: '#f1f3f4',
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>
          <DriveFileRenameOutline sx={{ fontSize: 20, color: '#5f6368' }} />
        </ListItemIcon>
        <ListItemText
          primary="Rename"
          primaryTypographyProps={{
            fontSize: 14,
            fontWeight: 400,
            color: '#3c4043',
          }}
        />
        <Typography
          variant="caption"
          sx={{
            color: '#5f6368',
            fontSize: 11,
            ml: 2,
          }}
        >
          Ctrl+Alt+E
        </Typography>
      </MenuItem>

      {/* Make a copy */}
      <MenuItem
        onClick={() => handleAction(onCopy)}
        sx={{
          px: 2,
          py: 1,
          minHeight: 36,
          '&:hover': {
            backgroundColor: '#f1f3f4',
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>
          <FileCopy sx={{ fontSize: 20, color: '#5f6368' }} />
        </ListItemIcon>
        <ListItemText
          primary="Make a copy"
          primaryTypographyProps={{
            fontSize: 14,
            fontWeight: 400,
            color: '#3c4043',
          }}
        />
        <Typography
          variant="caption"
          sx={{
            color: '#5f6368',
            fontSize: 11,
            ml: 1,
            whiteSpace: 'nowrap',
          }}
        >
          Ctrl+C Ctrl+V
        </Typography>
      </MenuItem>

      {/* Summarize this file (with New badge) */}
      {file.type !== 'folder' && (
        <MenuItem
          onClick={() => handleAction(onSummarize)}
          sx={{
            px: 2,
            py: 1,
            minHeight: 36,
            '&:hover': {
              backgroundColor: '#f1f3f4',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <AutoAwesome sx={{ fontSize: 20, color: '#5f6368' }} />
          </ListItemIcon>
          <ListItemText
            primary="Summarize this file"
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: 400,
              color: '#3c4043',
            }}
          />
          <Chip
            label="New"
            size="small"
            sx={{
              height: 20,
              fontSize: 11,
              fontWeight: 500,
              backgroundColor: '#1a73e8',
              color: '#fff',
              ml: 1,
              '& .MuiChip-label': {
                px: 1,
              },
            }}
          />
        </MenuItem>
      )}

      <Divider sx={{ my: 0.5 }} />

      {/* Share */}
      <MenuItem
        onClick={() => handleAction(onShare)}
        sx={{
          px: 2,
          py: 1,
          minHeight: 36,
          '&:hover': {
            backgroundColor: '#f1f3f4',
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>
          <Share sx={{ fontSize: 20, color: '#5f6368' }} />
        </ListItemIcon>
        <ListItemText
          primary="Share"
          primaryTypographyProps={{
            fontSize: 14,
            fontWeight: 400,
            color: '#3c4043',
          }}
        />
        <ChevronRight sx={{ fontSize: 20, color: '#5f6368', ml: 1 }} />
      </MenuItem>

      {/* Move */}
      <MenuItem
        onClick={() => handleAction(onMove)}
        sx={{
          px: 2,
          py: 1,
          minHeight: 36,
          '&:hover': {
            backgroundColor: '#f1f3f4',
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>
          <DriveFileMove sx={{ fontSize: 20, color: '#5f6368' }} />
        </ListItemIcon>
        <ListItemText
          primary="Move"
          primaryTypographyProps={{
            fontSize: 14,
            fontWeight: 400,
            color: '#3c4043',
          }}
        />
      </MenuItem>

      {/* File information */}
      <MenuItem
        onClick={() => handleAction(onDetails)}
        sx={{
          px: 2,
          py: 1,
          minHeight: 36,
          '&:hover': {
            backgroundColor: '#f1f3f4',
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>
          <InfoOutlined sx={{ fontSize: 20, color: '#5f6368' }} />
        </ListItemIcon>
        <ListItemText
          primary="File information"
          primaryTypographyProps={{
            fontSize: 14,
            fontWeight: 400,
            color: '#3c4043',
          }}
        />
        <ChevronRight sx={{ fontSize: 20, color: '#5f6368', ml: 1 }} />
      </MenuItem>

      {/* Make available offline */}
      <MenuItem
        onClick={() => handleAction(onMakeOffline)}
        sx={{
          px: 2,
          py: 1,
          minHeight: 36,
          '&:hover': {
            backgroundColor: '#f1f3f4',
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>
          <CloudDownload sx={{ fontSize: 20, color: '#5f6368' }} />
        </ListItemIcon>
        <ListItemText
          primary="Make available offline"
          primaryTypographyProps={{
            fontSize: 14,
            fontWeight: 400,
            color: '#3c4043',
          }}
        />
      </MenuItem>

      <Divider sx={{ my: 0.5 }} />

      {/* Move to trash */}
      <MenuItem
        onClick={() => handleAction(onDelete)}
        sx={{
          px: 2,
          py: 1,
          minHeight: 36,
          '&:hover': {
            backgroundColor: '#f1f3f4',
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>
          <Delete sx={{ fontSize: 20, color: '#5f6368' }} />
        </ListItemIcon>
        <ListItemText
          primary="Move to trash"
          primaryTypographyProps={{
            fontSize: 14,
            fontWeight: 400,
            color: '#3c4043',
          }}
        />
        <Typography
          variant="caption"
          sx={{
            color: '#5f6368',
            fontSize: 11,
            ml: 2,
          }}
        >
          Delete
        </Typography>
      </MenuItem>
    </Menu>
  );
};
