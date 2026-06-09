package com.romsproject.roms.controller;

import com.romsproject.roms.entity.*;
import com.romsproject.roms.entity.Statuses.OrderStatus;
import com.romsproject.roms.service.MenuService;
import com.romsproject.roms.service.OrderService;
import com.romsproject.roms.service.ReservationService;
import com.romsproject.roms.service.UserService;
import com.romsproject.roms.repository.InventoryRepository;
// import com.romsproject.roms.repository.MenuInventoryRepository;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:8080", allowCredentials = "true")
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;
    private final MenuService menuService;
    private final ReservationService reservationService;
    private final InventoryRepository inventoryRepository;

    public OrderController(OrderService orderService, UserService userService,
            MenuService menuService, ReservationService reservationService,
            InventoryRepository inventoryRepository) {
        this.orderService = orderService;
        this.userService = userService;
        this.menuService = menuService;
        this.reservationService = reservationService;
        this.inventoryRepository = inventoryRepository;
    }

    // ===================== Place Order =====================
    @PostMapping
    @Transactional
    public ResponseEntity<?> confirmOrder(@RequestBody OrderRequest request, Principal principal) {
        try {
            // for both customer and guest 3.7.26 shwehtet
            User user = null;

            if (principal != null) {
                user = userService.getUserByEmail(principal.getName());
            }
            // 1️⃣ Get logged-in user
            // User user = userService.getUserByEmail(principal.getName());
            // if (user == null)
            // return ResponseEntity.badRequest().body("User not found");

            // 2️⃣ Get table
            RestaurantTable table = reservationService.getById(request.getTableId());
            if (table == null)
                return ResponseEntity.badRequest().body("Table not found");

            // 3️⃣ Create Order entity
            Order order = new Order();
            // order.setUser(user);
            // also for guest
            if (user != null) {
                order.setUser(user);
            }
            order.setTable(table);
            order.setOrderTime(LocalDateTime.now());
            order.setTotalAmount(request.getTotalAmount());
            order.setStatus(Statuses.OrderStatus.RECEIVED);

            // Set<OrderItem> orderItems = new HashSet<>();
            //myint mo
            List<OrderItem> orderItems = new ArrayList<>();


            // 4️⃣ Validate stock and create OrderItems
            for (OrderItemRequest itemReq : request.getItems()) {
                MenuItem menuItem = menuService.getMenuItemById(itemReq.getMenuItemId());

                int availableStock = menuService.calculateAvailableStock(menuItem);
                if (availableStock < itemReq.getQuantity()) {
                    return ResponseEntity.badRequest()
                            .body("Not enough stock for " + menuItem.getName() + ". Available: " + availableStock);
                }

                // Deduct stock and save inventory
                menuItem.getInventories().forEach(inv -> {
                    BigDecimal usedPerItem = inv.getQuantityUsed();
                    if (usedPerItem != null && inv.getInventory() != null) {
                        BigDecimal remaining = inv.getInventory().getQuantity()
                                .subtract(usedPerItem.multiply(BigDecimal.valueOf(itemReq.getQuantity())));
                        inv.getInventory().setQuantity(remaining.max(BigDecimal.ZERO));
                        inventoryRepository.save(inv.getInventory());
                    }
                });

                // Create OrderItem
                OrderItem orderItem = new OrderItem(menuItem, itemReq.getQuantity(),
                        BigDecimal.valueOf(itemReq.getPrice()));
                orderItem.setOrder(order);
                orderItems.add(orderItem);
            }

            order.setOrderItems(orderItems);

            // 5️⃣ Save the order
            Order savedOrder = orderService.save(order);
            Integer orderId = savedOrder.getOrderId(); // Assuming getId() returns the order ID

            // return ResponseEntity.ok(new OrderResponse("Order confirmed!"));
            return ResponseEntity.ok(new OrderResponse(orderId, "Order confirmed!"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to confirm order: " + e.getMessage());
        }

    }

    //order customer status
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrder(@PathVariable Integer orderId) {

        return orderService.findById(orderId)
                .map(order -> ResponseEntity.ok(order))
                .orElse(ResponseEntity.notFound().build());
    }

    // ===================== DTOs =====================
    public static class OrderRequest {
        private Integer tableId;
        private BigDecimal totalAmount;
        private List<OrderItemRequest> items;

        public Integer getTableId() {
            return tableId;
        }

        public void setTableId(Integer tableId) {
            this.tableId = tableId;
        }

        public BigDecimal getTotalAmount() {
            return totalAmount;
        }

        public void setTotalAmount(BigDecimal totalAmount) {
            this.totalAmount = totalAmount;
        }

        public List<OrderItemRequest> getItems() {
            return items;
        }

        public void setItems(List<OrderItemRequest> items) {
            this.items = items;
        }
    }

    public static class OrderItemRequest {
        private Integer menuItemId;
        private Integer quantity;
        private double price;

        public Integer getMenuItemId() {
            return menuItemId;
        }

        public void setMenuItemId(Integer menuItemId) {
            this.menuItemId = menuItemId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }

        public double getPrice() {
            return price;
        }

        public void setPrice(double price) {
            this.price = price;
        }
    }

    public static class OrderResponse {
        private Integer orderId;
        private String message;

        public OrderResponse(Integer orderId, String message) {
            this.orderId = orderId;
            this.message = message;
        }

        public Integer getOrderId() {
            return orderId;
        }

        public String getMessage() {
            return message;
        }
    }
    // myint mo
    public static class KitchenOrderResponse {

        private Integer orderId;
        private Integer tableId;
        private String status;
        private List<KitchenItem> items;

        public Integer getOrderId() { return orderId; }
        public void setOrderId(Integer orderId) { this.orderId = orderId; }

        public Integer getTableId() { return tableId; }
        public void setTableId(Integer tableId) { this.tableId = tableId; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public List<KitchenItem> getItems() { return items; }
        public void setItems(List<KitchenItem> items) { this.items = items; }
    }

    public static class KitchenItem {

        private String name;
        private Integer quantity;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
    // ===================== Kitchen Orders =====================
    @GetMapping("/kitchen")
    public ResponseEntity<?> getKitchenOrders() {

        List<Order> orders = orderService.findAll();

        List<KitchenOrderResponse> response = orders.stream().map(order -> {

            KitchenOrderResponse dto = new KitchenOrderResponse();

            dto.setOrderId(order.getOrderId());
            dto.setTableId(order.getTable().getTableId());
            dto.setStatus(order.getStatus().name());

            List<KitchenItem> items = order.getOrderItems().stream().map(item -> {
                KitchenItem i = new KitchenItem();
                i.setName(item.getMenuItem().getName());
                i.setQuantity(item.getQuantity());
                return i;
            }).toList();

            dto.setItems(items);

            return dto;

        }).toList();

        return ResponseEntity.ok(response);
    }
    // ===================== Update Order Status =====================
    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Integer orderId,
            @RequestBody StatusRequest request) {

        Optional<Order> orderOpt = orderService.findById(orderId);

        if(orderOpt.isEmpty()){
            return ResponseEntity.badRequest().body("Order not found");
        }

        Order order = orderOpt.get();

        order.setStatus(OrderStatus.valueOf(request.getStatus()));
        orderService.save(order);

        return ResponseEntity.ok("Status updated");
    }

    public static class StatusRequest {
        private String status;

        public String getStatus() { return status; }

        public void setStatus(String status) {
            this.status = status;
        }
    }
    public static class CustomerOrderResponse {

        private Integer orderId;
        private Integer tableId;
        private String status;
        private BigDecimal totalAmount;
        private List<CustomerItem> items;

        public Integer getOrderId() { return orderId; }

        public void setOrderId(Integer orderId) { this.orderId = orderId; }

        public Integer getTableId() { return tableId; }

        public void setTableId(Integer tableId) { this.tableId = tableId; }

        public String getStatus() { return status; }

        public void setStatus(String status) { this.status = status; }

        public BigDecimal getTotalAmount() { return totalAmount; }

        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

        public List<CustomerItem> getItems() { return items; }

        public void setItems(List<CustomerItem> items) { this.items = items; }
    }


    public static class CustomerItem {

        private String name;
        private Integer qty;
        private BigDecimal price;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Integer getQty() {
            return qty;
        }

        public void setQty(Integer qty) {
            this.qty = qty;
        }

        public BigDecimal getPrice() {
            return price;
        }

        public void setPrice(BigDecimal price) {
            this.price = price;
        }
    }
    @GetMapping("/customer")
    public ResponseEntity<?> getCustomerOrders(Principal principal) {

        User user = userService.getUserByEmail(principal.getName());

        List<Order> orders = orderService.findByUserId(user.getUserId());

        List<CustomerOrderResponse> response = orders.stream().map(order -> {

            CustomerOrderResponse dto = new CustomerOrderResponse();

            dto.setOrderId(order.getOrderId());
            dto.setTableId(order.getTable().getTableId());
            dto.setStatus(order.getStatus().name());
            dto.setTotalAmount(order.getTotalAmount());

            List<CustomerItem> items = order.getOrderItems().stream().map(item -> {

                CustomerItem i = new CustomerItem();
                i.setName(item.getMenuItem().getName());
                i.setQty(item.getQuantity());
                i.setPrice(item.getPrice());

                return i;

            }).toList();

            dto.setItems(items);

            return dto;

        }).toList();

        return ResponseEntity.ok(response);
    }
    //zue
public static class SalesDTO {

    private String date;
    private String total;

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTotal() {
        return total;
    }

    public void setTotal(String total) {
        this.total = total;
    }
}
    @GetMapping("/sales")
public ResponseEntity<?> getSales(@RequestParam String type) {

    List<Object[]> results;

    if(type.equals("daily")){
        results = orderService.getDailySales();
    }else{
        results = orderService.getMonthlySales();
    }

    List<SalesDTO> response = new ArrayList<>();

    for(Object[] row : results){
        SalesDTO dto = new SalesDTO();
        dto.setDate(row[0].toString());
        dto.setTotal(row[1].toString());
        response.add(dto);
    }

    return ResponseEntity.ok(response);
}
//zue
}