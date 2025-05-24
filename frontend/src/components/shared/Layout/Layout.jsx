import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout({ children, searchText, setSearchText }) {
  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100vh' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Header searchText={searchText} setSearchText={setSearchText} />
        {children}
      </Box>
    </Box>
  );
}