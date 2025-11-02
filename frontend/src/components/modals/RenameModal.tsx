import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';
import {
  DriveFileRenameOutline as RenameIcon,
} from '@mui/icons-material';
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
          <RenameIcon sx={{ fontSize: 24, color: '#1a73e8' }} />
        </Box>
        <Typography variant="h6" sx={{ fontSize: 20, fontWeight: 500 }}>
          Rename
        </Typography>
      </DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          placeholder="Enter new name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
          variant="outlined"
          sx={{
            mt: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1a73e8',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1a73e8',
                borderWidth: 2,
              },
            },
          }}
        />
        {file.type !== 'folder' && file.name.includes('.') && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 1,
              color: '#5f6368',
              fontSize: 12,
            }}
          >
            Extension: {file.name.substring(file.name.lastIndexOf('.'))}
          </Typography>
        )}
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
          onClick={handleSubmit}
          variant="contained"
          disabled={!name.trim()}
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
            '&:disabled': {
              backgroundColor: '#f1f3f4',
              color: '#80868b',
            },
          }}
        >
          Rename
        </Button>
      </DialogActions>
    </Dialog>
  );
};
