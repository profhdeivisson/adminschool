import { Box, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export default function UserTable({ users, searchText, userRole }) {
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'nome', headerName: 'Nome', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'tipo', headerName: 'Tipo de Usuário', width: 150 },
  ];

  const searchedUsers = users.filter(user => 
    user.nome.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ width: '100%' }}>
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
}