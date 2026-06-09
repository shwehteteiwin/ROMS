document.addEventListener("DOMContentLoaded", () => {

    /* ---------------- Backed DATA ---------------- */
//zue
    async function loadDaily(){

    const container = document.getElementById("cardContainer");
    const noRecord = document.getElementById("noRecord");

    const response = await fetch("/api/orders/sales?type=daily");
    const salesData = await response.json();

    container.innerHTML = `
        <div class="card-item header">
            <div class="card-info">
                <h2 class="name">Date</h2>
                <h2 class="name">Total Sales</h2>
            </div>
        </div>
    `;

    if(salesData.length === 0){
        noRecord.innerText = "No Sale Record";
        return;
    }

    salesData.forEach(item => {

        const card = document.createElement("div");
        card.classList.add("card-item");

        card.innerHTML = `
            <div class="card-info">
                <h3 class="name date">${item.date}</h3>
                <h3 class="name total">${item.total}</h3>
            </div>
        `;

        container.appendChild(card);

    });

}
//zue

    /* ---------------- CUSTOM SELECT ---------------- */

    const select = document.getElementById("reportSelect");
    const selected = select.querySelector(".selected");
    const options = select.querySelector(".options");
    const optionItems = select.querySelectorAll(".option");

    // Toggle dropdown
    selected.addEventListener("click", () => {
        options.style.display =
            options.style.display === "block" ? "none" : "block";
    });

    // Select option
    optionItems.forEach(option => {

        option.addEventListener("click", () => {

            selected.textContent = option.textContent;

            optionItems.forEach(o => o.classList.remove("active"));
            option.classList.add("active");

            options.style.display = "none";

            const value = option.dataset.value;

            if (value === "daily") {
                loadDaily();
            } else {
                loadMonthly();
            }

        });

    });

    // Close dropdown outside click
    document.addEventListener("click", (e) => {
        if (!select.contains(e.target)) {
            options.style.display = "none";
        }
    });


    /* ---------------- INITIAL LOAD ---------------- */

    loadDaily();


    /* ---------------- FUNCTIONS ---------------- */
//zue
   async function loadMonthly(){

    const container = document.getElementById("cardContainer");
    const noRecord = document.getElementById("noRecord");

    const response = await fetch("/api/orders/sales?type=monthly");
    const salesData = await response.json();

    container.innerHTML = "";
    noRecord.innerText = "";

    if(salesData.length === 0){
        noRecord.innerText = "No Sale Record";
        return;
    }

    container.innerHTML = `
        <div class="card-item header">
            <div class="card-info">
                <h2 class="name">Month</h2>
                <h2 class="name">Total Sales</h2>
            </div>
        </div>
    `;

    salesData.forEach(item => {

        container.innerHTML += `
        <div class="card-item">
            <div class="card-info">
                <h3 class="name date">${item.date}</h3>
                <h3 class="name total">${item.total}</h3>
            </div>
        </div>
        `;

    });
}
//zue
});