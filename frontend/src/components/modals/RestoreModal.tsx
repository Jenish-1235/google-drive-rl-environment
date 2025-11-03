import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import {
  RestoreFromTrash as RestoreIcon,
} from '@mui/icons-material';
import type { DriveItem } from '../../types/file.types';

interface RestoreModalProps {
  open: boolean;
  files: DriveItem[];
  onClose: () => void;
  onRestore: () => void;
}

export const RestoreModal = ({
  open,
  files,
  onClose,
  onRestore,
}: RestoreModalProps) => {
  if (files.length === 0) return null;

  const singleFile = files.length === 1;
  const fileName = singleFile ? files[0].name : `${files.length} items`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
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
          <RestoreIcon sx={{ fontSize: 24, color: '#1a73e8' }} />
        </Box>
        <Typography variant="h6" sx={{ fontSize: 20, fontWeight: 500 }}>
          Restore from trash?
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Typography
          sx={{
            fontSize: 14,
            color: '#5f6368',
            lineHeight: 1.6,
          }}
        >
          <Typography
            component="span"
            sx={{
              fontWeight: 500,
              color: '#202124',
            }}
          >
            {fileName}
          </Typography>
          {' '}will be restored to{' '}
          {singleFile
            ? (files[0].parentId ? 'its original location' : 'My Drive')
            : 'their original locations'}
          .
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
          onClick={onRestore}
          variant="contained"
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
          }}
        >
          Restore
        </Button>
      </DialogActions>
    </Dialog>
  );
};
