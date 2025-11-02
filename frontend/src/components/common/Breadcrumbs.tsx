import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  Skeleton,
} from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useFileStore } from "../../store/fileStore";
import { ChevronRight as ChevronRightIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { fileService } from "../../services/fileService";

export const Breadcrumbs = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const breadcrumbs = useFileStore((state) => state.breadcrumbs);
  const setBreadcrumbs = useFileStore((state) => state.setBreadcrumbs);
  const files = useFileStore((state) => state.files);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const buildBreadcrumbs = async () => {
      // Root folder - just show "My Drive"
      if (!folderId) {
        setBreadcrumbs([{ id: "root", name: "My Drive" }]);
        return;
      }

      // Try to get folder name from loaded files first for immediate feedback
      const currentFolder = files.find((f) => f.id === folderId);
      if (currentFolder) {
        // Show immediate breadcrumb with just current folder name while loading full path
        setBreadcrumbs([
          { id: "root", name: "My Drive" },
          { id: currentFolder.id, name: currentFolder.name },
        ]);
      }

      // Fetch complete folder path from backend API
      try {
        setLoading(true);
        const response = await fileService.getFolderPath(folderId);
        const pathBreadcrumbs = response.path.map((folder: any) => ({
          id: folder.id,
          name: folder.name,
        }));

        // Prepend "My Drive" to the path
        setBreadcrumbs([{ id: "root", name: "My Drive" }, ...pathBreadcrumbs]);
      } catch (error: any) {
        console.error("Failed to fetch folder path:", error);

        // If we already have current folder name, keep it
        if (currentFolder) {
          // Already set above, do nothing
        } else {
          // Fallback to loading indicator
          setBreadcrumbs([
            { id: "root", name: "My Drive" },
            { id: folderId, name: "Loading..." },
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    buildBreadcrumbs();
  }, [folderId, setBreadcrumbs, files]);

  return (
    <Box sx={{ mb: 2 }}>
      {loading && breadcrumbs.length === 1 ? (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography color="text.primary">My Drive</Typography>
          <ChevronRightIcon fontSize="small" sx={{ color: "text.secondary" }} />
          <Skeleton variant="text" width={120} height={24} />
        </Box>
      ) : (
        <MuiBreadcrumbs separator={<ChevronRightIcon fontSize="small" />}>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const to = crumb.id === "root" ? "/drive" : `/folder/${crumb.id}`;

            return isLast ? (
              <Typography key={crumb.id} color="text.primary" fontWeight={500}>
                {crumb.name}
              </Typography>
            ) : (
              <Link
                key={crumb.id}
                component={RouterLink}
                to={to}
                underline="hover"
                color="inherit"
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                {crumb.name}
              </Link>
            );
          })}
        </MuiBreadcrumbs>
      )}
    </Box>
  );
};
