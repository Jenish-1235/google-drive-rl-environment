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
  CircularProgress,
} from "@mui/material";
import {
  InfoOutlined as InfoIcon,
  ArrowDownward as ArrowDownIcon,
  PeopleAlt as PeopleIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { getFileIcon } from "../../utils/fileIcons";
import { formatFileSize } from "../../utils/formatters";
import type { FileType } from "../../types/file.types";
import { getFileTypeFromMime } from "../../types/file.types";
import { userService, type StorageAnalytics } from "../../services";

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
  const [storageAnalytics, setStorageAnalytics] = useState<StorageAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch storage analytics
  useEffect(() => {
    const fetchStorageAnalytics = async () => {
      setLoading(true);
      try {
        const data = await userService.getStorageAnalytics();
        setStorageAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch storage analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStorageAnalytics();
  }, []);

  // Calculate storage stats from API data
  const totalStorage = storageAnalytics?.storage_limit || 0;
  const usedStorage = storageAnalytics?.total_storage || 0;
  const storagePercentage = storageAnalytics?.storage_percentage || 0;

  // Storage breakdown from API
  const breakdown = storageAnalytics?.breakdown || [];
  const totalBreakdownSize = breakdown.reduce((sum, cat) => sum + cat.total_size, 0) || 1;

  const documentsBreakdown = breakdown.find(b => b.category === 'documents');
  const imagesBreakdown = breakdown.find(b => b.category === 'images');
  const videosBreakdown = breakdown.find(b => b.category === 'videos');
  const otherBreakdown = breakdown.find(b => b.category === 'other');

  const drivePercentage = documentsBreakdown ? (documentsBreakdown.total_size / totalBreakdownSize) * 100 : 0;
  const photosPercentage = imagesBreakdown ? (imagesBreakdown.total_size / totalBreakdownSize) * 100 : 0;
  const videosPercentage = videosBreakdown ? (videosBreakdown.total_size / totalBreakdownSize) * 100 : 0;
  const otherPercentage = otherBreakdown ? (otherBreakdown.total_size / totalBreakdownSize) * 100 : 0;

  // Convert largest files to StorageFile format
  const largestFiles: StorageFile[] = storageAnalytics?.largest_files.map(file => {
    const fileType = getFileTypeFromMime(file.mime_type, "file");
    return {
      id: file.id,
      name: file.name,
      type: fileType,
      size: file.size,
      isShared: false, // Not available in LargestFile
    };
  }) || mockStorageFiles;

  const sortedFiles = [...largestFiles].sort((a, b) => {
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
            disableRipple
            sx={{
              color: "#5f6368",
              padding: 0.5,
              "&:hover": {
                backgroundColor: "rgba(95, 99, 104, 0.1)",
              },
              "&:focus": {
                outline: "none",
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
              backgroundColor: "transparent",
              borderRadius: 1,
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
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography
              sx={{
                fontSize: 32,
                fontWeight: 400,
                color: "#202124",
                mb: 1,
              }}
            >
              {formatFileSize(usedStorage)}{" "}
              <Typography
                component="span"
                sx={{ fontSize: 14, color: "#5f6368", fontWeight: 400 }}
              >
                of {formatFileSize(totalStorage)} used
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
                width: `${videosPercentage}%`,
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
              Documents ({documentsBreakdown ? formatFileSize(documentsBreakdown.total_size) : '0 B'})
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
              Images ({imagesBreakdown ? formatFileSize(imagesBreakdown.total_size) : '0 B'})
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
              Videos ({videosBreakdown ? formatFileSize(videosBreakdown.total_size) : '0 B'})
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
              Other ({otherBreakdown ? formatFileSize(otherBreakdown.total_size) : '0 B'})
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
          </>
        )}
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
