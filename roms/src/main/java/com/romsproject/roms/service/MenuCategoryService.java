package com.romsproject.roms.service;

import com.romsproject.roms.entity.MenuCategory;
import com.romsproject.roms.repository.MenuCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuCategoryService {

    @Autowired
    private MenuCategoryRepository repository;

    public MenuCategory addCategory(MenuCategory category) {
        return repository.save(category);
    }

    public List<MenuCategory> getAllCategories() {
        return repository.findAll();
    }

    public MenuCategory updateCategory(Integer id, MenuCategory category) {
        MenuCategory existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        existing.setCategoryName(category.getCategoryName());
        return repository.save(existing);
    }

    public void deleteCategory(Integer id) {
        repository.deleteById(id);
    }

    public MenuCategory getCategoryById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }
}