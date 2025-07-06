package com.adminschool.backend.dto.login;

import jakarta.validation.constraints.NotBlank;

public record LoginRequestDTO(
        @NotBlank(message = "Login é obrigatório")
        String login,
        @NotBlank(message = "Senha é obrigatória")
        String password
) {
} 