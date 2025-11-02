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
