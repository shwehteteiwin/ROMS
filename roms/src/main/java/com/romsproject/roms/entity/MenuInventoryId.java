package com.romsproject.roms.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class MenuInventoryId implements Serializable {

    @Column(name = "menu_item_id")
    private Integer menuItemId;

    @Column(name = "inventory_id")
    private Integer inventoryId;

    public MenuInventoryId() {}

    public MenuInventoryId(Integer menuItemId, Integer inventoryId) {
        this.menuItemId = menuItemId;
        this.inventoryId = inventoryId;
    }

    public Integer getMenuItemId() {
        return menuItemId;
    }

    public void setMenuItemId(Integer menuItemId) {
        this.menuItemId = menuItemId;
    }

    public Integer getInventoryId() {
        return inventoryId;
    }

    public void setInventoryId(Integer inventoryId) {
        this.inventoryId = inventoryId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MenuInventoryId)) return false;
        MenuInventoryId that = (MenuInventoryId) o;
        return Objects.equals(menuItemId, that.menuItemId) &&
               Objects.equals(inventoryId, that.inventoryId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(menuItemId, inventoryId);
    }
}