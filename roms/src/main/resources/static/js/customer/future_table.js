document.addEventListener("DOMContentLoaded", function () {

    const reserveBtn = document.querySelector(".reserve-btn");
    const hiddenInput = document.getElementById("selectedTableId");

    // 🔥 Store multiple selections
    let selectedTable = null;

    document.addEventListener("click", function (e) {

        if (e.target.classList.contains("select-btn")) {

            const button = e.target;
            const tableId = button.getAttribute("data-id");

            const allButtons = document.querySelectorAll(".select-btn");
            allButtons.forEach(btn=>{
                btn.classList.remove("selected-btn");
                btn.textContent = "Select Table";
            });
            selectedTable = tableId;
            hiddenInput.value = tableId;

            button.classList.add("selected-btn");
            button.textContent = "Selected";
        }
    });

    reserveBtn.addEventListener("click", function (e) {

        if (selectedTables) {
            e.preventDefault();
            alert("Please select at least one table.");
        }

        // alert("Tables : " + selectedTables +" reserved successfully!");
        // Let form submit normally
    });

});