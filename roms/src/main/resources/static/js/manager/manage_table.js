document.addEventListener("DOMContentLoaded", function () {

    const cardContainer = document.getElementById("cardContainer");
    const totalCountElement = document.getElementById("totalCount");
    const addBtn = document.querySelector(".add-btn");

    // ===============================
    // LOAD TABLES FROM BACKEND
    // ===============================
    function loadTables() {

        fetch("http://localhost:8080/api/tables")
            .then(res => res.json())
            .then(tables => {

                cardContainer.innerHTML = "";

                tables.forEach(table => {
                    const card = createCard(table);
                    cardContainer.appendChild(card);
                });

                updateTableCount();
            })
            .catch(err => console.error("Error loading tables:", err));
    }

    loadTables();

    // ===============================
    // UPDATE TOTAL COUNT
    // ===============================
    function updateTableCount() {
        const total = document.querySelectorAll(".card-item").length;
        totalCountElement.textContent = `Total Tables: ${total}`;
    }

    // ===============================
    // ADD TABLE BUTTON
    // ===============================
    addBtn.addEventListener("click", function () {
        window.location.href = "/addTable";
    });

    // ===============================
    // CREATE CARD FROM BACKEND DATA
    // ===============================
    function createCard(table) {

        const card = document.createElement("div");
        card.className = "card-item";

        card.innerHTML = `
            <div class="card-info">
                <h3>Table-${table.tableNumber}</h3>
                <h4>${table.capacity} seats</h4>
                <p>Status: ${table.status}</p>
            </div>

            <div class="btns">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        // ================= EDIT =================
        card.querySelector(".edit-btn").addEventListener("click", function () {
            window.location.href = `/editTable?id=${table.tableId}`;
        });

        // ================= DELETE =================
        //     card.querySelector(".delete-btn").addEventListener("click", function () {

        //         if (!confirm("Are you sure?")) return;

        //         fetch(`http://localhost:8080/api/tables/${table.tableId}`, {
        //             method: "DELETE"
        //         })
        //         .then(() => loadTables());
        //     });

        //     return card;
        // }
        card.querySelector(".delete-btn").addEventListener("click", function () {

            if (!confirm("Are you sure?")) return;

            fetch(`http://localhost:8080/api/tables/${table.tableId}`, {
                method: "DELETE"
            })
                .then(res => {
                    if (!res.ok) {
                        return res.text().then(msg => { throw new Error(msg); });
                    }
                    return res.text();
                })
                .then(() => {
                    alert("Table deleted successfully");
                    loadTables();
                })
                .catch(err => {
                    alert(err.message);
                });

        });
        return card; 
    }

});