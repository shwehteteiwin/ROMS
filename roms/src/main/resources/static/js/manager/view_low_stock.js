// document.addEventListener("DOMContentLoaded", function () {

//     const cardContainer = document.getElementById("cardContainer");
//     const lowStockCount = document.getElementById("lowStockCount");

//     loadLowStock();

//     function loadLowStock() {

//         fetch("http://localhost:8080/api/inventories")
//         .then(res => res.json())
//         .then(data => {

//             cardContainer.innerHTML = "";

//             let count = 0;

//             data.forEach(item => {

//                 // CHECK LOW STOCK
//                  if (item.quantity <= item.lowStockThreshold) {

//                     const card = createCard(item);
//                     cardContainer.appendChild(card);

//                     count++;
//                  }
//             });

//             lowStockCount.textContent = `Low Stock Items: ${count}`;

//         })
//         .catch(err => {
//             console.error(err);
//             alert("Failed to load low stock items");
//         });
//     }

//     function createCard(item) {

//         const card = document.createElement("div");
//         card.className = "card-item";

//         card.innerHTML = `
//             <div class="card-info">
//                 <h3>${item.itemName}</h3>
//                 <p>Quantity: ${item.quantity}</p>
//                 <p>Expiry Date: ${item.expiryDate}</p>
//             </div>
//         `;

//         return card;
//     }

// });
document.addEventListener("DOMContentLoaded", function () {

    const cardContainer = document.getElementById("cardContainer");
    const lowStockCount = document.getElementById("lowStockCount");

    loadLowStock();

    function loadLowStock() {

        fetch("http://localhost:8080/api/inventories/lowstock")
        .then(res => res.json())
        .then(data => {

            cardContainer.innerHTML = "";

            let count = 0;

            data.forEach(item => {

                const card = createCard(item);
                cardContainer.appendChild(card);

                count++;
            });

            lowStockCount.textContent = `Low Stock Items: ${count}`;

        })
        .catch(err => {
            console.error(err);
            alert("Failed to load low stock items");
        });
    }

    function createCard(item) {

        const card = document.createElement("div");
        card.className = "card-item";

        card.innerHTML = `
            <div class="card-info">
                <h3>${item.itemName}</h3>
                <p>Quantity: ${item.quantity}</p>
                <p>Expiry Date: ${item.expiryDate}</p>
            </div>
        `;

        return card;
    }

});