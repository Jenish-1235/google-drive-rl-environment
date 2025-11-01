import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
  Grid,
  alpha,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Share as ShareIcon,
  GetApp as DownloadIcon,
  DriveFileMove as MoveIcon,
  Edit as RenameIcon,
  Delete as DeleteIcon,
  InfoOutlined as InfoIcon,
  Folder as FolderIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { DriveItem } from '../../types/file.types';
import { useFileStore } from '../../store/fileStore';
import { getFileIcon } from '../../utils/fileIcons';
import { formatDate, formatFileSize } from '../../utils/formatters';
import { colors } from '../../theme/theme';
import { animations, getStaggerDelay } from '../../utils/animations';
import { EmptyState } from '../common/EmptyState';

interface FileGridProps {
  files: DriveItem[];
  onContextMenu?: (event: React.MouseEvent, file: DriveItem) => void;
  onFileClick?: (file: DriveItem) => void;
}

export const FileGrid = ({ files, onContextMenu, onFileClick }: FileGridProps) => {
  const navigate = useNavigate();
  const selectedFiles = useFileStore((state) => state.selectedFiles);
  const toggleFileSelection = useFileStore((state) => state.toggleFileSelection);
  const updateFile = useFileStore((state) => state.updateFile);

  const [actionMenuAnchor, setActionMenuAnchor] = useState<{
    element: HTMLElement;
    fileId: string;
  } | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleFileClick = (file: DriveItem) => {
    if (file.type === 'folder') {
      // Always navigate for folders
      navigate(`/folder/${file.id}`);
    } else if (onFileClick) {
      // Use custom handler for files if provided
      onFileClick(file);
    }
    // If no custom handler and not a folder, do nothing
  };

  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, fileId: string) => {
    event.stopPropagation();
    setActionMenuAnchor({ element: event.currentTarget, fileId });
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
  };

  const handleToggleStar = (event: React.MouseEvent, fileId: string) => {
    event.stopPropagation();
    const file = files.find((f) => f.id === fileId);
    if (file) {
      updateFile(fileId, { isStarred: !file.isStarred });
    }
  };

  const handleSelectFile = (event: React.MouseEvent, fileId: string) => {
    event.stopPropagation();
    toggleFileSelection(fileId);
  };

  const handleAction = (action: string) => {
    console.log(`Action: ${action} on file:`, actionMenuAnchor?.fileId);
    handleActionMenuClose();
    // TODO: Implement actions
  };

  const isSelected = (fileId: string) => selectedFiles.includes(fileId);

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>
        {files.map((file, index) => {
          const selected = isSelected(file.id);
          const hovered = hoveredCard === file.id;

          return (
            <Grid item xs={6} sm={4} md={3} lg={2} key={file.id}>
              <Card
                onMouseEnter={() => setHoveredCard(file.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleFileClick(file)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  onContextMenu?.(e, file);
                }}
                sx={{
                  cursor: 'pointer',
                  position: 'relative',
                  height: 220,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  backgroundColor: selected ? alpha(colors.primary, 0.08) : 'background.paper',
                  '&:hover': {
                    boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
                    borderColor: selected ? colors.primary : colors.border,
                  },
                  ...animations.scaleIn,
                  ...getStaggerDelay(index, 25),
                }}
              >
                {/* Checkbox */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    zIndex: 1,
                    opacity: selected || hovered ? 1 : 0,
                    transition: 'opacity 0.2s',
                  }}
                >
                  <Checkbox
                    checked={selected}
                    onChange={(e) => handleSelectFile(e as any, file.id)}
                    size="small"
                    sx={{
                      backgroundColor: 'background.paper',
                      borderRadius: '2px',
                      '&:hover': {
                        backgroundColor: 'background.paper',
                      },
                    }}
                  />
                </Box>

                {/* Star Icon */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 40,
                    zIndex: 1,
                    opacity: file.isStarred || hovered ? 1 : 0,
                    transition: 'opacity 0.2s',
                  }}
                >
                  <Tooltip title={file.isStarred ? 'Remove star' : 'Add star'}>
                    <IconButton
                      size="small"
                      onClick={(e) => handleToggleStar(e, file.id)}
                      sx={{
                        backgroundColor: 'background.paper',
                        '&:hover': {
                          backgroundColor: 'background.paper',
                        },
                      }}
                    >
                      {file.isStarred ? (
                        <StarIcon sx={{ fontSize: 20, color: colors.warning }} />
                      ) : (
                        <StarBorderIcon sx={{ fontSize: 20 }} />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* More Actions */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 1,
                    opacity: hovered ? 1 : 0,
                    transition: 'opacity 0.2s',
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => handleActionMenuOpen(e, file.id)}
                    sx={{
                      backgroundColor: 'background.paper',
                      '&:hover': {
                        backgroundColor: 'background.paper',
                      },
                    }}
                  >
                    <MoreVertIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>

                {/* Thumbnail/Icon */}
                <CardMedia
                  sx={{
                    height: 140,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.surfaceVariant,
                  }}
                >
                  {file.type === 'folder' ? (
                    <FolderIcon sx={{ fontSize: 80, color: colors.fileTypes.folder }} />
                  ) : (
                    <Box sx={{ '& > svg': { fontSize: 64 } }}>{getFileIcon(file.type)}</Box>
                  )}
                </CardMedia>

                {/* File Info */}
                <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Tooltip title={file.name} placement="bottom-start">
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{
                        fontWeight: 500,
                        mb: 0.5,
                      }}
                    >
                      {file.name}
                    </Typography>
                  </Tooltip>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {formatDate(file.modifiedTime)}
                    </Typography>
                    {file.type !== 'folder' && (
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize((file as any).size || 0)}
                      </Typography>
                    )}
                    {file.isShared && (
                      <Tooltip title="Shared">
                        <ShareIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                      </Tooltip>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor?.element}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
        onClick={handleActionMenuClose}
      >
        <MenuItem onClick={() => handleAction('share')}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('download')}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('rename')}>
          <ListItemIcon>
            <RenameIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('move')}>
          <ListItemIcon>
            <MoveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Move</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('details')}>
          <ListItemIcon>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('delete')}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>Move to trash</ListItemText>
        </MenuItem>
      </Menu>

      {/* Empty State */}
      {files.length === 0 && <EmptyState type="no-files" />}
    </Box>
  );
};
