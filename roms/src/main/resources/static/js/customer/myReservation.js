window.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll(".cancel-btn").forEach(button => {
        button.addEventListener("click", function () {

            const form = this.closest("form");

            const confirmCancel = confirm(
                "Are you sure you want to cancel this reservation?"
            );

            if (confirmCancel) {
                form.submit();
            }
        });
    });

    const successMessage = document.getElementById("successMessage");
    const errorMessage = document.getElementById("errorMessage");

    if (successMessage) {
        alert(successMessage.value);
    }

    if (errorMessage) {
        alert(errorMessage.value);
    }
});
// window.addEventListener("DOMContentLoaded", () => {

//     // Handle cancel button click
//     document.querySelectorAll(".cancel-btn").forEach(button => {

//         button.addEventListener("click", function () {

//             const form = this.closest("form");

//             // 🔥 Confirmation dialog
//             // const confirmCancel = confirm(
//             //     "Are you sure you want to cancel this reservation?"
//             // );

//             if (!confirmCancel) {
//                 // User canceled the confirmation
//                 // window.location.href = "/reservations/myReservation";
//                 return;
//             }

//             // If confirmed → submit form
//             // form.submit();
//             if (confirmCancel) {
//                 form.submit();
//             }
//         });
//     });

//     // 🔥 Show backend messages (success or error)
//     const successMessage = document.getElementById("successMessage");
//     const errorMessage = document.getElementById("errorMessage");

//     if (successMessage) {
//         alert(successMessage.value);
//         window.location.href = "/reservations/myReservation";
//     }

//     if (errorMessage) {
//         alert(errorMessage.value);
//         window.location.href = "/reservations/myReservation";
//     }

// });