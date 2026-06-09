document.addEventListener("DOMContentLoaded", function () {

    const input = document.getElementById("category-name");
    const idInput = document.getElementById("category-id");
    const form = document.getElementById("editCategoryForm");
    const cancelBtn = document.getElementById("cancelBtn");

    // ===============================
    // GET ID FROM URL
    // ===============================
    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get("id");

    console.log("Editing ID:", categoryId);

    if (!categoryId) {
        alert("Category ID not found!");
        window.location.href = "/manageCategory";
        return;
    }

    idInput.value = categoryId;

    // ===============================
    // LOAD CATEGORY FROM BACKEND
    // ===============================
    fetch(`http://localhost:8080/api/menu-categories/${categoryId}`)
        .then(res => {
            console.log("GET Status:", res.status);

            if (!res.ok) {
                throw new Error("Failed to load category. Status: " + res.status);
            }

            return res.text(); // 🔥 safe mode
        })
        .then(text => {

            console.log("GET Response:", text);

            const data = JSON.parse(text);

            // ✅ Fill input with data
            input.value = data.categoryName;
        })
        .catch(err => {
            console.log("GET ERROR:", err);
            alert("Error loading category:\n" + err.message);
        });

    // ===============================
    // UPDATE CATEGORY (PUT)
    // ===============================
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const updatedName = input.value.trim();

        if (updatedName === "") {
            alert("Category name cannot be empty!");
            return;
        }

        fetch(`http://localhost:8080/api/menu-categories/${categoryId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                categoryName: updatedName
            })
        })
        .then(async res => {

            console.log("UPDATE Status:", res.status);

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Update failed");
            }

            return res.text();
        })
        .then(() => {
            alert("Category updated successfully!");
            window.location.href = "/manageCategory";
        })
        .catch(err => {
            console.log("UPDATE ERROR:", err);
            alert("Update Error:\n" + err.message);
        });
    });

    // ===============================
    // CANCEL BUTTON
    // ===============================
    cancelBtn.addEventListener("click", function () {
        window.history.back();
    });

});