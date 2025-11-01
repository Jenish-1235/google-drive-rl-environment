import { Box, Typography, Container } from '@mui/material';

interface AuthPageProps {
  mode: 'login' | 'signup';
}

export const AuthPage = ({ mode }: AuthPageProps) => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h2" gutterBottom>
          {mode === 'login' ? 'Sign In' : 'Sign Up'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Authentication form will appear here.
        </Typography>
        {/* TODO: Add login/signup form */}
      </Box>
    </Container>
  );
};
