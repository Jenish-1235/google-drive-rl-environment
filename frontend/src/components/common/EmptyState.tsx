import { Box, Typography, Button } from '@mui/material';
import {
  CloudUpload as UploadIcon,
  CreateNewFolder as FolderIcon,
  Search as SearchIcon,
  Folder as EmptyFolderIcon,
} from '@mui/icons-material';
import { colors } from '../../theme/theme';

export type EmptyStateType = 'no-files' | 'no-search-results' | 'empty-folder' | 'no-trash';

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState = ({
  type = 'no-files',
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: EmptyStateProps) => {
  const getConfig = () => {
    switch (type) {
      case 'no-files':
        return {
          icon: <EmptyFolderIcon sx={{ fontSize: 120, color: colors.textSecondary, opacity: 0.5 }} />,
          title: title || 'No files or folders',
          description:
            description ||
            'Upload or create new files to get started. You can drag and drop files here or use the New button.',
          actionLabel: actionLabel || 'Upload files',
          secondaryActionLabel: secondaryActionLabel || 'Create folder',
        };
      case 'no-search-results':
        return {
          icon: <SearchIcon sx={{ fontSize: 120, color: colors.textSecondary, opacity: 0.5 }} />,
          title: title || 'No results found',
          description:
            description || 'Try different keywords or check your spelling. You can also clear the search to see all files.',
          actionLabel: actionLabel,
          secondaryActionLabel: secondaryActionLabel,
        };
      case 'empty-folder':
        return {
          icon: <EmptyFolderIcon sx={{ fontSize: 120, color: colors.textSecondary, opacity: 0.5 }} />,
          title: title || 'This folder is empty',
          description:
            description || 'Drag and drop files here, or use the New button to add content to this folder.',
          actionLabel: actionLabel || 'Upload files',
          secondaryActionLabel: secondaryActionLabel || 'Create folder',
        };
      case 'no-trash':
        return {
          icon: <EmptyFolderIcon sx={{ fontSize: 120, color: colors.textSecondary, opacity: 0.5 }} />,
          title: title || 'Trash is empty',
          description:
            description || 'Items you trash will appear here. You can restore them within 30 days.',
          actionLabel: actionLabel,
          secondaryActionLabel: secondaryActionLabel,
        };
      default:
        return {
          icon: <EmptyFolderIcon sx={{ fontSize: 120, color: colors.textSecondary, opacity: 0.5 }} />,
          title: title || 'Nothing here',
          description: description || '',
          actionLabel: actionLabel,
          secondaryActionLabel: secondaryActionLabel,
        };
    }
  };

  const config = getConfig();

  return (
    <Box
      sx={{
        py: 12,
        px: 4,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
      }}
    >
      {/* Icon */}
      <Box sx={{ mb: 3 }}>{config.icon}</Box>

      {/* Title */}
      <Typography
        variant="h3"
        sx={{
          color: colors.textPrimary,
          fontWeight: 400,
          mb: 1,
        }}
      >
        {config.title}
      </Typography>

      {/* Description */}
      {config.description && (
        <Typography
          variant="body1"
          sx={{
            color: colors.textSecondary,
            mb: 4,
            maxWidth: 500,
          }}
        >
          {config.description}
        </Typography>
      )}

      {/* Actions */}
      {(config.actionLabel || config.secondaryActionLabel) && (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          {config.actionLabel && onAction && (
            <Button variant="contained" size="large" onClick={onAction} startIcon={<UploadIcon />}>
              {config.actionLabel}
            </Button>
          )}
          {config.secondaryActionLabel && onSecondaryAction && (
            <Button variant="outlined" size="large" onClick={onSecondaryAction} startIcon={<FolderIcon />}>
              {config.secondaryActionLabel}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};
