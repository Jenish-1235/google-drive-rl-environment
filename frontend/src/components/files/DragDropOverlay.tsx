import { useState, useCallback } from 'react';
import { Box, Typography, alpha } from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import { colors } from '../../theme/theme';
import { useUploadStore } from '../../store/uploadStore';
import { useUIStore } from '../../store/uiStore';
import { useFileStore } from '../../store/fileStore';

interface DragDropOverlayProps {
  folderId?: string | null;
}

export const DragDropOverlay = ({ folderId = null }: DragDropOverlayProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const addUpload = useUploadStore((state) => state.addUpload);
  const updateUpload = useUploadStore((state) => state.updateUpload);
  const showSnackbar = useUIStore((state) => state.showSnackbar);
  const uploadFile = useFileStore((state) => state.uploadFile);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        setIsDragging(false);
      }
      return newCounter;
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleRealUpload = async (uploadId: string, file: File, parentId: string | null) => {
    try {
      updateUpload(uploadId, { status: 'uploading' });

      await uploadFile(file, parentId, (progress) => {
        updateUpload(uploadId, { progress });
      });

      updateUpload(uploadId, { progress: 100, status: 'completed' });
      useUIStore.getState().showSnackbar(`${file.name} uploaded successfully`, 'success');
    } catch (error: any) {
      updateUpload(uploadId, { status: 'error', error: error.message || 'Upload failed' });
      useUIStore.getState().showSnackbar(`Failed to upload ${file.name}`, 'error');
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setDragCounter(0);

      const files = Array.from(e.dataTransfer.files);

      if (files.length === 0) {
        return;
      }

      // Check file sizes
      const maxSize = 5 * 1024 * 1024 * 1024; // 5GB
      const validFiles = files.filter((file) => file.size <= maxSize);
      const oversizedFiles = files.filter((file) => file.size > maxSize);

      if (oversizedFiles.length > 0) {
        showSnackbar(
          `Some files are too large (max 5GB): ${oversizedFiles.map(f => f.name).join(', ')}`,
          'error'
        );
      }

      if (validFiles.length === 0) {
        return;
      }

      // Add files to upload queue and start upload
      validFiles.forEach((file) => {
        const uploadId = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        addUpload({
          id: uploadId,
          file,
          fileName: file.name,
          fileSize: file.size,
          progress: 0,
          status: 'pending',
          parentId: folderId,
        });

        // Start real upload
        handleRealUpload(uploadId, file, folderId);
      });

      showSnackbar(
        `Uploading ${validFiles.length} file${validFiles.length > 1 ? 's' : ''}`,
        'info'
      );
    },
    [folderId, addUpload, showSnackbar, uploadFile]
  );

  return (
    <>
      {/* Invisible drop zone */}
      <Box
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: isDragging ? 1400 : -1,
          pointerEvents: isDragging ? 'auto' : 'none',
        }}
      />

      {/* Visible overlay when dragging */}
      {isDragging && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: alpha(colors.primary, 0.1),
            backdropFilter: 'blur(4px)',
            zIndex: 1400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <Box
            sx={{
              textAlign: 'center',
              backgroundColor: 'background.paper',
              borderRadius: 4,
              p: 6,
              boxShadow: 3,
              border: `3px dashed ${colors.primary}`,
            }}
          >
            <UploadIcon
              sx={{
                fontSize: 120,
                color: colors.primary,
                mb: 3,
              }}
            />
            <Typography variant="h1" color="primary" gutterBottom>
              Drop files to upload
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Upload to {folderId ? 'current folder' : 'My Drive'}
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
};
