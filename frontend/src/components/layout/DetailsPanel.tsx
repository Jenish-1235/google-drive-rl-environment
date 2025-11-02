import { useState } from 'react';
import {
  Box,
  IconButton,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { colors } from '../../theme/theme';

interface DetailsPanelProps {
  open: boolean;
  onClose: () => void;
}

export const DetailsPanel = ({ open, onClose }: DetailsPanelProps) => {
  const [activeTab, setActiveTab] = useState(0);

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
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ color: '#5f6368' }}
          >
            <path d="M19 2H5C3.9 2 3 2.9 3 4V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V4C21 2.9 20.1 2 19 2ZM19 20H5V19H19V20ZM19 17H5V4H19V17Z"></path>
            <path d="M13.1215 6H10.8785C10.5514 6 10.271 6.18692 10.0841 6.46729L7.14019 11.6075C7 11.8878 7 12.215 7.14019 12.4953L8.26168 14.4579C8.40187 14.7383 8.72897 14.9252 9.05608 14.9252H15.0374C15.3645 14.9252 15.6449 14.7383 15.8318 14.4579L16.9533 12.4953C17.0935 12.215 17.0935 11.8878 16.9533 11.6075L13.9159 6.46729C13.7757 6.18692 13.4486 6 13.1215 6ZM10.1776 12.0748L12.0467 8.8972L13.8692 12.0748H10.1776Z"></path>
          </svg>
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 500,
              color: '#202124',
              letterSpacing: '0.1px',
              lineHeight: '28px',
            }}
          >
            My Drive
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
              Select an item to see the details
            </Typography>
          </Box>
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
