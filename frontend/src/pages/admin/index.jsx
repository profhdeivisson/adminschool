import { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  AppBar, 
  Toolbar, 
  IconButton
} from '@mui/material';
import { Link } from 'react-router-dom';
import './style.css';
import { useLoader } from '../../context/LoaderContext';
import { useQuery } from '@tanstack/react-query';
import { listUsers } from '../../services/listUsers';

export default function Admin() {
  const {showLoader, hideLoader, loading} = useLoader();
  const [selectedView, setSelectedView] = useState('all');

  const translateRole = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'Admin';
      case 'PROFESSOR':
        return 'Professor';
      case 'ALUNO':
        return 'Aluno';
      default:
        return role;
    }
  };

  const { data: users = [], isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: listUsers,
    select: (data) => {
      if (data.error) throw new Error(data.error);
      return data.data.map(user => ({
        id: user.id,
        nome: user.name,
        email: user.email,
        tipo: translateRole(user.role)
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutos para considerar os dados frescos
  });

  useEffect(() => {
    showLoader();
    const timer = setTimeout(() => {
      hideLoader();
    }, 1000);
    return () => {
      clearTimeout(timer);
      hideLoader();
    };
  }, []);

  if (loading || isLoading) {
    return null;
  }

  if (isError) {
    return <div>Erro: {error.message}</div>;
  }

  const filteredUsers = selectedView === 'all' 
    ? users 
    : users.filter(user => 
        selectedView === 'professors' 
          ? user.tipo === 'Professor' 
          : user.tipo === 'Aluno'
      );

  const clearFilter = () => {
    setSelectedView('all');
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
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            ADMIN SCHOOL
          </Typography>
        </Box>
        <List>
          <ListItem 
            button 
            selected={selectedView === 'professors'} 
            onClick={() => setSelectedView('professors')}
            className="filter-button"
          >
            <ListItemText primary="VER PROFESSORES" />
          </ListItem>
          <ListItem 
            button 
            selected={selectedView === 'students'} 
            onClick={() => setSelectedView('students')}
            className="filter-button"
          >
            <ListItemText primary="VER ALUNOS" />
          </ListItem>
          {selectedView !== 'all' && (
            <ListItem 
              button 
              onClick={clearFilter}
              className="clear-filter-button"
            >
              <ListItemText primary="LIMPAR FILTRO" />
            </ListItem>
          )}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar 
          position="static" 
          color="default" 
          elevation={0}
          sx={{ borderBottom: '1px solid #e0e0e0' }}
        >
          <Toolbar sx={{ justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              component={Link} 
              to="/"
              sx={{ borderRadius: 0 }}
            >
              SAIR
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <TableContainer 
            component={Paper} 
            sx={{ 
              boxShadow: 'none', 
              border: '1px solid #e0e0e0',
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Table stickyHeader sx={{ flexGrow: 1 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>NOME</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>EMAIL</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>TIPO DE USUÁRIO</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="table-row-hover">
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.nome}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.tipo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}