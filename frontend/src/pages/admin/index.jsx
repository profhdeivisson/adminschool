import { useState } from 'react';
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

export default function Admin() {
  const [selectedView, setSelectedView] = useState('all');
  
  // Mock data for the table
  const users = [
    { id: 1, nome: 'João Silva', email: 'joao@example.com', tipo: 'Professor' },
    { id: 2, nome: 'Maria Santos', email: 'maria@example.com', tipo: 'Aluno' },
    { id: 3, nome: 'Pedro Oliveira', email: 'pedro@example.com', tipo: 'Admin' },
    { id: 4, nome: 'Ana Costa', email: 'ana@example.com', tipo: 'Professor' },
    { id: 5, nome: 'Carlos Souza', email: 'carlos@example.com', tipo: 'Aluno' },
    { id: 6, nome: 'Lucia Ferreira', email: 'lucia@example.com', tipo: 'Aluno' },
    { id: 7, nome: 'Roberto Almeida', email: 'roberto@example.com', tipo: 'Professor' },
    { id: 8, nome: 'Fernanda Lima', email: 'fernanda@example.com', tipo: 'Aluno' },
  ];
  
  // Filter users based on selected view
  const filteredUsers = selectedView === 'all' 
    ? users 
    : users.filter(user => 
        selectedView === 'professors' 
          ? user.tipo === 'Professor' 
          : user.tipo === 'Aluno'
      );

  // Clear filter function
  const clearFilter = () => {
    setSelectedView('all');
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      {/* Sidebar */}
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
          
          {/* Clear filter button - only show when a filter is active */}
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

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
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

        {/* Table - expanded to take more space */}
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