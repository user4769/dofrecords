// ============================================================
// SCRIPT.JS — DOFRECORDS
// Ce fichier gère toutes les animations et interactions
// ============================================================


// ============================================================
// 1. INTERSECTION OBSERVER
// C'est le coeur du script : il "observe" les éléments
// et déclenche leur apparition quand ils entrent dans l'écran
// ============================================================

// On crée l'observateur
const observer = new IntersectionObserver(

  // Cette fonction est appelée à chaque fois qu'un élément
  // observé entre ou sort de l'écran
  (entries) => {
    entries.forEach(entry => {

      // entry.isIntersecting = true si l'élément est visible
      if (entry.isIntersecting) {

        // On ajoute la classe "visible" → déclenche l'animation CSS
        entry.target.classList.add('visible');

        // On arrête d'observer cet élément :
        // l'animation ne se rejoue pas à chaque scroll
        observer.unobserve(entry.target);
      }
    });
  },

  // Options de l'observateur
  {
    threshold: 0.15,
    // L'élément doit être visible à 15% avant de se déclencher
    // Augmente cette valeur pour déclencher plus tard
  }
);


// ============================================================
// 2. ON OBSERVE TOUS LES ÉLÉMENTS ANIMÉS
// On liste tous les éléments qui ont besoin d'apparaître
// au scroll et on les confie à l'observateur
// ============================================================

// querySelectorAll retourne TOUS les éléments qui matchent
const animatedElements = document.querySelectorAll(
  '.section-title, .bio-text, .soundcloud-wrapper, .coming-soon, .booking-email, .social-links'
);

// Pour chaque élément trouvé, on dit à l'observer de le surveiller
animatedElements.forEach(el => observer.observe(el));


// ============================================================
// 3. SCROLL INDICATOR
// La flèche ↓ dans le hero scrolle vers la section About
// quand on clique dessus
// ============================================================

const scrollIndicator = document.querySelector('.scroll-indicator');

if (scrollIndicator) {
  // "if" vérifie que l'élément existe avant d'agir dessus
  // Bonne pratique pour éviter les erreurs

  scrollIndicator.addEventListener('click', () => {
    // addEventListener écoute un événement (ici : un clic)

    const aboutSection = document.querySelector('#about');

    aboutSection.scrollIntoView({
      behavior: 'smooth'
      // Scroll fluide vers la section About
    });
  });
}


// ============================================================
// 4. NAVIGATION AU CLAVIER (ACCESSIBILITÉ)
// La flèche ↓ est aussi activable avec la touche Entrée
// ============================================================

if (scrollIndicator) {
  scrollIndicator.setAttribute('tabindex', '0');
  // tabindex="0" = l'élément est accessible au clavier (touche Tab)

  scrollIndicator.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      document.querySelector('#about').scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
}


// ============================================================
// 5. ANNÉE DYNAMIQUE DANS LE FOOTER
// Met à jour l'année automatiquement chaque année
// Plus besoin de modifier le HTML manuellement !
// ============================================================

const footer = document.querySelector('footer p');

if (footer) {
  const currentYear = new Date().getFullYear();
  // new Date() = date d'aujourd'hui
  // getFullYear() = extrait l'année (ex: 2026)

  footer.textContent = `© ${currentYear} DOFRECORDS — All rights reserved`;
  // Les backticks `` permettent d'insérer une variable
  // dans une chaîne de texte avec ${}
}


// ============================================================
// 6. CONSOLE LOG DE BIENVENUE
// Un petit message dans la console du navigateur
// (clic droit → Inspecter → Console pour le voir)
// Utile pour vérifier que le script est bien chargé
// ============================================================

console.log('%c DOFRECORDS ', 
  'background: #C4806A; color: #0A0A0A; font-weight: bold; font-size: 14px; padding: 4px 8px;'
);
console.log('%c Script chargé ✓', 
  'color: #9A9590; font-size: 11px;'
);

// ============================================================
// CURSEUR CUSTOM
// ============================================================

const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

// Position actuelle de la souris
let mouseX = 0, mouseY = 0;
// Position actuelle du cercle (suit avec retard)
let ringX  = 0, ringY  = 0;

// On écoute le mouvement de la souris
window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Le point suit instantanément
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

// Le cercle suit avec un effet de "lag" fluide
// requestAnimationFrame = s'exécute à chaque frame (60fps)
function animateRing() {
  // Interpolation linéaire (lerp)
  // ringX se rapproche de mouseX de 12% à chaque frame
  // Plus le % est bas, plus le lag est long
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;

  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';

  requestAnimationFrame(animateRing);
  // Boucle infinie — s'appelle elle-même à chaque frame
}
animateRing();

// Effet hover — s'active sur tous les liens et boutons
const hoverTargets = document.querySelectorAll(
  'a, button, .scroll-indicator'
);

hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.classList.add('hovering');
    cursorRing.classList.add('hovering');
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.classList.remove('hovering');
    cursorRing.classList.remove('hovering');
  });
});

// On cache le curseur quand la souris quitte la fenêtre
document.addEventListener('mouseleave', () => {
  cursorDot.style.opacity  = '0';
  cursorRing.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
  cursorDot.style.opacity  = '1';
  cursorRing.style.opacity = '1';
});
