import { useEffect, useState } from 'react';
import { 
  Box, 
  Typography,
  Paper, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  AppBar, 
  Toolbar, 
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Card,
  CardContent
} from '@mui/material';
import './style.css';
import { useLoader } from '../../context/LoaderContext';
import { useAuth } from '../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { listUsers } from '../../services/listUsers';
import { DataGrid } from '@mui/x-data-grid';
import {jwtDecode} from 'jwt-decode';
import { getUser } from '../../services/getUser';

export default function Admin() {
  const {showLoader, hideLoader, loading} = useLoader();
  const { user: authUser, login, logout } = useAuth();
  const [selectedView, setSelectedView] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchText, setSearchText] = useState('');
  const open = Boolean(anchorEl);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !authUser) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          console.error('Token expirado');
          logout();
          return;
        }

        const fetchUserData = async () => {
          const response = await getUser(decodedToken.id);
          if (!response.error) {
            login({
              id: decodedToken.id,
              name: response.data.name,
              email: response.data.email,
              role: response.data.role
            });
          } else {
            console.error('Erro ao buscar dados do usuário:', response.error);
          }
        };
        fetchUserData();
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
      }
    }
    showLoader();
    const timer = setTimeout(() => {
      hideLoader();
    }, 1000);
    return () => {
      clearTimeout(timer);
      hideLoader();
    };
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Só faz a query se não for aluno
  const { data: users = [], isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: listUsers,
    select: (data) => {
      if (data.error) throw new Error(data.error);
      return data.data.map(user => ({
        id: user.id,
        nome: user.name,
        email: user.email,
        tipo: user.role
      }));
    },
    staleTime: 5 * 60 * 1000,
    enabled: authUser?.role !== 'ALUNO' // Desabilita a query para alunos
  });

  // Renderiza o card do aluno
  const renderStudentCard = () => {
    if (!authUser) return null;
    
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
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
                {authUser.name}
              </Typography>

              <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 2 }}>
                Email
              </Typography>
              <Typography variant="body1" gutterBottom>
                {authUser.email}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  };

  // Renderiza o conteúdo principal baseado no papel do usuário
  const renderMainContent = () => {
    if (authUser?.role === 'ALUNO') {
      return renderStudentCard();
    }

    if (loading || isLoading) {
      return null;
    }

    if (isError) {
      return <div>Erro: {error.message}</div>;
    }

    return (
      <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Paper sx={{ height: '100%', width: '100%' }}>
          <DataGrid 
            rows={searchedUsers} 
            columns={columns} 
            initialState={{ pagination: { paginationModel: { pageSize: 5 } } }} 
            pageSizeOptions={[5, 10]} 
            checkboxSelection 
            sx={{ border: 0 }}
          />
        </Paper>
      </Box>
    );
  };

  const filteredUsers = selectedView === 'all' 
    ? users 
    : users.filter(user => 
        selectedView === 'professors' 
          ? user.tipo === 'Professor' 
          : user.tipo === 'Aluno'
      );

  const searchedUsers = filteredUsers.filter(user => 
    user.nome.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'nome', headerName: 'Nome', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'tipo', headerName: 'Tipo de Usuário', width: 150 },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
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

      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar 
          position="static" 
          color="default" 
          elevation={0}
          sx={{ borderBottom: '1px solid #e0e0e0' }}
        >
          <Toolbar sx={{ justifyContent: 'flex-end' }}>
            {authUser?.role !== 'ALUNO' && (
              <TextField
                size="small"
                placeholder="Pesquisar..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                sx={{ width: 300 }}
              />
            )}
          </Toolbar>
        </AppBar>

        {renderMainContent()}
      </Box>
    </Box>
  );
}
