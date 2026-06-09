# Restaurant Ordering & Management System (ROMS)

The **Restaurant Ordering & Management System (ROMS)** is a centralized, web-based application designed to digitalize and automate everyday restaurant operations. It provides a seamless experience for customers to browse menus and reserve tables, while offering robust, role-based management tools for managers and kitchen staff.

---

## 🚀 Key Features

### 👤 Customer & Guest Experience
* **Dynamic Menu Browsing:** View available menu items with real-time prices and availability.
* **Flexible Table Reservations:** Book tables for future dining or select an open table immediately as a walk-in guest.
* **No Login Mandatory:** Guests can browse, reserve, and place orders directly without forcing an account creation.
* **Live Order & Bill Tracking:** Place orders linked to specific tables, track fulfillment status, and view generated bills.

### 🍳 Kitchen Staff Operations
* **Live Order Feed:** View active incoming customer orders instantly.
* **Order Lifecycle Tracking:** Update order progress fluidly through statuses: `RECEIVED` ➔ `COOKING` ➔ `READY` ➔ `COMPLETED`.

### 💼 Management Tools
* **Menu & Table Management:** Easily add, edit, or remove menu items and layout tables.
* **Automated Inventory Control:** Ingredients automatically deduct when orders are placed. Includes low-stock threshold triggers and manual stock adjustments.
* **Sales Records:** Track and monitor restaurant sales data over time.

---

## 🛠️ Tech Stack

* **Backend:** Java, Spring Boot, Maven
* **Database:** MySQL / PostgreSQL (Schema initialization via `scheme.sql`)
* **Frontend:** HTML5, CSS3, JavaScript (Thymeleaf/Bootstrap architecture)

---

## 📁 Project Structure Highlights

* `/src/main/java` - Contains the core application logic, controllers, models, and repositories.
* `/src/main/resources/templates` - UI templates and views.
* `/src/main/resources/static` - Static assets including CSS, JavaScript, and UI images.
* `scheme.sql` - Database design structures and table relationships.

---

## ⚙️ Getting Started

### Prerequisites
* **Java JDK** (Version 17 or higher recommended)
* **Maven** (For dependency management)
* **A Relational Database** (MySQL/PostgreSQL)

### Local Setup & Installation

### Local Setup & Installation

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/shwehteteiwin/ROMS.git](https://github.com/shwehteteiwin/ROMS.git)
   cd ROMS

2. Configure Environment:
Open src/main/resources/application.properties and update your database connections:

spring.datasource.url=jdbc:mysql://localhost:3306/YOUR_DATABASE_NAME
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

3. Initialize Database:
Import and run the scheme.sql script located in the root folder into your local database instance to set up tables.

4. Build and Run the Application:
Using the Maven Wrapper included in the project:
   ```bash
   # On Windows
   mvnw.cmd spring-boot:run

   # On Linux/macOS
   ./mvnw spring-boot:run

Once started, access the application in your browser at http://localhost:8080.

