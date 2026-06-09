package com.romsproject.roms.repository;

import com.romsproject.roms.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Integer> {
      @Query("SELECT i FROM Inventory i WHERE i.quantity <= i.lowStockThreshold")
List<Inventory> findLowStock();

    // myint mo : find by item name
    Optional<Inventory> findByItemName(String itemName);

}