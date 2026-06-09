package com.romsproject.roms.repository;

import com.romsproject.roms.entity.RestaurantTable;
import com.romsproject.roms.entity.Statuses;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TableRepository extends JpaRepository<RestaurantTable, Integer> {

    // Find by table number (since it is unique)
    Optional<RestaurantTable> findByTableNumber(Integer tableNumber);

    // Find tables by status (AVAILABLE, OCCUPIED, RESERVED)
    List<RestaurantTable> findByStatus(Statuses.TableStatus status);
    
    // Get tables by capacity (exact match)
    List<RestaurantTable> findByCapacity(Integer capacity);

    // Find tables by capacity>=requested seat
    List<RestaurantTable> findByCapacityGreaterThanEqual(Integer capacity);

    // Find tables by status and capacity
    List<RestaurantTable> findByStatusAndCapacityGreaterThanEqual(
            Statuses.TableStatus status, Integer capacity);
            
    // Check if table number already exists
    boolean existsByTableNumber(Integer tableNumber);


}