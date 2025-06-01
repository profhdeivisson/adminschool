import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { getUser } from '../../services/getUser';
import Layout from '../../components/shared/Layout/Layout';
import ProfileComponent from '../../components/shared/ProfileComponent';

export default function Profile() {
    const [searchText, setSearchText] = useState('');
    const { user: authUser } = useAuth();
    const { data: userData, isLoading, isError, error } = useQuery({
        queryKey: ['user', authUser?.id],
        queryFn: () => getUser(authUser?.id),
        select: (data) => {
        if (data.error) throw new Error(data.error);
        return data.data;
        },
        enabled: !!authUser?.id,
        staleTime: 5 * 60 * 1000
    });

    if (isLoading) return null;
    if (isError) return <div>Erro: {error.message}</div>;

    return (
    <Layout searchText={searchText} setSearchText={setSearchText}>
        <ProfileComponent userData={userData} />
    </Layout>
    );
}
