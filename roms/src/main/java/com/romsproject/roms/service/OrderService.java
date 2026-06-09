
package com.romsproject.roms.service;

import com.romsproject.roms.entity.Order;
import com.romsproject.roms.entity.RestaurantTable;
import com.romsproject.roms.entity.User;
import com.romsproject.roms.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // Save or update an order
    public Order save(Order order) {
        return orderRepository.save(order);
    }

    // Find order by ID
    public Optional<Order> findById(Integer orderId) {
        return orderRepository.findById(orderId);
    }

    // Get all orders
    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    // Delete an order
    public void delete(Order order) {
        orderRepository.delete(order);
    }

    public List<Order> findByUserId(Integer userId) {
        User user = new User();
        user.setUserId(userId);
        return orderRepository.findByUser(user);
    }

    public List<Order> findByTableId(Integer tableId) {
        RestaurantTable table = new RestaurantTable();
        table.setTableId(tableId);
        return orderRepository.findByTable(table);
    }
    // // Additional: Find all orders by user ID
    // public List<Order> findByUserId(Integer userId) {
    // return orderRepository.findByUser_UserId(userId);
    // }

    // // Additional: Find all orders by table ID
    // public List<Order> findByTableId(Integer tableId) {
    // return orderRepository.findByTable_TableId(tableId);
    // }
    //zue
    public List<Object[]> getDailySales() {
    return orderRepository.getDailySales();
    }

    public List<Object[]> getMonthlySales() {
        return orderRepository.getMonthlySales();
    }
    //zue
}
