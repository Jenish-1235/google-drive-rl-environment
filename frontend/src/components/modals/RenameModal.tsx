import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import type { DriveItem } from '../../types/file.types';

interface RenameModalProps {
  open: boolean;
  file: DriveItem | null;
  onClose: () => void;
  onRename: (newName: string) => void;
}

export const RenameModal = ({ open, file, onClose, onRename }: RenameModalProps) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (file) {
      // Remove extension for files
      if (file.type !== 'folder' && file.name.includes('.')) {
        const lastDotIndex = file.name.lastIndexOf('.');
        setName(file.name.substring(0, lastDotIndex));
      } else {
        setName(file.name);
      }
    }
  }, [file]);

  const handleSubmit = () => {
    if (!name.trim() || !file) return;

    // Add extension back for files
    let finalName = name.trim();
    if (file.type !== 'folder' && file.name.includes('.')) {
      const extension = file.name.substring(file.name.lastIndexOf('.'));
      if (!finalName.endsWith(extension)) {
        finalName += extension;
      }
    }

    onRename(finalName);
    onClose();
  };

  if (!file) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Rename</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!name.trim() || name === file.name}
        >
          Rename
        </Button>
      </DialogActions>
    </Dialog>
  );
};
