import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  Button,
  IconButton,
  ButtonGroup,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  ChevronRight as ChevronRightIcon,
  KeyboardArrowDown as ArrowDownIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useFileStore } from "../../store/fileStore";
import { useEffect, useState } from "react";
import { colors } from "../../theme/theme";

interface FilterButtonProps {
  label: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const FilterButton = ({ label, onClick }: FilterButtonProps) => (
  <Button
    variant="outlined"
    endIcon={<ArrowDownIcon />}
    onClick={onClick}
    sx={{
      textTransform: "none",
      color: "text.primary",
      borderColor: colors.border,
      borderRadius: 3,
      px: 2,
      py: 0.75,
      fontSize: 14,
      fontWeight: 400,
      "&:hover": {
        borderColor: colors.border,
        backgroundColor: colors.hover,
      },
    }}
  >
    {label}
  </Button>
);

export const FileToolbar = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const files = useFileStore((state) => state.files);
  const breadcrumbs = useFileStore((state) => state.breadcrumbs);
  const setBreadcrumbs = useFileStore((state) => state.setBreadcrumbs);
  const viewMode = useFileStore((state) => state.viewMode);
  const setViewMode = useFileStore((state) => state.setViewMode);

  const [typeMenuAnchor, setTypeMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [peopleMenuAnchor, setPeopleMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [modifiedMenuAnchor, setModifiedMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [sourceMenuAnchor, setSourceMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  useEffect(() => {
    const buildBreadcrumbs = () => {
      const newBreadcrumbs = [{ id: "root", name: "My Drive" }];
      if (folderId) {
        let currentFolder = files.find((f) => f.id === folderId);
        const path = [];
        while (currentFolder) {
          path.unshift({ id: currentFolder.id, name: currentFolder.name });
          currentFolder = files.find((f) => f.id === currentFolder?.parentId);
        }
        newBreadcrumbs.push(...path);
      }
      setBreadcrumbs(newBreadcrumbs);
    };

    buildBreadcrumbs();
  }, [folderId, files, setBreadcrumbs]);

  return (
    <Box sx={{ mb: 3 }}>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 2 }}>
        <MuiBreadcrumbs
          separator={<ChevronRightIcon fontSize="small" />}
          sx={{
            "& .MuiBreadcrumbs-separator": {
              color: "text.secondary",
            },
          }}
        >
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const to = crumb.id === "root" ? "/drive" : `/folder/${crumb.id}`;

            return isLast ? (
              <Typography
                key={crumb.id}
                color="text.primary"
                fontSize={20}
                fontWeight={400}
              >
                {crumb.name}
              </Typography>
            ) : (
              <Link
                key={crumb.id}
                component={RouterLink}
                to={to}
                underline="hover"
                color="text.secondary"
                fontSize={14}
                sx={{
                  "&:hover": {
                    color: "text.primary",
                  },
                }}
              >
                {crumb.name}
              </Link>
            );
          })}
        </MuiBreadcrumbs>
      </Box>

      {/* Filter Buttons and View Toggle */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Filter Buttons */}
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <FilterButton
            label="Type"
            onClick={(e) => setTypeMenuAnchor(e.currentTarget)}
          />
          <FilterButton
            label="People"
            onClick={(e) => setPeopleMenuAnchor(e.currentTarget)}
          />
          <FilterButton
            label="Modified"
            onClick={(e) => setModifiedMenuAnchor(e.currentTarget)}
          />
          <FilterButton
            label="Source"
            onClick={(e) => setSourceMenuAnchor(e.currentTarget)}
          />
        </Box>

        {/* View Toggle and Info Button */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ButtonGroup
            variant="outlined"
            sx={{
              "& .MuiButtonGroup-grouped": {
                borderColor: colors.border,
                minWidth: 40,
                "&:hover": {
                  borderColor: colors.border,
                  backgroundColor: colors.hover,
                },
              },
            }}
          >
            <IconButton
              size="small"
              onClick={() => setViewMode("list")}
              sx={{
                color: viewMode === "list" ? colors.primary : "text.secondary",
                backgroundColor:
                  viewMode === "list" ? colors.selected : "transparent",
                borderRadius: "4px 0 0 4px",
                "&:hover": {
                  backgroundColor:
                    viewMode === "list" ? colors.selected : colors.hover,
                },
              }}
            >
              <ViewListIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setViewMode("grid")}
              sx={{
                color: viewMode === "grid" ? colors.primary : "text.secondary",
                backgroundColor:
                  viewMode === "grid" ? colors.selected : "transparent",
                borderRadius: "0 4px 4px 0",
                "&:hover": {
                  backgroundColor:
                    viewMode === "grid" ? colors.selected : colors.hover,
                },
              }}
            >
              <ViewModuleIcon fontSize="small" />
            </IconButton>
          </ButtonGroup>

          <IconButton
            size="small"
            sx={{
              color: "text.secondary",
              border: `1px solid ${colors.border}`,
              borderRadius: 1,
              "&:hover": {
                backgroundColor: colors.hover,
              },
            }}
          >
            <InfoIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Filter Menus (Placeholder content) */}
      <Menu
        anchorEl={typeMenuAnchor}
        open={Boolean(typeMenuAnchor)}
        onClose={() => setTypeMenuAnchor(null)}
      >
        <MenuItem onClick={() => setTypeMenuAnchor(null)}>Folders</MenuItem>
        <MenuItem onClick={() => setTypeMenuAnchor(null)}>Documents</MenuItem>
        <MenuItem onClick={() => setTypeMenuAnchor(null)}>
          Spreadsheets
        </MenuItem>
        <MenuItem onClick={() => setTypeMenuAnchor(null)}>
          Presentations
        </MenuItem>
        <MenuItem onClick={() => setTypeMenuAnchor(null)}>Images</MenuItem>
        <MenuItem onClick={() => setTypeMenuAnchor(null)}>Videos</MenuItem>
      </Menu>

      <Menu
        anchorEl={peopleMenuAnchor}
        open={Boolean(peopleMenuAnchor)}
        onClose={() => setPeopleMenuAnchor(null)}
      >
        <MenuItem onClick={() => setPeopleMenuAnchor(null)}>
          Owned by me
        </MenuItem>
        <MenuItem onClick={() => setPeopleMenuAnchor(null)}>
          Not owned by me
        </MenuItem>
        <MenuItem onClick={() => setPeopleMenuAnchor(null)}>
          Specific person
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={modifiedMenuAnchor}
        open={Boolean(modifiedMenuAnchor)}
        onClose={() => setModifiedMenuAnchor(null)}
      >
        <MenuItem onClick={() => setModifiedMenuAnchor(null)}>Today</MenuItem>
        <MenuItem onClick={() => setModifiedMenuAnchor(null)}>
          Last 7 days
        </MenuItem>
        <MenuItem onClick={() => setModifiedMenuAnchor(null)}>
          Last 30 days
        </MenuItem>
        <MenuItem onClick={() => setModifiedMenuAnchor(null)}>
          This year
        </MenuItem>
        <MenuItem onClick={() => setModifiedMenuAnchor(null)}>
          Custom date
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={sourceMenuAnchor}
        open={Boolean(sourceMenuAnchor)}
        onClose={() => setSourceMenuAnchor(null)}
      >
        <MenuItem onClick={() => setSourceMenuAnchor(null)}>My Drive</MenuItem>
        <MenuItem onClick={() => setSourceMenuAnchor(null)}>
          Shared with me
        </MenuItem>
        <MenuItem onClick={() => setSourceMenuAnchor(null)}>Starred</MenuItem>
      </Menu>
    </Box>
  );
};
