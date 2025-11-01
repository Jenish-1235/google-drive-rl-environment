import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useFileStore } from "../../store/fileStore";
import { ChevronRight as ChevronRightIcon } from "@mui/icons-material";
import { useEffect } from "react";

export const Breadcrumbs = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const files = useFileStore((state) => state.files);
  const breadcrumbs = useFileStore((state) => state.breadcrumbs);
  const setBreadcrumbs = useFileStore((state) => state.setBreadcrumbs);

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
    <Box sx={{ mb: 2 }}>
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
            >
              {crumb.name}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};
