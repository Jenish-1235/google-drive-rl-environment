import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
} from '@mui/material';
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
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {permanent ? 'Delete forever?' : 'Move to trash?'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {permanent ? (
            <>
              <strong>{fileName}</strong> will be deleted forever and you won't be able to restore it.
            </>
          ) : (
            <>
              <strong>{fileName}</strong> will be moved to trash. You can restore it from trash within 30 days.
            </>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onDelete} variant="contained" color="error">
          {permanent ? 'Delete forever' : 'Move to trash'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
