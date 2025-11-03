import { 
  Popover, 
  Box,
  Typography,
  Button,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  Mail as MailIcon,
  VideoCall as VideoCallIcon,
  Event as EventIcon,
  Edit as EditIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';

interface UserProfilePopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export const UserProfilePopover = ({
  anchorEl,
  open,
  onClose,
  onMouseEnter,
  onMouseLeave,
  user,
}: UserProfilePopoverProps) => {
  const handleSendMail = () => {
    window.location.href = `mailto:${user.email}`;
    onClose();
  };

  const handleOpenDetailedView = () => {
    console.log('Opening detailed view for:', user.email);
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      slotProps={{
        paper: {
          elevation: 8,
          onMouseEnter: onMouseEnter,
          onMouseLeave: onMouseLeave,
          sx: {
            width: 360,
            borderRadius: '16px',
            border: '1px solid #dadce0',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            overflow: 'visible',
            mt: 1,
            transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out',
          },
        },
      }}
      TransitionProps={{
        timeout: 200,
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* User Info Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={user.avatar}
            alt={user.name}
            sx={{
              width: 80,
              height: 80,
              mb: 1.5,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              sx={{
                fontSize: '20px',
                fontWeight: 400,
                color: '#202124',
              }}
            >
              {user.name}
            </Typography>
            <IconButton 
              size="small" 
              sx={{ 
                color: '#5f6368',
                '&:hover': { backgroundColor: '#f8f9fa' }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
          
          <Typography
            sx={{
              fontSize: '14px',
              color: '#5f6368',
              mt: 0.5,
            }}
          >
            {user.email}
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<MailIcon />}
            onClick={handleSendMail}
            sx={{
              backgroundColor: '#c2e7ff',
              color: '#001d35',
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 500,
              py: 1,
              borderRadius: '20px',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#a8daf5',
                boxShadow: 'none',
              },
            }}
          >
            Send mail
          </Button>
          
          <IconButton
            sx={{
              border: '1px solid #dadce0',
              borderRadius: '50%',
              color: '#5f6368',
              '&:hover': {
                backgroundColor: '#f8f9fa',
              },
            }}
          >
            <VideoCallIcon />
          </IconButton>
          
          <IconButton
            sx={{
              border: '1px solid #dadce0',
              borderRadius: '50%',
              color: '#5f6368',
              '&:hover': {
                backgroundColor: '#f8f9fa',
              },
            }}
          >
            <EventIcon />
          </IconButton>
        </Box>

        {/* Open detailed view link */}
        <Button
          fullWidth
          onClick={handleOpenDetailedView}
          endIcon={<OpenInNewIcon fontSize="small" />}
          sx={{
            textTransform: 'none',
            color: '#1a73e8',
            fontSize: '14px',
            fontWeight: 500,
            justifyContent: 'space-between',
            py: 1,
            px: 2,
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#f8f9fa',
            },
          }}
        >
          Open detailed view
        </Button>
      </Box>
    </Popover>
  );
};
