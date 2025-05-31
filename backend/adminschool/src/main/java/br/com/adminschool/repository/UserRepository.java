package br.com.adminschool.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.adminschool.model.User;

public interface UserRepository extends JpaRepository<User, UUID>{

}