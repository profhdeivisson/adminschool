import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/shared/Layout/Layout';
import UserCard from '../../components/shared/UserProfile/UserCard';
import StudentSkills from '../../components/shared/StudentSkills';
import GradesTable from '../../components/shared/GradesTable';
import { useState } from 'react';
import { Grid } from '@mui/material';

export default function Student() {
  const { user: authUser } = useAuth();
  const [searchText, setSearchText] = useState('');

  return (
    <Layout searchText={searchText} setSearchText={setSearchText}>
      <Grid container spacing={3} pt={3} sx={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'}}>
        <Grid container>
          <UserCard user={authUser} />
        </Grid>
        <Grid container>
          <StudentSkills />
        </Grid>
      </Grid>
      <Grid container spacing={3} pt={3} sx={{display: 'grid', gap: 1, gridTemplateColumns: 'repeat(1, 1fr)'}}>
        <Grid container mb={3}>
          <GradesTable />
        </Grid>
      </Grid>
    </Layout>
  );
}