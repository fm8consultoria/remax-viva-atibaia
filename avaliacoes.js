const track = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const cards = Array.from(track.children);

let cardWidth = cards[0].getBoundingClientRect().width + 20; // largura + margin
let index = 0;

// Botões manual
nextBtn.addEventListener('click', () => {
  index++;
  if(index >= cards.length) index = 0;
  moveCarousel();
});

prevBtn.addEventListener('click', () => {
  index--;
  if(index < 0) index = cards.length - 1;
  moveCarousel();
});

function moveCarousel() {
  track.style.transform = `translateX(${-cardWidth * index}px)`;
}

// Auto slide a cada 4s
setInterval(() => {
  index++;
  if(index >= cards.length) index = 0;
  moveCarousel();
}, 4000);

// Responsivo: recalcula a largura dos cards
window.addEventListener('resize', () => {
  cardWidth = cards[0].getBoundingClientRect().width + 20;
  moveCarousel();
});