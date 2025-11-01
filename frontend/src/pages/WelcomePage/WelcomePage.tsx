import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import { useState } from "react";
import {
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  AutoAwesome as GeminiIcon,
} from "@mui/icons-material";
import { colors } from "../../theme/theme";
import { animations } from "../../utils/animations";

interface SuggestionSectionProps {
  title: string;
  icon?: React.ReactNode;
}

const SuggestionSection = ({ title, icon }: SuggestionSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Box sx={{ mb: 2 }}>
      <ListItemButton
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          px: 0,
          "&:hover": { backgroundColor: "transparent" },
        }}
      >
        <ListItemIcon sx={{ minWidth: 32, color: "text.secondary" }}>
          {isOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />}
        </ListItemIcon>
        {icon && (
          <ListItemIcon sx={{ minWidth: 32, color: colors.primary }}>
            {icon}
          </ListItemIcon>
        )}
        <ListItemText
          primary={title}
          primaryTypographyProps={{
            variant: "body1",
            fontWeight: 500,
            color: "text.primary",
          }}
        />
      </ListItemButton>
      <Collapse in={isOpen}>
        <Box sx={{ pl: 4, pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Content for {title} will appear here.
          </Typography>
        </Box>
      </Collapse>
    </Box>
  );
};

export const WelcomePage = () => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        height: "auto",
        py: 4,
        px: { xs: 2, sm: 4, md: 6 },
        ...animations.fadeIn,
      }}
    >
      <Typography
        variant="h1"
        sx={{ mb: 4, fontSize: { xs: "28px", md: "32px" } }}
      >
        Welcome to Drive
      </Typography>

      <List sx={{ maxWidth: "100%", width: "100%" }}>
        <SuggestionSection title="Ask Gemini" icon={<GeminiIcon />} />
        <SuggestionSection title="Suggested folders" />
        <SuggestionSection title="Suggested files" />
      </List>
    </Box>
  );
};
