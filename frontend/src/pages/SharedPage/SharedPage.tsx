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
  ArrowDownward as ArrowDownwardIcon,
  BusinessOutlined as BusinessIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { getFileIcon } from "../../utils/fileIcons";

// Mock data for shared files
const mockSharedFiles = [
  {
    id: "1",
    name: "Google Drive Reinforcement Learning Environment",
    type: "document" as const,
    sharedBy: "anshul.sharma@scaler.com",
    sharedByInitial: "A",
    sharedByColor: "#EA4335",
    dateShared: "Nov 1",
    isShared: true,
    timeGroup: "Yesterday",
  },
  {
    id: "2",
    name: "SST Fee Management System: Student Guide",
    type: "document" as const,
    sharedBy: "r.karthik@scaler.com",
    sharedByInitial: "R",
    sharedByColor: "#E91E63",
    dateShared: "Oct 31",
    isShared: true,
    timeGroup: "Earlier this week",
  },
  {
    id: "3",
    name: "SST Annual Awards - Nomination Guidelines",
    type: "document" as const,
    sharedBy: "vedaansh.kaushik@scaler.com",
    sharedByInitial: "V",
    sharedByColor: "#4285F4",
    dateShared: "Oct 28",
    isShared: true,
    timeGroup: "Earlier this week",
  },
  {
    id: "4",
    name: "SST: Academic Clubs [Open]",
    type: "document" as const,
    sharedBy: "utkarsh@scaler.com",
    sharedByInitial: "U",
    sharedByColor: "#5F6368",
    dateShared: "Oct 28",
    isShared: true,
    hasCatchUp: true,
    timeGroup: "Earlier this week",
  },
  {
    id: "5",
    name: "YC Application _ Template",
    type: "document" as const,
    sharedBy: "vikram@grayscale.vc",
    sharedByInitial: "V",
    sharedByColor: "#C5221F",
    dateShared: "Oct 26",
    isShared: true,
    timeGroup: "Last week",
  },
  {
    id: "6",
    name: 'Event Concept Note — "Hack with Vercel: Building with AI"',
    type: "document" as const,
    sharedBy: "shruti.sagar@scaler.com",
    sharedByInitial: "S",
    sharedByColor: "#F9AB00",
    dateShared: "Oct 24",
    isShared: true,
    timeGroup: "Last week",
  },
  {
    id: "7",
    name: "Job Description_ Coding Teacher.pdf",
    type: "pdf" as const,
    sharedBy: "payal.yerme@vedantu.com",
    sharedByInitial: "P",
    sharedByColor: "#F4B400",
    dateShared: "Oct 22",
    isShared: true,
    timeGroup: "Last week",
  },
  {
    id: "8",
    name: "Vedantu_Early_Learning_Teacher_JD.pdf",
    type: "pdf" as const,
    sharedBy: "payal.yerme@vedantu.com",
    sharedByInitial: "P",
    sharedByColor: "#F4B400",
    dateShared: "Oct 22",
    isShared: true,
    timeGroup: "Last week",
  },
  {
    id: "9",
    name: "Y Combinator 10 Questions to Discuss with a Potential Co-Founder",
    type: "document" as const,
    sharedBy: "jared@ycombinator.com",
    sharedByInitial: "J",
    sharedByColor: "#FF6D00",
    dateShared: "Oct 21",
    isShared: true,
    timeGroup: "Last week",
  },
  {
    id: "10",
    name: "YC Guide to Co-founder Matching",
    type: "spreadsheet" as const,
    sharedBy: "Y Combinator",
    sharedByInitial: "Y",
    sharedByColor: "#5F6368",
    dateShared: "Oct 21",
    isShared: true,
    isSharedByOrg: true,
    timeGroup: "Last week",
  },
  {
    id: "11",
    name: "Project Report on WiFi-based Multimodal Human and Environment Sensing",
    type: "document" as const,
    sharedBy: "techSas",
    sharedByInitial: "T",
    sharedByColor: "#F4B400",
    dateShared: "Oct 16",
    isShared: true,
    timeGroup: "Last month",
  },
];

export const SharedPage = () => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Group files by time period
  const groupedFiles = mockSharedFiles.reduce((groups, file) => {
    const group = file.timeGroup;
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(file);
    return groups;
  }, {} as Record<string, typeof mockSharedFiles>);

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
          Shared with me
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
                Shared by
              </TableCell>
              <TableCell
                sx={{
                  color: "#5f6368",
                  fontSize: 12,
                  fontWeight: 500,
                  borderBottom: "1px solid #e8eaed",
                  py: 1.5,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#f8f9fa",
                  },
                }}
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  Date shared
                  <ArrowDownwardIcon
                    sx={{
                      fontSize: 16,
                      color: "#1a73e8",
                      transform:
                        sortOrder === "asc" ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s",
                    }}
                  />
                </Box>
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: "1px solid #e8eaed",
                  width: 48,
                  py: 1.5,
                  pr: 2,
                }}
              >
                <IconButton size="small" sx={{ color: "#5f6368" }}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M3 9h4V5H3v4zm0 6h4v-4H3v4zm6 0h4v-4H9v4zm6 0h4v-4h-4v4zM9 9h4V5H9v4zm6-4v4h4V5h-4z" />
                  </svg>
                </IconButton>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#5f6368",
                    display: "inline",
                    ml: 0.5,
                  }}
                >
                  Sort
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(groupedFiles).map(([timeGroup, files]) => (
              <>
                {/* Time Group Header */}
                <TableRow key={`group-${timeGroup}`}>
                  <TableCell
                    colSpan={4}
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
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
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
                          {file.hasCatchUp && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                px: 1,
                                py: 0.25,
                                backgroundColor: "#f1f3f4",
                                borderRadius: "12px",
                                ml: 0.5,
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
                          )}
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Shared by */}
                    <TableCell
                      sx={{
                        borderBottom: "1px solid #e8eaed",
                        py: 1.5,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {file.isSharedByOrg ? (
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              backgroundColor: "#fff",
                              border: "1px solid #dadce0",
                            }}
                          >
                            <BusinessIcon
                              sx={{ fontSize: 16, color: "#5f6368" }}
                            />
                          </Avatar>
                        ) : (
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              fontSize: 12,
                              backgroundColor: file.sharedByColor,
                            }}
                          >
                            {file.sharedByInitial}
                          </Avatar>
                        )}
                        <Typography
                          sx={{
                            fontSize: 14,
                            color: "#202124",
                          }}
                        >
                          {file.sharedBy}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Date shared */}
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
                        {file.dateShared}
                      </Typography>
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
