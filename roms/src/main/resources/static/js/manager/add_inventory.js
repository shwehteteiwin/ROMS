
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("addInventoryForm");

    const addBtn = document.getElementById("addBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    const confirmModal = document.getElementById("confirmModal");
    const confirmBtn = document.getElementById("confirmBtn");
    const backBtn = document.getElementById("backBtn");
    const confirmText = document.getElementById("confirmText");

    const nameInput = document.getElementById("inventory-name");
    const qtyInput = document.getElementById("inv-qty");
    const thresholdInput = document.getElementById("inv-threshold");
    const expDateInput = document.getElementById("exp-date");
    const hiddenUnit = document.getElementById("unit");

    // CANCEL BUTTON
  
    cancelBtn.addEventListener("click", function () {
        window.history.back();
    });

    
    // CUSTOM UNIT SELECT (CLEAN VERSION)

    const customSelect = document.getElementById("customSelect");
    const selectTrigger = customSelect.querySelector(".select-trigger");
    const options = customSelect.querySelectorAll(".option");
    const selectedUnit = document.getElementById("selectedUnit");

    // Toggle dropdown
    selectTrigger.addEventListener("click", function (e) {
        e.stopPropagation();
        customSelect.classList.toggle("active");
    });

    // Select option
    options.forEach(option => {
        option.addEventListener("click", function (e) {
            e.stopPropagation();

            const value = this.getAttribute("data-value");

            selectedUnit.textContent = value;
            hiddenUnit.value = value;

            customSelect.classList.remove("active");
        });
    });

    // Close when clicking outside
    document.addEventListener("click", function (e) {
        if (!customSelect.contains(e.target)) {
            customSelect.classList.remove("active");
         
        }
    });

    
    // ADD BUTTON → OPEN CONFIRM MODAL

    addBtn.addEventListener("click", function () {

        // Always close dropdown first
        customSelect.classList.remove("active");
        document.activeElement.blur();

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
            <strong>Expiry Date:</strong> ${expDateInput.value}
        `;

        confirmModal.style.display = "flex";
    });

    
    // BACK BUTTON (MODAL CANCEL)
   
    backBtn.addEventListener("click", function () {
        confirmModal.style.display = "none";
    });

    
    // CONFIRM BUTTON → SEND TO BACKEND
  
    confirmBtn.addEventListener("click", function () {

        const payload = {
            itemName: nameInput.value,
            quantity: parseFloat(qtyInput.value),
            unit: hiddenUnit.value,
            lowStockThreshold: parseFloat(thresholdInput.value),
            expiryDate: expDateInput.value
        };

        fetch("http://localhost:8080/api/inventories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        .then(async res => {
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText);
            }
            return res.json();
        })
        .then(() => {
            alert("Inventory Added Successfully!");

            // RESET FORM
            form.reset();

            // Reset custom select manually
            hiddenUnit.value = "";
            selectedUnit.textContent = "Choose Unit";

            confirmModal.style.display = "none";
            window.location.href = "/manageInventory";
        })
        .catch(err => {
            alert("Add Failed: " + err.message);
        });
    });

});