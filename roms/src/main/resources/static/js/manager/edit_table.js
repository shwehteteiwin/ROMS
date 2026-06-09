document.addEventListener("DOMContentLoaded", function () {

    const nameInput = document.getElementById("table-name");
    const seatInput = document.getElementById("seat-qty");
    const form = document.getElementById("editTableForm");
    const cancelBtn = document.getElementById("cancelBtn");

    // Get table ID from URL
    const params = new URLSearchParams(window.location.search);
    const tableId = params.get("id");

    if (!tableId) {
        window.location.href = "/manageTable";
        return;
    }

    // ================= LOAD TABLE DATA =================
    // fetch(`http://localhost:8080/api/tables`)
    //     .then(res => res.json())
    //     .then(tables => {

    //         const table = tables.find(t => t.tableId == tableId);

    //         if (!table) {
    //             window.location.href = "/manageTable";
    //             return;
    //         }

    //         nameInput.value = table.tableNumber;
    //         seatInput.value = table.capacity;
    //     });
fetch(`http://localhost:8080/api/tables/${tableId}`)
.then(res => res.json())
.then(table => {
    nameInput.value = table.tableNumber;
    seatInput.value = table.capacity;
});
    // ================= UPDATE =================
    form.addEventListener("submit", function (e) {
        e.preventDefault();

       const updatedData = {
    tableNumber: parseInt(nameInput.value.trim()),
    capacity: parseInt(seatInput.value.trim())
};

        fetch(`http://localhost:8080/api/tables/${tableId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedData)
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Update failed");
            }
            return res.json();
        })
        .then(() => {
            alert("Updated Successfully!");
            window.location.href = "/manageTable";
        })
        .catch(err => alert(err.message));
    });

    // ================= CANCEL =================
    cancelBtn.addEventListener("click", function () {
         window.history.back();
    });

});