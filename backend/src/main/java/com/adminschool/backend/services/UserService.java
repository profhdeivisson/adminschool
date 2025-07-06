package com.adminschool.backend.services;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import com.adminschool.backend.dto.register.UserRegisterDTO;
import com.adminschool.backend.dto.UserResponseDTO;
import com.adminschool.backend.dto.UserUpdateDTO;
import com.adminschool.backend.dto.login.LoginResponseDTO;
import com.adminschool.backend.entity.User;
import com.adminschool.backend.entity.enuns.UserRole;
import com.adminschool.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import com.adminschool.backend.security.CustomUserDetails;

@Service
@Transactional
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthorizationService authorizationService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthorizationService authorizationService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authorizationService = authorizationService;
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

    public Optional<UserResponseDTO> findUserById(UUID userId) {
        return userRepository.findById(userId)
                .map(this::convertToUserResponseDTO);
    }

    public Optional<User> findUserEntityById(UUID userId) {
        return userRepository.findById(userId);
    }

    public UserResponseDTO updateUser(UUID userId, UserUpdateDTO dto, User currentUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        // Verificar autorização
        if (!authorizationService.canEditUser(currentUser, user)) {
            throw new IllegalArgumentException("Sem permissão para editar este usuário");
        }

        // Verificar se o email já existe (se foi alterado)
        if (!user.getEmail().equals(dto.email()) && userRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }

        // Verificar se o username já existe (se foi alterado)
        if (!user.getUsername().equals(dto.username()) && userRepository.existsByUsername(dto.username())) {
            throw new IllegalArgumentException("Username já cadastrado");
        }

        // Atualizar dados
        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setUsername(dto.username());
        
        // Atualizar senha apenas se fornecida
        if (dto.password() != null && !dto.password().trim().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(dto.password()));
        }

        // O campo updatedAt será atualizado automaticamente pelo @PreUpdate
        User updatedUser = userRepository.save(user);
        return convertToUserResponseDTO(updatedUser);
    }

    public void deleteUser(UUID userId, User currentUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        // Verificar autorização
        if (!authorizationService.canDeleteUser(currentUser, user)) {
            throw new IllegalArgumentException("Sem permissão para deletar este usuário");
        }

        userRepository.delete(user);
    }

    public List<UserResponseDTO> listUsers(User currentUser) {
        if (!authorizationService.canListUsers(currentUser)) {
            throw new IllegalArgumentException("Sem permissão para listar usuários");
        }

        List<User> users;
        if (currentUser.getRole() == UserRole.ADMIN) {
            // Admin pode ver todos os usuários
            users = userRepository.findAll();
        } else if (currentUser.getRole() == UserRole.PROFESSOR) {
            // Professor pode ver apenas alunos
            users = userRepository.findByRole(UserRole.ALUNO);
        } else {
            // Aluno não pode listar usuários
            users = List.of();
        }

        return users.stream()
                .map(this::convertToUserResponseDTO)
                .collect(Collectors.toList());
    }

    public UserResponseDTO getUserById(UUID userId, User currentUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        // Verificar autorização
        if (!authorizationService.canViewUser(currentUser, user)) {
            throw new IllegalArgumentException("Sem permissão para visualizar este usuário");
        }

        return convertToUserResponseDTO(user);
    }

    public UserDetails loadUserById(UUID userId) throws UsernameNotFoundException {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + userId));
        return new CustomUserDetails(user);
    }

    public UserResponseDTO getUserByUsername(String username, User currentUser) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        // Verificar autorização
        if (!authorizationService.canViewUser(currentUser, user)) {
            throw new IllegalArgumentException("Sem permissão para visualizar este usuário");
        }
        return convertToUserResponseDTO(user);
    }

    public Optional<User> findUserEntityByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<UserResponseDTO> findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(this::convertToUserResponseDTO);
    }

    private UserResponseDTO convertToUserResponseDTO(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getUsername(),
                user.getRole(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
