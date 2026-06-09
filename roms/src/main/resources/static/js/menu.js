// ================= DOM Elements =================
const menuWrapper = document.querySelector(".menu_categories");
const menuContainer = document.querySelector(".menu_items");
const totalPrice = document.querySelector(".total_price");
const orderListPage = document.querySelector(".order_list");
const orderItemsContainer = document.querySelector(".order_items");
const orderNowBtn = document.querySelector(".order_now");
const orderSummary = document.querySelector(".order_summary");
const layout = document.querySelector(".menu_layout");
//3.7.26 for guest shwehtet


// Overlay and popup
const popupBox = document.getElementById("popupBox");
const overlay = document.getElementById("overlay");

// ================= Data =================
let orderItems = []; // menu items from backend
let orderList = []; // items user added

// ================= Load Menu from Backend =================
async function loadMenuFromBackend() {
    try {
        const response = await fetch("http://localhost:8080/api/menu/with-stock");


        if (!response.ok) throw new Error("Failed to fetch menu");

        const data = await response.json();
        // orderItems = data.map(item => ({
        //     id: item.id,
        //     name: item.name,
        //     price: Number(item.price),
        //     description: item.description,
        //     image: item.photoUrl,
        //     category: item.categoryName ? item.categoryName.toLowerCase() : "others"
        // }));
        orderItems = data.map(item => ({
            id: item.id,
            name: item.name,
            price: Number(item.price),
            description: item.description,
            image: item.photoUrl,
            category: item.categoryName ? item.categoryName.toLowerCase() : "others",
            availableStock: item.availableStock   // ✅ IMPORTANT
        }));
        generateCategoryButtons();
        initMenuCards();

        const allButton = document.querySelector('[data-category="all"]');
        if (allButton) allButton.click();
    } catch (err) {
        console.error("Error loading menu:", err);
    }
}
// ================= Generate Category Buttons =================
function generateCategoryButtons() {
    // const categories = ["all", ...new Set(orderItems.map(i => i.category))];
    // menuWrapper.innerHTML = "";

    // categories.forEach(cat => {
    //     const btn = document.createElement("button");
    //     btn.classList.add("category","category-btn");
    //     btn.dataset.category = cat;
    //     btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    //     menuWrapper.appendChild(btn);
    // });

    document.querySelectorAll(".category-btn").forEach(button => {
        button.addEventListener("click", () => {
            const category = button.dataset.category;
            if (category === "all") {
                menuWrapper.classList.add("all-view");
            } else {
                menuWrapper.classList.remove("all-view");
            }

            document.querySelectorAll(".menu_card").forEach(card => {
                if (category === "all" || card.dataset.category === category) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });

            document.querySelector(".category-btn.active")?.classList.remove("active");
            button.classList.add("active");
        });
    });
}

// ================= Initialize Menu Cards =================
function initMenuCards() {
    menuContainer.innerHTML = "";
    const categories = {};

    orderItems.forEach((item, key) => {
        const category = item.category || "others";

        if (!categories[category]) {
            categories[category] = document.createElement("div");
            categories[category].classList.add("one_category");
            categories[category].innerHTML = `
                <h2 class="title">${category.charAt(0).toUpperCase() + category.slice(1)}</h2>
                <div class="menu_items"></div>
            `;
            menuWrapper.appendChild(categories[category]);
        }

        const menuBox = categories[category].querySelector(".menu_items");
        let newDiv = document.createElement("div");
        newDiv.classList.add("menu_card");
        newDiv.dataset.category = category;
        newDiv.innerHTML = `
            <img src="${item.image}" alt="">
            <div class="card_texts">
                <h4>${item.name}</h4>
                <p class="prices">${item.price.toLocaleString()} Kyats</p>
                <button class="btn-login-w100 add-btn" 
        data-key="${key}" 
                      ${item.availableStock === 0
                ? "Out of Stock"
                : item.availableStock <= 3
                    ? `Only ${item.availableStock} Left`
                    : "Order"} >Order
</button>
                
            </div>
        `;
        // <button class="btn-login-w100 add-btn" data-key="${key}">Order</button>
        newDiv.addEventListener("click", (e) => {
            if (!e.target.classList.contains("add-btn")) {
                showPopup(item);
            }
        });

        menuBox.appendChild(newDiv);
    });
}







































// ================= Popup =================
function showPopup(item) {
    popupBox.querySelector("h2").textContent = item.name;
    popupBox.querySelector("img").src = item.image;
    popupBox.querySelector(".description").textContent = item.description;
    popupBox.querySelector(".price").textContent = item.price.toLocaleString() + " Kyats";
    popupBox.classList.add("active");
    overlay.classList.add("active");
}

function closePopup() {
    popupBox.classList.remove("active");
    overlay.classList.remove("active");
}

popupBox.querySelector("button").addEventListener("click", closePopup);

// ================= Add to Order =================
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("add-btn")) {
        const key = Number(e.target.dataset.key);
        addToOrderList(key);
    }
});

function addToOrderList(key) {
    const item = orderItems[key];
    const existing = orderList.find(o => o.id === item.id);

    if (existing) {
        if (existing.quantity >= item.availableStock) {
            alert(`Only ${item.availableStock} available.`);
            existing.quantity = item.availableStock; // force max
        } else {
            existing.quantity += 1;
        }
    } else {
        if (item.availableStock > 0) {
            orderList.push({ ...item, quantity: 1 });
        } else {
            alert("Item is out of stock!");
            return;
        }
    }

    reloadOrderList();
}

// ================= Order List =================
function changeQuantity(key, quantity) {
    const item = orderList[key];

    // If user tries more than stock
    if (quantity > item.availableStock) {
        alert(`Only ${item.availableStock} available. Quantity adjusted.`);
        orderList[key].quantity = item.availableStock;
        reloadOrderList();
        return;
    }

    if (quantity < 1) {
        orderList.splice(key, 1);
    } else {
        orderList[key].quantity = quantity;
    }

    reloadOrderList();
}

orderNowBtn.addEventListener("click", () => {
    if (orderList.length === 0) return; // Nothing to order

    const summaryContainer = orderSummary.querySelector(".order_items_summary");
    const summaryTotal = document.getElementById("summaryTotal");

    // Clear previous summary
    summaryContainer.innerHTML = "";

    let total = 0;

    orderList.forEach(item => {
        total += item.price * item.quantity;

        const div = document.createElement("div");
        div.classList.add("order_card");

        div.innerHTML = `
            <div class="img-wrapper">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="order_info">
                <h4>${item.name}</h4>
                <p>${item.quantity} x ${item.price.toLocaleString()} Kyats</p>
                <h4>${(item.price * item.quantity).toLocaleString()} Kyats</h4>
            </div>
        `;

        summaryContainer.appendChild(div);
    });

    summaryTotal.textContent = total.toLocaleString() + " Kyats";

    // Show the summary popup
    orderSummary.classList.add("active");
    document.querySelector(".close-summary").addEventListener("click", () => {
        orderSummary.classList.remove("active");
    });
});

function reloadOrderList() {
    if (orderList.length === 0) {
        orderListPage.classList.remove("active");
        menuWrapper.classList.remove("with-order");
        layout.classList.remove("order-open");
        orderItemsContainer.innerHTML = '';
        totalPrice.textContent = '';
        return;
    }

    orderListPage.classList.add("active");
    menuWrapper.classList.add("with-order");
    layout.classList.add("order-open");
    orderItemsContainer.innerHTML = '';

    let total = 0;

    orderList.forEach((item, key) => {
        total += item.price * item.quantity;

        const div = document.createElement("div");
        div.classList.add("order_card");
        div.innerHTML = `
            <img src="${item.image}">
            <div class="order_text">
                <div class="order_info">
                    <h4 class="order_name">${item.name}</h4>
                    <p class="order_price">${item.price.toLocaleString()} Kyats</p>
                </div>
                <div class="availability">
                    <button onclick="changeQuantity(${key}, ${item.quantity - 1})">-</button>
                    <div class="count order_quantity">${item.quantity}</div>
                    <button onclick="changeQuantity(${key}, ${item.quantity + 1})">+</button>
                </div>
                <h4>${(item.price * item.quantity).toLocaleString()}</h4>
            </div>
        `;
        orderItemsContainer.appendChild(div);
    });

    totalPrice.textContent = total.toLocaleString() + " Kyats";
}


//==================Confirm Order===========
async function confirmOrder(tableId) {
    if (orderList.length === 0) return alert("Your order is empty!");

    const payload = {
        tableId: Number(tableId),
        totalAmount: orderList.reduce((sum, item) => sum + item.price * item.quantity, 0),
        items: orderList.map(item => ({
            menuItemId: item.id,
            quantity: item.quantity,
            price: item.price
        }))
    };

    try {
        const response = await fetch("http://localhost:8080/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Important if using session cookies
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const result = await response.json();
        // alert(`Order confirmed!`);
        alert(`Order confirmed! Order ID: ${result.orderId}`);
        orderSummary.classList.remove("active");
        orderList = []; // Clear local order
        reloadOrderList();
        //8:43 for form clean
        // document.querySelector(".selected").textContent = "Select Table";
        // document.querySelector(".selectedTable").value = "";
    } catch (err) {
        console.error(err);
        alert("Error confirming order: " + err.message);
    }
}
function updateConfirmButton() {
    confirmBtn.disabled = orderList.length === 0 || !document.querySelector(".selectedTable").value;
}

document.addEventListener("click", updateConfirmButton);
document.querySelector(".selectedTable").addEventListener("change", updateConfirmButton);
// ================= Populate Table Dropdown =================
//7.3.2026
const params = new URLSearchParams(window.location.search);
const guestTableId = params.get("tableId");

async function loadTables() {
    const dropdownMenu = document.querySelector(".dropdown-menu");
    const selected = document.querySelector(".selected");
    const hiddenInput = document.querySelector(".selectedTable");

    console.log("Guest Table ID:", guestTableId);

    if (guestTableId) {

        dropdownMenu.innerHTML = "";

        const div = document.createElement("div");
        div.classList.add("item");
        div.dataset.value = guestTableId;
        div.textContent = "Reserved Table " + guestTableId;

        dropdownMenu.appendChild(div);

        selected.textContent = div.textContent;
        hiddenInput.value = guestTableId;

        return;
    }

    try {
        const response = await fetch("/api/tables/my", {
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to load tables");

        const tables = await response.json();

        dropdownMenu.innerHTML = "";

        if (tables.length === 0) {
            const div = document.createElement("div");
            div.classList.add("item");
            div.textContent = "No Active Reservation";
            dropdownMenu.appendChild(div);
            return;
        }

        tables.forEach(table => {
            const div = document.createElement("div");
            div.classList.add("item");
            div.dataset.value = table.id;
            div.textContent = table.displayName;
            dropdownMenu.appendChild(div);
        });

    } catch (err) {
        console.error("Table loading error:", err);
    }
}

//worked well for customer only
// async function loadTables() {
//     const dropdownMenu = document.querySelector(".dropdown-menu");

//     try {
//         const response = await fetch("/api/tables/my", {
//             credentials: "include"
//         });

//         if (!response.ok) throw new Error("Failed to load tables");

//         const tables = await response.json();

//         dropdownMenu.innerHTML = "";

//         if (tables.length === 0) {
//             const div = document.createElement("div");
//             div.classList.add("item");
//             div.textContent = "No Active Reservation (Please reserve a table)";
//             dropdownMenu.appendChild(div);
//             return;
//         }

//         tables.forEach(table => {
//             const div = document.createElement("div");
//             div.classList.add("item");
//             div.dataset.value = table.id;
//             div.textContent = table.displayName;

//             dropdownMenu.appendChild(div);
//         });

//     } catch (err) {
//         console.error("Table loading error:", err);
//     }
// }


// ================= Dropdown Event Handling =================
function attachDropdownEvents() {
    const select = document.querySelector(".select");
    const dropdownMenu = document.querySelector(".dropdown-menu");
    const selected = document.querySelector(".selected");
    const hiddenInput = document.querySelector(".selectedTable");
    const dropdown = document.querySelector(".dropdown");

    select.addEventListener("click", () => {
        dropdown.classList.toggle("active");
    });
    // select.addEventListener("click", () => {
    //     dropdownMenu.classList.toggle("show");
    // });

    dropdownMenu.addEventListener("click", (e) => {
        const item = e.target.closest(".item");
        // if (!item) return;
        if (!item || !item.dataset.value) return;

        selected.textContent = item.textContent;
        hiddenInput.value = item.dataset.value;

        dropdownMenu.classList.remove("show");
    });

    document.addEventListener("click", (e) => {
        if (!select.contains(e.target) && !dropdownMenu.contains(e.target)) {
            // dropdownMenu.classList.remove("show");
            dropdown.classList.remove("active");
        }
    });
}
//comfirm order btn 
const confirmBtn = document.querySelector(".success-btn");

confirmBtn.addEventListener("click", () => {
    const tableId = document.querySelector(".selectedTable").value;
    // const userId = 123; // Replace with logged-in user ID or get from session/auth
    if (!tableId) return alert("Please select a table first.");

    confirmOrder(tableId);
});
// ================= Initialize =================

window.addEventListener("DOMContentLoaded", async () => {
    await loadMenuFromBackend();
    await loadTables();
    attachDropdownEvents();
});