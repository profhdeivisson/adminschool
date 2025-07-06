package com.adminschool.backend.entity.enuns;

public enum UserRole {
    ADMIN, PROFESSOR, ALUNO;

    public static boolean isValid(String role) {
        try {
            UserRole.valueOf(role.toUpperCase());
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}