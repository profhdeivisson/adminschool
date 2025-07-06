package com.adminschool.backend.dto;

import com.adminschool.backend.entity.enuns.UserRole;
import java.time.LocalDateTime;

public record UserResponseDTO(
        String id,
        String name,
        String email,
        String username,
        UserRole role,
        LocalDateTime createdAt
) {
} 