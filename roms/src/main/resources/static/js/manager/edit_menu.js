document.addEventListener("DOMContentLoaded", () => {

    // ------------------------------
    // ELEMENTS
    // ------------------------------
    const itemName = document.getElementById("item-name");
    const priceInput = document.getElementById("price");
    const descriptionInput = document.getElementById("description");
    const categoryInput = document.getElementById("category");
    const selectedCategoryText = document.getElementById("selectedCategory");
    const selectedList = document.querySelector(".selected-list");
    const photoInput = document.getElementById("photo");
    const photoPreview = document.getElementById("photoPreview");
    const addBtn = document.getElementById("addBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    const customSelect = document.getElementById("customCategorySelect");
    const selectTrigger = customSelect.querySelector(".select-trigger");
    const categoryOptionsContainer = customSelect.querySelector(".options-list");

    const inventoryList = document.querySelector(".inventory-list");

    let allInventories = [];
    let menuInventories = [];

    const params = new URLSearchParams(window.location.search);
    const menuId = params.get("id");
    if (!menuId) { alert("Menu ID not found!"); return; }

    // ------------------------------
    // FETCH ALL INVENTORIES
    // ------------------------------
    fetch("/api/inventories")
        .then(res => res.json())
        .then(data => {
            allInventories = data;
            fetchMenu();
        })
        .catch(err => console.error("Error fetching inventories:", err));

    // ------------------------------
    // FETCH MENU DATA
    // ------------------------------
    function fetchMenu() {
        fetch(`/api/menu/manager/${menuId}`)
            .then(res => res.json())
            .then(menu => {
                itemName.value = menu.name;
                priceInput.value = menu.price;
                descriptionInput.value = menu.description;

                menuInventories = menu.inventories || [];
                loadInventory(menuInventories);
                renderInventoryButtons(allInventories, menuInventories);

                loadCategories(menu.categoryId, menu.categoryName);

                if (photoPreview && menu.photoUrl) photoPreview.src = menu.photoUrl;
            })
            .catch(err => console.error("Menu load error:", err));
    }

    // ------------------------------
    // CATEGORY DROPDOWN
    // ------------------------------
    selectTrigger.addEventListener("click", () => customSelect.classList.toggle("active"));
    document.addEventListener("click", e => {
        if (!customSelect.contains(e.target)) customSelect.classList.remove("active");
    });

    function loadCategories(selectedCategoryId, selectedCategoryName = null) {
        fetch("/api/menu-categories")
            .then(res => res.json())
            .then(categories => {
                categoryOptionsContainer.innerHTML = "";

                categories.forEach(category => {
                    const option = document.createElement("div");
                    option.classList.add("option");
                    option.setAttribute("data-value", category.categoryId);
                    option.innerText = category.categoryName;

                    option.addEventListener("click", () => {
                        selectedCategoryText.innerText = category.categoryName;
                        categoryInput.value = category.categoryId;
                        customSelect.classList.remove("active");
                        selectedCategoryText.style.color = "var(--text-main)";
                    });

                    categoryOptionsContainer.appendChild(option);
                });

                // Set selected category
                if (selectedCategoryId) {
                    const selectedCategory = categories.find(c => c.categoryId == selectedCategoryId);
                    if (selectedCategory) {
                        selectedCategoryText.innerText = selectedCategory.categoryName;
                        categoryInput.value = selectedCategory.categoryId;
                        selectedCategoryText.style.color = "var(--text-main)";
                    }
                } else {
                    selectedCategoryText.innerText = "Choose Category...";
                    categoryInput.value = "";
                    selectedCategoryText.style.color = "var(--text-muted)";
                }
            })
            .catch(err => console.error("Category load error:", err));
    }

    // ------------------------------
    // INVENTORY HANDLING
    // ------------------------------
    function loadInventory(inventoryArray) {
        selectedList.innerHTML = "";
        if (!inventoryArray || inventoryArray.length === 0) {
            selectedList.innerHTML = `<div class="empty-message">There is no Inventory selected</div>`;
            return;
        }
        inventoryArray.forEach(item => addInventoryCard(item));
    }

    function checkEmptyState() {
        const cards = selectedList.querySelectorAll(".card");
        const emptyMessage = selectedList.querySelector(".empty-message");
        if (cards.length === 0 && !emptyMessage) {
            const message = document.createElement("div");
            message.classList.add("empty-message");
            message.innerText = "There is no Inventory selected";
            selectedList.appendChild(message);
        } else if (cards.length > 0 && emptyMessage) {
            emptyMessage.remove();
        }
    }

    function renderInventoryButtons(all, selected) {
        inventoryList.innerHTML = "";
        all.forEach(inv => {
            if (selected.some(s => Number(s.id) === inv.inventoryId)) return;
            const btn = document.createElement("button");
            btn.innerText = inv.itemName;
            btn.setAttribute("data-unit", inv.unit);
            inventoryList.appendChild(btn);

            btn.addEventListener("click", () => {
                addInventoryCard({ id: inv.inventoryId, name: inv.itemName, quantity: 1, unit: inv.unit });
                btn.remove();
            });
        });
    }

    function addInventoryCard(inv) {
        // Prevent duplicates
        if ([...selectedList.querySelectorAll(".inv-name")].some(el => el.innerText === inv.name)) return;

        const emptyMessage = selectedList.querySelector(".empty-message");
        if (emptyMessage) emptyMessage.remove();

        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.id = inv.id;
        card.dataset.name = inv.name;
        card.innerHTML = `
            <div class="inv-name">${inv.name}</div>
            <div class="qty-box">
                <button class="minus">-</button>
                <input type="number" value="${inv.quantity || 1}" min="0">
                <button class="plus">+</button>
            </div>
            <div class="inv-unit">${inv.unit}</div>
        `;
        selectedList.appendChild(card);

        const input = card.querySelector("input");
        card.querySelector(".plus").onclick = () => input.stepUp();
        card.querySelector(".minus").onclick = () => {
            input.stepDown();
            if (parseInt(input.value) === 0) {
                card.remove();
                renderInventoryButtons(allInventories, getSelectedInventory());
                checkEmptyState();
            }
        };
        input.addEventListener("input", () => {
            if (parseInt(input.value) === 0) {
                card.remove();
                renderInventoryButtons(allInventories, getSelectedInventory());
                checkEmptyState();
            }
        });

        checkEmptyState();
    }

    function getSelectedInventory() {
        return Array.from(selectedList.querySelectorAll(".card")).map(card => ({
            id: Number(card.dataset.id),
            quantity: Number(card.querySelector("input").value)
        }));
    }

    // ------------------------------
    // PHOTO PREVIEW
    // ------------------------------
    // if (photoInput && photoPreview) {
    //     photoInput.addEventListener("change", () => {
    //         if (photoInput.files && photoInput.files[0]) {
    //             const reader = new FileReader();
    //             reader.onload = e => photoPreview.src = e.target.result;
    //             reader.readAsDataURL(photoInput.files[0]);
    //         }
    //     });
    // }
    // PHOTO INPUT DISPLAY
    const fileNameSpan = document.getElementById("file-name");

    if (photoInput) {
        photoInput.addEventListener("change", () => {
            const file = photoInput.files[0];
            if (file) {
                fileNameSpan.textContent = file.name; // <-- show file name
                // optional: show preview
                if (photoPreview) {
                    const reader = new FileReader();
                    reader.onload = e => photoPreview.src = e.target.result;
                    reader.readAsDataURL(file);
                }
            } else {
                fileNameSpan.textContent = "No file chosen";
            }
        });
    }

    // ------------------------------
    // UPDATE MENU
    // ------------------------------
    addBtn.addEventListener("click", async () => {
        const inventories = getSelectedInventory().map(inv => {
            const card = selectedList.querySelector(`.card[data-id='${inv.id}']`);
            return {
                id: inv.id,
                name: card.dataset.name,
                quantity: inv.quantity.toString()
            };
        });

        if (!itemName.value || !priceInput.value || !categoryInput.value) {
            alert("Name, price, and category are required!");
            return;
        }

        const formData = new FormData();
        formData.append("name", itemName.value.trim());
        formData.append("description", descriptionInput.value.trim());
        formData.append("price", parseFloat(priceInput.value));
        formData.append("categoryId", parseInt(categoryInput.value));
        formData.append("inventories", JSON.stringify(inventories));

        if (photoInput.files[0]) formData.append("photo", photoInput.files[0]);

        try {
            const res = await fetch(`/api/menu/manager/${menuId}`, { method: "PUT", body: formData });

            if (!res.ok) {
                const text = await res.text();
                console.error("Server response:", text);
                // Only alert if there really is an error
                if (text) {
                    alert("Update failed:\n" + text);
                }
                return;
            }

            // ✅ Success
            alert("Menu updated successfully!");
            window.location.href = "/manage_menus";

        } catch (err) {
            console.error("Fetch error:", err);
            alert("Update failed. See console for details.");
        }
    });


    cancelBtn.addEventListener("click", () => window.location.href = "/manage_menus");

});