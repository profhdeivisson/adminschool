package br.com.adminschool.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.adminschool.model.User;

public interface UserRepository extends JpaRepository<User, UUID>{
    Optional<User> findByUsername(String username);
}