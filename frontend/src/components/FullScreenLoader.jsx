import { CircularProgress, Box } from '@mui/material';

export default function FullScreenLoader({ open }) {
  if (!open) return null;
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 2000,
        background: 'rgba(255,255,255,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <CircularProgress size={60} color="primary" />
    </Box>
  );
}