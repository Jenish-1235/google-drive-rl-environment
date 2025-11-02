import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  IconButton,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  FormControlLabel,
  Button,
} from '@mui/material';
import {
  Close as CloseIcon,
} from '@mui/icons-material';
import { colors } from '../../theme/theme';

export interface AdvancedSearchFilters {
  type: string;
  owner: string;
  includesWords: string;
  itemName: string;
  location: string;
  inBin: boolean;
  starred: boolean;
  encrypted: boolean;
  dateModified: string;
  awaitingApproval: boolean;
  requestedByMe: boolean;
  sharedTo: string;
  followUps: string;
}

interface AdvancedSearchModalProps {
  open: boolean;
  onClose: () => void;
  onSearch?: (filters: AdvancedSearchFilters) => void;
}

export const AdvancedSearchModal = ({
  open,
  onClose,
  onSearch,
}: AdvancedSearchModalProps) => {
  const [filters, setFilters] = useState<AdvancedSearchFilters>({
    type: 'any',
    owner: 'anyone',
    includesWords: '',
    itemName: '',
    location: 'anywhere',
    inBin: false,
    starred: false,
    encrypted: false,
    dateModified: 'any-time',
    awaitingApproval: false,
    requestedByMe: false,
    sharedTo: '',
    followUps: '-',
  });

  const handleReset = () => {
    setFilters({
      type: 'any',
      owner: 'anyone',
      includesWords: '',
      itemName: '',
      location: 'anywhere',
      inBin: false,
      starred: false,
      encrypted: false,
      dateModified: 'any-time',
      awaitingApproval: false,
      requestedByMe: false,
      sharedTo: '',
      followUps: '-',
    });
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(filters);
    }
    onClose();
  };

  const handleFilterChange = (field: keyof AdvancedSearchFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionProps={{
        timeout: {
          enter: 300,
          exit: 200,
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxWidth: 720,
          position: 'absolute',
          left: '20%',
          top: '10%',
          m: 0,
          boxShadow: '0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.2)',
        },
      }}
      sx={{
        '& .MuiDialog-container': {
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          pl: '10%',
          pt: '5%',
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          transition: 'opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 4,
          pt: 3,
          pb: 2,
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 500, fontSize: '1.25rem' }}>
          Advanced search
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: 'text.secondary',
            transition: 'background-color 0.2s',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent
        sx={{
          px: 4,
          pt: 1,
          pb: 4,
          maxHeight: '70vh',
          overflowY: 'auto',
          // Custom scrollbar styling to match Google Drive
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#dadce0',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#bdc1c6',
            },
          },
          // For Firefox
          scrollbarWidth: 'thin',
          scrollbarColor: '#dadce0 transparent',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Type */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="body1"
              sx={{
                minWidth: 180,
                color: '#202124',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              Type
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.border,
                  },
                }}
              >
                <MenuItem value="any">Any</MenuItem>
                <MenuItem value="folders">Folders</MenuItem>
                <MenuItem value="documents">Documents</MenuItem>
                <MenuItem value="spreadsheets">Spreadsheets</MenuItem>
                <MenuItem value="presentations">Presentations</MenuItem>
                <MenuItem value="forms">Forms</MenuItem>
                <MenuItem value="pdfs">PDFs</MenuItem>
                <MenuItem value="images">Images</MenuItem>
                <MenuItem value="videos">Videos</MenuItem>
                <MenuItem value="audio">Audio</MenuItem>
                <MenuItem value="archives">Archives</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Owner */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="body1"
              sx={{
                minWidth: 180,
                color: '#202124',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              Owner
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={filters.owner}
                onChange={(e) => handleFilterChange('owner', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.border,
                  },
                }}
              >
                <MenuItem value="anyone">Anyone</MenuItem>
                <MenuItem value="me">Owned by me</MenuItem>
                <MenuItem value="not-me">Not owned by me</MenuItem>
                <MenuItem value="specific">Specific person</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Includes the words */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="body1"
              sx={{
                minWidth: 180,
                color: '#202124',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              Includes the words
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter words found in the file"
              value={filters.includesWords}
              onChange={(e) => handleFilterChange('includesWords', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: colors.border,
                  },
                },
              }}
            />
          </Box>

          {/* Item name */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="body1"
              sx={{
                minWidth: 180,
                color: '#202124',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              Item name
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter a term that matches part of the file name"
              value={filters.itemName}
              onChange={(e) => handleFilterChange('itemName', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: colors.border,
                  },
                },
              }}
            />
          </Box>

          {/* Location */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="body1"
              sx={{
                minWidth: 180,
                color: '#202124',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              Location
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.border,
                  },
                }}
              >
                <MenuItem value="anywhere">Anywhere</MenuItem>
                <MenuItem value="my-drive">My Drive</MenuItem>
                <MenuItem value="shared-with-me">Shared with me</MenuItem>
                <MenuItem value="starred">Starred</MenuItem>
                <MenuItem value="recent">Recent</MenuItem>
                <MenuItem value="trash">Trash</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Checkboxes Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ minWidth: 180 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', ml: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.inBin}
                    onChange={(e) => handleFilterChange('inBin', e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    In bin
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.starred}
                    onChange={(e) => handleFilterChange('starred', e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    Starred
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.encrypted}
                    onChange={(e) => handleFilterChange('encrypted', e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    Encrypted
                  </Typography>
                }
              />
            </Box>
          </Box>

          {/* Date modified */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="body1"
              sx={{
                minWidth: 180,
                color: '#202124',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              Date modified
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={filters.dateModified}
                onChange={(e) => handleFilterChange('dateModified', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.border,
                  },
                }}
              >
                <MenuItem value="any-time">Any time</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="yesterday">Yesterday</MenuItem>
                <MenuItem value="last-7-days">Last 7 days</MenuItem>
                <MenuItem value="last-30-days">Last 30 days</MenuItem>
                <MenuItem value="last-90-days">Last 90 days</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Approvals and eSignatures */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="body1"
              sx={{
                minWidth: 180,
                color: '#202124',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              Approvals and eSignatures
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.awaitingApproval}
                    onChange={(e) => handleFilterChange('awaitingApproval', e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    Awaiting my approval
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.requestedByMe}
                    onChange={(e) => handleFilterChange('requestedByMe', e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    Requested by me
                  </Typography>
                }
              />
            </Box>
          </Box>

          {/* Shared to */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="body1"
              sx={{
                minWidth: 180,
                color: '#202124',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              Shared to
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter a name or email address..."
              value={filters.sharedTo}
              onChange={(e) => handleFilterChange('sharedTo', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: colors.border,
                  },
                },
              }}
            />
          </Box>

          {/* Follow-ups */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="body1"
              sx={{
                minWidth: 180,
                color: '#202124',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              Follow-ups
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={filters.followUps}
                onChange={(e) => handleFilterChange('followUps', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.border,
                  },
                }}
              >
                <MenuItem value="-">-</MenuItem>
                <MenuItem value="any">Any</MenuItem>
                <MenuItem value="suggestions-only">Suggestions only</MenuItem>
                <MenuItem value="comments-assigned">Comments assigned to me only</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Action Buttons Row */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2,
              pt: 2,
              borderTop: `1px solid ${colors.border}`,
            }}
          >
            {/* Learn more link - left side */}
            <Button
              sx={{
                color: '#1a73e8',
                textTransform: 'none',
                fontSize: 14,
                '&:hover': {
                  bgcolor: 'transparent',
                  textDecoration: 'underline',
                },
              }}
            >
              Learn more
            </Button>

            {/* Action buttons - right side */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                onClick={handleReset}
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
                Reset
              </Button>
              <Button
                variant="contained"
                onClick={handleSearch}
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
                }}
              >
                Search
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
