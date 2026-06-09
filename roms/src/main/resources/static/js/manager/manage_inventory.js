document.addEventListener("DOMContentLoaded", function () {

    const cardContainer = document.getElementById("cardContainer");
    const totalCountElement = document.getElementById("totalCount");
    const addBtn = document.querySelector(".add-btn");

    // Go to Add Page
    addBtn.addEventListener("click", function () {
        window.location.href = "/addInventory";
    });

    loadInventories();

   
    // LOAD INVENTORIES
    
    function loadInventories() {

        fetch("http://localhost:8080/api/inventories")
            .then(async res => {

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(errorText);
                }

                return res.json();
            })
            .then(data => {

                cardContainer.innerHTML = "";

                data.forEach(item => {
                    const card = createCard(item);
                    cardContainer.appendChild(card);
                });

                updateInventoryCount();
            })
            .catch(err => {
                console.error("Load Error:", err);
                alert("Failed to load inventory");
            });
    }

    
    // UPDATE COUNT
    
    function updateInventoryCount() {
        const total = document.querySelectorAll(".card-item").length;
        totalCountElement.textContent = `Total Inventory Items: ${total}`;
    }

    // CREATE CARD
   
    function createCard(item) {

        const card = document.createElement("div");
        card.className = "card-item";

        // card.innerHTML = `
        //     <div class="card-info">
        //         <h3>${item.itemName}</h3>
        //         <p>Quantity: ${item.quantity} ${item.unit}</p>
        //         <p>Low Stock Threshold: ${item.lowStockThreshold}</p>
        //         <p>Expiry Date: ${item.expiryDate}</p>
        //     </div>
        //     <div class="btns">
        //         <button class="edit-btn">Edit</button>
        //         <button class="delete-btn">Delete</button>
        //     </div>
        // `;
       card.innerHTML = `
    <div class="card-info">
        <div class="col name">${item.itemName}</div>
        <div class="col qty">Quantity: ${item.quantity} ${item.unit}</div>
        <div class="col threshold">Low Stock: ${item.lowStockThreshold}</div>
        <div class="col expiry">Expiry: ${item.expiryDate}</div>
    </div>

    <div class="btns">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    </div>
`;
        
// EDIT INVENTORY

card.querySelector(".edit-btn")
    .addEventListener("click", function () {

        window.location.href = `/editInventory?id=${item.inventoryId}`;
});

        // DELETE INVENTORY
        
        // card.querySelector(".delete-btn")
        //     .addEventListener("click", function () {

        //         if (confirm("Delete this inventory?")) {

        //             fetch(`http://localhost:8080/api/inventories/${item.inventoryId}`, {
        //                 method: "DELETE"
        //             })
        //             .then(res => {

        //                 if (!res.ok) {
        //                     throw new Error("Delete failed");
        //                 }

        //                 loadInventories();
        //             })
        //             .catch(err => {
        //                 alert(err.message);
        //             });
        //         }
        //     });

        // return card;
        card.querySelector(".delete-btn")
.addEventListener("click", function () {

    if (confirm("Delete this inventory?")) {

        fetch(`http://localhost:8080/api/inventories/${item.inventoryId}`, {
            method: "DELETE"
        })
       .then(async res => {

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
    }

    loadInventories();
})
        .catch(err => {
            alert(err.message);
        });
    }
}); 
     return card;
    }

});