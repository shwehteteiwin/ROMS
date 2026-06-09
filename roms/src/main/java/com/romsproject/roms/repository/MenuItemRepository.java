package com.romsproject.roms.repository;

import com.romsproject.roms.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Integer> {

    // Find menu items by category ID
    List<MenuItem> findByCategory_CategoryId(Integer categoryId);
}