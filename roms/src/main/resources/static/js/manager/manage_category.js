
document.addEventListener("DOMContentLoaded", function () {

    const cardContainer = document.getElementById("cardContainer");
    const totalCountElement = document.getElementById("totalCount");
    const addBtn = document.querySelector(".add-btn");
     if (addBtn) {
        addBtn.addEventListener("click", function () {
            window.location.href = "/addCategory";
        });
    }

    loadCategories();

    function loadCategories() {
        fetch("http://localhost:8080/api/menu-categories")
            .then(res => res.json())
            .then(data => {

                cardContainer.innerHTML = "";

                data.forEach(category => {
                    const card = createCard(category);
                    cardContainer.appendChild(card);
                });

                updateCategoryCount();
            });
    }

    function updateCategoryCount() {
        const total = document.querySelectorAll(".card-item").length;
        totalCountElement.textContent = `Total Categories: ${total}`;
    }

    function createCard(category) {

        const card = document.createElement("div");
        card.className = "card-item";

        card.innerHTML = `
            <div class="card-info">
                <h3 class="name">${category.categoryName}</h3>
            </div>
            <div class="btns">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        // EDIT
        card.querySelector(".edit-btn").addEventListener("click", function () {
            window.location.href = `editCategory?id=${category.categoryId}`;
        });

        // DELETE
        card.querySelector(".delete-btn").addEventListener("click", function () {

            if (confirm("Are you sure?")) {

                fetch(`http://localhost:8080/api/menu-categories/${category.categoryId}`, {
                    method: "DELETE",
                    // credentials: "include"
                })
                .then(() => loadCategories());
            }
        });

        return card;
    }

});