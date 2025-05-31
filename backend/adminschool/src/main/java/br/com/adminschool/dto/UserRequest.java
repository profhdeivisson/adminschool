package br.com.adminschool.dto;

import br.com.adminschool.enums.UserEnum;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserRequest(
    
    @NotBlank
    @NotNull
    String name,

    @NotBlank
    @NotNull
    @Email
    String email,

    @NotBlank
    @NotNull
    String password,
    
    @NotBlank
    @NotNull
    UserEnum role
    ) {
    
}
