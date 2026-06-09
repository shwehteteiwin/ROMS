package com.romsproject.roms.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "inventory")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventory_id")
    private Integer inventoryId;

    @Column(name = "item_name", nullable = false, unique = true, length = 150)
    private String itemName;

    @Column(name = "quantity", nullable = false, precision = 10, scale = 2)
    private BigDecimal quantity;

    @Column(name = "unit", nullable = false, length = 50)
    private String unit;

    @Column(name = "low_stock_threshold", nullable = false, precision = 10, scale = 2)
    private BigDecimal lowStockThreshold;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    //Added cause  (Nang)
@JsonIgnore
@OneToMany(mappedBy = "inventory")
private Set<MenuInventory> menuItems = new HashSet<>();

    // // ===== Bidirectional relationship with MenuInventory =====
    // @OneToMany(mappedBy = "inventory", cascade = CascadeType.ALL, orphanRemoval = true)
    // private Set<MenuInventory> menuItems = new HashSet<>();

    // Default constructor
    public Inventory() {}

    public Inventory(String itemName, BigDecimal quantity, String unit, BigDecimal lowStockThreshold, LocalDate expiryDate) {
        this.itemName = itemName;
        this.quantity = quantity;
        this.unit = unit;
        this.lowStockThreshold = lowStockThreshold;
        this.expiryDate = expiryDate;
    }

    // ===== Helper methods =====
    public void addMenuItem(MenuInventory menuInventory) {
        menuItems.add(menuInventory);
        menuInventory.setInventory(this);
    }

    public void removeMenuItem(MenuInventory menuInventory) {
        menuItems.remove(menuInventory);
        menuInventory.setInventory(null);
    }

    // ===== Getters and setters =====
    public Integer getInventoryId() {
        return inventoryId;
    }

    public void setInventoryId(Integer inventoryId) {
        this.inventoryId = inventoryId;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public BigDecimal getLowStockThreshold() {
        return lowStockThreshold;
    }

    public void setLowStockThreshold(BigDecimal lowStockThreshold) {
        this.lowStockThreshold = lowStockThreshold;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public Set<MenuInventory> getMenuItems() {
        return menuItems;
    }

    public void setMenuItems(Set<MenuInventory> menuItems) {
        this.menuItems = menuItems;
    }
}