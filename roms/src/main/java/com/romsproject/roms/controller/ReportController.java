package com.romsproject.roms.controller;

import com.romsproject.roms.repository.OrderRepository;
import com.romsproject.roms.entity.Order;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:8080", allowCredentials = "true")
public class ReportController {

    private final OrderRepository orderRepository;

    public ReportController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping("/sales")
    public List<Map<String,Object>> getSalesReport(){

        List<Order> orders = orderRepository.findAll();

        List<Map<String,Object>> result = new ArrayList<>();

        for(Order order : orders){

            Map<String,Object> map = new HashMap<>();

            map.put("date", order.getOrderTime().toLocalDate().toString());
            map.put("total", order.getTotalAmount());

            result.add(map);
        }

        return result;
    }
}