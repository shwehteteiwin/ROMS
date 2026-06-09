document.addEventListener('DOMContentLoaded', () => {

    const customCategorySelect = document.getElementById('customCategorySelect');
    const categoryTrigger = customCategorySelect.querySelector('.select-trigger');
    const categoryInput = document.getElementById('category');
    const selectedCategoryText = document.getElementById('selectedCategory');
    const cancelBtn = document.getElementById("cancelBtn");

    const addBtn = document.getElementById("addBtn");
    const form = document.getElementById("addMenuItemForm");

    const photoInput = document.getElementById("photo");
    const fileNameDisplay = document.getElementById("file-name");

    const inventoryList = document.getElementById("inventoryList");
    const selectedList = document.querySelector(".selected-list");

    // ===============================
    // QTY BUTTONS
    // ===============================
    document.querySelectorAll(".qty-box").forEach(box => {
        const input = box.querySelector("input");
        box.querySelector(".plus").onclick = () => input.stepUp();
        box.querySelector(".minus").onclick = () => input.stepDown();
    });

    // ===============================
    // CATEGORY DROPDOWN
    // ===============================
    categoryTrigger.addEventListener('click', () => {
        customCategorySelect.classList.toggle('active');
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('#customCategorySelect')) {
            customCategorySelect.classList.remove('active');
        }
    });

    // ===============================
    // PHOTO FILE
    // ===============================
    photoInput.addEventListener("change", function () {

        const file = this.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file!");
            this.value = "";
            fileNameDisplay.textContent = "No file chosen";
            return;
        }

        fileNameDisplay.textContent = file.name;
    });

    // ===============================
    // INVENTORY ADD FUNCTION
    // ===============================
    function addInventoryToSelected(itemName, unit) {

        const alreadyAdded = [...selectedList.querySelectorAll(".inv-name")]
            .some(el => el.innerText === itemName);

        if (alreadyAdded) {
            alert(itemName + " already added");
            return;
        }

        const emptyMessage = selectedList.querySelector(".empty-message");
        if (emptyMessage) {
            emptyMessage.remove();
        }

        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <div class="inv-name">${itemName}</div>
            <div class="qty-box">
                <button class="minus">-</button>
                <input type="number" value="1" min="0">
                <button class="plus">+</button>
            </div>
            <div class="inv-unit">${unit}</div>
        `;

        selectedList.appendChild(card);

        const input = card.querySelector("input");

        card.querySelector(".plus").onclick = () => input.stepUp();

        card.querySelector(".minus").onclick = () => {

            input.stepDown();

            if (parseInt(input.value) === 0) {

                card.remove();

                if (selectedList.querySelectorAll(".card").length === 0) {

                    const message = document.createElement("div");
                    message.classList.add("empty-message");
                    message.innerText = "There is no Inventory selected";
                    selectedList.appendChild(message);

                }

            }

        };
    }

    // ===============================
    // ADD MENU BUTTON
    // ===============================
    addBtn.addEventListener("click", function (e) {

        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const category = document.getElementById("category").value;
        const description = document.getElementById("description").value.trim();
        const price = document.getElementById("price").value;

        if (!name || !category || !price) {
            alert("Please fill all required fields!");
            return;
        }

        const file = photoInput.files[0];

        if (!file) {
            alert("Please choose an image!");
            return;
        }

        const imagePath = file.name;

        const inventoryItems = [];

        document.querySelectorAll(".selected-list .card").forEach(card => {

            const invName = card.querySelector(".inv-name").innerText;
            const quantity = card.querySelector("input").value;

            inventoryItems.push({
                name: invName,
                quantity: parseFloat(quantity)
            });

        });
        //shwehtet for photo
        const formData = new FormData();

        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("categoryId", category);
        formData.append("photo", file);
        formData.append("inventories", JSON.stringify(inventoryItems));

        fetch("http://localhost:8080/api/menu", {
            method: "POST",
            body: formData
        })
            .then(res => {
                if (!res.ok) throw new Error("Server error");
                return res.text();
            })
            .then(() => {
                alert("Menu saved successfully ✅");
                window.location.href = "/manage_menus";
            })
            .catch(err => {
                console.error(err);
                alert("Failed to save menu ❌");
            });
        // fetch("http://localhost:8080/api/menu", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({
        //         name: name,
        //         description: description,
        //         price: parseFloat(price),
        //         photoUrl: imagePath,
        //         categoryId: parseInt(category),
        //         inventories: inventoryItems
        //     })
        // })
        // .then(res => {
        //     if (!res.ok) {
        //         throw new Error("Server error");
        //     }
        //     return res.text();   // don't force JSON
        // })
        // .then(() => {
        //     alert("Menu saved successfully ✅");
        //     window.location.href = "/manage_menus";
        // })
        // .catch(err => {
        //     console.error(err);
        //     alert("Failed to save menu ❌");
        // });

    });

    // ===============================
    // CANCEL BUTTON
    // ===============================
    cancelBtn.addEventListener("click", function () {
        window.location.href = "/manage_menus";
    });

    // ===============================
    // LOAD CATEGORIES
    // ===============================
    const categoryOptionsContainer = document.getElementById("categoryOptions");

    fetch("http://localhost:8080/api/menu-categories")
        .then(res => res.json())
        .then(categories => {

            categoryOptionsContainer.innerHTML = "";

            categories.forEach(category => {

                const option = document.createElement("div");
                option.classList.add("option");

                option.setAttribute("data-value", category.categoryId);
                option.innerText = category.categoryName;

                categoryOptionsContainer.appendChild(option);

                option.addEventListener("click", () => {

                    selectedCategoryText.innerText = category.categoryName;
                    categoryInput.value = category.categoryId;

                    customCategorySelect.classList.remove("active");
                    selectedCategoryText.style.color = "var(--text-main)";

                });

            });

        });

    // ===============================
    // LOAD INVENTORY
    // ===============================
    fetch("http://localhost:8080/api/inventories")
        .then(res => res.json())
        .then(inventories => {

            inventoryList.innerHTML = "";

            inventories.forEach(inv => {

                const btn = document.createElement("button");
                btn.innerText = inv.itemName;

                inventoryList.appendChild(btn);

                btn.addEventListener("click", () => {
                    addInventoryToSelected(inv.itemName, inv.unit);
                });

            });

        });

});