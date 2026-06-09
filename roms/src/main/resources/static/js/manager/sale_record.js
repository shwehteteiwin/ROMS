document.addEventListener("DOMContentLoaded", () => {

    let salesData = [];
    let currentView = "daily";

    /* ===============================
       INITIAL LOAD
    =============================== */

    loadData("daily");

    /* ===============================
       CUSTOM SELECT DROPDOWN
    =============================== */

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
                loadData("daily");
            } else {
                loadData("monthly");
            }

        });

    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
        if (!select.contains(e.target)) {
            options.style.display = "none";
        }
    });


    /* =====================================================
       FETCH DATA FROM BACKEND
    ===================================================== */

    async function loadData(type) {

        currentView = type;

        try {

            const response = await fetch(`/api/sales/${type}`, {
                method: "GET",
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Failed to fetch sales data");
            }

            const data = await response.json();

            // Convert backend response into UI format
            salesData = data.map(item => ({
                date: item.period,
                total: item.total
            }));

            if (type === "daily") {
                loadDaily();
            } else {
                loadMonthly();
            }

        } catch (error) {

            console.error("Error loading sales:", error);

            document.getElementById("noRecord").innerText =
                "Failed to load sales data";

        }
    }


    /* =====================================================
       DAILY REPORT
    ===================================================== */

    function loadDaily() {

        const container = document.getElementById("cardContainer");
        const noRecord = document.getElementById("noRecord");

        container.innerHTML = "";
        noRecord.innerText = "";

        if (!salesData || salesData.length === 0) {
            noRecord.innerText = "No Sale Record";
            return;
        }

        // Sort newest first
        const sortedData = [...salesData].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );

        // Header
        container.innerHTML = `
            <div class="card-item header">
                <div class="card-info">
                    <h2 class="name">Date</h2>
                    <h2 class="name">Total Sales</h2>
                </div>
            </div>
        `;

        // Rows
        sortedData.forEach(item => {

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


    /* =====================================================
       MONTHLY REPORT
    ===================================================== */

    function loadMonthly() {

        const container = document.getElementById("cardContainer");
        const noRecord = document.getElementById("noRecord");

        container.innerHTML = "";
        noRecord.innerText = "";

        if (!salesData || salesData.length === 0) {
            noRecord.innerText = "No Sale Record";
            return;
        }

        // Group by month (just in case backend returns daily format)
        const monthlyMap = {};

        salesData.forEach(item => {

            const month = item.date.substring(0, 7); // YYYY-MM

            if (!monthlyMap[month]) {
                monthlyMap[month] = 0;
            }

            monthlyMap[month] += Number(item.total);

        });

        const months = Object.keys(monthlyMap).sort().reverse();

        if (months.length === 0) {
            noRecord.innerText = "No Sale Record";
            return;
        }

        // Header
        container.innerHTML = `
            <div class="card-item header">
                <div class="card-info">
                    <h2 class="name">Month</h2>
                    <h2 class="name">Total Sales</h2>
                </div>
            </div>
        `;

        // Rows
        months.forEach(month => {

            container.innerHTML += `
                <div class="card-item">
                    <div class="card-info">
                        <h3 class="name date">${month}</h3>
                        <h3 class="name total">${monthlyMap[month]}</h3>
                    </div>
                </div>
            `;

        });
    }

});