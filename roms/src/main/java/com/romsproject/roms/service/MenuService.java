package com.romsproject.roms.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.romsproject.roms.controller.MenuController;
import com.romsproject.roms.controller.MenuController.MenuCreateRequest;
import com.romsproject.roms.entity.Inventory;
import com.romsproject.roms.entity.MenuInventory;
import com.romsproject.roms.entity.MenuInventoryId;
import com.romsproject.roms.entity.MenuItem;
import com.romsproject.roms.repository.MenuItemRepository;
import com.romsproject.roms.repository.InventoryRepository;
import com.romsproject.roms.repository.MenuCategoryRepository;
import com.romsproject.roms.repository.MenuInventoryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MenuService {

    private final MenuItemRepository menuItemRepository;

    @Autowired // myint mo
    private InventoryRepository inventoryRepository;

    @Autowired // myint mo
    private MenuInventoryRepository menuInventoryRepository;

    @Autowired // myint mo
    private MenuCategoryRepository menuCategoryRepository;

    public MenuService(MenuItemRepository menuItemRepository,
            MenuInventoryRepository menuInventoryRepository) {

        this.menuItemRepository = menuItemRepository;
        this.menuInventoryRepository = menuInventoryRepository;
    }

    // Fetch all menu items
    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    // Fetch by category id
    public List<MenuItem> getMenuItemsByCategory(Integer categoryId) {
        if (categoryId == null)
            return menuItemRepository.findAll();
        return menuItemRepository.findByCategory_CategoryId(categoryId);
    }

    // Fetch single item by ID
    public MenuItem getMenuItemById(Integer id) {
    return menuItemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Menu item not found"));
    }
    //additional
    public void deleteMenuItem(Integer id) {
        menuItemRepository.deleteById(id);
    }

    public MenuItem saveMenuItem(MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }

    // ✅ Calculate available stock
    public int calculateAvailableStock(MenuItem menuItem) {

    List<MenuInventory> ingredients =
            menuInventoryRepository.findByMenuItem(menuItem);

    if (ingredients.isEmpty()) {
        return 0;
    }

    int maxStock = Integer.MAX_VALUE;
    boolean hasValidIngredient = false;   // ✅ ADD THIS

    for (MenuInventory mi : ingredients) {

        BigDecimal inventoryQty =
                mi.getInventory() != null ?
                mi.getInventory().getQuantity() : null;

        BigDecimal usedPerItem = mi.getQuantityUsed();

        if (inventoryQty == null ||
            usedPerItem == null ||
            usedPerItem.compareTo(BigDecimal.ZERO) <= 0) {
            continue;
        }

        hasValidIngredient = true;   // ✅ Now this works

        int possible = inventoryQty
                .divide(usedPerItem, 0, RoundingMode.DOWN)
                .intValue();

        maxStock = Math.min(maxStock, possible);
    }

    // If no valid ingredients were processed
    if (!hasValidIngredient) {
        return 0;
    }

    return maxStock;
}
    // myint mo
    // ===============================
    // CREATE MENU WITH INVENTORY
    // ===============================
    public MenuItem createMenuWithInventory(MenuCreateRequest request) {

        MenuItem menuItem = new MenuItem();

        menuItem.setName(request.name);
        menuItem.setDescription(request.description);
        menuItem.setPrice(request.price);
        menuItem.setPhotoUrl(request.photoUrl);
        menuItem.setAvailability(true);

        menuItem.setCategory(
                menuCategoryRepository.findById(request.categoryId).orElse(null));

        // Save menu item first
        MenuItem savedMenu = menuItemRepository.save(menuItem);

        // Save menu_inventory items
        if (request.inventories != null) { 

            for (MenuController.InventoryRequest inv : request.inventories) {

                Inventory inventory = inventoryRepository
                        .findByItemName(inv.name)
                        // .findById(inv.id)
                        .orElseThrow(() -> new RuntimeException("Inventory not found"));

                MenuInventory mi = new MenuInventory();
                mi.setMenuItem(savedMenu);
                mi.setInventory(inventory);
                mi.setQuantityUsed(inv.quantity);

                menuInventoryRepository.save(mi);
            }
        }

        return savedMenu;
    }

    public MenuItem updateMenu(
            Integer id,
            String name,
            String description,
            BigDecimal price,
            Integer categoryId,
            MultipartFile photo,
            String inventoriesJson) throws Exception {

        // 1️⃣ Fetch existing menu item
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        // 2️⃣ Update basic fields
        menuItem.setName(name);
        menuItem.setDescription(description);
        menuItem.setPrice(price);

        // 3️⃣ Update category
        menuItem.setCategory(menuCategoryRepository.findById(categoryId).orElse(null));

        // 4️⃣ Update photo if provided
        if (photo != null && !photo.isEmpty()) {
            String fileName = photo.getOriginalFilename();
            Path uploadPath = Paths.get("uploads");
            if (!Files.exists(uploadPath))
                Files.createDirectories(uploadPath);
            Path path = uploadPath.resolve(fileName);
            Files.write(path, photo.getBytes());
            menuItem.setPhotoUrl("/uploads/" + fileName);
        }

        // 5️⃣ Save updated menu item first
        menuItemRepository.save(menuItem);

        // 6️⃣ Fetch existing inventories
        List<MenuInventory> existingInventories = menuInventoryRepository.findByMenuItem(menuItem);
        Map<Integer, MenuInventory> existingMap = existingInventories.stream()
                .collect(Collectors.toMap(mi -> mi.getInventory().getInventoryId(), mi -> mi));

        // 7️⃣ Parse new inventories from frontend JSON
        ObjectMapper mapper = new ObjectMapper();
        List<MenuController.InventoryRequest> inventoryList = mapper.readValue(
                inventoriesJson,
                new com.fasterxml.jackson.core.type.TypeReference<List<MenuController.InventoryRequest>>() {
                });

        // 8️⃣ Process each inventory from frontend
        for (MenuController.InventoryRequest invReq : inventoryList) {
            Inventory inventory = inventoryRepository.findById(invReq.id)
                    .orElseThrow(() -> new RuntimeException("Inventory not found: " + invReq.id));

            // Parse quantity safely
            BigDecimal quantity = invReq.quantity;

            if (existingMap.containsKey(invReq.id)) {
                // Update existing inventory
                MenuInventory mi = existingMap.get(invReq.id);
                mi.setQuantityUsed(quantity);
                menuInventoryRepository.save(mi);
                existingMap.remove(invReq.id);
            } else {
                // Add new inventory
                MenuInventory mi = new MenuInventory();
                MenuInventoryId miId = new MenuInventoryId(menuItem.getMenuItemId(), inventory.getInventoryId());
                mi.setId(miId); // ✅ set composite key
                mi.setMenuItem(menuItem);
                mi.setInventory(inventory);
                mi.setQuantityUsed(quantity);
                menuInventoryRepository.save(mi);
            }
        }

        // 9️⃣ Delete inventories removed in frontend
        for (MenuInventory leftover : existingMap.values()) {
            menuInventoryRepository.delete(leftover);
        }

        return menuItem;
    }

    // deletemenu
    // Delete menu item along with related MenuInventory entries
    // public void deleteMenu(Integer menuId) {
    // // 1️⃣ Fetch the menu item
    // MenuItem menuItem = menuItemRepository.findById(menuId)
    // .orElseThrow(() -> new RuntimeException("Menu item not found"));

    // // 2️⃣ Delete related MenuInventory entries first
    // List<MenuInventory> menuInventories =
    // menuInventoryRepository.findByMenuItem(menuItem);
    // menuInventoryRepository.deleteAll(menuInventories);

    // // 3️⃣ Delete the menu item itself
    // menuItemRepository.delete(menuItem);
    // }
    public void deleteMenu(Integer menuId) {
        MenuItem menuItem = menuItemRepository.findById(menuId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        List<MenuInventory> menuInventories = menuInventoryRepository.findByMenuItem(menuItem);

        // Break the relationship first
        for (MenuInventory mi : menuInventories) {
            mi.setMenuItem(null); // detach
        }
        menuInventoryRepository.deleteAll(menuInventories);

        // Now delete menu
        menuItemRepository.delete(menuItem);
    }

}