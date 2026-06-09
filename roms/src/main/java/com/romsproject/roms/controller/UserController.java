package com.romsproject.roms.controller;

import com.romsproject.roms.entity.Statuses.OtpPurpose;
import com.romsproject.roms.entity.User;
import com.romsproject.roms.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
// import jakarta.servlet.http.HttpSession;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:8080", allowCredentials = "true")

public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager; // <-- inject here

    public UserController(UserService userService, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
    }

    // login work for all roles
    @PostMapping("/login")
    public Map<String, Object> login(@RequestParam String email,
            @RequestParam String password,
            HttpServletRequest request) {

        Map<String, Object> response = new HashMap<>();

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password));

            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(auth);
            request.getSession(true).setAttribute(
                    HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                    context);

            User user = userService.getUserByEmail(email);
            String role = user.getRole().getRoleName().toUpperCase();

            String redirectUrl;
            switch (role) {
                case "CUSTOMER":
                    redirectUrl = "/dashboard"; // always go to customer dashboard
                    break;
                case "KITCHEN":
                    redirectUrl = "/kitchen_order_status";
                    break;
                case "MANAGER":
                    redirectUrl = "/lowStock";
                    break;
                default:
                    redirectUrl = "/dashboard";
            }

            response.put("status", "success");
            response.put("redirect", redirectUrl);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Invalid email or password");
        }

        return response;
    }
    // @PostMapping("/login")
    // public Map<String, Object> login(@RequestParam String email,
    // @RequestParam String password,
    // HttpServletRequest request) {

    // Map<String, Object> response = new HashMap<>();

    // try {
    // Authentication auth = authenticationManager.authenticate(
    // new UsernamePasswordAuthenticationToken(email, password));

    // // 1️⃣ Create SecurityContext
    // SecurityContext context = SecurityContextHolder.createEmptyContext();
    // context.setAuthentication(auth);
    // // 2️⃣ Save it
    // SecurityContextHolder.setContext(context);
    // // 3️⃣ VERY IMPORTANT: store it in HTTP session
    // request.getSession(true)
    // .setAttribute(
    // HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
    // context);

    // response.put("status", "success");
    // response.put("redirect", "/dashboard");

    // } catch (Exception e) {
    // response.put("status", "error");
    // response.put("message", "Invalid email or password");
    // }

    // return response;
    // }

    @PostMapping("/logout")
    public String logout(HttpServletRequest request, HttpServletResponse response) {
        new org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler()
                .logout(request, response, null);
        return "Logged out successfully";
    }

    @PostMapping("/signup")
    public String signup(@RequestParam String name,
            @RequestParam String email,
            @RequestParam String password) {
        try {
            User user = userService.signup(name, email, password);
            return "User registered with email: " + user.getEmail();
        } catch (Exception e) {
            return e.getMessage();
        }
    }

    @PostMapping("/editProfile")
    public Map<String, Object> editProfile(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam(required = false) MultipartFile image,
            Principal principal) {

        Map<String, Object> response = new HashMap<>();

        try {
            // Get logged-in user by email
            String currentEmail = principal.getName();
            userService.editProfile(currentEmail, name, email, image);

            response.put("status", "success");
            response.put("message", "Profile updated successfully");
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
        }

        return response;
    }

    @PostMapping("/change-password")
    public Map<String, Object> changePassword(
            @RequestParam String currentPassword,
            @RequestParam String newPassword,
            Principal principal) {

        Map<String, Object> response = new HashMap<>();

        // 1️⃣ Check if user is authenticated
        if (principal == null || principal.getName() == null) {
            System.out.println("[ChangePassword] Principal is null or not authenticated");
            response.put("status", "error");
            response.put("message", "Not authenticated");
            return response;
        }

        String email = principal.getName();
        System.out.println("[ChangePassword] Logged-in user email: " + email);

        try {
            // 2️⃣ Fetch user from database
            User user = userService.getUserByEmail(email);
            System.out.println("[ChangePassword] User fetched: " + user);

            // 3️⃣ Check current password
            boolean matches = userService.matchesPassword(currentPassword, user.getPasswordHash());
            System.out.println("[ChangePassword] Current password match? " + matches);

            if (!matches) {
                System.out.println("[ChangePassword] Current password is incorrect");
                response.put("status", "error");
                response.put("message", "Current password is incorrect");
                return response; // ✅ exit early
            }

            // 4️⃣ Update password
            userService.updatePassword(user, newPassword);
            System.out.println("[ChangePassword] Password updated successfully for user: " + email);

            response.put("status", "success");
            response.put("message", "Password changed successfully");

        } catch (Exception e) {
            System.out.println("[ChangePassword] Exception occurred: " + e.getMessage());
            e.printStackTrace();
            response.put("status", "error");
            response.put("message", "Failed to change password: " + e.getMessage());
        }

        return response;
    }

    @PostMapping("/signup-init")
    public Map<String, Object> signupInit(
            @RequestParam String name,
            @RequestParam String email,
            HttpServletRequest request) {

        Map<String, Object> res = new HashMap<>();

        try {
            userService.generateOtp(email, OtpPurpose.SIGNUP);
            // userService.generateSignupOtp(name, email);

            // Store temporary signup data
            request.getSession().setAttribute("TMP_NAME", name);
            request.getSession().setAttribute("TMP_EMAIL", email);

            res.put("status", "success");

        } catch (Exception e) {
            res.put("status", "error");
            res.put("message", e.getMessage());
        }

        return res;
    }

    @PostMapping("/verify-otp")
    public Map<String, Object> verifyOtp(
            @RequestParam String otp,
            HttpServletRequest request) {

        Map<String, Object> res = new HashMap<>();

        try {
            String email = (String) request.getSession().getAttribute("TMP_EMAIL");
            // userService.verifySignupOtp(otp);
            userService.verifyOtp(email, otp, OtpPurpose.SIGNUP);
            request.getSession().setAttribute("OTP_VERIFIED", true);
            res.put("status", "success");

        } catch (Exception e) {
            res.put("status", "error");
            res.put("message", e.getMessage());
        }

        return res;
    }

    @PostMapping("/signup-complete")
    public Map<String, Object> signupComplete(@RequestParam String password,
            HttpServletRequest request) {
        Map<String, Object> res = new HashMap<>();
        Boolean verified = (Boolean) request.getSession().getAttribute("OTP_VERIFIED");
        if (verified == null || !verified) {
            res.put("status", "error");
            res.put("message", "OTP not verified");
            return res;
        }

        String name = (String) request.getSession().getAttribute("TMP_NAME");
        String email = (String) request.getSession().getAttribute("TMP_EMAIL");

        try {
            userService.completeSignup(name, email, password);
            request.getSession().invalidate();
            res.put("status", "success");
            res.put("redirect", "/login");
        } catch (Exception e) {
            res.put("status", "error");
            res.put("message", e.getMessage());
        }

        return res;
    }

    @PostMapping("/set-password")
    public Map<String, Object> setPassword(@RequestParam String password, HttpServletRequest request) {
        Map<String, Object> res = new HashMap<>();

        Boolean verified = (Boolean) request.getSession().getAttribute("OTP_VERIFIED");
        String email = (String) request.getSession().getAttribute("TMP_EMAIL");

        if (verified == null || !verified) {
            res.put("status", "error");
            res.put("message", "OTP not verified");
            return res;
        }

        try {
            // Fetch the existing user
            User user = userService.getUserByEmail(email);

            // Update the password
            userService.updatePassword(user, password);

            // Clear session after success
            request.getSession().invalidate();

            res.put("status", "success");
            res.put("redirect", "/login");

        } catch (Exception e) {
            res.put("status", "error");
            res.put("message", e.getMessage());
        }

        return res;
    }

    // 1. Send OTP for forgot password
    @PostMapping("/forgot-password-init")
    public Map<String, Object> forgotPasswordInit(@RequestParam String email, HttpServletRequest request) {
        Map<String, Object> res = new HashMap<>();
        try {
            // ✅ Check if email exists
            if (!userService.userExists(email)) {
                res.put("status", "error");
                res.put("message", "Email not registered");
                return res;
            }

            // Generate OTP for RESET_PASSWORD
            userService.generateOtp(email, OtpPurpose.RESET_PASSWORD);

            // Store email in session for verification
            request.getSession().setAttribute("TMP_EMAIL", email);

            res.put("status", "success");
            res.put("message", "OTP sent to your email");
        } catch (Exception e) {
            res.put("status", "error");
            res.put("message", e.getMessage());
        }
        return res;
    }

    // 2. Verify the OTP
    @PostMapping("/verify-reset-otp")
    public Map<String, Object> verifyResetOtp(@RequestParam String otp, HttpServletRequest request) {
        Map<String, Object> res = new HashMap<>();
        try {
            String email = (String) request.getSession().getAttribute("TMP_EMAIL");
            if (email == null) {
                res.put("status", "error");
                res.put("message", "Email not found in session");
                return res;
            }

            // Verify OTP
            userService.verifyOtp(email, otp, OtpPurpose.RESET_PASSWORD);

            // Mark OTP verified in session
            request.getSession().setAttribute("OTP_VERIFIED", true);

            res.put("status", "success");
            res.put("redirect", "/reset_ps.html"); // frontend page to set new password
        } catch (Exception e) {
            res.put("status", "error");
            res.put("message", e.getMessage());
        }
        return res;
    }

    // 3. Set new password after OTP verified
    @PostMapping("/forgot-password-set")
    public Map<String, Object> setForgotPassword(@RequestParam String password, HttpServletRequest request) {
        Map<String, Object> res = new HashMap<>();

        Boolean verified = (Boolean) request.getSession().getAttribute("OTP_VERIFIED");
        String email = (String) request.getSession().getAttribute("TMP_EMAIL");

        if (verified == null || !verified) {
            res.put("status", "error");
            res.put("message", "OTP not verified");
            return res;
        }

        try {
            // Fetch existing user
            User user = userService.getUserByEmail(email);

            // Update password
            userService.updatePassword(user, password);

            // Clear session
            request.getSession().invalidate();

            res.put("status", "success");
            res.put("redirect", "/login");
        } catch (Exception e) {
            res.put("status", "error");
            res.put("message", e.getMessage());
        }

        return res;
    }

    // staff_login
    @PostMapping("/staff-login")
    public Map<String, Object> staffLogin(@RequestParam String email,
            @RequestParam String password,
            @RequestParam String role,
            HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password));

            // Check role
            User user = userService.getUserByEmail(email);
            if (!user.getRole().getRoleName().equalsIgnoreCase(role)) {
                response.put("status", "error");
                response.put("message", "Unauthorized role");
                return response;
            }

            // Create and store SecurityContext
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(auth);
            SecurityContextHolder.setContext(context);
            request.getSession(true).setAttribute(
                    HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);

            response.put("status", "success");
            response.put("redirect", "/staff-dashboard");
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Invalid credentials");
        }
        return response;
    }
}