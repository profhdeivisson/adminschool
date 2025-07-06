package com.adminschool.backend.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.adminschool.backend.dto.register.UserRegisterDTO;
import com.adminschool.backend.dto.UserResponseDTO;
import com.adminschool.backend.dto.login.LoginRequestDTO;
import com.adminschool.backend.dto.login.LoginResponseDTO;
import com.adminschool.backend.entity.User;
import com.adminschool.backend.security.JwtTokenProvider;
import com.adminschool.backend.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

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
    public ResponseEntity<?> getCurrentUser(@RequestParam String userId) {
        Optional<UserResponseDTO> userOpt = userService.findUserById(userId);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Usuário não encontrado"));
        }
    }
}
