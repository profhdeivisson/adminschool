package br.com.adminschool.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import br.com.adminschool.dto.UserResponse;
import br.com.adminschool.model.User;
import br.com.adminschool.service.UserService;


@RestController
@RequestMapping("/users")


public class UserController {

    @Autowired
    private UserService service;

    @GetMapping
    public List<UserResponse> findAll(){
        List<User> users = service.findAll();
        return users.stream().map(user -> new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole())).collect(Collectors.toList());
    }
    
}
