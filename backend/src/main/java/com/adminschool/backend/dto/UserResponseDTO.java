package com.adminschool.backend.dto;

import com.adminschool.backend.entity.enuns.UserRole;
import java.time.LocalDateTime;
import java.util.UUID;

public record UserResponseDTO(
        UUID id,
        String name,
        String email,
        String username,
        UserRole role,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
} 