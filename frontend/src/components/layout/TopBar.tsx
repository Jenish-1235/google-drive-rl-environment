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
  SvgIcon,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  HelpOutline as HelpIcon,
  Apps as AppsIcon,
  CheckCircleOutline as CheckIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

// Custom Advanced Search Icon with exact Google Drive SVG path
const AdvancedSearchIcon = (props: any) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"></path>
  </SvgIcon>
);

// Custom Settings Icon with exact Google Drive SVG path
const CustomSettingsIcon = (props: any) => (
  <SvgIcon {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.85 22.25h-3.7c-.74 0-1.36-.54-1.45-1.27l-.27-1.89c-.27-.14-.53-.29-.79-.46l-1.8.72c-.7.26-1.47-.03-1.81-.65L2.2 15.53c-.35-.66-.2-1.44.36-1.88l1.53-1.19c-.01-.15-.02-.3-.02-.46 0-.15.01-.31.02-.46l-1.52-1.19c-.59-.45-.74-1.26-.37-1.88l1.85-3.19c.34-.62 1.11-.9 1.79-.63l1.81.73c.26-.17.52-.32.78-.46l.27-1.91c.09-.7.71-1.25 1.44-1.25h3.7c.74 0 1.36.54 1.45 1.27l.27 1.89c.27.14.53.29.79.46l1.8-.72c.71-.26 1.48.03 1.82.65l1.84 3.18c.36.66.2 1.44-.36 1.88l-1.52 1.19c.01.15.02.3.02.46s-.01.31-.02.46l1.52 1.19c.56.45.72 1.23.37 1.86l-1.86 3.22c-.34.62-1.11.9-1.8.63l-1.8-.72c-.26.17-.52.32-.78.46l-.27 1.91c-.1.68-.72 1.22-1.46 1.22zm-3.23-2h2.76l.37-2.55.53-.22c.44-.18.88-.44 1.34-.78l.45-.34 2.38.96 1.38-2.4-2.03-1.58.07-.56c.03-.26.06-.51.06-.78s-.03-.53-.06-.78l-.07-.56 2.03-1.58-1.39-2.4-2.39.96-.45-.35c-.42-.32-.87-.58-1.33-.77l-.52-.22-.37-2.55h-2.76l-.37 2.55-.53.21c-.44.19-.88.44-1.34.79l-.45.33-2.38-.95-1.39 2.39 2.03 1.58-.07.56a7 7 0 0 0-.06.79c0 .26.02.53.06.78l.07.56-2.03 1.58 1.38 2.4 2.39-.96.45.35c.43.33.86.58 1.33.77l.53.22.38 2.55z"></path>
    <circle cx="12" cy="12" r="3.5"></circle>
  </SvgIcon>
);

// Custom Gemini Icon - exact SVG from Google Drive
// Black by default, blue on hover (matching Google Drive behavior)
const GeminiIcon = ({ isHovered = false }: { isHovered?: boolean }) => (
  <Box
    sx={{
      width: 28,
      height: 28,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    }}
  >
    {/* Main Gemini star icon SVG - exact from Google Drive */}
    <Box
      component="svg"
      viewBox="0 -960 960 960"
      focusable="false"
      sx={{
        width: 28,
        height: 28,
        display: "block",
        fill: "currentColor",
        position: "relative",
        zIndex: 2,
        transition: "fill 0.2s ease",
        color: "inherit",
      }}
    >
      <path 
        d="M480-80q-6,0-11-4t-7-10q-17-67-51-126T328-328T220-411T94-462q-6-2-10-7t-4-11t4-11t10-7q67-17 126-51t108-83t83-108t51-126q2-6 7-10t11-4t10.5,4t6.5,10q18,67 52,126t83,108t108,83t126,51q6,2 10,7t4,11t-4,11t-10,7q-67,17-126,51T632-328T549-220T498-94q-2,6-7,10t-11,4Z"
        fill="currentColor"
      />
    </Box>
    {/* Gemini logo circle background - visible on hover with subtle blue glow */}
    <Box
      className="VYBDae-c-RLmnJb"
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        background: isHovered 
          ? "radial-gradient(circle, rgba(49,134,255,0.12) 0%, rgba(49,134,255,0.06) 50%, transparent 80%)"
          : "transparent",
        pointerEvents: "none",
        zIndex: 1,
        transition: "background 0.2s ease",
        opacity: isHovered ? 1 : 0,
      }}
    />
  </Box>
);
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
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const [anchorElHelp, setAnchorElHelp] = useState<null | HTMLElement>(null);

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [geminiHovered, setGeminiHovered] = useState(false);

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
        bgcolor: "#F9FAFD",
        borderBottom: "none",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        width: "100%",
        left: 0,
        right: 0,
      }}
    >
      <Toolbar 
        sx={{ 
          gap: 0, 
          minHeight: 64, 
          height: 64,
          width: "100%", 
          px: { xs: 1, md: 0 }, 
          display: "flex", 
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        {/* Menu button & Logo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            width: { xs: "auto", md: "auto" },
            flexShrink: 0,
            ml: { xs: 0, md: 2 },
            minWidth: { xs: "auto", md: "240px" },
          }}
        >
          <IconButton
            edge="start"
            onClick={toggleSidebar}
            sx={{
              color: "text.secondary",
              display: { xs: "inline-flex", md: "none" },
              p: 1,
              mr: 0.5,
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              cursor: "pointer",
              ml: { xs: 0, md: 0.5 },
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
              sx={{
                fontFamily: '"Google Sans", "Roboto", "Arial", sans-serif',
                fontSize: 22,
                fontWeight: 400,
                color: "#444746",
                display: { xs: "none", sm: "block" },
                letterSpacing: 0,
                lineHeight: 1.36364,
              }}
            >
              Drive
            </Typography>
          </Box>
        </Box>

        {/* Search Bar */}
        <Box 
          sx={{ 
            ml: { xs: 1, md: 0.5 }, 
            mr: { xs: 1, md: 2 }, 
            flex: 1, 
            minWidth: 0, 
            display: "flex", 
            justifyContent: "flex-start",
            maxWidth: { xs: "100%", md: "832px" },
          }}
        >
          <Box
            sx={{
              position: "relative",
              borderRadius: "24px",
              backgroundColor: searchFocused ? "#ffffff" : "#E9EEF6",
              border: searchFocused ? `1px solid #1a73e8` : "1px solid transparent",
              transition: "all 0.2s",
              width: "100%",
              maxWidth: { xs: "100%", md: "832px" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                pl: 2,
                pr: 1.25,
                py: 0,
                height: 48,
              }}
            >
              <SearchIcon sx={{ color: "rgba(69, 71, 70, 1)", mr: 1.5, fontSize: 24, width: 24, height: 24, flexShrink: 0 }} />
              <InputBase
                placeholder="Search in Drive"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  "& input": {
                    fontSize: 15,
                    padding: 0,
                    lineHeight: 1.5,
                    color: "rgba(31, 31, 31, 1)",
                    fontFamily: '"Google Sans", "Roboto", "Arial", sans-serif',
                    "&::placeholder": {
                      color: "#5f6368",
                      opacity: 1,
                    },
                  },
                }}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              />
              <Tooltip title="Advanced search">
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: "rgba(69, 71, 70, 1)", 
                    ml: 0.25, 
                    mr: 0,
                    flexShrink: 0,
                    p: 0.625,
                    minWidth: 34,
                    width: 34,
                    height: 34,
                  }} 
                  onClick={handleAdvancedSearchOpen}
                >
                  <AdvancedSearchIcon sx={{ fontSize: 24, width: 24, height: 24 }} />
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
            mr: { xs: 0.5, md: 1 },
          }}
        >
          <Tooltip title="Tasks">
            <IconButton sx={{ color: "#5f6368", p: 1, width: 40, height: 40 }}>
              <CheckIcon sx={{ fontSize: 24, width: 24, height: 24 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Help">
            <IconButton
              sx={{ color: "#5f6368", p: 1, width: 40, height: 40 }}
              onClick={handleOpenHelpMenu}
            >
              <HelpIcon sx={{ fontSize: 24, width: 24, height: 24 }} />
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
            <IconButton sx={{ color: "#5f6368", p: 1, width: 40, height: 40 }}>
              <CustomSettingsIcon sx={{ fontSize: 24, width: 24, height: 24 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Ask Gemini">
            <IconButton 
              onMouseEnter={() => setGeminiHovered(true)}
              onMouseLeave={() => setGeminiHovered(false)}
              sx={{ 
                p: 0.75, 
                width: 40, 
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1f1f1f",
                backgroundColor: "transparent",
                transition: "background-color 0.2s ease, color 0.2s ease",
                "&:hover": {
                  backgroundColor: "rgba(95, 99, 104, 0.08)",
                  color: "#3186ff",
                },
                "&:focus": {
                  backgroundColor: "rgba(95, 99, 104, 0.12)",
                  color: "#3186ff",
                },
              }}
            >
              <GeminiIcon isHovered={geminiHovered} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Google apps">
            <IconButton sx={{ color: "#5f6368", p: 1, width: 40, height: 40 }}>
              <AppsIcon sx={{ fontSize: 24, width: 24, height: 24 }} />
            </IconButton>
          </Tooltip>

          {/* User Avatar */}
          <Tooltip title="Account">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5, width: 36, height: 36 }}>
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