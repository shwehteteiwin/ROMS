document.addEventListener("DOMContentLoaded", function () {

    const cardContainer = document.getElementById("cardContainer");
    const totalCountElement = document.getElementById("totalCount");

    // ================================
    // ADD MENU BUTTON
    // ================================
    const addBtn = document.querySelector(".add-btn");

    if (addBtn) {
        addBtn.addEventListener("click", function () {
            window.location.href = "/add-menu";
        });
    }

    // ================================
    // LOAD MENUS FROM BACKEND
    // ================================
    fetch("http://localhost:8080/api/menu")
        .then(res => res.json())
        .then(data => {

            cardContainer.innerHTML = "";

            data.forEach(item => {

                const card = createCard(
                    item.photoUrl,
                    item.name,
                    item.categoryName,
                    item.description,
                    item.id
                );

                cardContainer.appendChild(card);

            });

            updateMenuCount();

        })
        .catch(err => {
            console.error("Menu fetch error:", err);
        });


    // ================================
    // UPDATE MENU COUNT
    // ================================
    function updateMenuCount() {

        const total = document.querySelectorAll(".card-item").length;

        if (totalCountElement) {
            totalCountElement.textContent = `Total Menu Items: ${total}`;
        }

    }


    // ================================
    // CREATE MENU CARD
    // ================================
    function createCard(photo, name, category, description, id) {

        const card = document.createElement("div");
        card.className = "card-item";
        card.dataset.id = id;

        card.innerHTML = `
            <img src="${photo}" alt="${name}">
            <div class="card-text">
                <div class="card-info">
                    <h3 class="name">${name}</h3>
                    <h3 class="category">${category ?? ""}</h3>
                    <h5 class="description">${description ?? ""}</h5>
                </div>
                <div class="btns">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            </div>
        `;

        // Edit Button
        card.querySelector(".edit-btn").addEventListener("click", function () {
            editMenu(id);
        });

        // Delete Button
        card.querySelector(".delete-btn").addEventListener("click", function () {
            deleteMenu(id);
        });

        return card;

    }


    // ================================
    // DELETE MENU
    // ================================
    function deleteMenu(id) {
        const confirmDelete = confirm("Are you sure you want to delete this menu item?");
        if (!confirmDelete) return;

        fetch(`http://localhost:8080/api/menu/${id}`, { method: "DELETE" })
            .then(async res => {
                if (res.ok) return; // success
                // parse JSON error if exists
                let data;
                try {
                    data = await res.json();
                } catch {
                    data = { error: "Delete failed" };
                }
                throw new Error(data.error || "Delete failed");
            })
            .then(() => {
                alert("Menu item deleted successfully ✅");
                location.reload();
            })
            .catch(err => {
                console.error("Delete error:", err);
                alert(`You can't delete menu.The customer already ordered this menu.`);
            });
    }
    // fetch(`http://localhost:8080/api/menu/${id}`, {
    //     method: "DELETE"
    // })
    // .then(res => {

    //     if (!res.ok) {
    //         throw new Error("Delete failed");
    //     }

    //     alert("Menu item deleted successfully ✅");

    //     location.reload();

    // })
    // .catch(err => {

    //     console.error("Delete error:", err);

    //     alert("Failed to delete menu ❌");

    // });




    // ================================
    // EDIT MENU
    // ================================
    function editMenu(id) {

        // Redirect to edit page with menu id
        window.location.href = `/edit-menu?id=${id}`;

    }

});