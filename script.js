// ============================================================
// SCRIPT.JS — DOFRECORDS
// Ce fichier gère toutes les animations et interactions
// ============================================================

// ============================================================
// LOADER — Barre de chargement
// À mettre EN PREMIER dans le script
// ============================================================

const loader    = document.querySelector('#loader');
const loaderBar = document.querySelector('.loader-bar');

// Étapes de progression simulées
// [ délai en ms, largeur en % ]
const steps = [
  [100,  25],
  [400,  50],
  [700,  75],
  [900,  90],
  [1100, 100],
];

// On joue chaque étape avec son délai
steps.forEach(([delay, width]) => {
  setTimeout(() => {
    loaderBar.style.width = width + '%';
  }, delay);
});

// Quand la page est complètement chargée
window.addEventListener('load', () => {

  // On force la barre à 100% si ce n'est pas déjà fait
  loaderBar.style.width = '100%';

  // Petit délai pour que le 100% soit visible
  setTimeout(() => {
    loader.classList.add('hidden');

    // On retire le loader du DOM après la transition
    // pour qu'il ne bloque plus rien
    setTimeout(() => {
      loader.style.display = 'none';
    }, 1100);
    // 1100ms = durée de la transition opacity (0.8s) + délai (0.3s)

  }, 300);
});

// ============================================================
// ... reste du script inchangé en dessous ...
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


// ============================================================
// NAVBAR — Apparition au scroll
// ============================================================

const navbar = document.querySelector('#navbar');

// Seuil en pixels à partir duquel la navbar apparaît
const NAVBAR_THRESHOLD = 80;
// Seuil pour le mode compact
const NAVBAR_COMPACT   = 200;

});

// ============================================================
// NAVBAR — Lien actif selon la section visible
// Highlight le lien de la section en cours de lecture
// ============================================================

const sections  = document.querySelectorAll('section');
const navLinks  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {

        // On retire la classe active de tous les liens
        navLinks.forEach(link => link.classList.remove('active'));

        // On trouve le lien qui correspond à la section visible
        const activeLink = document.querySelector(
          `.nav-links a[href="#${entry.target.id}"]`
        );

        // On lui ajoute la classe active
        if (activeLink) activeLink.classList.add('active');
      }
    });
  },
  {
    threshold: 0.4
    // La section doit être visible à 40% pour être "active"
  }
);

// On observe chaque section
sections.forEach(section => sectionObserver.observe(section));


// ============================================================
// PARALLAX — Effet de profondeur sur le Hero
// ============================================================

const heroContent  = document.querySelector('.hero-content');
const gradientBg   = document.querySelector('.gradient-bg');
const heroSection  = document.querySelector('#hero');

// ============================================================
// SCROLL UNIQUE — Navbar + Parallax fusionnés
// Un seul écouteur = meilleures performances
// ============================================================

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // --- NAVBAR ---
  if (scrollY > NAVBAR_THRESHOLD) {
    navbar.classList.add('visible');
  } else {
    navbar.classList.remove('visible');
  }

  if (scrollY > NAVBAR_COMPACT) {
    navbar.classList.add('compact');
  } else {
    navbar.classList.remove('compact');
  }

  // --- PARALLAX ---
  if (scrollY <= heroSection.offsetHeight) {
    const contentOffset = scrollY * 0.4;
    const bgOffset      = scrollY * -0.15;

    heroContent.style.transform = `translateY(${contentOffset}px)`;
    gradientBg.style.transform  = `translateY(${bgOffset}px)`;
  }
});

// ============================================================
// PARALLAX — Effet subtil au mouvement de la souris
// Le dégradé réagit légèrement à la position de la souris
// ============================================================

heroSection.addEventListener('mousemove', (e) => {

  // On calcule la position de la souris
  // par rapport au centre de l'écran
  const centerX = window.innerWidth  / 2;
  const centerY = window.innerHeight / 2;

  // Distance depuis le centre (-1 à +1)
  const deltaX = (e.clientX - centerX) / centerX;
  const deltaY = (e.clientY - centerY) / centerY;

  // Mouvement très subtil du dégradé
  const moveX = deltaX * 15;
  const moveY = deltaY * 15;

  gradientBg.style.transition = 'transform 0.8s ease';
  gradientBg.style.transform  = `translate(${moveX}px, ${moveY}px)`;

});

// Quand la souris quitte le hero, le dégradé revient en place
heroSection.addEventListener('mouseleave', () => {
  gradientBg.style.transition = 'transform 1.2s ease';
  gradientBg.style.transform  = 'translate(0, 0)';
});
