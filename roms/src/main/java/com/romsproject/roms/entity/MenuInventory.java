package com.romsproject.roms.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "menu_inventory")
public class MenuInventory {

    @EmbeddedId
    private MenuInventoryId id;

    @MapsId("menuItemId")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
        name = "menu_item_id",
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_mi_menu")
    )
    private MenuItem menuItem;

    @MapsId("inventoryId")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
        name = "inventory_id",
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_mi_inventory")
    )
    private Inventory inventory;

    @Column(name = "quantity_used", nullable = false, precision = 10, scale = 2)
    private BigDecimal quantityUsed;

    // ===== Default constructor (required by JPA) =====
    public MenuInventory() {
    }

    // ===== Constructor (SAFE version) =====
    public MenuInventory(MenuItem menuItem, Inventory inventory, BigDecimal quantityUsed) {
        this.menuItem = menuItem;
        this.inventory = inventory;
        this.quantityUsed = quantityUsed;
    }

    // ===== Getters and Setters =====

    public MenuInventoryId getId() {
        return id;
    }

    public void setId(MenuInventoryId id) {
        this.id = id;
    }

    public MenuItem getMenuItem() {
        return menuItem;
    }

    public void setMenuItem(MenuItem menuItem) {
        this.menuItem = menuItem;
    }

    public Inventory getInventory() {
        return inventory;
    }

    public void setInventory(Inventory inventory) {
        this.inventory = inventory;
    }

    public BigDecimal getQuantityUsed() {
        return quantityUsed;
    }

    public void setQuantityUsed(BigDecimal quantityUsed) {
        this.quantityUsed = quantityUsed;
    }
}