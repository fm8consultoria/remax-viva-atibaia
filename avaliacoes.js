const track = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const cards = Array.from(track.children);

let cardWidth = cards[0].getBoundingClientRect().width + 20; // largura + margin
let index = 0;

// Touch / Mouse Drag
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID;

// Botões manual
nextBtn.addEventListener('click', () => {
  index++;
  if (index >= cards.length) index = 0;
  moveCarousel();
  resetAutoSlide();
});

prevBtn.addEventListener('click', () => {
  index--;
  if (index < 0) index = cards.length - 1;
  moveCarousel();
  resetAutoSlide();
});

function moveCarousel() {
  currentTranslate = -cardWidth * index;
  prevTranslate = currentTranslate;
  setSliderPosition();
}

// Auto slide a cada 4s
let autoSlide = setInterval(() => {
  index++;
  if (index >= cards.length) index = 0;
  moveCarousel();
}, 4000);

function resetAutoSlide() {
  clearInterval(autoSlide);
  autoSlide = setInterval(() => {
    index++;
    if (index >= cards.length) index = 0;
    moveCarousel();
  }, 4000);
}

// Responsivo: recalcula a largura dos cards
window.addEventListener('resize', () => {
  cardWidth = cards[0].getBoundingClientRect().width + 20;
  moveCarousel();
});

// Touch / Mouse events
track.addEventListener('mousedown', dragStart);
track.addEventListener('mousemove', dragMove);
track.addEventListener('mouseup', dragEnd);
track.addEventListener('mouseleave', dragEnd);
track.addEventListener('touchstart', dragStart);
track.addEventListener('touchmove', dragMove);
track.addEventListener('touchend', dragEnd);

function dragStart(e) {
  isDragging = true;
  startPos = getPositionX(e);
  track.style.transition = 'none';
  cancelAnimationFrame(animationID);
}

function dragMove(e) {
  if (!isDragging) return;
  const currentPosition = getPositionX(e);
  currentTranslate = prevTranslate + currentPosition - startPos;
  setSliderPosition();
}

function dragEnd() {
  if (!isDragging) return;
  isDragging = false;
  track.style.transition = 'transform 0.5s ease-in-out';
  
  // Ajusta para o card mais próximo
  index = Math.round(-currentTranslate / cardWidth);
  if (index < 0) index = 0;
  if (index >= cards.length) index = cards.length - 1;

  moveCarousel();
}

function getPositionX(e) {
  return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
}

function setSliderPosition() {
  track.style.transform = `translateX(${currentTranslate}px)`;
}