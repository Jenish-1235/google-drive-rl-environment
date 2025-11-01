import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Avatar,
  IconButton,
  Select,
  MenuItem,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  InputAdornment,
  Tooltip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  type SelectChangeEvent,
} from '@mui/material';
import {
  Close as CloseIcon,
  Link as LinkIcon,
  PersonAdd as PersonAddIcon,
  Check as CheckIcon,
  ContentCopy as ContentCopyIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import type { DriveItem } from '../../types/file.types';
import { colors } from '../../theme/theme';

export type SharePermission = 'viewer' | 'commenter' | 'editor';
export type GeneralAccess = 'restricted' | 'anyone-with-link';

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  permission: SharePermission;
  isOwner?: boolean;
}

interface ShareModalProps {
  open: boolean;
  file: DriveItem | null;
  onClose: () => void;
  onShare?: (emails: string[], permission: SharePermission) => void;
  onUpdatePermission?: (collaboratorId: string, permission: SharePermission) => void;
  onRemoveAccess?: (collaboratorId: string) => void;
  onCopyLink?: () => void;
  onChangeGeneralAccess?: (access: GeneralAccess, permission?: SharePermission) => void;
}

export const ShareModal = ({
  open,
  file,
  onClose,
  onShare,
  onUpdatePermission,
  onRemoveAccess,
  onCopyLink,
  onChangeGeneralAccess,
}: ShareModalProps) => {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<SharePermission>('viewer');
  const [generalAccess, setGeneralAccess] = useState<GeneralAccess>('restricted');
  const [linkCopied, setLinkCopied] = useState(false);

  // Mock collaborators - in real app, this would come from props or API
  const [collaborators] = useState<Collaborator[]>([
    {
      id: '1',
      name: 'You',
      email: 'you@example.com',
      permission: 'editor',
      isOwner: true,
    },
  ]);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePermissionChange = (event: SelectChangeEvent<SharePermission>) => {
    setPermission(event.target.value as SharePermission);
  };

  const handleShare = () => {
    if (email.trim() && onShare) {
      onShare([email], permission);
      setEmail('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleShare();
    }
  };

  const handleCollaboratorPermissionChange = (
    collaboratorId: string,
    newPermission: SharePermission
  ) => {
    if (onUpdatePermission) {
      onUpdatePermission(collaboratorId, newPermission);
    }
  };

  const handleRemoveAccess = (collaboratorId: string) => {
    if (onRemoveAccess) {
      onRemoveAccess(collaboratorId);
    }
  };

  const handleCopyLink = () => {
    if (onCopyLink) {
      onCopyLink();
    }
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleGeneralAccessChange = (event: SelectChangeEvent<GeneralAccess>) => {
    const newAccess = event.target.value as GeneralAccess;
    setGeneralAccess(newAccess);
    if (onChangeGeneralAccess) {
      onChangeGeneralAccess(newAccess, 'viewer');
    }
  };

  const getPermissionLabel = (perm: SharePermission) => {
    switch (perm) {
      case 'viewer':
        return 'Viewer';
      case 'commenter':
        return 'Commenter';
      case 'editor':
        return 'Editor';
    }
  };

  const getGeneralAccessLabel = (access: GeneralAccess) => {
    switch (access) {
      case 'restricted':
        return 'Restricted';
      case 'anyone-with-link':
        return 'Anyone with the link';
    }
  };

  const getGeneralAccessDescription = (access: GeneralAccess) => {
    switch (access) {
      case 'restricted':
        return 'Only people with access can open';
      case 'anyone-with-link':
        return 'Anyone on the Internet with the link can view';
    }
  };

  if (!file) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" component="div">
            Share &quot;{file.name}&quot;
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {/* Add People Section */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Add people or groups"
              value={email}
              onChange={handleEmailChange}
              onKeyPress={handleKeyPress}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonAddIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl sx={{ minWidth: 120 }} size="small">
              <Select value={permission} onChange={handlePermissionChange}>
                <MenuItem value="viewer">Viewer</MenuItem>
                <MenuItem value="commenter">Commenter</MenuItem>
                <MenuItem value="editor">Editor</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleShare}
              disabled={!email.trim()}
              sx={{ minWidth: 80 }}
            >
              Send
            </Button>
          </Box>

          <Typography variant="caption" color="text.secondary">
            People will get an email invitation
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* People with Access */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            People with access
          </Typography>

          <List sx={{ p: 0 }}>
            {collaborators.map((collaborator) => (
              <ListItem
                key={collaborator.id}
                sx={{
                  px: 0,
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={collaborator.photoUrl}
                    alt={collaborator.name}
                    sx={{ width: 40, height: 40 }}
                  >
                    {collaborator.name.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">{collaborator.name}</Typography>
                      {collaborator.isOwner && (
                        <Chip label="Owner" size="small" sx={{ height: 20, fontSize: '0.75rem' }} />
                      )}
                    </Box>
                  }
                  secondary={collaborator.email}
                />
                {!collaborator.isOwner ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={collaborator.permission}
                        onChange={(e) =>
                          handleCollaboratorPermissionChange(
                            collaborator.id,
                            e.target.value as SharePermission
                          )
                        }
                      >
                        <MenuItem value="viewer">Viewer</MenuItem>
                        <MenuItem value="commenter">Commenter</MenuItem>
                        <MenuItem value="editor">Editor</MenuItem>
                      </Select>
                    </FormControl>
                    <IconButton size="small" onClick={() => handleRemoveAccess(collaborator.id)}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
                    {getPermissionLabel(collaborator.permission)}
                  </Typography>
                )}
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* General Access */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            General access
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: colors.surfaceVariant,
                color: 'text.secondary',
              }}
            >
              <LinkIcon fontSize="small" />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                <Select
                  value={generalAccess}
                  onChange={handleGeneralAccessChange}
                  displayEmpty
                  renderValue={(value) => (
                    <Typography variant="body2" fontWeight={500}>
                      {getGeneralAccessLabel(value)}
                    </Typography>
                  )}
                >
                  <MenuItem value="restricted">
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        Restricted
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Only people with access can open
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="anyone-with-link">
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        Anyone with the link
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Anyone on the Internet with the link can view
                      </Typography>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
              <Typography variant="caption" color="text.secondary">
                {getGeneralAccessDescription(generalAccess)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Copy Link Button */}
        <Button
          fullWidth
          variant="outlined"
          startIcon={linkCopied ? <CheckIcon /> : <ContentCopyIcon />}
          onClick={handleCopyLink}
          sx={{
            mt: 2,
            justifyContent: 'center',
            color: linkCopied ? colors.success : colors.primary,
            borderColor: linkCopied ? colors.success : undefined,
          }}
        >
          {linkCopied ? 'Link copied' : 'Copy link'}
        </Button>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="text">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};
