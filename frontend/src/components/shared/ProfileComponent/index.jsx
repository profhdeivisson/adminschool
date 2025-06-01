import { format, formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import './styles.css';
import { Link } from '@mui/material';

export default function ProfileComponent({ userData }) {
    const formatDate = (date) => {
        if (!date) return '-';
        const parsedDate = new Date(date);
        const formattedDate = format(parsedDate, 'dd/MM/yyyy', { locale: ptBR });
        const timeAgo = formatDistance(parsedDate, new Date(), { locale: ptBR, addSuffix: true });
        return `${formattedDate} (${timeAgo})`;
    };

    const getRoleLabel = (role) => {
        const roles = {
            ADMIN: 'Administrador',
            PROFESSOR: 'Professor',
            ALUNO: 'Aluno'
        };
        return roles[role] || role;
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="avatar">
                        <img src="/default-avatar.jpg" alt="Avatar do usuário" />
                    </div>
                    <h1>Meu Perfil</h1>
                </div>
                
                <div className="profile-info">
                    <div className="info-group">
                        <label>Nome</label>
                        <p>{userData?.name}</p>
                    </div>

                    <div className="info-group">
                        <label>Email</label>
                        <p>{userData?.email}</p>
                    </div>

                    <div className="info-group">
                        <label>Tipo de Usuário</label>
                        <p>{getRoleLabel(userData?.role)}</p>
                    </div>

                    <div className="info-group">
                        <label>Data de Criação</label>
                        <p>{formatDate(userData?.created_at)}</p>
                    </div>

                    <div className="info-group">
                        <label>Última Atualização</label>
                        <p>{formatDate(userData?.updated_at)}</p>
                    </div>
                </div>

                <div className="profile-actions">
                    <Link to="#" className="edit-button">Editar Perfil</Link>
                </div>
            </div>
        </div>
    );
}