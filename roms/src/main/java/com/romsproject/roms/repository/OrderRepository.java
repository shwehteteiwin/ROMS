package com.romsproject.roms.repository;

import com.romsproject.roms.entity.Order;
import com.romsproject.roms.entity.RestaurantTable;
import com.romsproject.roms.entity.User;
import com.romsproject.roms.entity.Statuses;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    // Get all orders by user
    List<Order> findByUser(User user);

    // Get all orders by table
    List<Order> findByTable(RestaurantTable table);

    // Get all orders by status
    List<Order> findByStatus(Statuses.OrderStatus status);

    // Get orders by user and status
    List<Order> findByUserAndStatus(User user, Statuses.OrderStatus status);

    // Get active orders for a table (example: not completed)
    List<Order> findByTableAndStatusNot(RestaurantTable table, Statuses.OrderStatus status);

    // DAILY SALES//zue
    @Query("""
                SELECT DATE(o.orderTime), SUM(o.totalAmount)
                FROM Order o
                where o.status = com.romsproject.roms.entity.Statuses.OrderStatus.COMPLETED
                GROUP BY DATE(o.orderTime)
                ORDER BY DATE(o.orderTime) DESC
            """)
    List<Object[]> getDailySales();

    // MONTHLY SALES
    @Query("""
                SELECT FUNCTION('DATE_FORMAT', o.orderTime, '%Y-%m'), SUM(o.totalAmount)
                FROM Order o
                where o.status = com.romsproject.roms.entity.Statuses.OrderStatus.COMPLETED
                GROUP BY FUNCTION('DATE_FORMAT', o.orderTime, '%Y-%m')
                ORDER BY FUNCTION('DATE_FORMAT', o.orderTime, '%Y-%m') DESC
            """)
    List<Object[]> getMonthlySales();
    // zue
}