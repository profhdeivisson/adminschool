package com.adminschool.backend.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.adminschool.backend.dto.register.UserRegisterDTO;
import com.adminschool.backend.dto.UserResponseDTO;
import com.adminschool.backend.dto.UserUpdateDTO;
import com.adminschool.backend.dto.login.LoginRequestDTO;
import com.adminschool.backend.dto.login.LoginResponseDTO;
import com.adminschool.backend.entity.User;
import com.adminschool.backend.security.JwtTokenProvider;
import com.adminschool.backend.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/users")
@Validated
public class UserController {
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    public UserController(UserService userService, JwtTokenProvider jwtTokenProvider) {
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Validated UserRegisterDTO dto) {
        try {
            UserResponseDTO userResponse = userService.registerAndReturnDTO(dto);
            String token = jwtTokenProvider.generateToken(userService.authenticate(dto.email(), dto.password()).orElseThrow());
            return ResponseEntity.ok(Map.of("token", token, "user", userResponse));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Validated LoginRequestDTO loginRequest) {
        Optional<User> userOpt = userService.authenticate(loginRequest.login(), loginRequest.password());
        if (userOpt.isPresent()) {
            String token = jwtTokenProvider.generateToken(userOpt.get());
            LoginResponseDTO loginResponse = userService.authenticateAndReturnDTO(loginRequest.login(), loginRequest.password(), token).orElse(null);
            return ResponseEntity.ok(loginResponse);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Credenciais inválidas"));
        }
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR', 'ALUNO')")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        Optional<UserResponseDTO> userOpt = userService.findUserByUsername(currentUsername);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Usuário não encontrado"));
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<?> listUsers() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        try {
            User currentUser = userService.findUserEntityByUsername(currentUsername)
                    .orElseThrow(() -> new IllegalArgumentException("Usuário atual não encontrado"));
            List<UserResponseDTO> users = userService.listUsers(currentUser);
            return ResponseEntity.ok(users);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{identifier}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR', 'ALUNO')")
    public ResponseEntity<?> getUserByIdOrUsername(@PathVariable("identifier") String identifier) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        try {
            User currentUser = userService.findUserEntityByUsername(currentUsername)
                    .orElseThrow(() -> new IllegalArgumentException("Usuário atual não encontrado"));
            UserResponseDTO user;
            try {
                UUID userId = UUID.fromString(identifier);
                user = userService.getUserById(userId, currentUser);
            } catch (IllegalArgumentException e) {
                // Não é UUID, tentar buscar por username
                user = userService.getUserByUsername(identifier, currentUser);
            }
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR', 'ALUNO')")
    public ResponseEntity<?> updateUser(@PathVariable UUID userId, 
                                       @RequestBody @Validated UserUpdateDTO dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        try {
            User currentUser = userService.findUserEntityByUsername(currentUsername)
                    .orElseThrow(() -> new IllegalArgumentException("Usuário atual não encontrado"));
            UserResponseDTO updatedUser = userService.updateUser(userId, dto, currentUser);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable UUID userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        try {
            User currentUser = userService.findUserEntityByUsername(currentUsername)
                    .orElseThrow(() -> new IllegalArgumentException("Usuário atual não encontrado"));
            userService.deleteUser(userId, currentUser);
            return ResponseEntity.ok(Map.of("message", "Usuário deletado com sucesso"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}
