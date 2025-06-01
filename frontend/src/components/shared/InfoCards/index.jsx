import { FaUsers, FaUserTie, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';
import './styles.css';

export default function InfoCards({ users }) {
    const totalUsers = users.length;
    const totalAdmins = users.filter(user => user.tipo === 'ADMIN').length;
    const totalTeachers = users.filter(user => user.tipo === 'PROFESSOR').length;
    const totalStudents = users.filter(user => user.tipo === 'ALUNO').length;

    return (
        <div className="info-cards-grid">
            <div className="info-card">
                <div className="card-content">
                    <p className="card-title">Total de Usuários</p>
                    <p className="card-value">{totalUsers}</p>
                </div>
                <div className="icon-container blue">
                    <FaUsers className="icon" />
                </div>
            </div>

            <div className="info-card">
                <div className="card-content">
                    <p className="card-title">Administradores</p>
                    <p className="card-value">{totalAdmins}</p>
                </div>
                <div className="icon-container purple">
                    <FaUserTie className="icon" />
                </div>
            </div>

            <div className="info-card">
                <div className="card-content">
                    <p className="card-title">Professores</p>
                    <p className="card-value">{totalTeachers}</p>
                </div>
                <div className="icon-container green">
                    <FaChalkboardTeacher className="icon" />
                </div>
            </div>

            <div className="info-card">
                <div className="card-content">
                    <p className="card-title">Alunos</p>
                    <p className="card-value">{totalStudents}</p>
                </div>
                <div className="icon-container yellow">
                    <FaUserGraduate className="icon" />
                </div>
            </div>
        </div>
    );
}