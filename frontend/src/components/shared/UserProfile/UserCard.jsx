import { Box, Card, CardContent, Typography } from '@mui/material';

export default function UserCard({ user }) {
  if (!user) return null;
  
  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ minWidth: 300, maxWidth: 400, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Meu Perfil
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Nome
            </Typography>
            <Typography variant="body1" gutterBottom>
              {user.name}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 2 }}>
              Email
            </Typography>
            <Typography variant="body1" gutterBottom>
              {user.email}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}