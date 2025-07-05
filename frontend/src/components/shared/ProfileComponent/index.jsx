import { format, formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import './styles.css';
import { Link } from '@mui/material';
import { useState } from 'react';
import ModalEditProfile from '../ModalEditProfile';
import { updateUser } from '../../../services/updateUser';
import AlertMessage from '../../AlertMessage';

export default function ProfileComponent({ userData, onProfileUpdate }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

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
                    <Link onClick={() => setModalOpen(true)} className="edit-button">Editar Perfil</Link>
                </div>
            </div>

            <ModalEditProfile
                userData={userData}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={async (updatedData) => {
                    setIsUpdating(true);

                    try {
                        await updateUser(updatedData, userData.id);
                        await onProfileUpdate();

                        setAlertState({
                            open: true,
                            message: 'Perfil atualizado com sucesso!',
                            severity: 'success'
                        });
                    } catch (error) {
                        setAlertState({
                            open: true,
                            message: 'Erro ao atualizar perfil: ' + (error.message || 'Tente novamente mais tarde'),
                            severity: 'error'
                        });
                    } finally {
                        setIsUpdating(false);
                    }
                }}
                isSaving={isUpdating}
            />

            <AlertMessage
                open={alertState.open}
                message={alertState.message}
                severity={alertState.severity}
                onClose={() => setAlertState(prev => ({ ...prev, open: false }))}
            />
        </div>
    );
}