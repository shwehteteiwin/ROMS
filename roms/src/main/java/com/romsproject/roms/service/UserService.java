package com.romsproject.roms.service;

import com.romsproject.roms.entity.Otp;
import com.romsproject.roms.entity.Role;
import com.romsproject.roms.entity.Statuses.OtpPurpose;
import com.romsproject.roms.entity.User;
import com.romsproject.roms.repository.OtpRepository;
import com.romsproject.roms.repository.RoleRepository;
import com.romsproject.roms.repository.UserRepository;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

// import io.jsonwebtoken.io.IOException;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;

// import java.util.Optional;
import java.util.Random;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final OtpRepository otpRepository;
    private final JavaMailSender mailSender;

    // public UserService(UserRepository userRepository,
    // RoleRepository roleRepository,
    // OtpRepository otpRepository) { // inject here
    // this.userRepository = userRepository;
    // this.roleRepository = roleRepository;
    // this.otpRepository = otpRepository; // assign
    // this.passwordEncoder = new BCryptPasswordEncoder();
    // }
    public UserService(UserRepository userRepository,
            RoleRepository roleRepository,
            OtpRepository otpRepository,
            JavaMailSender mailSender) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.otpRepository = otpRepository;
        this.mailSender = mailSender;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    // Signup
    public User signup(String name, String email, String password) throws Exception {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new Exception("Email already registered");
        }

        Role customerRole = roleRepository.findByRoleName("CUSTOMER")
                .orElseThrow(() -> new Exception("Role CUSTOMER not found"));

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole(customerRole);

        return userRepository.save(user);
    }

    // Update Profile
    public void editProfile(String currentEmail, String name, String email, MultipartFile image) throws IOException {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(name);
        user.setEmail(email);

        if (image != null && !image.isEmpty()) {
            String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            Path uploadPath = Paths.get("uploads/profile-images");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(filename);
            Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            user.setPhotoUrl("/uploads/profile-images/" + filename);
        }

        userRepository.save(user);
    }

    // Fetch user by email (needed for profile page)
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // change password match or not
    public boolean matchesPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public void updatePassword(User user, String newPassword) {
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // public void generateOtp(String email, OtpPurpose purpose) throws Exception {

    // // If purpose is SIGNUP, user may not exist yet
    // User user = null;
    // if (purpose != OtpPurpose.SIGNUP) {
    // user = userRepository.findByEmail(email)
    // .orElseThrow(() -> new Exception("Email not registered"));
    // }
    public void generateOtp(String email, OtpPurpose purpose) throws Exception {

        User user = null;

        if (purpose == OtpPurpose.SIGNUP) {
            // prevent existing email
            if (userRepository.findByEmail(email).isPresent()) {
                throw new Exception("Email already registered");
            }
        } else {
            // for other OTP purposes (reset password etc)
            user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new Exception("Email not registered"));
        }

        // Generate 6-digit OTP
        String otpCode = String.format("%06d", new Random().nextInt(900000) + 100000);

        Otp otp = new Otp();
        otp.setCode(otpCode);
        otp.setPurpose(purpose.name()); // store enum name as string
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        otp.setIsUsed(false);
        otp.setUser(user); // null if signup
        otpRepository.save(otp);

        // Send email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("no-reply@romsproject.test");
        message.setTo(email);
        message.setSubject("Your OTP Code");
        message.setText("Your OTP for " + purpose.name() + " is: " + otpCode +
                "\nIt expires in 5 minutes.");

        mailSender.send(message);

        System.out.println("OTP sent to " + email + ": " + otpCode);
    }

    public void verifyOtp(String email, String otpCode, OtpPurpose purpose) throws Exception {

        User user = null;
        if (purpose != OtpPurpose.SIGNUP) {
            user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new Exception("Email not registered"));
        }

        Otp otp = otpRepository
                .findTopByCodeAndPurposeAndUserAndIsUsedFalseOrderByCreatedAtDesc(
                        otpCode, purpose.name(), user)
                .orElseThrow(() -> new Exception("Invalid OTP"));

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new Exception("OTP expired");
        }

        otp.setIsUsed(true);
        otpRepository.save(otp);
    }

    public User completeSignup(String name, String email, String password) throws Exception {

        if (userRepository.findByEmail(email).isPresent()) {
            throw new Exception("Email already registered");
        }

        Role role = roleRepository.findByRoleName("CUSTOMER")
                .orElseThrow(() -> new Exception("Role not found"));

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole(role);

        return userRepository.save(user);
    }

    // Fetch role by name
    public Role getRoleByName(String roleName) throws Exception {
        return roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new Exception("Role not found: " + roleName));
    }

    // Save user after setting role
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public boolean userExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public User createManager(String name, String email, String password) throws Exception {

        if (userRepository.findByEmail(email).isPresent()) {
            throw new Exception("Email already registered");
        }

        Role managerRole = roleRepository.findByRoleName("MANAGER")
                .orElseThrow(() -> new Exception("Role MANAGER not found"));

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole(managerRole);

        return userRepository.save(user);
    }

    // create kitchen role
    public User createKitchen(String name, String email, String password) throws Exception {

        if (userRepository.findByEmail(email).isPresent()) {
            throw new Exception("Email already registered");
        }

        Role kitchenRole = roleRepository.findByRoleName("KITCHEN")
                .orElseThrow(() -> new Exception("Role KITCHEN not found"));

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole(kitchenRole);

        return userRepository.save(user);
    }
}
