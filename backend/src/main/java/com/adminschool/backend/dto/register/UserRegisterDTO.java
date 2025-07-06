package com.adminschool.backend.dto.register;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserRegisterDTO(
        @NotNull
        @NotBlank
        String name,
        @NotBlank
        @NotNull
        String username,
        @NotBlank
        @NotNull
        @Email
        String email,
        @NotBlank
        @NotNull
        String password,
        @NotBlank
        @NotNull
        String role) {
}
