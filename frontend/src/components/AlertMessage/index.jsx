import { Alert, Snackbar } from '@mui/material';

export default function AlertMessage({ 
  open, 
  message, 
  severity = 'error', 
  onClose,
  anchorOrigin = { vertical: 'top', horizontal: 'center' },
  autoHideDuration = 6000
}) {
  return (
    <Snackbar 
      open={open} 
      autoHideDuration={autoHideDuration} 
      onClose={onClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}