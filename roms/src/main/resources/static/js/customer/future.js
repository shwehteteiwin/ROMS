document.addEventListener("DOMContentLoaded", () => {
  function closeAllDropdowns() {
    document.querySelectorAll(".custom-select .options").forEach(opt => {
      opt.style.display = "none";
    });
  }

  function createTimeDropdown(customId, type) {
    const custom = document.getElementById(customId);
    if (!custom) return;

    const optionsContainer = custom.querySelector(".options");
    if (!optionsContainer) return;

    let options = [];

    if (type === "hour")
      options = Array.from({ length: 12 }, (_, i) => i + 1);
    else if (type === "minute")
      options = Array.from({ length: 60 }, (_, i) =>
        i.toString().padStart(2, "0")
      );
    else if (type === "ampm")
      options = ["AM", "PM"];

    options.forEach(value => {
      const option = document.createElement("div");
      option.textContent = value;

      option.onclick = () => {
        custom.querySelector(".selected").textContent = value;
        closeAllDropdowns();
      };

      optionsContainer.appendChild(option);
    });

    // Toggle dropdown
    custom.querySelector(".selected").addEventListener("click", (e) => {
      e.stopPropagation();

      const isOpen = optionsContainer.style.display === "block";

      closeAllDropdowns(); // close everything first

      if (!isOpen) {
        optionsContainer.style.display = "block";
      }
    });
  }

  createTimeDropdown("startHourCustom", "hour");
  createTimeDropdown("startMinuteCustom", "minute");
  createTimeDropdown("startAmPmCustom", "ampm");

  createTimeDropdown("endHourCustom", "hour");
  createTimeDropdown("endMinuteCustom", "minute");
  createTimeDropdown("endAmPmCustom", "ampm");

  document.addEventListener("click", () => {
    closeAllDropdowns();
  });
  document.querySelector(".search-table").addEventListener("click", () => {

      const date = document.getElementById("myDate").value;

      const startHour = document.querySelector("#startHourCustom .selected").textContent;
      const startMinute = document.querySelector("#startMinuteCustom .selected").textContent;
      const startAmPm = document.querySelector("#startAmPmCustom .selected").textContent;

      const endHour = document.querySelector("#endHourCustom .selected").textContent;
      const endMinute = document.querySelector("#endMinuteCustom .selected").textContent;
      const endAmPm = document.querySelector("#endAmPmCustom .selected").textContent;

      if (!date || startHour === "Hour" || endHour === "Hour") {
          alert("Please complete all date and time fields.");
          return;
      }

      // 🔥 Convert to 24-hour format
      let sHour = parseInt(startHour);
      let eHour = parseInt(endHour);

      if (startAmPm === "PM" && sHour !== 12) sHour += 12;
      if (startAmPm === "AM" && sHour === 12) sHour = 0;

      if (endAmPm === "PM" && eHour !== 12) eHour += 12;
      if (endAmPm === "AM" && eHour === 12) eHour = 0;

      const selectedStart = new Date(`${date}T${String(sHour).padStart(2, "0")}:${startMinute}:00`);
      const selectedEnd = new Date(`${date}T${String(eHour).padStart(2, "0")}:${endMinute}:00`);

      const now = new Date();

      // 🚫 Prevent past time for today
      // const today = now.toISOString().split("T")[0];
      const today = now.getFullYear() + "-" +
      String(now.getMonth() + 1).padStart(2, "0") + "-" +
      String(now.getDate()).padStart(2, "0");

      if (date === today && selectedStart < now) {
          alert("You cannot select a past time for today.");
          return;
      }

      // 🚫 Prevent end before start
      if (selectedEnd <= selectedStart) {
          alert("End time must be after start time.");
          return;
      }

      // Send to backend
      const params = new URLSearchParams({
          date,
          startHour,
          startMinute,
          startAmPm,
          endHour,
          endMinute,
          endAmPm
      });

      window.location.href = `/reservations/future-tables?${params.toString()}`;
  });
  // document.addEventListener("click", function (e) {
  //     if (e.target.classList.contains("search-table")) {
  //         // const tableId = e.target.getAttribute("data-id");
  //         window.location.href = `/reservations/future-tables`;
  //     }
  // });
});