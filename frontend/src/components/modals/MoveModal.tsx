import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Breadcrumbs,
  Link,
  CircularProgress,
} from '@mui/material';
import {
  DriveFileMove as MoveIcon,
  Folder as FolderIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import type { DriveItem } from '../../types/file.types';
import { useFileStore } from '../../store/fileStore';
import { useUIStore } from '../../store/uiStore';
import { fileService } from '../../services/fileService';

interface MoveModalProps {
  open: boolean;
  files: DriveItem[];
  onClose: () => void;
  onMove: (targetFolderId: string | null) => void;
}

export const MoveModal = ({ open, files, onClose, onMove }: MoveModalProps) => {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folders, setFolders] = useState<DriveItem[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ id: string | null; name: string }>>([
    { id: null, name: 'My Drive' }
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const fileStoreCurrentFolder = useFileStore((state) => state.currentFolderId);
  const showSnackbar = useUIStore((state) => state.showSnackbar);

  useEffect(() => {
    if (open) {
      // Start at current folder
      setCurrentFolderId(fileStoreCurrentFolder);
      setSelectedFolderId(fileStoreCurrentFolder);
      loadFolders(fileStoreCurrentFolder);
      loadBreadcrumbs(fileStoreCurrentFolder);
    }
  }, [open, fileStoreCurrentFolder]);

  const loadFolders = async (folderId: string | null) => {
    setLoading(true);
    try {
      const response = await fileService.listFiles({
        parent_id: folderId,
        type: 'folder',
      });

      // Filter out the files being moved (can't move into themselves)
      const fileIds = files.map(f => f.id);
      const availableFolders = response.files
        .filter((folder: any) => !fileIds.includes(folder.id))
        .map((folder: any) => ({
          id: folder.id,
          name: folder.name,
          type: folder.type as 'folder',
          mimeType: folder.mime_type,
          size: folder.size,
          parentId: folder.parent_id,
          ownerId: folder.owner_id,
          createdTime: folder.created_at,
          modifiedTime: folder.updated_at,
          isStarred: Boolean(folder.is_starred),
          isTrashed: Boolean(folder.is_trashed),
        }));

      setFolders(availableFolders);
    } catch (error) {
      console.error('Failed to load folders:', error);
      showSnackbar('Failed to load folders. Please try again.', 'error');
      setFolders([]);
    } finally {
      setLoading(false);
    }
  };

  const loadBreadcrumbs = async (folderId: string | null) => {
    if (!folderId) {
      setBreadcrumbs([{ id: null, name: 'My Drive' }]);
      return;
    }

    try {
      const response = await fileService.getFolderPath(folderId);
      const pathBreadcrumbs = response.path.map((folder: any) => ({
        id: folder.id,
        name: folder.name,
      }));

      setBreadcrumbs([{ id: null, name: 'My Drive' }, ...pathBreadcrumbs]);
    } catch (error) {
      console.error('Failed to load breadcrumbs:', error);
      showSnackbar('Failed to load folder path', 'error');
      setBreadcrumbs([{ id: null, name: 'My Drive' }]);
    }
  };

  const handleNavigateToFolder = (folderId: string | null) => {
    setCurrentFolderId(folderId);
    loadFolders(folderId);
    loadBreadcrumbs(folderId);
  };

  const handleFolderDoubleClick = (folder: DriveItem) => {
    handleNavigateToFolder(folder.id);
  };

  const handleFolderClick = (folderId: string | null) => {
    setSelectedFolderId(folderId);
  };

  const handleMove = () => {
    onMove(selectedFolderId);
    onClose();
  };

  if (files.length === 0) return null;

  const singleFile = files.length === 1;
  const itemName = singleFile ? files[0].name : `${files.length} items`;
  const isCurrentLocation = selectedFolderId === fileStoreCurrentFolder;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          height: '600px',
          maxHeight: '80vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          pb: 2,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            backgroundColor: '#e8f0fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MoveIcon sx={{ fontSize: 24, color: '#1a73e8' }} />
        </Box>
        <Typography variant="h6" sx={{ fontSize: 20, fontWeight: 500 }}>
          Move
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 1, pb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography
          sx={{
            fontSize: 14,
            color: '#5f6368',
            lineHeight: 1.6,
          }}
        >
          Select a folder to move{' '}
          <Typography
            component="span"
            sx={{
              fontWeight: 500,
              color: '#202124',
            }}
          >
            {itemName}
          </Typography>
          {' '}to:
        </Typography>

        {/* Breadcrumbs */}
        <Box sx={{ borderBottom: '1px solid #e8eaed', pb: 1 }}>
          <Breadcrumbs
            separator={<ChevronRightIcon sx={{ fontSize: 16, color: '#5f6368' }} />}
            sx={{ fontSize: 14 }}
          >
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return isLast ? (
                <Typography
                  key={crumb.id || 'root'}
                  sx={{
                    fontSize: 14,
                    color: '#202124',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  {crumb.id === null && <HomeIcon sx={{ fontSize: 16 }} />}
                  {crumb.name}
                </Typography>
              ) : (
                <Link
                  key={crumb.id || 'root'}
                  component="button"
                  onClick={() => handleNavigateToFolder(crumb.id)}
                  sx={{
                    fontSize: 14,
                    color: '#1a73e8',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {crumb.id === null && <HomeIcon sx={{ fontSize: 16 }} />}
                  {crumb.name}
                </Link>
              );
            })}
          </Breadcrumbs>
        </Box>

        {/* Current Location Option */}
        <Box
          sx={{
            border: '1px solid #e8eaed',
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <ListItemButton
            selected={selectedFolderId === currentFolderId}
            onClick={() => handleFolderClick(currentFolderId)}
            sx={{
              py: 1.5,
              '&.Mui-selected': {
                backgroundColor: '#e8f0fe',
                '&:hover': {
                  backgroundColor: '#d2e3fc',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <HomeIcon sx={{ fontSize: 20, color: '#5f6368' }} />
            </ListItemIcon>
            <ListItemText
              primary="Current location"
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: 500,
              }}
            />
          </ListItemButton>
        </Box>

        {/* Folder List */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            border: '1px solid #e8eaed',
            borderRadius: 1,
            minHeight: 200,
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
              }}
            >
              <CircularProgress size={32} />
            </Box>
          ) : folders.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
                color: '#5f6368',
              }}
            >
              <FolderIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
              <Typography sx={{ fontSize: 14 }}>
                No folders in this location
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {folders.map((folder) => (
                <ListItem
                  key={folder.id}
                  disablePadding
                  sx={{
                    borderBottom: '1px solid #f1f3f4',
                    '&:last-child': {
                      borderBottom: 'none',
                    },
                  }}
                >
                  <ListItemButton
                    selected={selectedFolderId === folder.id}
                    onClick={() => handleFolderClick(folder.id)}
                    onDoubleClick={() => handleFolderDoubleClick(folder)}
                    sx={{
                      py: 1.5,
                      '&.Mui-selected': {
                        backgroundColor: '#e8f0fe',
                        '&:hover': {
                          backgroundColor: '#d2e3fc',
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <FolderIcon sx={{ fontSize: 20, color: '#5f6368' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={folder.name}
                      primaryTypographyProps={{
                        fontSize: 14,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        <Typography
          sx={{
            fontSize: 12,
            color: '#5f6368',
            fontStyle: 'italic',
          }}
        >
          Tip: Double-click a folder to open it
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{
            textTransform: 'none',
            color: '#5f6368',
            fontSize: 14,
            fontWeight: 500,
            px: 3,
            '&:hover': {
              backgroundColor: '#f8f9fa',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleMove}
          variant="contained"
          disabled={isCurrentLocation}
          sx={{
            textTransform: 'none',
            backgroundColor: '#1a73e8',
            fontSize: 14,
            fontWeight: 500,
            px: 3,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#1557b0',
              boxShadow: 'none',
            },
            '&:disabled': {
              backgroundColor: '#f1f3f4',
              color: '#80868b',
            },
          }}
        >
          Move here
        </Button>
      </DialogActions>
    </Dialog>
  );
};
