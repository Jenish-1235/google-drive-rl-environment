import {
  Box,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Link,
} from "@mui/material";
import {
  InfoOutlined as InfoIcon,
  ArrowDownward as ArrowDownIcon,
  PeopleAlt as PeopleIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { getFileIcon } from "../../utils/fileIcons";
import { formatFileSize } from "../../utils/formatters";
import type { FileType } from "../../types/file.types";

interface StorageFile {
  id: string;
  name: string;
  type: FileType;
  size: number;
  isShared: boolean;
}

// Mock storage data
const mockStorageFiles: StorageFile[] = [
  {
    id: "1",
    name: "train.csv",
    type: "spreadsheet",
    size: 61.4 * 1024 * 1024,
    isShared: false,
  },
  {
    id: "2",
    name: "train.csv",
    type: "spreadsheet",
    size: 60.5 * 1024 * 1024,
    isShared: false,
  },
  {
    id: "3",
    name: "train.csv",
    type: "spreadsheet",
    size: 60.5 * 1024 * 1024,
    isShared: true,
  },
  {
    id: "4",
    name: "skew.csv",
    type: "spreadsheet",
    size: 25.3 * 1024 * 1024,
    isShared: true,
  },
  {
    id: "5",
    name: "cml-dataset.zip",
    type: "archive",
    size: 19.4 * 1024 * 1024,
    isShared: true,
  },
  {
    id: "6",
    name: "test.csv",
    type: "spreadsheet",
    size: 15.3 * 1024 * 1024,
    isShared: true,
  },
  {
    id: "7",
    name: "val.csv",
    type: "spreadsheet",
    size: 15.2 * 1024 * 1024,
    isShared: true,
  },
  {
    id: "8",
    name: "ScholAR Logo Design Brief",
    type: "document",
    size: 11 * 1024 * 1024,
    isShared: false,
  },
  {
    id: "9",
    name: "NeroSpatial-Aristotle-for-the-Next-Wave-of-Alexanders (2).pdf",
    type: "pdf",
    size: 6.2 * 1024 * 1024,
    isShared: true,
  },
  {
    id: "10",
    name: "Untitled presentation",
    type: "presentation",
    size: 4.3 * 1024 * 1024,
    isShared: false,
  },
  {
    id: "11",
    name: "Untitled presentation",
    type: "presentation",
    size: 4.2 * 1024 * 1024,
    isShared: false,
  },
];

export const StoragePage = () => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Storage stats
  const totalStorage = 2 * 1024 * 1024 * 1024 * 1024; // 2 TB
  const usedStorage = 7.24 * 1024 * 1024 * 1024; // 7.24 GB
  const storagePercentage = (usedStorage / totalStorage) * 100;

  // Storage breakdown (mock data)
  const driveStorage = 5.5 * 1024 * 1024 * 1024;
  const photosStorage = 1.2 * 1024 * 1024 * 1024;
  const gmailStorage = 0.44 * 1024 * 1024 * 1024;
  const otherStorage = 0.1 * 1024 * 1024 * 1024;

  const drivePercentage = (driveStorage / usedStorage) * 100;
  const photosPercentage = (photosStorage / usedStorage) * 100;
  const gmailPercentage = (gmailStorage / usedStorage) * 100;
  const otherPercentage = (otherStorage / usedStorage) * 100;

  const sortedFiles = [...mockStorageFiles].sort((a, b) => {
    return sortOrder === "desc" ? b.size - a.size : a.size - b.size;
  });

  const handleSortToggle = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        py: 3,
        px: 3,
        backgroundColor: "#f9fafb",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontSize: 22,
            fontWeight: 500,
            color: "#202124",
          }}
        >
          Storage
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link
            href="#"
            underline="none"
            sx={{
              fontSize: 14,
              color: "#1a73e8",
              fontWeight: 500,
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Backups
          </Link>

          <IconButton
            size="small"
            sx={{
              color: "#5f6368",
              border: `1px solid #dadce0`,
              borderRadius: 1,
              width: 40,
              height: 40,
              "&:hover": {
                backgroundColor: "#f8f9fa",
              },
            }}
          >
            <InfoIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Filter Buttons */}
      <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
        {["Type", "Modified", "Source"].map((filter) => (
          <Button
            key={filter}
            variant="outlined"
            endIcon={<ArrowDownIcon sx={{ fontSize: 18 }} />}
            sx={{
              textTransform: "none",
              color: "#202124",
              borderColor: "#dadce0",
              backgroundColor: "white",
              borderRadius: "18px",
              px: 2,
              py: 0.5,
              fontSize: 14,
              fontWeight: 500,
              minHeight: 36,
              "&:hover": {
                borderColor: "#dadce0",
                backgroundColor: "#f8f9fa",
              },
            }}
          >
            {filter}
          </Button>
        ))}
      </Box>

      {/* Storage Usage Display */}
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontSize: 32,
            fontWeight: 400,
            color: "#202124",
            mb: 1,
          }}
        >
          7.24 GB{" "}
          <Typography
            component="span"
            sx={{ fontSize: 14, color: "#5f6368", fontWeight: 400 }}
          >
            of 2 TB used
          </Typography>
        </Typography>

        {/* Progress Bar */}
        <Box sx={{ position: "relative", height: 8, mb: 2 }}>
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: "#e8eaed",
              borderRadius: 1,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              display: "flex",
              height: "100%",
              width: `${Math.min(storagePercentage * 10, 100)}%`,
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: `${drivePercentage}%`,
                backgroundColor: "#4285f4",
              }}
            />
            <Box
              sx={{
                width: `${photosPercentage}%`,
                backgroundColor: "#fbbc04",
              }}
            />
            <Box
              sx={{
                width: `${gmailPercentage}%`,
                backgroundColor: "#ea4335",
              }}
            />
            <Box
              sx={{
                width: `${otherPercentage}%`,
                backgroundColor: "#34a853",
              }}
            />
          </Box>
        </Box>

        {/* Legend */}
        <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: "#4285f4",
                borderRadius: "50%",
              }}
            />
            <Typography sx={{ fontSize: 13, color: "#5f6368" }}>
              Google Drive
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: "#fbbc04",
                borderRadius: "50%",
              }}
            />
            <Typography sx={{ fontSize: 13, color: "#5f6368" }}>
              Google Photos
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: "#ea4335",
                borderRadius: "50%",
              }}
            />
            <Typography sx={{ fontSize: 13, color: "#5f6368" }}>
              Gmail
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: "#34a853",
                borderRadius: "50%",
              }}
            />
            <Typography sx={{ fontSize: 13, color: "#5f6368" }}>
              Other
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={
              <Box
                component="span"
                sx={{
                  color: "#1a73e8",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                ⬆
              </Box>
            }
            sx={{
              textTransform: "none",
              color: "#1a73e8",
              borderColor: "#dadce0",
              backgroundColor: "white",
              borderRadius: "20px",
              px: 3,
              py: 1,
              fontSize: 14,
              fontWeight: 500,
              "&:hover": {
                borderColor: "#d2e3fc",
                backgroundColor: "#f8f9fa",
              },
            }}
          >
            Get more storage
          </Button>
          <Button
            variant="text"
            sx={{
              textTransform: "none",
              color: "#1a73e8",
              fontSize: 14,
              fontWeight: 500,
              px: 2,
              "&:hover": {
                backgroundColor: "#f8f9fa",
              },
            }}
          >
            Clean up space
          </Button>
        </Box>
      </Box>

      {/* File List Table */}
      <TableContainer sx={{ backgroundColor: "white", borderRadius: "8px" }}>
        <Table sx={{ width: "100%" }}>
          <TableHead>
            <TableRow
              sx={{
                borderBottom: `1px solid #e8eaed`,
              }}
            >
              <TableCell
                sx={{
                  py: 1.5,
                  px: 2.5,
                  borderBottom: "none",
                  width: "70%",
                }}
              >
                <Typography fontSize={12} fontWeight={500} color="#5f6368">
                  Name
                </Typography>
              </TableCell>
              <TableCell
                sx={{
                  py: 1.5,
                  px: 2.5,
                  borderBottom: "none",
                  width: "30%",
                }}
              >
                <TableSortLabel
                  active={true}
                  direction={sortOrder}
                  onClick={handleSortToggle}
                  sx={{
                    "& .MuiTableSortLabel-icon": {
                      fontSize: 18,
                    },
                  }}
                >
                  <Typography fontSize={12} fontWeight={500} color="#5f6368">
                    Storage used
                  </Typography>
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedFiles.map((file) => (
              <TableRow
                key={file.id}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f8f9fa",
                  },
                  cursor: "pointer",
                  borderBottom: `1px solid #e8eaed`,
                }}
              >
                <TableCell
                  sx={{
                    py: 1.5,
                    px: 2.5,
                    borderBottom: "none",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ "& > svg": { fontSize: 24 } }}>
                      {getFileIcon(file.type)}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        fontSize={14}
                        color="#202124"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {file.name}
                      </Typography>
                      {file.isShared && (
                        <PeopleIcon sx={{ fontSize: 16, color: "#5f6368" }} />
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    py: 1.5,
                    px: 2.5,
                    borderBottom: "none",
                  }}
                >
                  <Typography fontSize={14} color="#5f6368">
                    {formatFileSize(file.size)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
