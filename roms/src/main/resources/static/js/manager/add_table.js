document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("addTableForm");
    const tableNameInput = document.getElementById("table-name");
    const seatQtyInput = document.getElementById("seat-qty");

    const modal = document.getElementById("confirmModal");
    const confirmText = document.getElementById("confirmText");

    const confirmBtn = document.getElementById("confirmBtn");
    const backBtn = document.getElementById("backBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    // ================= FORM SUBMIT =================
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const tableName = tableNameInput.value.trim();
        const seats = seatQtyInput.value.trim();

        if (!tableName || !seats) return;

        confirmText.innerHTML = `
            Table Name: <strong>Table-${tableName}</strong><br>
            Seats: <strong>${seats}</strong>
        `;

        modal.style.display = "flex";
    });

    // ================= CONFIRM → SAVE TO BACKEND =================
//     confirmBtn.addEventListener("click", function () {

//        const tableData = {
//     tableNumber: parseInt(tableNameInput.value.trim()),
//     capacity: parseInt(seatQtyInput.value.trim())
// };

//         fetch("http://localhost:8080/api/tables", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(tableData)
//         })
//         .then(res => {
//             if (!res.ok) {
//                 throw new Error("Failed to add table");
//             }
//             return res.json();
//         })
//         .then(() => {
//             alert("Table Added Successfully!");
//             window.location.href = "/manageTable";
//         })
//         .catch(err => alert(err.message));
//     });
confirmBtn.addEventListener("click", function () {

    const tableNumber = parseInt(tableNameInput.value.trim());
    const capacity = parseInt(seatQtyInput.value.trim());

    if (isNaN(tableNumber) || isNaN(capacity)) {
        alert("Table Number and Capacity must be valid numbers!");
        return;
    }

    const tableData = {
        tableNumber: tableNumber,
        capacity: capacity
    };

    fetch("http://localhost:8080/api/tables", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tableData)
    })
    .then(res => {
        if (!res.ok) {
            return res.text().then(text => { throw new Error(text); });
        }
        return res.json();
    })
    .then(() => {
        alert("Table Added Successfully!");
        window.location.href = "/manageTable";
    })
    .catch(err => alert(err.message));
});

    // ================= MODAL BACK =================
    backBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // ================= CANCEL =================
    cancelBtn.addEventListener("click", function () {
        // form.reset();
        window.history.back();
    });

});