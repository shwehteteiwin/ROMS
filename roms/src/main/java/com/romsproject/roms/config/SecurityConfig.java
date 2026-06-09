
package com.romsproject.roms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.romsproject.roms.service.CustomerDetailsService;

@Configuration
public class SecurityConfig {

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                // 1️⃣ Disable CSRF for your REST endpoints
                                .csrf(csrf -> csrf
                                                .ignoringRequestMatchers("/api/auth/**", "/reservations/book-now",
                                                                "/api/orders/**", "/api/menu-categories/**",
                                                                "/api/inventory/**",
                                                                "/api/orders/**", // myint mo
                                                                "/api/inventories/**", "/api/inventories/lowstock",
                                                                "/saleRecord", "/lowStock",
                                                                "/api/inventories", "/api/tables/**", "/manageCategory",
                                                                "/manageInventory", "/addCategory",
                                                                "/editCategory", "/addInventory", "/editInventory",
                                                                "/manageTable", "/addTable", "/editTable",
                                                                "/manage_menus", "/api/menu/**", "/add-menu","/role_popup1_1"))

                                // 2️⃣ Authorize requests
                                .authorizeHttpRequests(auth -> auth
                                                // Public endpoints
                                                .requestMatchers(
                                                                "/login", "/SaleRecord", "/getOtp", "/forget_ps",
                                                                "/reset_ps",
                                                                "/set_ps", "/api/**", "/menu-categories/**",
                                                                "/inventories/**",
                                                                "/api/dashboard/**", "/staff_login", "/guest_dashboard",
                                                                "/api/auth/**", "/uploads/**", "/css/**", "/menu",
                                                                "/images/**", "/js/**", "/currentRS", "/api/orders/**",
                                                                "/reservations/book-now", "/api/menu-categories/**",
                                                                "/api/inventory/**",
                                                                "/api/inventories/**", "/api/inventories/lowstock",
                                                                "/api/inventories", "/api/tables/**", "/manage_menus",
                                                                "/add_menu","/api/menu/**","/role_popup1_1")
                                                .permitAll()

                                                // Authenticated endpoints
                                                // .requestMatchers("/reservations/**", "/dashboard", "/profile",
                                                // "/api/profile",
                                                // // myint mo
                                                // "/kitchen_order_status", "/cus_order_status_bills",
                                                // "/sale_record", "/lowStock",
                                                // "/manageCategory", "/manageInventory", "/addCategory",
                                                // "/editCategory", "/addInventory",
                                                // "/editInventory", "/manageTable", "/addTable",
                                                // "/editTable", "/add-menu", "/edit-menu",
                                                // "/manage_menus")
                                                // .authenticated()

                                                .requestMatchers("/reservations/**", "/dashboard", "/profile",
                                                                "/api/profile",
                                                                // myint mo
                                                                "/kitchen_order_status", "/cus_order_status_bills",
                                                                "/sale_record", "/lowStock",
                                                                "/manageCategory", "/manageInventory", "/addCategory",
                                                                "/editCategory", "/addInventory",
                                                                "/editInventory")
                                                .authenticated()

                                                // Any other request must be authenticated
                                                .anyRequest().authenticated())

                                // 3️⃣ Disable default form login (you handle login via REST)
                                .formLogin(form -> form.disable()) // myint mo
                                .httpBasic(basic -> basic.disable()); // myint mo

                return http.build();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public AuthenticationManager authenticationManager(HttpSecurity http,
                        PasswordEncoder passwordEncoder,
                        CustomerDetailsService userDetailsService) throws Exception {

                AuthenticationManagerBuilder authBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);

                authBuilder.userDetailsService(userDetailsService)
                                .passwordEncoder(passwordEncoder);

                return authBuilder.build();
        }
}