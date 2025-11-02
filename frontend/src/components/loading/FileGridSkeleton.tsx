import { Box, Card, CardContent, CardMedia, Skeleton } from '@mui/material';
import { colors } from '../../theme/theme';

interface FileGridSkeletonProps {
  count?: number;
}

export const FileGridSkeleton = ({ count = 12 }: FileGridSkeletonProps) => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 2 }}>
        {Array.from({ length: count }).map((_, index) => (
          <Box key={index}>
            <Card
              sx={{
                height: 220,
                border: `1px solid ${colors.border}`,
                borderRadius: 2,
              }}
            >
              {/* Thumbnail skeleton */}
              <CardMedia
                sx={{
                  height: 140,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.surfaceVariant,
                }}
              >
                <Skeleton
                  variant="rectangular"
                  width={64}
                  height={64}
                  sx={{ borderRadius: 1 }}
                />
              </CardMedia>

              {/* File info skeleton */}
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Skeleton variant="text" width="80%" height={20} sx={{ mb: 0.5 }} />
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                  }}
                >
                  <Skeleton variant="text" width="50%" height={16} />
                  <Skeleton variant="text" width="30%" height={16} />
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
