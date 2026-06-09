const openBtn = document.getElementById("openPopup");
const closeBtn = document.getElementById("closePopup");
const popup = document.getElementById("popupBox");
const overlay = document.getElementById("overlay");
const pageContent = document.getElementById("pageContent");
// const openMenu = document.getElementById("openMenu");

openBtn.addEventListener("click", () => {
    popup.classList.add("active");
    overlay.classList.add("active");
    pageContent.classList.add("inactive");
});

closeBtn.addEventListener("click", () => {
    popup.classList.remove("active");
    overlay.classList.remove("active");
    pageContent.classList.remove("inactive");
});

function openMenuPage(){
    window.location.href="./customer/menu.html";
}