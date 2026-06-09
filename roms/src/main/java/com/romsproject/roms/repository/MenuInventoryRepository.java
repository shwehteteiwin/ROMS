package com.romsproject.roms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.romsproject.roms.entity.MenuInventory;
import com.romsproject.roms.entity.MenuInventoryId;
import com.romsproject.roms.entity.MenuItem;
import org.springframework.transaction.annotation.Transactional;

public interface MenuInventoryRepository extends JpaRepository<MenuInventory, MenuInventoryId> {

    List<MenuInventory> findByMenuItem(MenuItem menuItem);
    
    @Transactional
    void deleteByMenuItem(MenuItem menuItem);
}