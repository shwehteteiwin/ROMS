const menuItems = document.querySelectorAll(".menu-item");

menuItems.forEach(item => {

item.addEventListener("click", function(){

menuItems.forEach(link=>{
link.classList.remove("active");
});

this.classList.add("active");

});

});