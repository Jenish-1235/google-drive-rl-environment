import {
  Box,
  Typography,
  Button,
  IconButton,
  ButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
} from "@mui/material";
import {
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  InfoOutlined as InfoIcon,
  KeyboardArrowDown as ArrowDownIcon,
  MoreVert as MoreVertIcon,
  PeopleOutline as PeopleIcon,
  FolderOutlined as FolderIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { getFileIcon } from "../../utils/fileIcons";
import { formatFileSize } from "../../utils/formatters";

// Mock data for recent files
const mockRecentFiles = [
  {
    id: "1",
    name: "Google Drive Reinforcement Learning Environment",
    type: "document" as const,
    owner: "anshul.sharma@scaler.com",
    ownerInitial: "A",
    ownerColor: "#EA4335",
    fileSize: 6144, // 6 KB
    location: "Shared with me",
    date: "Nov 1",
    dateInfo: "Opened by me",
    isShared: true,
    timeGroup: "Yesterday",
  },
  {
    id: "2",
    name: "SST Fee Management System: Student Guide",
    type: "document" as const,
    owner: "r.karthik@scaler.com",
    ownerInitial: "R",
    ownerColor: "#E91E63",
    fileSize: 2411520, // 2.3 MB
    location: "Shared with me",
    date: "Oct 31",
    dateInfo: "Opened by me",
    isShared: true,
    timeGroup: "Earlier this week",
  },
  {
    id: "3",
    name: "NeroSpatial-Aristotle-for-the-Next-Wave-of-Alexanders (2).pdf",
    type: "pdf" as const,
    owner: "me",
    ownerInitial: "M",
    ownerColor: "#34A853",
    fileSize: 6502400, // 6.2 MB
    location: "NeroSpatial",
    date: "Oct 31",
    dateInfo: "Modified by me",
    isShared: false,
    timeGroup: "Earlier this week",
  },
  {
    id: "4",
    name: "SST: Academic Clubs [Open]",
    type: "document" as const,
    owner: "utkarsh@scaler.com",
    ownerInitial: "U",
    ownerColor: "#5F6368",
    fileSize: 17408, // 17 KB
    location: "Shared with me",
    date: "Oct 30",
    dateInfo: "Opened by me",
    isShared: true,
    hasCatchUp: true,
    timeGroup: "Earlier this week",
  },
  {
    id: "5",
    name: "NeroSpatial - Building Spatially Context Aware Companions",
    type: "document" as const,
    owner: "me",
    ownerInitial: "M",
    ownerColor: "#34A853",
    fileSize: 7168, // 7 KB
    location: "My Drive",
    date: "Oct 28",
    dateInfo: "Opened by me",
    isShared: false,
    timeGroup: "Earlier this week",
  },
  {
    id: "6",
    name: "SST: Academic Clubs [Open].pdf",
    type: "pdf" as const,
    owner: "me",
    ownerInitial: "M",
    ownerColor: "#34A853",
    fileSize: 345088, // 337 KB
    location: "My Drive",
    date: "Oct 28",
    dateInfo: "Uploaded",
    isShared: false,
    timeGroup: "Earlier this week",
  },
  {
    id: "7",
    name: "SST Annual Awards - Nomination Guidelines",
    type: "document" as const,
    owner: "vedaansh.kaushik@scaler.com",
    ownerInitial: "V",
    ownerColor: "#4285F4",
    fileSize: 23552, // 23 KB
    location: "Shared with me",
    date: "Oct 28",
    dateInfo: "Opened by me",
    isShared: true,
    timeGroup: "Earlier this week",
  },
  {
    id: "8",
    name: "NeroSpatial-Pitch-Deck",
    type: "presentation" as const,
    owner: "me",
    ownerInitial: "M",
    ownerColor: "#34A853",
    fileSize: 2411520, // 2.3 MB
    location: "My Drive",
    date: "Oct 27",
    dateInfo: "Opened by me",
    isShared: false,
    timeGroup: "Earlier this week",
  },
  {
    id: "9",
    name: "Untitled presentation",
    type: "presentation" as const,
    owner: "me",
    ownerInitial: "M",
    ownerColor: "#34A853",
    fileSize: 92160, // 90 KB
    location: "My Drive",
    date: "Oct 27",
    dateInfo: "Modified by me",
    isShared: false,
    timeGroup: "Earlier this week",
  },
  {
    id: "10",
    name: "SINE Pitch",
    type: "presentation" as const,
    owner: "me",
    ownerInitial: "M",
    ownerColor: "#34A853",
    fileSize: 89088, // 87 KB
    location: "My Drive",
    date: "Oct 27",
    dateInfo: "Modified by me",
    isShared: false,
    timeGroup: "Earlier this week",
  },
  {
    id: "11",
    name: "NeroSpatial-Pitch-Deck.pdf",
    type: "pdf" as const,
    owner: "me",
    ownerInitial: "M",
    ownerColor: "#34A853",
    fileSize: 943104, // 921 KB
    location: "My Drive",
    date: "Oct 27",
    dateInfo: "Uploaded",
    isShared: false,
    timeGroup: "Earlier this week",
  },
  {
    id: "12",
    name: "YC Application _ Template",
    type: "document" as const,
    owner: "vikram@grayscale.vc",
    ownerInitial: "V",
    ownerColor: "#C5221F",
    fileSize: 6144, // 6 KB
    location: "Shared with me",
    date: "Oct 26",
    dateInfo: "Opened by me",
    isShared: true,
    timeGroup: "Last week",
  },
];

export const RecentPage = () => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Group files by time period
  const groupedFiles = mockRecentFiles.reduce((groups, file) => {
    const group = file.timeGroup;
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(file);
    return groups;
  }, {} as Record<string, typeof mockRecentFiles>);

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
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        {/* Title */}
        <Typography
          sx={{
            fontSize: 22,
            fontWeight: 500,
            color: "#202124",
          }}
        >
          Recent
        </Typography>

        {/* Right Side: View Toggle + Info */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ButtonGroup
            variant="outlined"
            sx={{
              "& .MuiButtonGroup-grouped": {
                borderColor: "#dadce0",
                minWidth: 40,
                "&:hover": {
                  borderColor: "#dadce0",
                  backgroundColor: "#f8f9fa",
                },
              },
            }}
          >
            <IconButton
              size="small"
              onClick={() => setViewMode("list")}
              sx={{
                color: viewMode === "list" ? "#1a73e8" : "#5f6368",
                backgroundColor:
                  viewMode === "list" ? "#e8f0fe" : "transparent",
                borderRadius: "50%",
                width: 40,
                height: 40,
                border:
                  viewMode === "list"
                    ? "1px solid #1a73e8"
                    : "1px solid #dadce0",
                "&:hover": {
                  backgroundColor: viewMode === "list" ? "#e8f0fe" : "#f8f9fa",
                },
              }}
            >
              <ViewListIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setViewMode("grid")}
              sx={{
                color: viewMode === "grid" ? "#1a73e8" : "#5f6368",
                backgroundColor:
                  viewMode === "grid" ? "#e8f0fe" : "transparent",
                borderRadius: "50%",
                width: 40,
                height: 40,
                border:
                  viewMode === "grid"
                    ? "1px solid #1a73e8"
                    : "1px solid #dadce0",
                ml: 1,
                "&:hover": {
                  backgroundColor: viewMode === "grid" ? "#e8f0fe" : "#f8f9fa",
                },
              }}
            >
              <ViewModuleIcon fontSize="small" />
            </IconButton>
          </ButtonGroup>

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
        {["Type", "People", "Modified", "Source"].map((filter) => (
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

      {/* File List */}
      <TableContainer
        sx={{
          backgroundColor: "white",
          borderRadius: 1,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  color: "#5f6368",
                  fontSize: 12,
                  fontWeight: 500,
                  borderBottom: "1px solid #e8eaed",
                  py: 1.5,
                  pl: 2,
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  color: "#5f6368",
                  fontSize: 12,
                  fontWeight: 500,
                  borderBottom: "1px solid #e8eaed",
                  py: 1.5,
                }}
              >
                Owner
              </TableCell>
              <TableCell
                sx={{
                  color: "#5f6368",
                  fontSize: 12,
                  fontWeight: 500,
                  borderBottom: "1px solid #e8eaed",
                  py: 1.5,
                }}
              >
                File size
              </TableCell>
              <TableCell
                sx={{
                  color: "#5f6368",
                  fontSize: 12,
                  fontWeight: 500,
                  borderBottom: "1px solid #e8eaed",
                  py: 1.5,
                }}
              >
                Location
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: "1px solid #e8eaed",
                  width: 48,
                }}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(groupedFiles).map(([timeGroup, files]) => (
              <>
                {/* Time Group Header */}
                <TableRow key={`group-${timeGroup}`}>
                  <TableCell
                    colSpan={5}
                    sx={{
                      color: "#5f6368",
                      fontSize: 12,
                      fontWeight: 500,
                      borderBottom: "none",
                      py: 2,
                      pl: 2,
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    {timeGroup}
                  </TableCell>
                </TableRow>

                {/* Files in this group */}
                {files.map((file) => (
                  <TableRow
                    key={file.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f8f9fa",
                      },
                      cursor: "pointer",
                    }}
                  >
                    {/* Name */}
                    <TableCell
                      sx={{
                        borderBottom: "1px solid #e8eaed",
                        py: 1.5,
                        pl: 2,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        {getFileIcon(file.type, 20)}
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: 14,
                                color: "#202124",
                                fontWeight: 400,
                              }}
                            >
                              {file.name}
                            </Typography>
                            {file.isShared && (
                              <PeopleIcon
                                sx={{ fontSize: 16, color: "#5f6368" }}
                              />
                            )}
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: 12,
                                color: "#5f6368",
                              }}
                            >
                              {file.date}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 12,
                                color: "#5f6368",
                              }}
                            >
                              •
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 12,
                                color: "#5f6368",
                              }}
                            >
                              {file.dateInfo}
                            </Typography>
                            {file.hasCatchUp && (
                              <>
                                <Typography
                                  sx={{
                                    fontSize: 12,
                                    color: "#5f6368",
                                  }}
                                >
                                  •
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    px: 1,
                                    py: 0.25,
                                    backgroundColor: "#f1f3f4",
                                    borderRadius: "12px",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 16,
                                      height: 16,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 16 16"
                                      fill="none"
                                    >
                                      <path
                                        d="M8 2L9.5 5.5L13 6L10.5 8.5L11 12L8 10L5 12L5.5 8.5L3 6L6.5 5.5L8 2Z"
                                        fill="#5f6368"
                                      />
                                    </svg>
                                  </Box>
                                  <Typography
                                    sx={{
                                      fontSize: 11,
                                      color: "#5f6368",
                                      fontWeight: 500,
                                    }}
                                  >
                                    Catch up
                                  </Typography>
                                </Box>
                              </>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Owner */}
                    <TableCell
                      sx={{
                        borderBottom: "1px solid #e8eaed",
                        py: 1.5,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            fontSize: 12,
                            backgroundColor: file.ownerColor,
                          }}
                        >
                          {file.ownerInitial}
                        </Avatar>
                        <Typography
                          sx={{
                            fontSize: 14,
                            color: "#202124",
                          }}
                        >
                          {file.owner}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* File Size */}
                    <TableCell
                      sx={{
                        borderBottom: "1px solid #e8eaed",
                        py: 1.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 14,
                          color: "#202124",
                        }}
                      >
                        {formatFileSize(file.fileSize)}
                      </Typography>
                    </TableCell>

                    {/* Location */}
                    <TableCell
                      sx={{
                        borderBottom: "1px solid #e8eaed",
                        py: 1.5,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        {file.location === "My Drive" ? (
                          <FolderIcon sx={{ fontSize: 16, color: "#5f6368" }} />
                        ) : (
                          <PeopleIcon sx={{ fontSize: 16, color: "#5f6368" }} />
                        )}
                        <Typography
                          sx={{
                            fontSize: 14,
                            color: "#202124",
                          }}
                        >
                          {file.location}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Actions */}
                    <TableCell
                      sx={{
                        borderBottom: "1px solid #e8eaed",
                        py: 1.5,
                        pr: 2,
                      }}
                    >
                      <IconButton size="small">
                        <MoreVertIcon sx={{ fontSize: 20, color: "#5f6368" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
