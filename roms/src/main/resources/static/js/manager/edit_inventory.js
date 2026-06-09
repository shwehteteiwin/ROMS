document.addEventListener("DOMContentLoaded", function () {

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    
    // INPUTS
    
    const nameInput = document.getElementById("inventory-name");
    const qtyInput = document.getElementById("inv-qty");
    const thresholdInput = document.getElementById("inv-threshold");
    const expDateInput = document.getElementById("exp-date");

    const customSelect = document.getElementById("customSelect");
    const selectedUnit = document.getElementById("selectedUnit");
    const hiddenUnit = document.getElementById("unit");

    
    // BUTTONS & MODAL
   
    const updateBtn = document.getElementById("updateBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    const confirmModal = document.getElementById("confirmModal");
    const confirmBtn = document.getElementById("confirmBtn");
    const backBtn = document.getElementById("backBtn");
    const confirmText = document.getElementById("confirmText");

    
    // LOAD EXISTING INVENTORY
 
    if (id) {
        fetch(`http://localhost:8080/api/inventories/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to load inventory");
                return res.json();
            })
            .then(data => {

                nameInput.value = data.itemName;
                qtyInput.value = data.quantity;
                thresholdInput.value = data.lowStockThreshold;
                expDateInput.value = data.expiryDate;

                //  Set unit
                selectedUnit.textContent = data.unit;
                hiddenUnit.value = data.unit;

            })
            .catch(err => alert(err.message));
    }

    // =============================
    // CANCEL
    // =============================
    cancelBtn?.addEventListener("click", function () {
        window.location.href = "/manageInventory";
    });

    // =============================
    // CUSTOM DROPDOWN (SAME AS ADD PAGE)
    // =============================
    if (customSelect) {

        const selectTrigger = customSelect.querySelector(".select-trigger");
        const optionsList = customSelect.querySelector(".options-list");
        const options = customSelect.querySelectorAll(".option");

        // Hide by default
        optionsList.style.display = "none";

        // Toggle dropdown
        selectTrigger.addEventListener("click", function (e) {
            e.stopPropagation();

            optionsList.style.display =
                optionsList.style.display === "block"
                    ? "none"
                    : "block";
        });

        // Select option
        options.forEach(option => {
            option.addEventListener("click", function (e) {
                e.stopPropagation();

                const value = this.getAttribute("data-value");

                selectedUnit.textContent = value;
                hiddenUnit.value = value;

                optionsList.style.display = "none";
            });
        });

        // Close when clicking outside
        document.addEventListener("click", function () {
            optionsList.style.display = "none";
        });
    }

//     if (customSelect) {

//     const selectTrigger = customSelect.querySelector(".select-trigger");
//     const options = customSelect.querySelectorAll(".option");

//     // Toggle dropdown
//     selectTrigger.addEventListener("click", function (e) {
//         e.stopPropagation();
//         customSelect.classList.toggle("active");
//     });

//     // Select option
//     options.forEach(option => {
//         option.addEventListener("click", function (e) {
//             e.stopPropagation();

//             const value = this.getAttribute("data-value");

//             selectedUnit.textContent = value;
//             hiddenUnit.value = value;

//             customSelect.classList.remove("active");
//         });
//     });

//     // Close when clicking outside
//     document.addEventListener("click", function () {
//         customSelect.classList.remove("active");
//     });
// }
    // =============================
    // UPDATE → OPEN CONFIRM MODAL
    // =============================
    updateBtn?.addEventListener("click", function () {

        if (!nameInput.value ||
            !qtyInput.value ||
            !thresholdInput.value ||
            !hiddenUnit.value ||
            !expDateInput.value) {

            alert("Please fill all fields!");
            return;
        }

        confirmText.innerHTML = `
            <strong>Name:</strong> ${nameInput.value}<br>
            <strong>Quantity:</strong> ${qtyInput.value} ${hiddenUnit.value}<br>
            <strong>Threshold:</strong> ${thresholdInput.value}<br>
            <strong>Expiry:</strong> ${expDateInput.value}
        `;

        confirmModal.style.display = "flex";
    });

    // =============================
    // CLOSE MODAL
    // =============================
    backBtn?.addEventListener("click", function () {
        confirmModal.style.display = "none";
    });

    // =============================
    // CONFIRM UPDATE → PUT REQUEST
    // =============================
    confirmBtn?.addEventListener("click", function () {

        const payload = {
            itemName: nameInput.value,
            quantity: parseFloat(qtyInput.value),
            unit: hiddenUnit.value,
            lowStockThreshold: parseFloat(thresholdInput.value),
            expiryDate: expDateInput.value
        };

        fetch(`http://localhost:8080/api/inventories/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (!res.ok) throw new Error("Update failed");
                return res.json();
            })
            .then(() => {
                alert("Inventory Updated Successfully!");
                confirmModal.style.display = "none";
                window.location.href = "/manageInventory";
            })
            .catch(err => alert(err.message));
    });

});