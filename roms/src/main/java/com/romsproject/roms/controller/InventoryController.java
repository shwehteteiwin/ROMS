package com.romsproject.roms.controller;

import com.romsproject.roms.entity.Inventory;
import com.romsproject.roms.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventories")   // ← IMPORTANT (plural)
@CrossOrigin("*")
public class InventoryController {

    @Autowired
    private InventoryRepository repository;

    @PostMapping
    public Inventory add(@RequestBody Inventory inventory) {
        return repository.save(inventory);
    }
    @GetMapping("/{id}")
public Inventory getById(@PathVariable Integer id) {
    return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Inventory not found"));
}

    @GetMapping
    public List<Inventory> getAll() {
        return repository.findAll();
    }
//     @DeleteMapping("/{id}")
// public void delete(@PathVariable Integer id) {
//     repository.deleteById(id);
// }
@DeleteMapping("/{id}")
public ResponseEntity<?> delete(@PathVariable Integer id) {

    try {
        repository.deleteById(id);
        return ResponseEntity.ok("Deleted successfully");
    }
    catch (Exception e) {
        return ResponseEntity
                .badRequest()
                .body("Cannot delete. Item is used in menu.");
    }
}

@PutMapping("/{id}")
public Inventory update(@PathVariable Integer id,
                        @RequestBody Inventory updated) {

    Inventory existing = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Inventory not found"));

    existing.setItemName(updated.getItemName());
    existing.setQuantity(updated.getQuantity());
    existing.setUnit(updated.getUnit());
    existing.setLowStockThreshold(updated.getLowStockThreshold());
    existing.setExpiryDate(updated.getExpiryDate());

    return repository.save(existing);
}

 @GetMapping("/lowstock")
    public List<Inventory> getLowStock() {
        return repository.findLowStock();
    }

}