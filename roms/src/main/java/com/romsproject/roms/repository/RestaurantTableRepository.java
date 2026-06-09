package com.romsproject.roms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.romsproject.roms.entity.RestaurantTable;

@Repository
public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Integer> {
boolean existsByTableNumber(Integer tableNumber);

}