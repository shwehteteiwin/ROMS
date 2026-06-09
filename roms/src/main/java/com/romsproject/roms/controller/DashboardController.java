package com.romsproject.roms.controller;

import java.util.List;



import org.springframework.web.bind.annotation.*;

import com.romsproject.roms.entity.RestaurantTable;
import com.romsproject.roms.repository.TableRepository;

import jakarta.annotation.security.PermitAll;

@RestController
@RequestMapping("/api/dashboard")

@CrossOrigin(origins = "http://localhost:8080", allowCredentials = "true")
public class DashboardController {
    private final TableRepository tableRepository;

    public DashboardController(TableRepository tableRepository) {
        this.tableRepository = tableRepository;
    }

    @GetMapping("/tables")
    @PermitAll  //
    public List<RestaurantTable> getAllTables() {
        return tableRepository.findAll();
    }

}

// @GetMapping("/dashboard")
// public Map<String, Object> getDashboard() {
// Authentication auth = SecurityContextHolder.getContext().getAuthentication();
// String email = auth.getName();
// String role = auth.getAuthorities().stream()
// .map(Object::toString)
// .findFirst().orElse("UNKNOWN");

// Map<String, Object> response = new HashMap<>();
// response.put("message", "Welcome to your dashboard");
// response.put("email", email);
// response.put("role", role);
// return response;
// }
// }

// @GetMapping
// public String getDashboard() {
// Authentication auth = SecurityContextHolder.getContext().getAuthentication();
// String email = auth.getName();
// String role = auth.getAuthorities().toString();

// return "Welcome " + email + "! Your role is: " + role;
// }
// @GetMapping
// public String getDashboard() {
// Authentication auth = SecurityContextHolder.getContext().getAuthentication();
// String email = auth.getName();
// String role = auth.getAuthorities().stream()
// .map(Object::toString)
// .findFirst().orElse("UNKNOWN");

// return "Welcome " + email + "! Your role is: " + role;
// }
