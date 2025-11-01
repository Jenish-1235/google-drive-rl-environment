import { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { DriveItem, SortField, SortOrder } from '../../types/file.types';
import { useFileStore } from '../../store/fileStore';
import { getFileIcon } from '../../utils/fileIcons';
import { formatDate, formatFileSize } from '../../utils/formatters';
import { colors } from '../../theme/theme';
import { animations, getStaggerDelay } from '../../utils/animations';
import { EmptyState } from '../common/EmptyState';

interface FileListProps {
  files: DriveItem[];
  onSort?: (field: SortField) => void;
  onContextMenu?: (event: React.MouseEvent, file: DriveItem) => void;
  onFileClick?: (file: DriveItem) => void;
}

export const FileList = ({ files, onSort, onContextMenu, onFileClick }: FileListProps) => {
  const navigate = useNavigate();
  const selectedFiles = useFileStore((state) => state.selectedFiles);
  const toggleFileSelection = useFileStore((state) => state.toggleFileSelection);
  const selectAll = useFileStore((state) => state.selectAll);
  const clearSelection = useFileStore((state) => state.clearSelection);
  const sortField = useFileStore((state) => state.sortField);
  const sortOrder = useFileStore((state) => state.sortOrder);
  const toggleSortOrder = useFileStore((state) => state.toggleSortOrder);
  const setSortField = useFileStore((state) => state.setSortField);
  const updateFile = useFileStore((state) => state.updateFile);

  const [actionMenuAnchor, setActionMenuAnchor] = useState<{
    element: HTMLElement;
    fileId: string;
  } | null>(null);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      selectAll();
    } else {
      clearSelection();
    }
  };

  const handleSelectFile = (fileId: string) => {
    toggleFileSelection(fileId);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      toggleSortOrder();
    } else {
      setSortField(field);
    }
    onSort?.(field);
  };

  const handleFileClick = (file: DriveItem) => {
    if (onFileClick) {
      onFileClick(file);
    } else if (file.type === 'folder') {
      navigate(`/folder/${file.id}`);
    }
  };

  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, fileId: string) => {
    event.stopPropagation();
    setActionMenuAnchor({ element: event.currentTarget, fileId });
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
  };

  const handleToggleStar = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (file) {
      updateFile(fileId, { isStarred: !file.isStarred });
    }
  };

  const handleAction = (action: string) => {
    console.log(`Action: ${action} on file:`, actionMenuAnchor?.fileId);
    handleActionMenuClose();
    // TODO: Implement actions
  };

  const isSelected = (fileId: string) => selectedFiles.includes(fileId);
  const isAllSelected = files.length > 0 && selectedFiles.length === files.length;
  const isSomeSelected = selectedFiles.length > 0 && selectedFiles.length < files.length;

  return (
    <Box>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ width: 48 }}>
                <Checkbox
                  indeterminate={isSomeSelected}
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  size="small"
                />
              </TableCell>
              <TableCell sx={{ width: 40 }} />
              <TableCell sx={{ width: '40%' }}>
                <TableSortLabel
                  active={sortField === 'name'}
                  direction={sortField === 'name' ? sortOrder : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: '20%' }}>
                <TableSortLabel
                  active={sortField === 'owner'}
                  direction={sortField === 'owner' ? sortOrder : 'asc'}
                  onClick={() => handleSort('owner')}
                >
                  Owner
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: '20%' }}>
                <TableSortLabel
                  active={sortField === 'modifiedTime'}
                  direction={sortField === 'modifiedTime' ? sortOrder : 'asc'}
                  onClick={() => handleSort('modifiedTime')}
                >
                  Last modified
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: '15%' }}>
                <TableSortLabel
                  active={sortField === 'size'}
                  direction={sortField === 'size' ? sortOrder : 'asc'}
                  onClick={() => handleSort('size')}
                >
                  File size
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: 48 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file, index) => (
              <TableRow
                key={file.id}
                hover
                selected={isSelected(file.id)}
                onClick={() => handleFileClick(file)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  onContextMenu?.(e, file);
                }}
                sx={{
                  cursor: 'pointer',
                  '&.Mui-selected': {
                    backgroundColor: alpha(colors.primary, 0.08),
                  },
                  ...animations.fadeIn,
                  ...getStaggerDelay(index, 20),
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected(file.id)}
                    onChange={() => handleSelectFile(file.id)}
                    onClick={(e) => e.stopPropagation()}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getFileIcon(file.type)}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" noWrap>
                      {file.name}
                    </Typography>
                    {file.isShared && (
                      <Tooltip title="Shared">
                        <ShareIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {file.ownerName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(file.modifiedTime)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {file.type === 'folder' ? '—' : formatFileSize((file as any).size || 0)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title={file.isStarred ? 'Remove star' : 'Add star'}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStar(file.id);
                        }}
                      >
                        {file.isStarred ? (
                          <StarIcon sx={{ fontSize: 20, color: colors.warning }} />
                        ) : (
                          <StarBorderIcon sx={{ fontSize: 20 }} />
                        )}
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      size="small"
                      onClick={(e) => handleActionMenuOpen(e, file.id)}
                    >
                      <MoreVertIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
