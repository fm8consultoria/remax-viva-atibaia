// depoimentos.js
document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".carousel-track");
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
  
    // mouse down
    track.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
      track.style.cursor = "grabbing";
    });
  
    // mouse leave
    track.addEventListener("mouseleave", () => {
      isDragging = false;
      track.style.cursor = "grab";
    });
  
    // mouse up
    track.addEventListener("mouseup", () => {
      isDragging = false;
      track.style.cursor = "grab";
    });
  
    // mouse move
    track.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 2; // multiplicador para velocidade
      track.scrollLeft = scrollLeft - walk;
    });
  
    // touch events para mobile
    track.addEventListener("touchstart", (e) => {
      isDragging = true;
      startX = e.touches[0].pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
  
    track.addEventListener("touchend", () => {
      isDragging = false;
    });
  
    track.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      const x = e.touches[0].pageX - track.offsetLeft;
      const walk = (x - startX) * 2;
      track.scrollLeft = scrollLeft - walk;
    });
  });  