package com.romsproject.roms.controller;

import com.romsproject.roms.entity.MenuCategory;
import com.romsproject.roms.service.MenuCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu-categories")
@CrossOrigin(origins = "*")
public class MenuCategoryController {

    @Autowired
    private MenuCategoryService service;

    //  Add Category
    @PostMapping
    public MenuCategory addCategory(@RequestBody MenuCategory category) {
        return service.addCategory(category);
    }

    //  Get All Categories
    @GetMapping
    public List<MenuCategory> getAllCategories() {
        return service.getAllCategories();
    }

    //  Update Category
   @PutMapping("/{id}")
public MenuCategory updateCategory(@PathVariable Integer id,
                                   @RequestBody MenuCategory category) {
        return service.updateCategory(id, category);
    }

    //  Delete Category
    @DeleteMapping("/{id}")
    public String deleteCategory(@PathVariable Integer id) {
        service.deleteCategory(id);
        return "Category deleted successfully";
    }
    @GetMapping("/{id}")
public MenuCategory getCategoryById(@PathVariable Integer id) {
    return service.getCategoryById(id);
}
}