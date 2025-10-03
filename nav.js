document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.createElement("div");
    hamburger.classList.add("hamburger");
    hamburger.innerHTML = "<span></span><span></span><span></span>";
  
    const nav = document.querySelector("nav.primary");
    nav.parentNode.insertBefore(hamburger, nav);
  
    const menu = nav.querySelector("ul");
  
    // Abrir/fechar menu ao clicar no hamburger
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      menu.classList.toggle("show");
    });
  
    // Fechar menu ao clicar em um link
    menu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        menu.classList.remove("show");
        hamburger.classList.remove("active");
      });
    });
  });  