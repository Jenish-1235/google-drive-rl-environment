import { Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import {
  OpenInNew as OpenIcon,
  Share as ShareIcon,
  GetApp as DownloadIcon,
  DriveFileMove as MoveIcon,
  Edit as RenameIcon,
  FileCopy as CopyIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Delete as DeleteIcon,
  InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import type { DriveItem } from '../../types/file.types';
import { colors } from '../../theme/theme';

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
  onToggleStar,
  onDelete,
  onDetails,
}: ContextMenuProps) => {
  if (!file) return null;

  const handleAction = (action: () => void | undefined) => {
    onClose();
    action?.();
  };

  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition || undefined}
      PaperProps={{
        sx: {
          minWidth: 220,
        },
      }}
    >
      {file.type !== 'folder' && (
        <MenuItem onClick={() => handleAction(onOpen!)}>
          <ListItemIcon>
            <OpenIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Open</ListItemText>
        </MenuItem>
      )}

      <MenuItem onClick={() => handleAction(onShare!)}>
        <ListItemIcon>
          <ShareIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Share</ListItemText>
      </MenuItem>

      {file.type !== 'folder' && (
        <MenuItem onClick={() => handleAction(onDownload!)}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
      )}

      <Divider />

      <MenuItem onClick={() => handleAction(onRename!)}>
        <ListItemIcon>
          <RenameIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Rename</ListItemText>
      </MenuItem>

      <MenuItem onClick={() => handleAction(onMove!)}>
        <ListItemIcon>
          <MoveIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Move</ListItemText>
      </MenuItem>

      <MenuItem onClick={() => handleAction(onCopy!)}>
        <ListItemIcon>
          <CopyIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Make a copy</ListItemText>
      </MenuItem>

      <Divider />

      <MenuItem onClick={() => handleAction(onToggleStar!)}>
        <ListItemIcon>
          {file.isStarred ? (
            <StarIcon fontSize="small" sx={{ color: colors.warning }} />
          ) : (
            <StarBorderIcon fontSize="small" />
          )}
        </ListItemIcon>
        <ListItemText>{file.isStarred ? 'Remove from starred' : 'Add to starred'}</ListItemText>
      </MenuItem>

      <MenuItem onClick={() => handleAction(onDetails!)}>
        <ListItemIcon>
          <InfoIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>File information</ListItemText>
      </MenuItem>

      <Divider />

      <MenuItem onClick={() => handleAction(onDelete!)}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText sx={{ color: 'error.main' }}>Move to trash</ListItemText>
      </MenuItem>
    </Menu>
  );
};
