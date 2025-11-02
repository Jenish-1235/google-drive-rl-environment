import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Box,
  IconButton,
  Tabs,
  Tab,
  Typography,
  Button,
  Avatar,
  TextField,
} from '@mui/material';
import { Close as CloseIcon, ShieldOutlined as ShieldIcon, Folder as FolderIcon, Person as PersonIcon } from '@mui/icons-material';
import { colors } from '../../theme/theme';
import { useFileStore } from '../../store/fileStore';

interface DetailsPanelProps {
  open: boolean;
  onClose: () => void;
}

export const DetailsPanel = ({ open, onClose }: DetailsPanelProps) => {
  const [activeTab, setActiveTab] = useState(0);
  // Select primitive store slices to avoid re-renders from new array instances
  const selectedIds = useFileStore((state) => state.selectedFiles);
  const files = useFileStore((state) => state.files);
  const selectedFile = useMemo(() => {
    if (selectedIds.length !== 1) return null;
    const id = selectedIds[0];
    return files.find((f) => f.id === id) || null;
  }, [selectedIds, files]);

  const headerIcon = selectedFile ? (
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: '10px',
        backgroundColor: '#f1f3f4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FolderIcon sx={{ fontSize: 20, color: '#5f6368' }} />
    </Box>
  ) : (
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: '10px',
        backgroundColor: '#f1f3f4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ color: '#5f6368' }}
      >
        <path d="M10,4H4C2.9,4,2.01,4.9,2.01,6L2,18c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V8c0-1.1-0.9-2-2-2h-8L10,4z"></path>
      </svg>
    </Box>
  );

  const panelTitle = selectedFile ? selectedFile.name : 'My Drive';
  const titleFontWeight = selectedFile ? 500 : 400;

  return (
    <Box
      sx={{
        position: 'fixed',
        right: open ? 56 : '-360px',
        top: 56, // Match TopBar height and avoid overlap with right icon rail
        bottom: 0,
        width: 360,
        backgroundColor: colors.surface,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.1)',
        transition: 'right 0.225s cubic-bezier(0.4, 0.0, 0.2, 1)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {headerIcon}
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: titleFontWeight,
              color: '#202124',
              letterSpacing: '0.1px',
              lineHeight: '28px',
            }}
          >
            {panelTitle}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            onClick={onClose}
            disableRipple
            sx={{
              color: '#5f6368',
              padding: '4px',
              '&:hover': {
                backgroundColor: 'rgba(95, 99, 104, 0.1)',
              },
            }}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ backgroundColor: '#f8f9fa', px: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            minHeight: 48,
            // Clone Drive-style short blue underline centered under the active label
            '& .MuiTabs-indicator': {
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              height: 3,
            },
            '& .MuiTabs-indicatorSpan': {
              maxWidth: 36,
              width: '100%',
              backgroundColor: '#1a73e8',
              borderRadius: 2,
            },
            '& .MuiTabs-flexContainer': {
              gap: 1,
            },
          }}
          TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
        >
          <Tab
            label="Details"
            disableRipple
            sx={{
              textTransform: 'none',
              fontSize: '15px',
              fontWeight: 500,
              minHeight: 48,
              flex: 1,
              color: '#5f6368',
              backgroundColor: 'transparent',
              borderRadius: '8px 8px 0 0',
              boxShadow: 'none',
              outline: 'none',
              '&.Mui-selected': {
                color: '#1a73e8',
                fontWeight: 500,
                backgroundColor: '#ffffff',
                boxShadow: 'none',
                outline: 'none',
              },
              '&:hover': {
                backgroundColor: activeTab === 0 ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
              },
              '&:focus': {
                outline: 'none',
                boxShadow: 'none',
              },
              '&.Mui-focusVisible': {
                outline: 'none',
                boxShadow: 'none',
              },
            }}
          />
          <Tab
            label="Activity"
            disableRipple
            sx={{
              textTransform: 'none',
              fontSize: '15px',
              fontWeight: 500,
              minHeight: 48,
              flex: 1,
              color: '#5f6368',
              backgroundColor: 'transparent',
              borderRadius: '8px 8px 0 0',
              boxShadow: 'none',
              outline: 'none',
              '&.Mui-selected': {
                color: '#1a73e8',
                fontWeight: 500,
                backgroundColor: '#ffffff',
                boxShadow: 'none',
                outline: 'none',
              },
              '&:hover': {
                backgroundColor: activeTab === 1 ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
              },
              '&:focus': {
                outline: 'none',
                boxShadow: 'none',
              },
              '&.Mui-focusVisible': {
                outline: 'none',
                boxShadow: 'none',
              },
            }}
          />
        </Tabs>
      </Box>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 3,
          pr: 3,
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {activeTab === 0 ? (
          selectedFile ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Folder Icon with Title */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 2 }}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="100" height="80" viewBox="0 0 24 24" fill="#5f6368">
                    <path d="M10,4H4C2.9,4,2.01,4.9,2.01,6L2,18c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V8c0-1.1-0.9-2-2-2h-8L10,4z"/>
                  </svg>
                </Box>
              </Box>

              {/* Who has access */}
              <DetailsSection title="Who has access">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      width: 36, 
                      height: 36,
                      backgroundColor: '#1a73e8',
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 20, color: 'white' }} />
                  </Avatar>
                  <Typography sx={{ fontSize: '14px', color: '#5f6368' }}>
                    Private to you
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  sx={{
                    textTransform: 'none',
                    borderRadius: '20px',
                    borderColor: '#dadce0',
                    color: '#1a73e8',
                    fontSize: '14px',
                    fontWeight: 500,
                    px: 3,
                    py: 1,
                    '&:hover': {
                      borderColor: '#1a73e8',
                      backgroundColor: 'rgba(26, 115, 232, 0.04)',
                    }
                  }}
                >
                  Manage access
                </Button>
              </DetailsSection>

              {/* Security limitations */}
              <DetailsSection title="Security limitations">
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <ShieldIcon sx={{ color: '#5f6368', fontSize: 22, mt: 0.5 }} />
                  <Box>
                    <Typography
                      sx={{ fontSize: '14px', fontWeight: 500, color: '#202124', mb: 0.5 }}
                    >
                      No limitations applied
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: '#5f6368' }}>
                      If any are applied, they will appear here
                    </Typography>
                  </Box>
                </Box>
              </DetailsSection>

              {/* File/Folder details - Expanded */}
              <Box sx={{ borderTop: '1px solid #e8eaed', pt: 3 }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#202124', mb: 2 }}>
                  {selectedFile?.type === 'folder' ? 'Folder details' : 'File details'}
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Type */}
                  <Box>
                    <Typography sx={{ fontSize: '14px', color: '#202124', fontWeight: 500, mb: 0.5 }}>
                      Type
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: '#5f6368', fontWeight: 400 }}>
                      {selectedFile?.type === 'folder' ? 'Google Drive Folder' : 
                       selectedFile?.type === 'pdf' ? 'PDF' :
                       selectedFile?.type === 'document' ? 'Google Docs' :
                       selectedFile?.type === 'spreadsheet' ? 'Google Sheets' :
                       selectedFile?.type === 'presentation' ? 'Google Slides' :
                       selectedFile?.type === 'image' ? 'Image' :
                       selectedFile?.type === 'video' ? 'Video' :
                       selectedFile?.type === 'audio' ? 'Audio' :
                       selectedFile?.type || 'File'}
                    </Typography>
                  </Box>

                  {/* Size - Only for files */}
                  {selectedFile?.type !== 'folder' && (
                    <Box>
                      <Typography sx={{ fontSize: '14px', color: '#202124', fontWeight: 500, mb: 0.5 }}>
                        Size
                      </Typography>
                      <Typography sx={{ fontSize: '13px', color: '#5f6368', fontWeight: 400 }}>
                        {selectedFile?.size ? `${Math.round(selectedFile.size / 1024)} KB` : '0 KB'}
                      </Typography>
                    </Box>
                  )}

                  {/* Storage used - Only for files */}
                  {selectedFile?.type !== 'folder' && (
                    <Box>
                      <Typography sx={{ fontSize: '14px', color: '#202124', fontWeight: 500, mb: 0.5 }}>
                        Storage used
                      </Typography>
                      <Typography sx={{ fontSize: '13px', color: '#5f6368', fontWeight: 400 }}>
                        {selectedFile?.size ? `${Math.round(selectedFile.size / 1024)} KB` : '0 KB'}
                      </Typography>
                    </Box>
                  )}

                  {/* Owner */}
                  <Box>
                    <Typography sx={{ fontSize: '14px', color: '#202124', fontWeight: 500, mb: 0.5 }}>
                      Owner
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: '#5f6368', fontWeight: 400 }}>
                      me
                    </Typography>
                  </Box>

                  {/* Modified */}
                  <Box>
                    <Typography sx={{ fontSize: '14px', color: '#202124', fontWeight: 500, mb: 0.5 }}>
                      Modified
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: '#5f6368', fontWeight: 400 }}>
                      {selectedFile?.modifiedTime ? 
                        new Date(selectedFile.modifiedTime).toLocaleDateString('en-GB', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        }) + ' by me' : 
                        '19 Mar 2022 by me'
                      }
                    </Typography>
                  </Box>

                  {/* Opened */}
                  <Box>
                    <Typography sx={{ fontSize: '14px', color: '#202124', fontWeight: 500, mb: 0.5 }}>
                      Opened
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: '#5f6368', fontWeight: 400 }}>
                      {selectedFile?.lastOpenedTime ? 
                        new Date(selectedFile.lastOpenedTime).toLocaleDateString('en-GB', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        }) + ' by me' : 
                        '2 Nov 2025 by me'
                      }
                    </Typography>
                  </Box>

                  {/* Created */}
                  <Box>
                    <Typography sx={{ fontSize: '14px', color: '#202124', fontWeight: 500, mb: 0.5 }}>
                      Created
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: '#5f6368', fontWeight: 400 }}>
                      {selectedFile?.createdTime ? 
                        new Date(selectedFile.createdTime).toLocaleDateString('en-GB', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        }) : 
                        '19 Mar 2022'
                      }
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Description */}
              <Box sx={{ borderTop: '1px solid #e8eaed', pt: 3 }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#202124', mb: 2 }}>
                  Description
                </Typography>
                
                <Box sx={{ position: 'relative' }}>
                  <TextField
                    placeholder="Add description"
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        fontSize: '13px',
                        height: '40px',
                        '& fieldset': {
                          borderColor: '#dadce0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#5f6368',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1a73e8',
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        padding: '10px 12px',
                        fontSize: '13px',
                        color: '#202124',
                        height: '20px',
                        '&::placeholder': {
                          color: '#9aa0a6',
                          opacity: 1,
                        },
                      },
                    }}
                  />
                  
                  {/* Character count */}
                  <Typography 
                    sx={{ 
                      position: 'absolute',
                      bottom: -20,
                      right: 0,
                      fontSize: '11px',
                      color: '#5f6368',
                    }}
                  >
                    0/25,000
                  </Typography>
                </Box>
              </Box>
            </Box>
          ) : (
          // Details Tab
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
            }}
          >
            {/* Empty State Illustration */}
            <Box sx={{ mb: 3 }}>
              <img
                src="https://ssl.gstatic.com/docs/doclist/images/empty_state_details_v2.svg"
                alt="Select an item"
                style={{ width: '200px', height: '200px' }}
              />
            </Box>

            <Typography
              variant="body1"
              sx={{
                color: colors.text.secondary,
                fontSize: '14px',
                lineHeight: 1.6,
              }}
            >
              {selectedIds.length > 1
                ? 'Select a single item to see details here'
                : 'Select an item to see the details'}
            </Typography>
          </Box>
          )
        ) : (
          // Activity Tab
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <svg
                width="100"
                height="100"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="50" cy="50" r="35" fill="#E8F0FE" />
                <path
                  d="M50 25 L50 50 L65 60"
                  stroke="#1a73e8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="50" cy="50" r="40" stroke="#1a73e8" strokeWidth="2" fill="none" />
              </svg>
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: colors.text.primary,
                fontSize: '16px',
                fontWeight: 500,
                mb: 2,
              }}
            >
              Coming Soon
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: colors.text.secondary,
                fontSize: '14px',
                lineHeight: 1.6,
                mb: 2,
              }}
            >
              Activity tracking will be available soon
            </Typography>
          </Box>
        )}
      </Box>

      {/* Cancel button removed */}
    </Box>
  );
};

const DetailsSection = ({ title, children }: DetailsSectionProps) => (
  <Box>
    <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#202124', mb: 1.5 }}>
      {title}
    </Typography>
    {children}
  </Box>
);

interface DetailsSectionProps {
  title: string;
  children: ReactNode;
}
