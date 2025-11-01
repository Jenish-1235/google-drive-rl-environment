import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  ListItemIcon,
  Typography,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Settings as SettingsIcon,
  HelpOutline as HelpIcon,
  FilterList as FilterListIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useFileStore } from "../../store/fileStore";
import { useUIStore } from "../../store/uiStore";
import { colors } from "../../theme/theme";

export const TopBar = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const viewMode = useFileStore((state) => state.viewMode);
  const setViewMode = useFileStore((state) => state.setViewMode);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate("/auth/login");
  };

  const handleViewModeToggle = () => {
    setViewMode(viewMode === "list" ? "grid" : "list");
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: `1px solid ${colors.border}`,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        width: "100%",
        left: 0,
        right: 0,
      }}
    >
      <Toolbar
        sx={{ gap: 0, minHeight: 64, width: "100%", px: { xs: 2, md: 3 } }}
      >
        {/* Menu button & Logo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            width: { xs: "auto", md: "230px" }, // Match sidebar width on desktop
            flexShrink: 0,
          }}
        >
          <IconButton
            edge="start"
            onClick={toggleSidebar}
            sx={{
              color: "text.secondary",
              display: { xs: "inline-flex", md: "none" }, // Hide on desktop (md and up)
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
            onClick={() => navigate("/home")}
          >
            <Box
              component="img"
              src="https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png"
              alt="Drive"
              sx={{ width: 40, height: 40 }}
            />
            <Typography
              variant="h3"
              sx={{
                fontSize: 22,
                fontWeight: 400,
                color: "text.secondary",
                display: { xs: "none", sm: "block" },
              }}
            >
              Drive
            </Typography>
          </Box>
        </Box>

        {/* Search Bar */}
        <Box
          sx={{
            ml: { xs: 1, md: 0 },
            mr: { xs: 1, md: 2 },
          }}
        >
          <Box
            sx={{
              position: "relative",
              borderRadius: 8,
              backgroundColor: searchFocused
                ? colors.surface
                : colors.backgroundGray,
              border: searchFocused
                ? `1px solid ${colors.primary}`
                : "1px solid transparent",
              "&:hover": {
                backgroundColor: colors.surface,
                boxShadow: searchFocused
                  ? "none"
                  : "0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)",
              },
              transition: "all 0.2s",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                px: 2,
                height: 44,
                width: { xs: 200, sm: 300, md: 820 },
              }}
            >
              <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
              <InputBase
                placeholder="Search in Drive"
                sx={{
                  flex: 1,
                  "& input": {
                    fontSize: 16,
                    padding: 0,
                  },
                }}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <Tooltip title="Advanced search">
                <IconButton size="small" sx={{ color: "text.secondary" }}>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        {/* Right side actions */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            flexShrink: 0,
            ml: "auto",
          }}
        >
          {/* View Mode Toggle */}
          <Tooltip title={viewMode === "list" ? "Grid view" : "List view"}>
            <IconButton
              onClick={handleViewModeToggle}
              sx={{ color: "text.secondary" }}
            >
              {viewMode === "list" ? <ViewModuleIcon /> : <ViewListIcon />}
            </IconButton>
          </Tooltip>

          {/* Help */}
          <Tooltip title="Help">
            <IconButton sx={{ color: "text.secondary" }}>
              <HelpIcon />
            </IconButton>
          </Tooltip>

          {/* Settings */}
          <Tooltip title="Settings">
            <IconButton sx={{ color: "text.secondary" }}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <Tooltip title="Account">
            <IconButton onClick={handleOpenUserMenu} sx={{ ml: 0.5 }}>
              {user?.photoUrl ? (
                <Avatar
                  src={user.photoUrl}
                  alt={user.name}
                  sx={{ width: 32, height: 32 }}
                />
              ) : (
                <Avatar sx={{ width: 32, height: 32, bgcolor: colors.primary }}>
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </Avatar>
              )}
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            onClick={handleCloseUserMenu}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 300,
              },
            }}
          >
            {user && [
              <Box key="user-info" sx={{ px: 2, py: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: colors.primary,
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                </Box>
              </Box>,
              <Divider key="divider-1" />,
            ]}
            <MenuItem>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              Manage your Google Account
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Sign out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
