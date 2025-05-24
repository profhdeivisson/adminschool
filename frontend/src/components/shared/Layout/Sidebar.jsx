import { 
  Box, 
  Drawer, 
  Typography, 
  Avatar, 
  IconButton, 
  Tooltip,
  Menu,
  MenuItem 
} from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function Sidebar() {
  const { user: authUser, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          borderRight: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        },
      }}
    >
      <Box>
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            ADMIN SCHOOL
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{ p: 2, borderTop: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        onClick={handleClick}
      >
        <Tooltip title="Configurações da conta">
          <IconButton
            size="small" 
            sx={{ mr: 1 }} 
            aria-controls={open ? 'account-menu' : undefined} 
            aria-haspopup="true" 
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {authUser?.name ? authUser.name[0].toUpperCase() : 'U'}
            </Avatar>
          </IconButton>
        </Tooltip>
        <Typography
          variant="body2"
          sx={{ 
            textAlign: 'center',
            maxWidth: 150,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {authUser?.name || 'Usuário'}
        </Typography>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={(e) => e.stopPropagation()}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
          <MenuItem onClick={handleClose}>
            Meu Perfil
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            Sair
          </MenuItem>
        </Menu>
      </Box>
    </Drawer>
  );
}