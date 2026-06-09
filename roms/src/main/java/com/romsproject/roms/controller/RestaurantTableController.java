package com.romsproject.roms.controller;

import com.romsproject.roms.entity.RestaurantTable;
import com.romsproject.roms.service.RestaurantTableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin("*")
public class RestaurantTableController {

    @Autowired
    private RestaurantTableService service;

    @PostMapping
    public RestaurantTable addTable(@RequestBody RestaurantTable table) {

        return service.addTable(table);
    }

    @PutMapping("/{id}")
    public RestaurantTable updateTable(@PathVariable Integer id,
            @RequestBody RestaurantTable table) {
        return service.updateTable(id, table);
    }

    // @DeleteMapping("/{id}")
    // public void deleteTable(@PathVariable Integer id) {
    //     service.removeTable(id);
    // }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTable(@PathVariable Integer id) {

        try {
            service.removeTable(id);
            return ResponseEntity.ok("Table deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/available")
    public RestaurantTable markAvailable(@PathVariable Integer id) {
        return service.markAvailable(id);
    }

    @PutMapping("/{id}/reserved")
    public RestaurantTable markReserved(@PathVariable Integer id) {
        return service.markReserved(id);
    }

    @PutMapping("/{id}/occupied")
    public RestaurantTable markOccupied(@PathVariable Integer id) {
        return service.markOccupied(id);
    }

    @GetMapping
    public List<RestaurantTable> getAll() {
        return service.getAllTables();
    }

    @GetMapping("/{id}")
    public RestaurantTable getById(@PathVariable Integer id) {
        return service.getTableById(id);
    }
}