document.addEventListener("DOMContentLoaded", function () {

    fetch("/api/dashboard/tables")
        .then(response => response.json())
        .then(data => {

            const container = document.querySelector(".table_group");
            container.innerHTML = "";

            data.forEach(table => {
                // hide only OCCUPIED tables
                if (table.status === "OCCUPIED") {
                    return;
                }
                container.innerHTML += `
                    <div class="table_card">
                        <img src="/images/table.jpg" alt="">
                        <div class="card_texts">
                            <h4>Table ${table.tableNumber}</h4>
                            <p>${table.capacity} seats</p>
                            ${table.status === "RESERVED"
                                ? `<button 
                                    class="btn-login-w100 add-btn book-btn reserved-btn"
                                    data-id="${table.tableId}">
                                    Book Now
                                    </button>`
                                : `<button 
                                    class="btn-login-w100 add-btn book-btn"
                                    data-id="${table.tableId}">
                                    Book Now
                                    </button>`
                            }
                        </div>
                    </div>
                `;
            });

            document.addEventListener("click", function (e) {
                if (e.target.classList.contains("book-btn")) {
                    const tableId = e.target.getAttribute("data-id");
                    window.location.href = `/reservations/book-now?tableId=${tableId}`;
                }
            });

        });

});