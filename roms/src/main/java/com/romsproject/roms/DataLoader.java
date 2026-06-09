package com.romsproject.roms;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.romsproject.roms.entity.Role;
import com.romsproject.roms.repository.RoleRepository;
import com.romsproject.roms.service.UserService;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserService userService;
    private final RoleRepository roleRepository;
    private final Environment env;

    public DataLoader(UserService userService, RoleRepository roleRepository, Environment env) {
        this.userService = userService;
        this.roleRepository = roleRepository;
        this.env = env;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1️⃣ Ensure roles exist
        createRoleIfNotExists("CUSTOMER");
        createRoleIfNotExists("MANAGER");
        createRoleIfNotExists("KITCHEN");

        // 2️⃣ Ensure manager account exists
        String managerEmail = "manager@example.com";

        // Check if manager exists safely
        if (!userService.userExists(managerEmail)) {
            String managerPassword = env.getProperty("manager.password", "manager123");
            userService.createManager("Alice Manager", managerEmail, managerPassword);
            System.out.println("Manager account created: " + managerEmail + " / " + managerPassword);
        } else {
            System.out.println("Manager account already exists: " + managerEmail);
        }
        // 3️⃣ Ensure kitchen account exists
        String kitchenEmail = "kitchen@example.com";
        if (!userService.userExists(kitchenEmail))

        {
            String kitchenPassword = env.getProperty("kitchen.password", "kitchen123");
            userService.createKitchen("Kitchen Staff", kitchenEmail, kitchenPassword);
            System.out.println("Kitchen account created: " + kitchenEmail + " / " + kitchenPassword);
        } else {
            System.out.println("Kitchen account already exists: " + kitchenEmail);
        }

    }

    private void createRoleIfNotExists(String roleName) {
        roleRepository.findByRoleName(roleName).ifPresentOrElse(
                role -> System.out.println("Role already exists: " + roleName),
                () -> {
                    Role role = new Role();
                    role.setRoleName(roleName);
                    roleRepository.save(role);
                    System.out.println("Role created: " + roleName);
                });
    }

}