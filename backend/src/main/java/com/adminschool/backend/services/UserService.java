package com.adminschool.backend.services;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import com.adminschool.backend.dto.register.UserRegisterDTO;
import com.adminschool.backend.dto.UserResponseDTO;
import com.adminschool.backend.dto.login.LoginResponseDTO;
import com.adminschool.backend.entity.User;
import com.adminschool.backend.entity.enuns.UserRole;
import com.adminschool.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import com.adminschool.backend.security.CustomUserDetails;

@Service
@Transactional
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(UserRegisterDTO dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }
        if (userRepository.existsByUsername(dto.username())) {
            throw new IllegalArgumentException("Username já cadastrado");
        }
        if (!UserRole.isValid(dto.role())) {
            throw new IllegalArgumentException("Role inválida");
        }
        User user = new User();
        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setUsername(dto.username());
        user.setPasswordHash(passwordEncoder.encode(dto.password()));
        user.setRole(UserRole.valueOf(dto.role().toUpperCase()));
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public UserResponseDTO registerAndReturnDTO(UserRegisterDTO dto) {
        User user = register(dto);
        return convertToUserResponseDTO(user);
    }

    public Optional<User> authenticate(String login, String password) {
        Optional<User> userOpt = login.contains("@") ?
                userRepository.findByEmail(login) :
                userRepository.findByUsername(login);
        if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPasswordHash())) {
            return userOpt;
        }
        return Optional.empty();
    }

    public Optional<LoginResponseDTO> authenticateAndReturnDTO(String login, String password, String token) {
        Optional<User> userOpt = authenticate(login, password);
        return userOpt.map(user -> new LoginResponseDTO(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getUsername(),
                user.getRole()
        ));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userOpt = username.contains("@") ?
                userRepository.findByEmail(username) :
                userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            throw new UsernameNotFoundException("Usuário não encontrado: " + username);
        }
        return new CustomUserDetails(userOpt.get());
    }

    public Optional<UserResponseDTO> findUserById(String userId) {
        return userRepository.findById(userId)
                .map(this::convertToUserResponseDTO);
    }

    private UserResponseDTO convertToUserResponseDTO(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getUsername(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}
