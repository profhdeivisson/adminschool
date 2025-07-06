package com.adminschool.backend.services;

import com.adminschool.backend.entity.User;
import com.adminschool.backend.entity.enuns.UserRole;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationService {

    /**
     * Verifica se um usuário pode visualizar outro usuário
     */
    public boolean canViewUser(User currentUser, User targetUser) {
        if (currentUser == null || targetUser == null) {
            return false;
        }

        // Admin pode ver todos os usuários
        if (currentUser.getRole() == UserRole.ADMIN) {
            return true;
        }

        // Professor pode ver todos os alunos
        if (currentUser.getRole() == UserRole.PROFESSOR && targetUser.getRole() == UserRole.ALUNO) {
            return true;
        }

        // Usuário pode ver a si mesmo
        return currentUser.getId().equals(targetUser.getId());
    }

    /**
     * Verifica se um usuário pode editar outro usuário
     */
    public boolean canEditUser(User currentUser, User targetUser) {
        if (currentUser == null || targetUser == null) {
            return false;
        }

        // Admin pode editar todos os usuários
        if (currentUser.getRole() == UserRole.ADMIN) {
            return true;
        }

        // Professor pode editar apenas a si mesmo
        if (currentUser.getRole() == UserRole.PROFESSOR) {
            return currentUser.getId().equals(targetUser.getId());
        }

        // Aluno pode editar apenas a si mesmo
        if (currentUser.getRole() == UserRole.ALUNO) {
            return currentUser.getId().equals(targetUser.getId());
        }

        return false;
    }

    /**
     * Verifica se um usuário pode deletar outro usuário
     */
    public boolean canDeleteUser(User currentUser, User targetUser) {
        if (currentUser == null || targetUser == null) {
            return false;
        }

        // Apenas admin pode deletar usuários
        if (currentUser.getRole() != UserRole.ADMIN) {
            return false;
        }

        // Admin não pode deletar a si mesmo
        if (currentUser.getId().equals(targetUser.getId())) {
            return false;
        }

        // Admin pode deletar professores e alunos
        return targetUser.getRole() == UserRole.PROFESSOR || targetUser.getRole() == UserRole.ALUNO;
    }

    /**
     * Verifica se um usuário pode listar outros usuários
     */
    public boolean canListUsers(User currentUser) {
        if (currentUser == null) {
            return false;
        }

        // Admin pode listar todos os usuários
        if (currentUser.getRole() == UserRole.ADMIN) {
            return true;
        }

        // Professor pode listar apenas alunos
        return currentUser.getRole() == UserRole.PROFESSOR;
    }
} 