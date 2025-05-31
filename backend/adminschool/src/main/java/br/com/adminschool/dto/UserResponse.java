package br.com.adminschool.dto;

import java.util.UUID;

import br.com.adminschool.enums.UserEnum;

public record UserResponse(UUID id, String name, String email, UserEnum role) {
}