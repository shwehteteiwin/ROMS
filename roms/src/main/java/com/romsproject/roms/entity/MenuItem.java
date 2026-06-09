package com.romsproject.roms.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "menu_items")
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "menu_item_id")
    private Integer menuItemId;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "availability", nullable = false)
    private Boolean availability;

    @Column(name = "photo_url", length = 255)
    private String photoUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "category_id",
        foreignKey = @ForeignKey(name = "fk_menu_category")
    )
    private MenuCategory category;

    // ===== Bidirectional relationship with MenuInventory =====
    @OneToMany(mappedBy = "menuItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<MenuInventory> inventories = new HashSet<>();

    // Default constructor
    public MenuItem() {}

    public MenuItem(String name, BigDecimal price, Boolean availability) {
        this.name = name;
        this.price = price;
        this.availability = availability;
    }

    // PrePersist to ensure default availability = true
    @PrePersist
    private void applyDefaultAvailability() {
        if (availability == null) {
            availability = true;
        }
    }

    // ===== Helper methods =====
    public void addInventory(MenuInventory menuInventory) {
        inventories.add(menuInventory);
        menuInventory.setMenuItem(this);
    }

    public void removeInventory(MenuInventory menuInventory) {
        inventories.remove(menuInventory);
        menuInventory.setMenuItem(null);
    }

    // ===== Getters and setters =====
    public Integer getMenuItemId() {
        return menuItemId;
    }

    public void setMenuItemId(Integer menuItemId) {
        this.menuItemId = menuItemId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Boolean getAvailability() {
        return availability;
    }

    public void setAvailability(Boolean availability) {
        this.availability = availability;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public MenuCategory getCategory() {
        return category;
    }

    public void setCategory(MenuCategory category) {
        this.category = category;
    }

    public Set<MenuInventory> getInventories() {
        return inventories;
    }

    public void setInventories(Set<MenuInventory> inventories) {
        this.inventories = inventories;
    }
}