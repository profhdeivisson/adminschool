import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/shared/Layout/Layout';
import UserCard from '../../components/shared/UserProfile/UserCard';
import { useState } from 'react';

export default function Student() {
  const { user: authUser } = useAuth();
  const [searchText, setSearchText] = useState('');

  return (
    <Layout searchText={searchText} setSearchText={setSearchText}>
      <UserCard user={authUser} />
    </Layout>
  );
}