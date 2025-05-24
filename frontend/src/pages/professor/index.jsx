import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { listUsers } from '../../services/listUsers';
import Layout from '../../components/shared/Layout/Layout';
import UserTable from '../../components/shared/UserProfile/UserTable';

export default function Professor() {
  const { user: authUser } = useAuth();
  const [searchText, setSearchText] = useState('');

  const { data: users = [], isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: listUsers,
    select: (data) => {
      if (data.error) throw new Error(data.error);
      return data.data
        .filter(user => user.role === 'ALUNO')
        .map(user => ({
          id: user.id,
          nome: user.name,
          email: user.email,
          tipo: user.role
        }));
    },
    staleTime: 5 * 60 * 1000
  });

  if (isLoading) return null;
  if (isError) return <div>Erro: {error.message}</div>;

  return (
    <Layout searchText={searchText} setSearchText={setSearchText}>
      <UserTable users={users} searchText={searchText} userRole="PROFESSOR" />
    </Layout>
  );
}