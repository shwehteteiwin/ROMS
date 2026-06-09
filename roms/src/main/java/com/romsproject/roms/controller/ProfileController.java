
package com.romsproject.roms.controller;

import com.romsproject.roms.entity.User;
import com.romsproject.roms.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:8080", allowCredentials = "true")
public class ProfileController {

    private final UserRepository userRepository;

    public ProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public Map<String, Object> getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // extra safety
        if (auth == null || !auth.isAuthenticated()
                || auth.getPrincipal().equals("anonymousUser")) {
            throw new RuntimeException("Not authenticated");
        }

        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return Map.of(
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole().getRoleName(),
                "createdAt", user.getCreatedAt(),
                "photoUrl", user.getPhotoUrl() != null
                        ? user.getPhotoUrl()
                        : "/images/cus5.jpg");
  
    }
}