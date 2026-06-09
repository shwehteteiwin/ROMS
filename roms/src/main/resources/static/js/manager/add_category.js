
// =============================
// Get Elements
// =============================
console.log("Confirm button clicked");
const form = document.getElementById("addCategoryForm");
const categoryInput = document.getElementById("category-name");

const modal = document.getElementById("confirmModal");
const confirmText = document.getElementById("confirmText");

const confirmBtn = document.getElementById("confirmBtn");
const backBtn = document.getElementById("backBtn");
const cancelBtn = document.getElementById("cancelBtn");


// Cancel Button → Go Back

cancelBtn.addEventListener("click", function () {
    // Go back to previous page
    window.history.back();
});


// STEP 1: Submit Form → Open Modal

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const categoryName = categoryInput.value.trim();

    if (categoryName === "") {
        alert("Category name cannot be empty!");
        return;
    }

    confirmText.innerHTML = `Category Name: <strong>${categoryName}</strong>`;

    // Show modal
    modal.style.display = "flex";
});


// STEP 2: Confirm → Send Data To Backend

confirmBtn.addEventListener("click", function () {

    const categoryName = categoryInput.value.trim();

    if (categoryName === "") return;

    fetch("http://localhost:8080/api/menu-categories", {
        method: "POST",
        // credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            categoryName: categoryName
        })
    })
    .then(response => {
        console.log("Status:", response.status);
        if (!response.ok) {
            throw new Error("Failed to add category");
        }
        return response.json();
    })
    .then(data => {
        alert("Category added successfully!");

        // Close modal
        modal.style.display = "none";

        // Redirect to manage page
        window.location.href = "/manageCategory";
    })
    .catch(error => {
        alert("Error: " + error.message);
    });
});


// STEP 3: Cancel Inside Modal

backBtn.addEventListener("click", function () {
    modal.style.display = "none";
});


// Optional: Close modal when clicking outside

window.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});