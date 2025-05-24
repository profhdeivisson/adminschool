import { AppBar, Toolbar, TextField } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';

export default function Header({ searchText, setSearchText }) {
  const { user: authUser } = useAuth();

  return (
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
  );
}