USE roms;

-- =========================
-- 1. ROLES
-- =========================
CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- =========================
-- 2. USERS
-- =========================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    photo_url VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id) REFERENCES roles(role_id)
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
);

-- =========================
-- 3. RESTAURANT_TABLES
-- =========================
CREATE TABLE restaurant_tables (
    table_id INT AUTO_INCREMENT PRIMARY KEY,
    table_number INT NOT NULL UNIQUE,
    capacity INT NOT NULL CHECK (capacity > 0),
    status ENUM('AVAILABLE','RESERVED','OCCUPIED') 
        NOT NULL DEFAULT 'AVAILABLE'
);

-- =========================
-- 4. MENU_CATEGORIES
-- =========================
CREATE TABLE menu_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

-- =========================
-- 5. MENU_ITEMS
-- =========================
CREATE TABLE menu_items (
    menu_item_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    availability BOOLEAN NOT NULL DEFAULT TRUE,
    photo_url VARCHAR(255),
    category_id INT,
    
    CONSTRAINT fk_menu_category
        FOREIGN KEY (category_id) 
        REFERENCES menu_categories(category_id)
        ON DELETE SET NULL 
        ON UPDATE CASCADE
);

-- =========================
-- 6. INVENTORY
-- =========================
CREATE TABLE inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(150) NOT NULL UNIQUE,
    quantity DECIMAL(10,2) NOT NULL CHECK (quantity >= 0),
    unit VARCHAR(50) NOT NULL,
    low_stock_threshold DECIMAL(10,2) NOT NULL CHECK (low_stock_threshold >= 0),
    expiry_date DATE NOT NULL
);

-- =========================
-- 7. MENU_INVENTORY (Junction Table)
-- =========================
CREATE TABLE menu_inventory (
    menu_item_id INT NOT NULL,
    inventory_id INT NOT NULL,
    quantity_used DECIMAL(10,2) NOT NULL CHECK (quantity_used > 0),
    
    PRIMARY KEY (menu_item_id, inventory_id),
    
    CONSTRAINT fk_mi_menu
        FOREIGN KEY (menu_item_id)
        REFERENCES menu_items(menu_item_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
        
    CONSTRAINT fk_mi_inventory
        FOREIGN KEY (inventory_id)
        REFERENCES inventory(inventory_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- =========================
-- 8. RESERVATIONS
-- =========================
CREATE TABLE reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    table_id INT NOT NULL,
    user_id INT,
    customer_name VARCHAR(100) NOT NULL,
    reservation_time DATETIME NOT NULL,
    finished_time DATETIME,
    status ENUM('ACTIVE','CANCELLED','COMPLETED') 
        NOT NULL DEFAULT 'ACTIVE',
    
    CONSTRAINT fk_res_table
        FOREIGN KEY (table_id)
        REFERENCES restaurant_tables(table_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
        
    CONSTRAINT fk_res_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- =========================
-- 9. ORDERS
-- =========================
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    table_id INT NOT NULL,
    user_id INT,
    order_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('RECEIVED','COOKING','READY','COMPLETED') 
        NOT NULL DEFAULT 'RECEIVED',
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    
    CONSTRAINT fk_orders_table
        FOREIGN KEY (table_id)
        REFERENCES restaurant_tables(table_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
        
    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- =========================
-- 10. ORDER_ITEMS
-- =========================
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    
    UNIQUE (order_id, menu_item_id),
    
    CONSTRAINT fk_oi_order
        FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
        
    CONSTRAINT fk_oi_menu
        FOREIGN KEY (menu_item_id)
        REFERENCES menu_items(menu_item_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);
CREATE TABLE otps (
    otp_id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    purpose VARCHAR(255),
    expires_at DATETIME,
    is_used BOOLEAN DEFAULT FALSE,
    user_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);
ALTER TABLE reservations
MODIFY reservation_time TIMESTAMP NOT NULL,
MODIFY finished_time TIMESTAMP NULL;

ALTER TABLE reservations
ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP

-- //Nang

ALTER TABLE menu_inventory
DROP FOREIGN KEY fk_mi_inventory;

ALTER TABLE menu_inventory
ADD CONSTRAINT fk_mi_inventory
FOREIGN KEY (inventory_id)
REFERENCES inventory(inventory_id)
ON DELETE RESTRICT
ON UPDATE CASCADE;