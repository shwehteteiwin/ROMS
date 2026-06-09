package com.romsproject.roms.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

// import org.springframework.ui.Model;

@Controller
public class pageController {
    // @GetMapping("/dashboard")
    // public String dashboard(Model model) {
    // model.addAttribute("message", "Welcome to My Dashboard 🔥");
    // return "dashboard";
    // }
    @GetMapping("/dashboard")
    public String dashboard() {
        return "dashboard";
    }

    @GetMapping("/guest_dashboard")
    public String guest_dashboard() {
        return "guest_dashboard";
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login"; // loads login.html from templates
    }

    @GetMapping("/profile")
    public String profile() {
        return "profile"; // menu.html
    }

    @GetMapping("/editProfile")
    public String editProfile() {
        return "editProfile"; // menu.html
    }

    @GetMapping("/change_password")
    public String change_password() {
        return "change_password"; // menu.html
    }

    @GetMapping("/menu")
    public String menu() {
        return "menu";
    }

    @GetMapping("/reservation")
    public String reservation() {
        return "reservation";
    }

    @GetMapping("/orders")
    public String orders() {
        return "orders";
    }

    @GetMapping("/getOtp")
    public String getOtp() {
        return "getOtp";
    }

    @GetMapping("/set_ps")
    public String set_ps() {
        return "set_ps";
    }

    @GetMapping("/staff_login")
    public String staff_login() {
        return "staff_login";
    }

    @GetMapping("/forget_ps")
    public String forget_ps() {
        return "forget_ps";
    }

    @GetMapping("/reset_ps")
    public String reset_ps() {
        return "reset_ps";
    }

    // myint mo
    @GetMapping("/cus_order_status_bills")
    public String order_status_bills() {
        return "cus_order_status_bills";
    }

    // myint mo
    @GetMapping("/kitchen_order_status")
    public String kitchen_order_status() {
        return "kitchen_order_status";
    }

    // zue
    @GetMapping("/sale_record")
    public String sale_record() {
        return "sale_record";
    }

    @GetMapping("/manageCategory")
    public String manageCategory() {
        return "manage_category";
    }

    @GetMapping("/addCategory")
    public String addCategory() {
        return "add_category";
    }

    @GetMapping("/editCategory")
    public String editCategory() {
        return "edit_category";
    }

    @GetMapping("/manageInventory")
    public String manageInventory() {
        return "manage_inventory";
    }

    @GetMapping("/addInventory")
    public String addInventory() {
        return "add_inventory";
    }

    @GetMapping("/editInventory")
    public String editInventory() {
        return "edit_inventory";
    }

    @GetMapping("/manageTable")
    public String manageTable() {
        return "manage_table";
    }

    @GetMapping("/addTable")
    public String addTable() {
        return "add_table";
    }

    @GetMapping("/editTable")
    public String editTable() {
        return "edit_table";
    }

    @GetMapping("/lowStock")
    public String lowStock() {
        return "view_low_stock";
    }

    @GetMapping("/manage_menus")
    public String manage_menus() {
        return "manage_menus";
    }

    @GetMapping("/add-menu")
    public String add_menu() {
        return "add_menu";
    }

    @GetMapping("/edit-menu")
    public String edit_menu() {
        return "edit_menu";
    }

    @GetMapping("/role_popup1_1")
    public String role_popup1_1() {
        return "role_popup1_1";
    }

}
