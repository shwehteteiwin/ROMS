package com.romsproject.roms.repository;

import com.romsproject.roms.entity.OrderItem;
import com.romsproject.roms.entity.Order;
import com.romsproject.roms.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    // Get all items by Order
    List<OrderItem> findByOrder(Order order);

    // Get all items by MenuItem
    List<OrderItem> findByMenuItem(MenuItem menuItem);

    // Find specific OrderItem by Order and MenuItem
    Optional<OrderItem> findByOrderAndMenuItem(Order order, MenuItem menuItem);

    // Delete all items of an order
    void deleteByOrder(Order order);
}