import { Box, IconButton, Button, Typography, Divider } from "@mui/material";
import {
  Close as CloseIcon,
  Share as ShareIcon,
  GetApp as DownloadIcon,
  Delete as DeleteIcon,
  Link as LinkIcon,
  MoreVert as MoreVertIcon,
  Folder as FolderIcon,
} from "@mui/icons-material";
import { useFileStore } from "../../store/fileStore";

interface SelectionToolbarProps {
  onClose: () => void;
}

export const SelectionToolbar = ({ onClose }: SelectionToolbarProps) => {
  const selectedFiles = useFileStore((state) => state.selectedFiles);
  const getSelectedFilesData = useFileStore(
    (state) => state.getSelectedFilesData
  );

  const selectedFilesData = getSelectedFilesData();
  const selectedCount = selectedFiles.length;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 1.5,
        py: 0.5,
        backgroundColor: "#f0f4f9",
        borderRadius: "24px",
        height: 40,
      }}
    >
      {/* Close Button */}
      <IconButton
        size="small"
        onClick={onClose}
        sx={{
          color: "#5f6368",
          "&:hover": {
            backgroundColor: "#e8eaed",
          },
        }}
      >
        <CloseIcon sx={{ fontSize: 20 }} />
      </IconButton>

      {/* Selected Count */}
      <Typography fontSize={14} fontWeight={500} color="#202124">
        {selectedCount} selected
      </Typography>

      {/* Summarize Folder Button (only show for single folder selection) */}
      {selectedCount === 1 && selectedFilesData[0]?.type === "folder" && (
        <Button
          variant="outlined"
          startIcon={<FolderIcon sx={{ fontSize: 16 }} />}
          sx={{
            textTransform: "none",
            color: "#5f6368",
            borderColor: "#dadce0",
            backgroundColor: "white",
            borderRadius: "18px",
            px: 2,
            py: 0.5,
            fontSize: 13,
            fontWeight: 400,
            "&:hover": {
              borderColor: "#dadce0",
              backgroundColor: "#f8f9fa",
            },
          }}
        >
          Summarize this folder
        </Button>
      )}

      <Divider
        orientation="vertical"
        flexItem
        sx={{ borderColor: "#dadce0", height: 24, alignSelf: "center" }}
      />

      {/* Action Buttons */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <IconButton
          size="small"
          sx={{
            color: "#5f6368",
            "&:hover": {
              backgroundColor: "#e8eaed",
            },
          }}
        >
          <ShareIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <IconButton
          size="small"
          sx={{
            color: "#5f6368",
            "&:hover": {
              backgroundColor: "#e8eaed",
            },
          }}
        >
          <DownloadIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <IconButton
          size="small"
          sx={{
            color: "#5f6368",
            "&:hover": {
              backgroundColor: "#e8eaed",
            },
          }}
        >
          <FolderIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <IconButton
          size="small"
          sx={{
            color: "#5f6368",
            "&:hover": {
              backgroundColor: "#e8eaed",
            },
          }}
        >
          <DeleteIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <IconButton
          size="small"
          sx={{
            color: "#5f6368",
            "&:hover": {
              backgroundColor: "#e8eaed",
            },
          }}
        >
          <LinkIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <IconButton
          size="small"
          sx={{
            color: "#5f6368",
            "&:hover": {
              backgroundColor: "#e8eaed",
            },
          }}
        >
          <MoreVertIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>
    </Box>
  );
};
