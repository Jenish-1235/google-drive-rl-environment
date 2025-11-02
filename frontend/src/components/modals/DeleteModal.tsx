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
  DeleteOutline as DeleteIcon,
  WarningAmber as WarningIcon,
} from '@mui/icons-material';
import type { DriveItem } from '../../types/file.types';

interface DeleteModalProps {
  open: boolean;
  files: DriveItem[];
  onClose: () => void;
  onDelete: () => void;
  permanent?: boolean;
}

export const DeleteModal = ({
  open,
  files,
  onClose,
  onDelete,
  permanent = false,
}: DeleteModalProps) => {
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
            backgroundColor: permanent ? '#fce8e6' : '#e8f0fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {permanent ? (
            <WarningIcon sx={{ fontSize: 24, color: '#c5221f' }} />
          ) : (
            <DeleteIcon sx={{ fontSize: 24, color: '#5f6368' }} />
          )}
        </Box>
        <Typography variant="h6" sx={{ fontSize: 20, fontWeight: 500 }}>
          {permanent ? 'Delete forever?' : 'Move to trash?'}
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
          {permanent ? (
            <>
              <Typography
                component="span"
                sx={{
                  fontWeight: 500,
                  color: '#202124',
                }}
              >
                {fileName}
              </Typography>
              {' '}will be deleted forever and you won&apos;t be able to restore {singleFile ? 'it' : 'them'}.
            </>
          ) : (
            <>
              <Typography
                component="span"
                sx={{
                  fontWeight: 500,
                  color: '#202124',
                }}
              >
                {fileName}
              </Typography>
              {' '}will be moved to trash. You can restore {singleFile ? 'it' : 'them'} from trash within 30 days.
            </>
          )}
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
          onClick={onDelete}
          variant="contained"
          sx={{
            textTransform: 'none',
            backgroundColor: permanent ? '#c5221f' : '#5f6368',
            fontSize: 14,
            fontWeight: 500,
            px: 3,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: permanent ? '#a50e0e' : '#3c4043',
              boxShadow: 'none',
            },
          }}
        >
          {permanent ? 'Delete forever' : 'Move to trash'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
