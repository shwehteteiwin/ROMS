package com.romsproject.roms.controller;

import com.romsproject.roms.entity.Inventory;
import com.romsproject.roms.entity.MenuInventory;
import com.romsproject.roms.entity.MenuInventoryId;
import com.romsproject.roms.entity.MenuItem;
import com.romsproject.roms.repository.InventoryRepository;
import com.romsproject.roms.repository.MenuCategoryRepository;
import com.romsproject.roms.repository.MenuInventoryRepository;
import com.romsproject.roms.service.MenuService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
// import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.Path;
import java.util.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/menu")
// @CrossOrigin(origins = "*")
@CrossOrigin(origins = "http://localhost:8080", allowCredentials = "true")
public class MenuController {

    private final MenuService menuService;
    private final InventoryRepository inventoryRepository; // myint mo
    private final MenuInventoryRepository menuInventoryRepository; // myint mo
    private final MenuCategoryRepository menuCategoryRepository; // myint mo

    public MenuController(MenuService menuService,
            InventoryRepository inventoryRepository, // myint mo
            MenuInventoryRepository menuInventoryRepository, // myint mo
            MenuCategoryRepository menuCategoryRepository) { // myint mo

        this.menuService = menuService;
        this.inventoryRepository = inventoryRepository; // myint mo
        this.menuInventoryRepository = menuInventoryRepository; // myint mo
        this.menuCategoryRepository = menuCategoryRepository; // myint mo
    }

    // GET all menu items
    @GetMapping
    public List<Map<String, Object>> getAllMenuItems() {
        List<MenuItem> items = menuService.getAllMenuItems();
        return items.stream().map(item -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", item.getMenuItemId());
            map.put("name", item.getName());
            map.put("description", item.getDescription());
            map.put("price", item.getPrice());
            map.put("availability", item.getAvailability());
            map.put("photoUrl", item.getPhotoUrl());
            map.put("categoryName", item.getCategory() != null ? item.getCategory().getCategoryName() : null);
            return map;
        }).collect(Collectors.toList());
    }

    // GET menu items by category
    @GetMapping("/category/{id}")
    public List<Map<String, Object>> getMenuByCategory(@PathVariable("id") Integer categoryId) {
        List<MenuItem> items = menuService.getMenuItemsByCategory(categoryId);
        return items.stream().map(item -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", item.getMenuItemId());
            map.put("name", item.getName());
            map.put("description", item.getDescription());
            map.put("price", item.getPrice());
            map.put("availability", item.getAvailability());
            map.put("photoUrl", item.getPhotoUrl());
            map.put("categoryName", item.getCategory() != null ? item.getCategory().getCategoryName() : null);
            return map;
        }).collect(Collectors.toList());
    }

    // GET single menu item
    @GetMapping("/{id}")
    public Map<String, Object> getMenuItem(@PathVariable("id") Integer id) throws Exception {
        MenuItem item = menuService.getMenuItemById(id);
        Map<String, Object> map = new HashMap<>();
        map.put("id", item.getMenuItemId());
        map.put("name", item.getName());
        map.put("description", item.getDescription());
        map.put("price", item.getPrice());
        map.put("availability", item.getAvailability());
        map.put("photoUrl", item.getPhotoUrl());
        map.put("categoryName", item.getCategory() != null ? item.getCategory().getCategoryName() : null);
        return map;
    }

    //get by stock
    @GetMapping("/with-stock")
public List<Map<String, Object>> getAllMenuItemsWithStock() {
    List<MenuItem> items = menuService.getAllMenuItems();

    return items.stream().map(item -> {
        Map<String, Object> map = new HashMap<>();
        map.put("id", item.getMenuItemId());
        map.put("name", item.getName());
        map.put("description", item.getDescription());
        map.put("price", item.getPrice());
        map.put("availability", item.getAvailability());
        map.put("photoUrl", item.getPhotoUrl());
        map.put("categoryName",
                item.getCategory() != null ?
                item.getCategory().getCategoryName() : null);

        int stock = menuService.calculateAvailableStock(item);
        map.put("availableStock", stock);

        return map;
    }).collect(Collectors.toList());
}

    // shwehtet
    @PostMapping(consumes = "multipart/form-data")
    public MenuItem createMenu(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam BigDecimal price,
            @RequestParam Integer categoryId,
            @RequestParam("photo") MultipartFile photo,
            @RequestParam String inventories) throws Exception {

        // =====================
        // SAVE PHOTO
        // =====================
        String fileName = photo.getOriginalFilename();
        // String uploadDir = "uploads/";

        // Path path = Paths.get(uploadDir + fileName);
        // Files.write(path, photo.getBytes());
        Path uploadPath = Paths.get("uploads");

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path path = uploadPath.resolve(fileName);
        Files.write(path, photo.getBytes());
        // =====================
        // CREATE MENU ITEM
        // =====================
        MenuItem menuItem = new MenuItem();
        menuItem.setName(name);
        menuItem.setDescription(description);
        menuItem.setPrice(price);
        menuItem.setPhotoUrl("/uploads/" + fileName);
        menuItem.setAvailability(true);

        menuItem.setCategory(
                menuCategoryRepository.findById(categoryId).orElse(null));

        MenuItem savedMenu = menuService.saveMenuItem(menuItem);

        // =====================
        // CONVERT INVENTORY JSON
        // =====================
        ObjectMapper mapper = new ObjectMapper();

        List<InventoryRequest> inventoryList = mapper.readValue(inventories,
                new TypeReference<List<InventoryRequest>>() {
                });

        // =====================
        // SAVE MENU INVENTORY
        // =====================
        for (InventoryRequest inv : inventoryList) {

            Inventory inventory = inventoryRepository
                    .findByItemName(inv.name)
                    .orElseThrow(() -> new RuntimeException("Inventory not found"));

            // Inventory inventory = inventoryRepository
            // .findById(inv.id)
            // .orElseThrow(() -> new RuntimeException("Inventory not found: " + inv.id));

            MenuInventoryId id = new MenuInventoryId(
                    savedMenu.getMenuItemId(),
                    inventory.getInventoryId());

            MenuInventory menuInventory = new MenuInventory();
            menuInventory.setId(id);
            menuInventory.setMenuItem(savedMenu);
            menuInventory.setInventory(inventory);
            menuInventory.setQuantityUsed(inv.quantity);

            menuInventoryRepository.save(menuInventory);
        }

        return savedMenu;
    }

    @GetMapping("/manager/{id}")
    public Map<String, Object> getMenuInventoryItem(@PathVariable Integer id) {

        MenuItem item = menuService.getMenuItemById(id);

        Map<String, Object> map = new HashMap<>();
        map.put("id", item.getMenuItemId());
        map.put("name", item.getName());
        map.put("description", item.getDescription());
        map.put("price", item.getPrice());
        map.put("photoUrl", item.getPhotoUrl());
        map.put("categoryId", item.getCategory().getCategoryId());
        map.put("categoryName", item.getCategory().getCategoryName());

        List<Map<String, Object>> inventories = item.getInventories().stream().map(mi -> {
            Map<String, Object> inv = new HashMap<>();
            inv.put("id", mi.getInventory().getInventoryId());
            inv.put("name", mi.getInventory().getItemName());
            inv.put("quantity", mi.getQuantityUsed());
            inv.put("unit", mi.getInventory().getUnit());
            return inv;
        }).collect(Collectors.toList());

        map.put("inventories", inventories);

        return map;
    }

    // shwehtet
    @PutMapping(value = "/manager/{id}", consumes = "multipart/form-data")
    public MenuItem updateMenu(
            @PathVariable Integer id,
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam BigDecimal price,
            @RequestParam Integer categoryId,
            @RequestParam(required = false) MultipartFile photo,
            @RequestParam String inventories) throws Exception {

        return menuService.updateMenu(id, name, description, price, categoryId, photo, inventories);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMenu(@PathVariable Integer id) {
        try {
            menuService.deleteMenu(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    // ===============================
    // DTO CLASSES (INSIDE CONTROLLER)
    // ===============================

    public static class MenuCreateRequest {

        public String name;
        public String description;
        public BigDecimal price;
        public String photoUrl;
        public Integer categoryId;

        public List<InventoryRequest> inventories;
    }

    public static class InventoryRequest {
        public Integer id;
        public String name;
        public BigDecimal quantity;
    }

}