import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
  Toolbar,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import type { DriveItem } from '../../types/file.types';
import { formatFileSize, formatDate } from '../../utils/formatters';
import { colors } from '../../theme/theme';

interface FilePreviewModalProps {
  open: boolean;
  file: DriveItem | null;
  files: DriveItem[];
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onShare?: () => void;
}

export const FilePreviewModal = ({
  open,
  file,
  files,
  onClose,
  onNext,
  onPrevious,
  onShare,
}: FilePreviewModalProps) => {
  const [zoom, setZoom] = useState(100);
  const [loading, setLoading] = useState(true);

  if (!file) return null;

  const currentIndex = files.findIndex((f) => f.id === file.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < files.length - 1;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));

  const renderPreview = () => {
    if (file.type === 'folder') {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 400,
          }}
        >
          <Typography variant="h3" color="text.secondary">
            Folder preview not available
          </Typography>
        </Box>
      );
    }

    switch (file.type) {
      case 'image':
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 400,
              overflow: 'auto',
              position: 'relative',
            }}
          >
            {loading && (
              <CircularProgress
                sx={{ position: 'absolute' }}
              />
            )}
            <img
              src={`https://via.placeholder.com/800x600?text=${encodeURIComponent(file.name)}`}
              alt={file.name}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                transform: `scale(${zoom / 100})`,
                transition: 'transform 0.2s',
              }}
              onLoad={() => setLoading(false)}
            />
          </Box>
        );

      case 'pdf':
        return (
          <Box
            sx={{
              height: '70vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.surfaceVariant,
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" gutterBottom>
                PDF Preview
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {file.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                PDF preview coming soon
              </Typography>
            </Box>
          </Box>
        );

      case 'video':
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 400,
              backgroundColor: '#000',
            }}
          >
            <video
              controls
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
              }}
            >
              <source src="#" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        );

      case 'audio':
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 400,
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography variant="h3">{file.name}</Typography>
            <audio controls style={{ width: '100%', maxWidth: 500 }}>
              <source src="#" type="audio/mpeg" />
              Your browser does not support the audio tag.
            </audio>
          </Box>
        );

      case 'document':
      case 'spreadsheet':
      case 'presentation':
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 400,
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography variant="h3">Document Preview</Typography>
            <Typography variant="body1" color="text.secondary">
              {file.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Document preview requires Google Drive API integration
            </Typography>
          </Box>
        );

      default:
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 400,
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography variant="h3">Preview not available</Typography>
            <Typography variant="body1" color="text.secondary">
              {file.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatFileSize((file as any).size || 0)} • {formatDate(file.modifiedTime)}
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          maxHeight: 900,
        },
      }}
    >
      {/* Top Toolbar */}
      <Toolbar
        sx={{
          borderBottom: `1px solid ${colors.border}`,
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          <Typography variant="body1" noWrap sx={{ fontWeight: 500 }}>
            {file.name}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {file.type === 'image' && (
            <>
              <Tooltip title="Zoom out">
                <IconButton size="small" onClick={handleZoomOut} disabled={zoom <= 50}>
                  <ZoomOutIcon />
                </IconButton>
              </Tooltip>
              <Typography
                variant="body2"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 1,
                  color: 'text.secondary',
                }}
              >
                {zoom}%
              </Typography>
              <Tooltip title="Zoom in">
                <IconButton size="small" onClick={handleZoomIn} disabled={zoom >= 200}>
                  <ZoomInIcon />
                </IconButton>
              </Tooltip>
            </>
          )}

          <Tooltip title="Download">
            <IconButton size="small">
              <DownloadIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Share">
            <IconButton size="small" onClick={onShare}>
              <ShareIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Open in new tab">
            <IconButton size="small">
              <OpenInNewIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="More actions">
            <IconButton size="small">
              <MoreVertIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Close">
            <IconButton size="small" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* Content */}
      <DialogContent
        sx={{
          p: 0,
          overflow: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Previous button */}
        {hasPrevious && (
          <IconButton
            onClick={onPrevious}
            sx={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'background.paper',
              boxShadow: 2,
              '&:hover': {
                backgroundColor: 'background.paper',
                boxShadow: 4,
              },
              zIndex: 1,
            }}
          >
            <PrevIcon />
          </IconButton>
        )}

        {/* Preview */}
        {renderPreview()}

        {/* Next button */}
        {hasNext && (
          <IconButton
            onClick={onNext}
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'background.paper',
              boxShadow: 2,
              '&:hover': {
                backgroundColor: 'background.paper',
                boxShadow: 4,
              },
              zIndex: 1,
            }}
          >
            <NextIcon />
          </IconButton>
        )}
      </DialogContent>

      {/* Bottom info bar */}
      <DialogActions
        sx={{
          borderTop: `1px solid ${colors.border}`,
          justifyContent: 'space-between',
          px: 3,
          py: 1.5,
        }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary">
            {file.ownerName} • {formatDate(file.modifiedTime)}
            {file.type !== 'folder' && ` • ${formatFileSize((file as any).size || 0)}`}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            {currentIndex + 1} of {files.length}
          </Typography>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
