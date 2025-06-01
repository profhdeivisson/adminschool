import { Box, Card, CardContent, Typography, Avatar } from '@mui/material';

export default function UserCard({ user }) {
  if (!user) return null;
  
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Card sx={{ minWidth: 300, width: '100%', boxShadow: 3 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <Avatar
            src="/default-avatar.jpg"
            alt={user.name}
            sx={{ width: 120, height: 120, mb: 2 }}
          />
          <Typography variant="h5" component="div" gutterBottom>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {user.email}
          </Typography>
          <Box sx={{ width: '100%', mt: 2, borderTop: 1, borderColor: 'divider', pt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Matrícula Ativa
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
              2º Semestre
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}