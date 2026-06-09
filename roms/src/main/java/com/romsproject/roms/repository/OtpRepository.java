package com.romsproject.roms.repository;


import com.romsproject.roms.entity.Otp;
import com.romsproject.roms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Integer> {

    // Find latest unused OTP by code + purpose + user
    Optional<Otp> findTopByCodeAndPurposeAndUserAndIsUsedFalseOrderByCreatedAtDesc(
            String code,
            String purpose,
            User user
    );

    // Find latest unused OTP for a user and purpose
    Optional<Otp> findTopByUserAndPurposeAndIsUsedFalseOrderByCreatedAtDesc(
            User user,
            String purpose
    );

    // Find all expired OTPs (for cleanup job)
    List<Otp> findByExpiresAtBefore(LocalDateTime now);

    // Optional: mark OTP as used
    Optional<Otp> findByOtpIdAndIsUsedFalse(Integer otpId);
    Optional<Otp> findTopByCodeAndPurposeAndIsUsedFalseOrderByCreatedAtDesc(
        String code,
        String purpose
);
}