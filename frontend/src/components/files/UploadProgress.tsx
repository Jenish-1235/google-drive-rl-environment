import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Minimize as MinimizeIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useUploadStore } from '../../store/uploadStore';
import { getFileIcon } from '../../utils/fileIcons';
import { formatFileSize } from '../../utils/formatters';
import { getFileType } from '../../utils/constants';
import { colors } from '../../theme/theme';

export const UploadProgress = () => {
  const uploads = useUploadStore((state) => state.uploads);
  const cancelUpload = useUploadStore((state) => state.cancelUpload);
  const removeUpload = useUploadStore((state) => state.removeUpload);
  const clearCompleted = useUploadStore((state) => state.clearCompleted);

  const [expanded, setExpanded] = useState(true);
  const [minimized, setMinimized] = useState(false);

  if (uploads.length === 0) return null;

  const activeUploads = uploads.filter(
    (u) => u.status === 'uploading' || u.status === 'pending'
  );
  const completedUploads = uploads.filter((u) => u.status === 'completed');

  const totalProgress = uploads.length > 0
    ? uploads.reduce((sum, upload) => sum + upload.progress, 0) / uploads.length
    : 0;

  if (minimized) {
    return (
      <Paper
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          p: 2,
          minWidth: 300,
          boxShadow: 3,
          zIndex: 1300,
          cursor: 'pointer',
        }}
        onClick={() => setMinimized(false)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LinearProgress
            variant="determinate"
            value={totalProgress}
            sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
          />
          <Typography variant="body2" color="text.secondary">
            {activeUploads.length > 0
              ? `${activeUploads.length} uploading...`
              : `${completedUploads.length} complete`}
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        width: 400,
        maxHeight: 500,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 3,
        zIndex: 1300,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body1" fontWeight={500}>
            {activeUploads.length > 0
              ? `Uploading ${activeUploads.length} file${activeUploads.length > 1 ? 's' : ''}`
              : `${uploads.length} upload${uploads.length > 1 ? 's' : ''} complete`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {completedUploads.length > 0 && (
            <Tooltip title="Clear completed">
              <IconButton size="small" onClick={clearCompleted}>
                <CheckIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={expanded ? 'Collapse' : 'Expand'}>
            <IconButton size="small" onClick={() => setExpanded(!expanded)}>
              {expanded ? (
                <ExpandLessIcon sx={{ fontSize: 20 }} />
              ) : (
                <ExpandMoreIcon sx={{ fontSize: 20 }} />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Minimize">
            <IconButton size="small" onClick={() => setMinimized(true)}>
              <MinimizeIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Progress Bar */}
      {activeUploads.length > 0 && (
        <LinearProgress
          variant="determinate"
          value={totalProgress}
          sx={{ height: 2 }}
        />
      )}

      {/* Upload List */}
      <Collapse in={expanded}>
        <List
          sx={{
            maxHeight: 400,
            overflow: 'auto',
            p: 0,
          }}
        >
          {uploads.map((upload) => {
            const fileType = getFileType(upload.file.type);

            return (
              <Box key={upload.id}>
                <ListItem
                  sx={{
                    py: 1.5,
                    px: 2,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {upload.status === 'completed' ? (
                      <CheckIcon sx={{ color: colors.success }} />
                    ) : upload.status === 'error' ? (
                      <ErrorIcon sx={{ color: colors.error }} />
                    ) : (
                      getFileIcon(fileType)
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" noWrap>
                        {upload.fileName}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {formatFileSize(upload.fileSize)}
                          {upload.status === 'uploading' && ` • ${Math.round(upload.progress)}%`}
                          {upload.status === 'completed' && ' • Complete'}
                          {upload.status === 'error' && ' • Failed'}
                        </Typography>
                        {upload.status === 'uploading' && (
                          <LinearProgress
                            variant="determinate"
                            value={upload.progress}
                            sx={{ mt: 0.5, height: 3, borderRadius: 1.5 }}
                          />
                        )}
                      </Box>
                    }
                    secondaryTypographyProps={{ component: 'div' }}
                  />
                  {(upload.status === 'uploading' || upload.status === 'pending') && (
                    <Tooltip title="Cancel">
                      <IconButton
                        size="small"
                        onClick={() => cancelUpload(upload.id)}
                      >
                        <CancelIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                  {(upload.status === 'completed' || upload.status === 'error' || upload.status === 'cancelled') && (
                    <Tooltip title="Remove">
                      <IconButton
                        size="small"
                        onClick={() => removeUpload(upload.id)}
                      >
                        <CloseIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </ListItem>
                <Divider />
              </Box>
            );
          })}
        </List>
      </Collapse>
    </Paper>
  );
};
