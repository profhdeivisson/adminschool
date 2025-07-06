package com.adminschool.backend.dto.login;

import java.util.UUID;

import com.adminschool.backend.entity.enuns.UserRole;

public record LoginResponseDTO(
        String token,
        UUID userId,
        String name,
        String email,
        String username,
        UserRole role
) {
} 