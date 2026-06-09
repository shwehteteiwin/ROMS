// ================= DOM Elements =================
const menuWrapper = document.querySelector(".menu_categories");
const menuContainer = document.querySelector(".menu_items");
const totalPrice = document.querySelector(".total_price");
const orderListPage = document.querySelector(".order_list");
const orderItemsContainer = document.querySelector(".order_items");
const orderNowBtn = document.querySelector(".order_now");
const orderSummary = document.querySelector(".order_summary");
const buttons = document.querySelectorAll(".category-btn");
const sections = document.querySelectorAll(".one_category");
const layout = document.querySelector(".menu_layout");

// Overlay and popup
const popupBox = document.getElementById("popupBox");
const overlay = document.getElementById("overlay");

// ================= Data =================
let orderItems = []; // menu items from backend
let orderList = []; // items user added

// ================= Load Menu from Backend =================
async function loadMenuFromBackend() {
    try {
        const response = await fetch("http://localhost:8080/api/menu");
        if (!response.ok) throw new Error("Failed to fetch menu");

        const data = await response.json();

        orderItems = data.map(item => ({
            id: item.id,
            name: item.name,
            price: Number(item.price),
            description: item.description,
            image: item.photoUrl,
            category: item.categoryName
                ? item.categoryName.toLowerCase()
                : "others"
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

    const categories = [
        "all",
        ...new Set(orderItems.map(i => i.category))
    ];

    menuWrapper.innerHTML = "";

    categories.forEach(cat => {

        const btn = document.createElement("button");
        btn.classList.add("category-btn");
        btn.dataset.category = cat;
        btn.textContent =
            cat.charAt(0).toUpperCase() + cat.slice(1);

        menuWrapper.appendChild(btn);
    });
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

        // Update active class
        document.querySelector(".category-btn.active")?.classList.remove("active");
        button.classList.add("active");
    });
});document.querySelectorAll(".category-btn").forEach(button => {
    button.addEventListener("click", () => {
        const category = button.dataset.category;
        if (category === "all") {
            menuWrapper.classList.add("all-view");
        } else {
            menuWrapper.classList.remove("all-view");
        }

        // hide/show each section
        document.querySelectorAll(".one_category").forEach(section => {
            const sectionCategory = section.querySelector(".menu_card")?.dataset.category;

            if (category === "all" || sectionCategory === category) {
                section.style.display = "block"; // show section and its title
            } else {
                section.style.display = "none"; // hide section including <h2>
            }
        });

        // Update active class
        document.querySelector(".category-btn.active")?.classList.remove("active");
        button.classList.add("active");
    });
});
    // document.querySelectorAll(".category-btn").forEach(button => {

    //         button.addEventListener("click", () => {

    //             const category = button.dataset.category;

    //             if (category === "all") {
    //                 menuWrapper.classList.add("all-view");
    //             } else {
    //                 menuWrapper.classList.remove("all-view");
    //             }

    //             document.querySelectorAll(".menu_card")
    //                 .forEach(card => {

    //                     if (category === "all" || card.dataset.category === category) {
    //                         card.style.display = "block";
    //                     } else {
    //                         card.style.display = "none";
    //                     }
    //                 });

    //             document.querySelector(".category-btn.active")
    //                 ?.classList.remove("active");

    //             button.classList.add("active");
    //         });
    //     });
}



// ================= Initialize Menu Cards =================
function initMenuCards() {

    menuContainer.innerHTML = "";
    const categories = {};

    orderItems.forEach((item, key) => {

        const category = item.category || "others";

        if (!categories[category]) {

            categories[category] =
                document.createElement("div");

            categories[category]
                .classList.add("one_category");

            categories[category].innerHTML = `
                <h2 class="title">
                    ${category.charAt(0).toUpperCase() + category.slice(1)}
                </h2>
                <div class="menu_items"></div>
            `;

            menuWrapper.appendChild(
                categories[category]
            );
        }

        const menuBox =
            categories[category]
                .querySelector(".menu_items");

        let newDiv = document.createElement("div");

        newDiv.classList.add("menu_card");
        newDiv.dataset.category = category;

        newDiv.innerHTML = `
            <img src="${item.image}" alt="">
            <div class="card_texts">
                <h4>${item.name}</h4>
                <p class="prices">
                    ${item.price.toLocaleString()} Kyats
                </p>
                <button
                    class="btn-login-w100 add-btn"
                    data-key="${key}">
                    Order
                </button>
            </div>
        `;

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

    popupBox.querySelector("h2").textContent =
        item.name;

    popupBox.querySelector("img").src =
        item.image;

    popupBox.querySelector(".description")
        .textContent = item.description;

    popupBox.querySelector(".price")
        .textContent =
        item.price.toLocaleString() + " Kyats";

    popupBox.classList.add("active");
    overlay.classList.add("active");
}

function closePopup() {
    popupBox.classList.remove("active");
    overlay.classList.remove("active");
}

popupBox.querySelector("button")
    .addEventListener("click", closePopup);

// ================= Add to Order =================
document.addEventListener("click", function (e) {

    if (e.target.classList.contains("add-btn")) {

        const key =
            Number(e.target.dataset.key);

        addToOrderList(key);
    }
});

function addToOrderList(key) {

    const item = orderItems[key];

    const existing =
        orderList.find(o => o.id === item.id);

    if (existing) {
        existing.quantity += 1;
    } else {
        orderList.push({
            ...item,
            quantity: 1
        });
    }

    reloadOrderList();
}

// ================= Order List =================
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
                    <h4 class="order_name">
                        ${item.name}
                    </h4>
                    <p class="order_price">
                        ${item.price.toLocaleString()} Kyats
                    </p>
                </div>
                <div class="availability">
                    <button onclick="changeQuantity(${key}, ${item.quantity - 1})">-</button>
                    <div class="count order_quantity">
                        ${item.quantity}
                    </div>
                    <button onclick="changeQuantity(${key}, ${item.quantity + 1})">+</button>
                </div>
                <h4>
                    ${(item.price * item.quantity).toLocaleString()}
                </h4>
            </div>
        `;

        orderItemsContainer.appendChild(div);
    });

    totalPrice.textContent =
        total.toLocaleString() + " Kyats";
}

function changeQuantity(key, quantity) {

    if (quantity < 1) {
        orderList.splice(key, 1);
    } else {
        orderList[key].quantity = quantity;
    }

    reloadOrderList();
}

// ================= Initialize =================
window.addEventListener(
    "DOMContentLoaded",
    loadMenuFromBackend
);