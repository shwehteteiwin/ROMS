package com.romsproject.roms.service;

import com.romsproject.roms.entity.RestaurantTable;
import com.romsproject.roms.entity.Statuses.TableStatus;
import com.romsproject.roms.repository.RestaurantTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestaurantTableService {

    @Autowired
    private RestaurantTableRepository repository;

    public RestaurantTable addTable(RestaurantTable table) {

        // Check duplicate before saving
        if (repository.existsByTableNumber(table.getTableNumber())) {
            throw new RuntimeException("Table already exists");
        }

        table.setStatus(TableStatus.AVAILABLE);
        return repository.save(table);
    }

    public RestaurantTable updateTable(Integer id, RestaurantTable updatedTable) {

        RestaurantTable existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table not found"));

        existing.setTableNumber(updatedTable.getTableNumber());
        existing.setCapacity(updatedTable.getCapacity());

        return repository.save(existing);
    }

    // public void removeTable(Integer id) {
    //     repository.deleteById(id);
    // }
    public void removeTable(Integer id) {

    RestaurantTable table = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Table not found"));

    // Prevent deleting reserved or occupied tables
    if (table.getStatus() == TableStatus.RESERVED || 
        table.getStatus() == TableStatus.OCCUPIED) {

        throw new RuntimeException("Cannot delete a reserved or occupied table");
    }

    repository.deleteById(id);
}

    public RestaurantTable markAvailable(Integer id) {
        RestaurantTable table = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table not found"));

        table.setStatus(TableStatus.AVAILABLE);
        return repository.save(table);
    }

    public RestaurantTable markReserved(Integer id) {
        RestaurantTable table = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table not found"));

        table.setStatus(TableStatus.RESERVED);
        return repository.save(table);
    }

    public RestaurantTable markOccupied(Integer id) {
        RestaurantTable table = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table not found"));

        table.setStatus(TableStatus.OCCUPIED);
        return repository.save(table);
    }

    public List<RestaurantTable> getAllTables() {
        return repository.findAll();
    }

    public RestaurantTable getTableById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table not found"));
    }
}