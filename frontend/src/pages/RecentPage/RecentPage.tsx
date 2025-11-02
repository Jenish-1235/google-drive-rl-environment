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
  Avatar,
} from "@mui/material";
import {
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              display: "flex",
              backgroundColor: "#ffffff",
              borderRadius: "50px",
              padding: "3px",
              gap: "2px",
              position: "relative",
              border: "1.5px solid #5f6368",
              boxShadow: "0 1px 3px rgba(60, 64, 67, 0.3)",
              height: "36px",
            }}
          >
            <IconButton
              size="small"
              onClick={() => setViewMode("list")}
              disableRipple
              sx={{
                color: viewMode === "list" ? "#202124" : "#5f6368",
                backgroundColor:
                  viewMode === "list" ? "#d3e3fd" : "transparent",
                borderRadius: "18px",
                position: "relative",
                minWidth: "48px",
                height: "28px",
                px: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                border: "none",
                outline: "none",
                "&:hover": {
                  backgroundColor:
                    viewMode === "list" ? "#d3e3fd" : "rgba(0, 0, 0, 0.04)",
                },
                "&:focus": {
                  outline: "none",
                },
                "&:active": {
                  outline: "none",
                },
              }}
            >
              {viewMode === "list" && (
                <svg
                  viewBox="0 0 18 18"
                  aria-hidden="true"
                  width="12"
                  height="12"
                  style={{
                    flexShrink: 0,
                  }}
                >
                  <path
                    fill="none"
                    stroke="#5f6368"
                    strokeWidth="2.5"
                    d="M3 9.23529L6.84 13L15 5"
                  />
                </svg>
              )}
              <svg
                width="14"
                height="12"
                viewBox="0 0 14 12"
                fill="currentColor"
                style={{
                  flexShrink: 0,
                }}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1 0C0.447715 0 0 0.447715 0 1C0 1.55228 0.447715 2 1 2H13C13.5523 2 14 1.55228 14 1C14 0.447715 13.5523 0 13 0H1ZM0 6C0 5.44772 0.447715 5 1 5H13C13.5523 5 14 5.44772 14 6C14 6.55228 13.5523 7 13 7H1C0.447715 7 0 6.55228 0 6ZM1 10C0.447715 10 0 10.4477 0 11C0 11.5523 0.447715 12 1 12H13C13.5523 12 14 11.5523 14 11C14 10.4477 13.5523 10 13 10H1Z"
                  fill="currentColor"
                />
              </svg>
            </IconButton>
            {/* Separator Line */}
            <Box
              sx={{
                width: "1px",
                height: "24px",
                backgroundColor: "#dadce0",
                alignSelf: "center",
              }}
            />
            <IconButton
              size="small"
              onClick={() => setViewMode("grid")}
              disableRipple
              sx={{
                color: viewMode === "grid" ? "#202124" : "#5f6368",
                backgroundColor:
                  viewMode === "grid" ? "#d3e3fd" : "transparent",
                borderRadius: "18px",
                position: "relative",
                minWidth: "48px",
                height: "28px",
                px: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                border: "none",
                outline: "none",
                "&:hover": {
                  backgroundColor:
                    viewMode === "grid" ? "#d3e3fd" : "rgba(0, 0, 0, 0.04)",
                },
                "&:focus": {
                  outline: "none",
                },
                "&:active": {
                  outline: "none",
                },
              }}
            >
              {viewMode === "grid" && (
                <svg
                  viewBox="0 0 18 18"
                  aria-hidden="true"
                  width="12"
                  height="12"
                  style={{
                    flexShrink: 0,
                  }}
                >
                  <path
                    fill="none"
                    stroke="#5f6368"
                    strokeWidth="2.5"
                    d="M3 9.23529L6.84 13L15 5"
                  />
                </svg>
              )}
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  flexShrink: 0,
                }}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 1C0 0.447715 0.447715 0 1 0H5C5.55228 0 6 0.447715 6 1V5C6 5.55228 5.55228 6 5 6H1C0.447715 6 0 5.55228 0 5V1ZM2 2H4V4H2V2ZM0 9C0 8.44772 0.447715 8 1 8H5C5.55228 8 6 8.44772 6 9V13C6 13.5523 5.55228 14 5 14H1C0.447715 14 0 13.5523 0 13V9ZM2 10H4V12H2V10ZM9 0C8.44772 0 8 0.447715 8 1V5C8 5.55228 8.44772 6 9 6H13C13.5523 6 14 5.55228 14 5V1C14 0.447715 13.5523 0 13 0H9ZM12 2H10V4H12V2ZM8 9C8 8.44772 8.44772 8 9 8H13C13.5523 8 14 8.44772 14 9V13C14 13.5523 13.5523 14 13 14H9C8.44772 14 8 13.5523 8 13V9ZM10 10H12V12H10V10Z"
                  fill="currentColor"
                />
              </svg>
            </IconButton>
          </Box>

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
        {["Type", "People", "Modified", "Source"].map((filter) => (
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
                        {getFileIcon(file.type)}
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
