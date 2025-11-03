import { useState, useEffect } from 'react';
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
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Autocomplete,
  CircularProgress,
  type SelectChangeEvent,
} from '@mui/material';
import {
  Close as CloseIcon,
  Link as LinkIcon,
  PersonAdd as PersonAddIcon,
  Check as CheckIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';
import type { DriveItem } from '../../types/file.types';
import { colors } from '../../theme/theme';
import { shareService, userService, type User, type ShareWithDetails, type PermissionRole } from '../../services';
import { useUIStore } from '../../store/uiStore';

export type SharePermission = PermissionRole;
export type GeneralAccess = 'restricted' | 'anyone-with-link';

interface ShareModalProps {
  open: boolean;
  file: DriveItem | null;
  onClose: () => void;
  onShareSuccess?: () => void;
}

export const ShareModal = ({
  open,
  file,
  onClose,
  onShareSuccess,
}: ShareModalProps) => {
  const showSnackbar = useUIStore((state) => state.showSnackbar);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [permission, setPermission] = useState<SharePermission>('viewer');
  const [generalAccess, setGeneralAccess] = useState<GeneralAccess>('restricted');
  const [linkCopied, setLinkCopied] = useState(false);
  const [shareLink, setShareLink] = useState<string>('');

  // State for data
  const [shares, setShares] = useState<ShareWithDetails[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [sharesLoading, setSharesLoading] = useState(false);

  // Fetch shares for the file
  useEffect(() => {
    const fetchShares = async () => {
      if (!file || !open) return;

      setSharesLoading(true);
      try {
        const response = await shareService.getSharesForFile(file.id);
        setShares(response.shares);
      } catch (error) {
        console.error('Failed to fetch shares:', error);
        showSnackbar('Failed to load sharing information', 'error');
      } finally {
        setSharesLoading(false);
      }
    };

    fetchShares();
  }, [file, open]);

  // Fetch users for autocomplete
  useEffect(() => {
    const fetchUsers = async () => {
      if (!open) return;

      setUsersLoading(true);
      try {
        const [usersResponse, currentUserResponse] = await Promise.all([
          userService.getAllUsers(),
          userService.getCurrentUser(),
        ]);
        setUsers(usersResponse.users);
        setCurrentUser(currentUserResponse.user);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        showSnackbar('Failed to load users list', 'error');
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, [open]);

  const handlePermissionChange = (event: SelectChangeEvent<SharePermission>) => {
    setPermission(event.target.value as SharePermission);
  };

  const handleShare = async () => {
    if (!selectedUser || !file) return;

    setLoading(true);
    try {
      await shareService.createShare(file.id, selectedUser.id, permission);
      // Refresh shares
      const response = await shareService.getSharesForFile(file.id);
      setShares(response.shares);
      setSelectedUser(null);
      showSnackbar(`Successfully shared with ${selectedUser.name}`, 'success');
      onShareSuccess?.();
    } catch (error) {
      console.error('Failed to share file:', error);
      showSnackbar('Failed to share file. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCollaboratorPermissionChange = async (
    shareId: number,
    newPermission: SharePermission
  ) => {
    setLoading(true);
    try {
      await shareService.updateSharePermission(shareId, newPermission);
      // Update local state
      setShares(prev => prev.map(share =>
        share.id === shareId ? { ...share, permission: newPermission } : share
      ));
      showSnackbar('Permission updated successfully', 'success');
    } catch (error) {
      console.error('Failed to update permission:', error);
      showSnackbar('Failed to update permission. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAccess = async (shareId: number) => {
    setLoading(true);
    try {
      await shareService.revokeShare(shareId);
      // Remove from local state
      setShares(prev => prev.filter(share => share.id !== shareId));
      showSnackbar('Access removed successfully', 'success');
    } catch (error) {
      console.error('Failed to remove access:', error);
      showSnackbar('Failed to remove access. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!file) return;

    try {
      let link = shareLink;

      // Generate link if not already generated
      if (!link) {
        const response = await shareService.generateShareLink(file.id, permission);
        link = response.share_link;
        setShareLink(link);
      }

      await navigator.clipboard.writeText(link);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
      showSnackbar('Link copied to clipboard', 'success');
    } catch (error) {
      console.error('Failed to copy link:', error);
      showSnackbar('Failed to copy link. Please try again.', 'error');
    }
  };

  const handleGeneralAccessChange = async (event: SelectChangeEvent<GeneralAccess>) => {
    if (!file) return;

    const newAccess = event.target.value as GeneralAccess;
    setGeneralAccess(newAccess);

    if (newAccess === 'anyone-with-link' && !shareLink) {
      try {
        const response = await shareService.generateShareLink(file.id, permission);
        setShareLink(response.share_link);
        showSnackbar('Share link generated', 'success');
      } catch (error) {
        console.error('Failed to generate share link:', error);
        showSnackbar('Failed to generate share link. Please try again.', 'error');
      }
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
            <Autocomplete
              fullWidth
              size="small"
              options={users}
              value={selectedUser}
              onChange={(_, newValue) => setSelectedUser(newValue)}
              getOptionLabel={(option) => `${option.name} (${option.email})`}
              loading={usersLoading}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {option.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body2">{option.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.email}
                      </Typography>
                    </Box>
                  </Box>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Add people or groups"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <PersonAddIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                    endAdornment: (
                      <>
                        {usersLoading ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
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
              disabled={!selectedUser || loading}
              sx={{ minWidth: 80 }}
            >
              {loading ? <CircularProgress size={20} /> : 'Send'}
            </Button>
          </Box>

          <Typography variant="caption" color="text.secondary">
            People will get notified when you share with them
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* People with Access */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            People with access
          </Typography>

          {sharesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {/* Show file owner */}
              {file && currentUser && String(file.ownerId) === String(currentUser.id) && (
                <ListItem
                  sx={{
                    px: 0,
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ width: 40, height: 40 }}>
                      {currentUser.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">{currentUser.name} (You)</Typography>
                        <Chip label="Owner" size="small" sx={{ height: 20, fontSize: '0.75rem' }} />
                      </Box>
                    }
                    secondary={currentUser.email}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
                    Owner
                  </Typography>
                </ListItem>
              )}

              {/* Show shared users */}
              {shares.map((share) => share.shared_with_user && (
                <ListItem
                  key={share.id}
                  sx={{
                    px: 0,
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ width: 40, height: 40 }}>
                      {share.shared_with_user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography variant="body2">{share.shared_with_user.name}</Typography>}
                    secondary={share.shared_with_user.email}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={share.permission}
                        onChange={(e) =>
                          handleCollaboratorPermissionChange(
                            share.id,
                            e.target.value as SharePermission
                          )
                        }
                        disabled={loading}
                      >
                        <MenuItem value="viewer">Viewer</MenuItem>
                        <MenuItem value="commenter">Commenter</MenuItem>
                        <MenuItem value="editor">Editor</MenuItem>
                      </Select>
                    </FormControl>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveAccess(share.id)}
                      disabled={loading}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}

              {shares.length === 0 && !sharesLoading && (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  Not shared with anyone yet
                </Typography>
              )}
            </List>
          )}
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
