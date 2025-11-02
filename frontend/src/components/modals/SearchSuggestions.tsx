import {
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
} from '@mui/icons-material';

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'suggestion';
}

interface SearchSuggestionsProps {
  open: boolean;
  searchValue: string;
  onSuggestionClick: (suggestion: string) => void;
  onAdvancedSearchClick: () => void;
}

export const SearchSuggestions = ({
  open,
  searchValue,
  onSuggestionClick,
  onAdvancedSearchClick,
}: SearchSuggestionsProps) => {
  // Mock suggestions - in real app, this would be dynamic based on search history and results
  const suggestions: SearchSuggestion[] = [
    { id: '1', text: 'har followup:any', type: 'recent' },
    { id: '2', text: 'har followup:any after:2025-11-01 before:2025-11-02', type: 'recent' },
    { id: '3', text: 'min', type: 'recent' },
    { id: '4', text: 'mini', type: 'recent' },
    { id: '5', text: 'aadhar both', type: 'recent' },
  ];

  // Filter suggestions based on search value
  const filteredSuggestions = searchValue
    ? suggestions.filter((s) =>
        s.text.toLowerCase().includes(searchValue.toLowerCase())
      )
    : suggestions;

  if (!open) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'absolute',
        top: 'calc(100% + 4px)',
        left: 0,
        right: 0,
        borderRadius: '8px',
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
        zIndex: 1300,
        boxShadow: '0 1px 6px rgba(32,33,36,0.28)',
        opacity: open ? 1 : 0,
        transform: open ? 'translateY(0)' : 'translateY(-8px)',
        transition: 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        // Custom scrollbar styling
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
        scrollbarWidth: 'thin',
        scrollbarColor: '#dadce0 transparent',
      }}
    >
      <Box>
        {/* Filter buttons section */}
        <Box sx={{ px: 2, pt: 1.5, pb: 1, display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            endIcon={<span style={{ fontSize: '10px' }}>▼</span>}
            sx={{
              borderRadius: '16px',
              borderColor: '#dadce0',
              color: '#202124',
              textTransform: 'none',
              fontSize: '13px',
              fontWeight: 400,
              px: 1.5,
              py: 0.25,
              minHeight: '28px',
              '&:hover': {
                borderColor: '#dadce0',
                bgcolor: '#f1f3f4',
              },
            }}
          >
            Type
          </Button>
          <Button
            variant="outlined"
            size="small"
            endIcon={<span style={{ fontSize: '10px' }}>▼</span>}
            sx={{
              borderRadius: '16px',
              borderColor: '#dadce0',
              color: '#202124',
              textTransform: 'none',
              fontSize: '13px',
              fontWeight: 400,
              px: 1.5,
              py: 0.25,
              minHeight: '28px',
              '&:hover': {
                borderColor: '#dadce0',
                bgcolor: '#f1f3f4',
              },
            }}
          >
            People
          </Button>
          <Button
            variant="outlined"
            size="small"
            endIcon={<span style={{ fontSize: '10px' }}>▼</span>}
            sx={{
              borderRadius: '16px',
              borderColor: '#dadce0',
              color: '#202124',
              textTransform: 'none',
              fontSize: '13px',
              fontWeight: 400,
              px: 1.5,
              py: 0.25,
              minHeight: '28px',
              '&:hover': {
                borderColor: '#dadce0',
                bgcolor: '#f1f3f4',
              },
            }}
          >
            Modified
          </Button>
        </Box>

        <Divider sx={{ borderColor: '#e8eaed' }} />

        {/* Suggestions list */}
        <List sx={{ py: 0.5 }}>
          {filteredSuggestions.map((suggestion) => (
            <ListItem key={suggestion.id} disablePadding>
              <ListItemButton
                onClick={() => onSuggestionClick(suggestion.text)}
                sx={{
                  px: 2,
                  py: 0.75,
                  minHeight: '40px',
                  '&:hover': {
                    bgcolor: '#f1f3f4',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <SearchIcon sx={{ fontSize: 18, color: '#5f6368' }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#202124',
                        fontSize: '14px',
                        lineHeight: '20px',
                      }}
                    >
                      {suggestion.text}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ borderColor: '#e8eaed' }} />

        {/* Advanced search and All results in same row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1 }}>
          <Box
            onClick={onAdvancedSearchClick}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#1a73e8',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              Advanced search
            </Typography>
          </Box>
          <Box
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#5f6368',
                fontSize: '13px',
              }}
            >
              ← All results
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
