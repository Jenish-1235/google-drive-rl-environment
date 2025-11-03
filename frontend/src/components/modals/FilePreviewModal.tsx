import { useState, useEffect } from 'react';
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
import { fileService } from '../../services/fileService';
import { useUIStore } from '../../store/uiStore';

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const showSnackbar = useUIStore((state) => state.showSnackbar);

  // Fetch file content when file changes
  useEffect(() => {
    if (!file || !open || file.type === 'folder') {
      setPreviewUrl(null);
      setLoading(false);
      return;
    }

    // Expanded list of previewable file types
    const previewableTypes = ['image', 'video', 'audio', 'pdf', 'document', 'spreadsheet', 'presentation', 'other'];
    if (!previewableTypes.includes(file.type)) {
      setPreviewUrl(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Fetch file as blob using the fileService
    fileService
      .previewFile(file.id)
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        setPreviewUrl(url);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load file preview:', err);
        setError('Failed to load preview');
        setLoading(false);
        showSnackbar('Failed to load file preview. Please try again.', 'error');
      });

    // Cleanup function to revoke object URL when component unmounts or file changes
    return () => {
      setPreviewUrl((currentUrl) => {
        if (currentUrl) {
          window.URL.revokeObjectURL(currentUrl);
        }
        return null;
      });
    };
  }, [file?.id, open]);

  if (!file) return null;

  const currentIndex = files.findIndex((f) => f.id === file.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < files.length - 1;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));

  const handleDownload = async () => {
    if (!file) return;

    try {
      await fileService.downloadFile(file.id, file.name);
      showSnackbar('Download started successfully', 'success');
    } catch (error) {
      console.error('Download failed:', error);
      showSnackbar('Failed to download file. Please try again.', 'error');
    }
  };

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
            {error && (
              <Typography variant="body1" color="error">
                {error}
              </Typography>
            )}
            {!loading && !error && previewUrl && (
              <img
                src={previewUrl}
                alt={file.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  transform: `scale(${zoom / 100})`,
                  transition: 'transform 0.2s',
                }}
              />
            )}
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
              position: 'relative',
            }}
          >
            {loading && <CircularProgress />}
            {error && (
              <Typography variant="body1" color="error">
                {error}
              </Typography>
            )}
            {!loading && !error && previewUrl && (
              <iframe
                src={previewUrl}
                title={file.name}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            )}
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
              position: 'relative',
            }}
          >
            {loading && <CircularProgress sx={{ color: '#fff' }} />}
            {error && (
              <Typography variant="body1" color="error">
                {error}
              </Typography>
            )}
            {!loading && !error && previewUrl && (
              <video
                controls
                style={{
                  maxWidth: '100%',
                  maxHeight: '70vh',
                }}
                src={previewUrl}
              >
                Your browser does not support the video tag.
              </video>
            )}
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
              position: 'relative',
            }}
          >
            <Typography variant="h3">{file.name}</Typography>
            {loading && <CircularProgress />}
            {error && (
              <Typography variant="body1" color="error">
                {error}
              </Typography>
            )}
            {!loading && !error && previewUrl && (
              <audio controls style={{ width: '100%', maxWidth: 500 }} src={previewUrl}>
                Your browser does not support the audio tag.
              </audio>
            )}
          </Box>
        );

      case 'document':
      case 'spreadsheet':
      case 'presentation':
        // Check if it's a text-based document that can be previewed
        const isTextBased = file.mimeType?.includes('text') ||
                           file.mimeType?.includes('json') ||
                           file.mimeType?.includes('xml') ||
                           file.mimeType?.includes('html') ||
                           file.mimeType?.includes('css') ||
                           file.mimeType?.includes('javascript');

        if (isTextBased && previewUrl) {
          return (
            <Box
              sx={{
                height: '70vh',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                position: 'relative',
              }}
            >
              {loading && <CircularProgress />}
              {error && (
                <Typography variant="body1" color="error">
                  {error}
                </Typography>
              )}
              {!loading && !error && (
                <iframe
                  src={previewUrl}
                  title={file.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    backgroundColor: '#fff',
                  }}
                  sandbox="allow-same-origin"
                />
              )}
            </Box>
          );
        }

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
              {file.mimeType}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Full document preview requires additional integration
            </Typography>
          </Box>
        );

      default:
        // For 'other' file types, try to detect if they can be previewed
        const canPreviewAsText = file.mimeType?.includes('text') ||
                                 file.mimeType?.includes('json') ||
                                 file.mimeType?.includes('xml') ||
                                 file.mimeType?.includes('javascript') ||
                                 file.mimeType?.includes('css') ||
                                 file.mimeType?.includes('html') ||
                                 file.name?.match(/\.(txt|md|log|csv|json|xml|html|css|js|ts|tsx|jsx|py|java|c|cpp|h|sh|yaml|yml|ini|conf|config)$/i);

        const canPreviewAsImage = file.mimeType?.includes('image') ||
                                  file.name?.match(/\.(jpg|jpeg|png|gif|bmp|svg|webp|ico)$/i);

        const canPreviewAsPdf = file.mimeType?.includes('pdf') ||
                                file.name?.match(/\.pdf$/i);

        if (canPreviewAsImage && previewUrl) {
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
              {loading && <CircularProgress sx={{ position: 'absolute' }} />}
              {error && (
                <Typography variant="body1" color="error">
                  {error}
                </Typography>
              )}
              {!loading && !error && (
                <img
                  src={previewUrl}
                  alt={file.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '70vh',
                    transform: `scale(${zoom / 100})`,
                    transition: 'transform 0.2s',
                  }}
                />
              )}
            </Box>
          );
        }

        if (canPreviewAsPdf && previewUrl) {
          return (
            <Box
              sx={{
                height: '70vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.surfaceVariant,
                position: 'relative',
              }}
            >
              {loading && <CircularProgress />}
              {error && (
                <Typography variant="body1" color="error">
                  {error}
                </Typography>
              )}
              {!loading && !error && (
                <iframe
                  src={previewUrl}
                  title={file.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                />
              )}
            </Box>
          );
        }

        if (canPreviewAsText && previewUrl) {
          return (
            <Box
              sx={{
                height: '70vh',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                position: 'relative',
              }}
            >
              {loading && <CircularProgress />}
              {error && (
                <Typography variant="body1" color="error">
                  {error}
                </Typography>
              )}
              {!loading && !error && (
                <iframe
                  src={previewUrl}
                  title={file.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    backgroundColor: '#fff',
                  }}
                  sandbox="allow-same-origin"
                />
              )}
            </Box>
          );
        }

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
              {file.mimeType || 'Unknown type'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatFileSize((file as any).size || 0)} • {formatDate(file.modifiedTime)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Download the file to view its contents
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
          borderRadius: 2,
        },
      }}
    >
      {/* Top Toolbar */}
      <Toolbar
        sx={{
          borderBottom: '1px solid #e8eaed',
          justifyContent: 'space-between',
          backgroundColor: '#f8f9fa',
          minHeight: 64,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          <Typography
            variant="body1"
            noWrap
            sx={{
              fontWeight: 500,
              fontSize: 16,
              color: '#202124',
            }}
          >
            {file.name}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {file.type === 'image' && (
            <>
              <Tooltip title="Zoom out">
                <IconButton
                  size="small"
                  onClick={handleZoomOut}
                  disabled={zoom <= 50}
                  sx={{
                    color: '#5f6368',
                    '&:hover': {
                      backgroundColor: '#e8eaed',
                    },
                    '&:disabled': {
                      color: '#dadce0',
                    },
                  }}
                >
                  <ZoomOutIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Typography
                variant="body2"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 1,
                  color: '#5f6368',
                  fontSize: 14,
                }}
              >
                {zoom}%
              </Typography>
              <Tooltip title="Zoom in">
                <IconButton
                  size="small"
                  onClick={handleZoomIn}
                  disabled={zoom >= 200}
                  sx={{
                    color: '#5f6368',
                    '&:hover': {
                      backgroundColor: '#e8eaed',
                    },
                    '&:disabled': {
                      color: '#dadce0',
                    },
                  }}
                >
                  <ZoomInIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}

          <Tooltip title="Download">
            <IconButton
              size="small"
              onClick={handleDownload}
              sx={{
                color: '#5f6368',
                '&:hover': {
                  backgroundColor: '#e8eaed',
                },
              }}
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Share">
            <IconButton
              size="small"
              onClick={onShare}
              sx={{
                color: '#5f6368',
                '&:hover': {
                  backgroundColor: '#e8eaed',
                },
              }}
            >
              <ShareIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Open in new tab">
            <IconButton
              size="small"
              sx={{
                color: '#5f6368',
                '&:hover': {
                  backgroundColor: '#e8eaed',
                },
              }}
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="More actions">
            <IconButton
              size="small"
              sx={{
                color: '#5f6368',
                '&:hover': {
                  backgroundColor: '#e8eaed',
                },
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Close">
            <IconButton
              size="small"
              onClick={onClose}
              sx={{
                color: '#5f6368',
                '&:hover': {
                  backgroundColor: '#e8eaed',
                },
              }}
            >
              <CloseIcon fontSize="small" />
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
              backgroundColor: '#fff',
              color: '#5f6368',
              width: 48,
              height: 48,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: '#f8f9fa',
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
              },
              zIndex: 1,
            }}
          >
            <PrevIcon sx={{ fontSize: 32 }} />
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
              backgroundColor: '#fff',
              color: '#5f6368',
              width: 48,
              height: 48,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: '#f8f9fa',
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
              },
              zIndex: 1,
            }}
          >
            <NextIcon sx={{ fontSize: 32 }} />
          </IconButton>
        )}
      </DialogContent>

      {/* Bottom info bar */}
      <DialogActions
        sx={{
          borderTop: '1px solid #e8eaed',
          justifyContent: 'space-between',
          backgroundColor: '#f8f9fa',
          px: 3,
          py: 1.5,
          minHeight: 52,
        }}
      >
        <Box>
          <Typography
            variant="caption"
            sx={{
              color: '#5f6368',
              fontSize: 13,
            }}
          >
            {file.ownerName} • {formatDate(file.modifiedTime)}
            {file.type !== 'folder' && ` • ${formatFileSize((file as any).size || 0)}`}
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="caption"
            sx={{
              color: '#5f6368',
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {currentIndex + 1} of {files.length}
          </Typography>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
