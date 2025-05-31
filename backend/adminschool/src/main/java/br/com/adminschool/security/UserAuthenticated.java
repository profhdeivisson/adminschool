package br.com.adminschool.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import br.com.adminschool.model.User;

public class UserAuthenticated implements UserDetails {
    private final User user;

    public UserAuthenticated(User user) {
        this.user = user;
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return switch (user.getRole()) {
            case ADMIN -> List.of(
                new SimpleGrantedAuthority("ROLE_ADMIN"),
                new SimpleGrantedAuthority("SCOPE_read:all"),
                new SimpleGrantedAuthority("SCOPE_write:all")
            );
            case PROFESSOR -> List.of(
                new SimpleGrantedAuthority("ROLE_PROFESSOR"),
                new SimpleGrantedAuthority("SCOPE_read:students"),
                new SimpleGrantedAuthority("SCOPE_read:own")
            );
            case ALUNO -> List.of(
                new SimpleGrantedAuthority("ROLE_ALUNO"),
                new SimpleGrantedAuthority("SCOPE_read:own")
            );
        };
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public User getUser() {
        return user;
    }
}
