package com.romsproject.roms.repository;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.romsproject.roms.entity.User;

public interface UserRepository extends JpaRepository<User, Integer>{
    Optional<User> findByEmail(String email);
}
