import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { Folder as FolderIcon } from "@mui/icons-material";

interface CreateFolderModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (folderName: string) => void;
}

export const CreateFolderModal = ({
  open,
  onClose,
  onCreate,
}: CreateFolderModalProps) => {
  const [folderName, setFolderName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setFolderName("");
      setError("");
    }
  }, [open]);

  const handleSubmit = () => {
    const trimmedName = folderName.trim();

    if (!trimmedName) {
      setError("Folder name cannot be empty");
      return;
    }

    if (trimmedName.length > 255) {
      setError("Folder name is too long");
      return;
    }

    // Check for invalid characters
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(trimmedName)) {
      setError("Folder name contains invalid characters");
      return;
    }

    onCreate(trimmedName);
    onClose();
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

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
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          pb: 2,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            backgroundColor: "#e8f0fe",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FolderIcon sx={{ fontSize: 24, color: "#1a73e8" }} />
        </Box>
        <Typography variant="h6" sx={{ fontSize: 20, fontWeight: 500 }}>
          New folder
        </Typography>
      </DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          placeholder="Untitled folder"
          value={folderName}
          onChange={(e) => {
            setFolderName(e.target.value);
            setError("");
          }}
          onKeyPress={handleKeyPress}
          error={!!error}
          helperText={error}
          variant="outlined"
          sx={{
            mt: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1a73e8",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1a73e8",
                borderWidth: 2,
              },
            },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{
            textTransform: "none",
            color: "#5f6368",
            fontSize: 14,
            fontWeight: 500,
            px: 3,
            "&:hover": {
              backgroundColor: "#f8f9fa",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            textTransform: "none",
            backgroundColor: "#1a73e8",
            fontSize: 14,
            fontWeight: 500,
            px: 3,
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#1557b0",
              boxShadow: "none",
            },
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
