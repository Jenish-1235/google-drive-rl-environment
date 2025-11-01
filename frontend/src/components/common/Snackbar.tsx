import { Snackbar as MuiSnackbar, Alert } from '@mui/material';
import { useUIStore } from '../../store/uiStore';

export const Snackbar = () => {
  const snackbar = useUIStore((state) => state.snackbar);
  const hideSnackbar = useUIStore((state) => state.hideSnackbar);

  return (
    <MuiSnackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={hideSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Alert
        onClose={hideSnackbar}
        severity={snackbar.severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </MuiSnackbar>
  );
};
