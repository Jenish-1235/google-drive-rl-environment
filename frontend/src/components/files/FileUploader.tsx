import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Paper, alpha } from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import { colors } from '../../theme/theme';
import { useUploadStore } from '../../store/uploadStore';
import { useUIStore } from '../../store/uiStore';

interface FileUploaderProps {
  folderId?: string | null;
  onFilesSelected?: (files: File[]) => void;
}

export const FileUploader = ({ folderId = null, onFilesSelected }: FileUploaderProps) => {
  const addUpload = useUploadStore((state) => state.addUpload);
  const showSnackbar = useUIStore((state) => state.showSnackbar);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        showSnackbar('No files selected', 'error');
        return;
      }

      // Check file sizes
      const maxSize = 5 * 1024 * 1024 * 1024; // 5GB
      const oversizedFiles = acceptedFiles.filter((file) => file.size > maxSize);

      if (oversizedFiles.length > 0) {
        showSnackbar(
          `Some files are too large (max 5GB): ${oversizedFiles.map(f => f.name).join(', ')}`,
          'error'
        );
        return;
      }

      // Add files to upload queue
      acceptedFiles.forEach((file) => {
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
      });

      // Simulate upload process
      acceptedFiles.forEach((file, index) => {
        const uploadId = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        simulateUpload(uploadId, file);
      });

      showSnackbar(
        `Uploading ${acceptedFiles.length} file${acceptedFiles.length > 1 ? 's' : ''}`,
        'info'
      );

      onFilesSelected?.(acceptedFiles);
    },
    [folderId, addUpload, showSnackbar, onFilesSelected]
  );

  const simulateUpload = (uploadId: string, file: File) => {
    const updateUpload = useUploadStore.getState().updateUpload;

    updateUpload(uploadId, { status: 'uploading' });

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;

      if (progress >= 100) {
        clearInterval(interval);
        updateUpload(uploadId, { progress: 100, status: 'completed' });
        useUIStore.getState().showSnackbar(`${file.name} uploaded successfully`, 'success');
      } else {
        updateUpload(uploadId, { progress: Math.min(progress, 99) });
      }
    }, 300);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: false,
    noKeyboard: false,
  });

  return (
    <Paper
      {...getRootProps()}
      sx={{
        border: `2px dashed ${isDragActive ? colors.primary : colors.border}`,
        borderRadius: 2,
        p: 4,
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: isDragActive ? alpha(colors.primary, 0.04) : 'background.paper',
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: colors.primary,
          backgroundColor: alpha(colors.primary, 0.02),
        },
      }}
    >
      <input {...getInputProps()} />
      <UploadIcon
        sx={{
          fontSize: 64,
          color: isDragActive ? colors.primary : 'text.secondary',
          mb: 2,
        }}
      />
      <Typography variant="h3" gutterBottom>
        {isDragActive ? 'Drop files here' : 'Drag and drop files here'}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        or click to browse
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        Maximum file size: 5GB
      </Typography>
    </Paper>
  );
};
