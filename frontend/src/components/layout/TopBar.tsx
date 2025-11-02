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
  FilterList as FilterListIcon,
  HelpOutline as HelpIcon,
  Settings as SettingsIcon,
  Apps as AppsIcon,
  CheckCircleOutline as CheckIcon,
  AutoAwesome as SparkleIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";
import { colors } from "../../theme/theme";
import {
  AdvancedSearchModal,
  type AdvancedSearchFilters,
} from "../modals/AdvancedSearchModal";
import { SearchSuggestions } from "../modals/SearchSuggestions";

export const TopBar = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const viewMode = useFileStore((state) => state.viewMode);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const [anchorElHelp, setAnchorElHelp] = useState<null | HTMLElement>(null);

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleOpenHelpMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElHelp(event.currentTarget);
  };

  const handleCloseHelpMenu = () => {
    setAnchorElHelp(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate("/auth/login");
  };

  const handleAdvancedSearchOpen = () => {
    setAdvancedSearchOpen(true);
  };

  const handleAdvancedSearchClose = () => {
    setAdvancedSearchOpen(false);
  };

  const handleAdvancedSearch = (filters: AdvancedSearchFilters) => {
    console.log("Advanced search filters:", filters);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchValue(suggestion);
    setSearchFocused(false);
  };

  const handleAdvancedSearchFromSuggestions = () => {
    setSearchFocused(false);
    setAdvancedSearchOpen(true);
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
      <Toolbar sx={{ gap: 0, minHeight: 64, width: "100%", px: { xs: 2, md: 3 } }}>
        {/* Menu button & Logo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1, // smaller gap
            width: { xs: "auto", md: "200px" }, // narrower
            flexShrink: 0,
            ml: -1, // shift left
          }}
        >
          <IconButton
            edge="start"
            onClick={toggleSidebar}
            sx={{
              color: "text.secondary",
              display: { xs: "inline-flex", md: "none" },
              p: 0.5, // smaller button
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5, // smaller gap
              cursor: "pointer",
            }}
            onClick={() => navigate("/home")}
          >
            <Box
              component="img"
              src="https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png"
              alt="Drive"
              sx={{ width: 32, height: 32 }} // smaller logo
            />
            <Typography
              variant="h3"
              sx={{
                fontSize: 20,
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
        <Box sx={{ ml: { xs: 1, md: 0 }, mr: { xs: 1, md: 2 } }}>
          <Box
            sx={{
              position: "relative",
              borderRadius: 8,
              backgroundColor: searchFocused ? colors.surface : colors.backgroundGray,
              border: searchFocused ? `1px solid ${colors.primary}` : "1px solid transparent",
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
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                sx={{
                  flex: 1,
                  "& input": {
                    fontSize: 16,
                    padding: 0,
                  },
                }}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              />
              <Tooltip title="Advanced search">
                <IconButton size="small" sx={{ color: "text.secondary" }} onClick={handleAdvancedSearchOpen}>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Search Suggestions */}
            <SearchSuggestions
              open={searchFocused}
              searchValue={searchValue}
              onSuggestionClick={handleSuggestionClick}
              onAdvancedSearchClick={handleAdvancedSearchFromSuggestions}
            />
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
          <Tooltip title="Tasks">
            <IconButton sx={{ color: "text.secondary" }}>
              <CheckIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Help">
            <IconButton
              sx={{ color: "text.secondary" }}
              onClick={handleOpenHelpMenu}
            >
              <HelpIcon />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorElHelp}
            open={Boolean(anchorElHelp)}
            onClose={handleCloseHelpMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                mt: 1,
                borderRadius: 0, // square edges
                minWidth: 280,
                boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
                border: "1px solid #e0e0e0",
              },
            }}
          >
            <MenuItem
              onClick={handleCloseHelpMenu}
              sx={{
                py: 1,
                "&:hover": { backgroundColor: "#f8f9fa" },
              }}
            >
              Help
            </MenuItem>

            {/* Divider after Help removed */}

            <MenuItem
              onClick={handleCloseHelpMenu}
              sx={{
                py: 1,
                "&:hover": { backgroundColor: "#f8f9fa" },
              }}
            >
              Training
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={handleCloseHelpMenu}
              sx={{
                py: 1,
                "&:hover": { backgroundColor: "#f8f9fa" },
              }}
            >
              Terms and Policy
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={handleCloseHelpMenu}
              sx={{
                py: 1,
                "&:hover": { backgroundColor: "#f8f9fa" },
              }}
            >
              Send feedback to Google
            </MenuItem>
          </Menu>

          <Tooltip title="Settings">
            <IconButton sx={{ color: "text.secondary" }}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Ask Gemini">
            <IconButton sx={{ color: "text.secondary" }}>
              <SparkleIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Google apps">
            <IconButton sx={{ color: "text.secondary" }}>
              <AppsIcon />
            </IconButton>
          </Tooltip>

          {/* User Avatar */}
          <Tooltip title="Account">
            <IconButton onClick={handleOpenUserMenu} sx={{ ml: 0.5 }}>
              {user?.photoUrl ? (
                <Avatar src={user.photoUrl} alt={user.name} sx={{ width: 32, height: 32 }} />
              ) : (
                <Avatar sx={{ width: 32, height: 32, bgcolor: colors.primary }}>
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </Avatar>
              )}
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <Menu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
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
                    sx={{ width: 40, height: 40, bgcolor: colors.primary }}
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

      <AdvancedSearchModal
        open={advancedSearchOpen}
        onClose={handleAdvancedSearchClose}
        onSearch={handleAdvancedSearch}
      />
    </AppBar>
  );
};