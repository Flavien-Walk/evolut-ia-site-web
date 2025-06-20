// Sélectionner les boutons
const joinButton = document.querySelector('.primary-btn');
const learnMoreButton = document.querySelector('.secondary-btn');

// Ajouter les événements de clic
joinButton.addEventListener('click', () => {
    window.location.href = "/"; // Remplacez ce lien par celui de votre page d'inscription
});

learnMoreButton.addEventListener('click', () => {
    window.location.href = "#"; // Remplacez cela par l'ID d'une section pour plus d'informations
});








const track = document.querySelector('.carousel-track');
let cards = document.querySelectorAll('.testimonial-card');
let slideWidth = 0;
let index = 0;

// Fonction pour calculer la largeur exacte d'une "slide"
function updateSlideWidth() {
  cards = document.querySelectorAll('.testimonial-card');
  if (cards.length > 0) {
    const style = window.getComputedStyle(cards[0]);
    const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    slideWidth = cards[0].offsetWidth + margin;
  }
}

// Cloner les deux premières cartes
function cloneSlides() {
  for (let i = 0; i < 2; i++) {
    const clone = cards[i].cloneNode(true);
    track.appendChild(clone);
  }
}

function showNextSlide() {
  index++;
  track.style.transform = `translateX(-${index * slideWidth}px)`;

  if (index >= cards.length) {
    setTimeout(() => {
      track.style.transition = 'none';
      track.style.transform = 'translateX(0px)';
      index = 0;
      void track.offsetWidth; // reflow
      track.style.transition = 'transform 0.8s ease-in-out';
    }, 800);
  }
}

// Initialiser quand la page est prête
window.addEventListener('load', () => {
  updateSlideWidth();
  cloneSlides();
  setInterval(showNextSlide, 6000);
});

// Recalcul si redimensionnement de la fenêtre
window.addEventListener('resize', () => {
  updateSlideWidth();
});
