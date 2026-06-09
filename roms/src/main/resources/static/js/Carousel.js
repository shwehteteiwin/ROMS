        const track = document.querySelector('.carousel-track');
const cards = Array.from(document.querySelectorAll('.carousel-card'));
const dots = Array.from(document.querySelectorAll('.dot'));
const totalCards = dots.length;

let index = 1; // start on first real card
let cardWidth = document.querySelector('.carousel').offsetWidth;
let interval;

// Update card width dynamically
function updateWidth() {
  cardWidth = document.querySelector('.carousel').offsetWidth;
}

// Set active dot
function setActiveDot(idx) {
  const realIndex = (idx - 1 + totalCards) % totalCards;
  dots.forEach((dot, i) => dot.classList.toggle('active', i === realIndex));
}

// Move to a slide
function moveToIndex(idx, instant = false) {
  track.style.transition = instant ? 'none' : 'transform 0.5s ease-in-out';
  track.style.transform = `translateX(-${cardWidth * idx}px)`;
  setActiveDot(idx);
}

// Loop handling — prevent peeking
function checkLoop() {
  if (index >= cards.length - 1) {
    index = 1;
    // double requestAnimationFrame to force jump after transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => moveToIndex(index, true));
    });
  }
  if (index <= 0) {
    index = totalCards;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => moveToIndex(index, true));
    });
  }
}

// Next slide
function nextSlide() {
  index++;
  moveToIndex(index);
}

// Dot navigation
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    index = i + 1;
    moveToIndex(index);
    resetAutoSlide();
  });
});

// Auto-slide
function startAutoSlide() {
  interval = setInterval(nextSlide, 4000);
}
function resetAutoSlide() {
  clearInterval(interval);
  setTimeout(startAutoSlide, 1000);
}

// Initialize
updateWidth();
moveToIndex(index, true);
startAutoSlide();

// Event listeners
track.addEventListener('transitionend', checkLoop);
window.addEventListener('resize', () => {
  updateWidth();
  moveToIndex(index, true);
});
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    updateWidth();
    moveToIndex(index, true);
    resetAutoSlide();
  } else clearInterval(interval);
});
