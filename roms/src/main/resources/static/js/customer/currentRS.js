/**
 * Create a custom dropdown for hour or minute
 * @param {string} customId - ID of the custom-select container
 * @param {string} type - "hour" or "minute"
 */
document.querySelector("form").addEventListener("submit", function (e) {

    const hour = document.getElementById("hourInput").value;
    const minute = document.getElementById("minuteInput").value;

    if (!hour && !minute) {
        e.preventDefault();
        alert("Please choose reservation duration.");
    }
});
function createTimeDropdown(customId, type) {

    const custom = document.getElementById(customId);
    if (!custom) return; // Prevent crash if element doesn't exist

    const selected = custom.querySelector(".selected");
    const optionsContainer = custom.querySelector(".options");

    if (!selected || !optionsContainer) return;

    // Clear old options (prevents duplicates on reload)
    optionsContainer.innerHTML = "";

    let options = [];

    // Generate values
    if (type === "hour") {
        options = [0, 1, 2]; // You can change max hours here
    }
    else if (type === "minute") {
        options = Array.from({ length: 60 }, (_, i) =>
            i.toString().padStart(2, "0")
        );
    }

    // Create dropdown options
    options.forEach(value => {
        const option = document.createElement("div");
        option.classList.add("option-item");
        option.textContent = value;

        option.addEventListener("click", () => {
            selected.textContent = value;
            optionsContainer.style.display = "none";

            if (type === "hour") {
                document.getElementById("hourInput").value = value;
            } else {
                document.getElementById("minuteInput").value = value;
            }
        });

        optionsContainer.appendChild(option);
    });

    // Toggle dropdown
    selected.addEventListener("click", (e) => {

        e.stopPropagation();

        // Close all other dropdowns first
        document.querySelectorAll(".options").forEach(opt => {
            if (opt !== optionsContainer) {
                opt.style.display = "none";
            }
        });

        optionsContainer.style.display =
            optionsContainer.style.display === "block"
                ? "none"
                : "block";
    });
}


// Close dropdown if clicking outside
document.addEventListener("click", () => {
    document.querySelectorAll(".options").forEach(opt => {
        opt.style.display = "none";
    });
});


// Initialize dropdowns when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    createTimeDropdown("startHourCustom", "hour");
    createTimeDropdown("startMinuteCustom", "minute");
});
