package com.adminschool.backend.dto.login;

import com.adminschool.backend.entity.enuns.UserRole;

public record LoginResponseDTO(
        String token,
        String userId,
        String name,
        String email,
        String username,
        UserRole role
) {
} 