package com.romsproject.roms.repository;


import com.romsproject.roms.entity.MenuCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MenuCategoryRepository extends JpaRepository<MenuCategory, Integer> {

    Optional<MenuCategory> findByCategoryName(String categoryName);
    
}
