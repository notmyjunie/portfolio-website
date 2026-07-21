// 1. Load CSS Design Tokens & Base Styles
import './styles/tokens.css';
import './styles/main.css';

// 2. Load Google Material 3 Web Components
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/chips/chip-set.js';
import '@material/web/chips/assist-chip.js';
import '@material/web/icon/icon.js';

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const navBrand = document.querySelector('.nav-brand');
  const sections = document.querySelectorAll('main[id], section[id]');

  // Variable to prevent scroll listener from competing during smooth scroll click
  let isClickScrolling = false;

  // 1. CLICK EVENT FOR NAV LINKS (#about, #projects, #contact)
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      isClickScrolling = true;

      // Update active state immediately on click
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');

      // Re-enable scroll listener tracking after smooth scroll finishes
      setTimeout(() => {
        isClickScrolling = false;
      }, 800);
    });
  });

  // 2. CLICK EVENT FOR BRAND LOGO (#home / landing)
  if (navBrand) {
    navBrand.addEventListener('click', () => {
      isClickScrolling = true;

      // Clear pills from ALL nav links when returning home
      navLinks.forEach(l => l.classList.remove('active'));

      setTimeout(() => {
        isClickScrolling = false;
      }, 800);
    });
  }

  // 3. SCROLL EVENT TRACKER
  window.addEventListener('scroll', () => {
    // Skip scroll logic if we are currently mid-click animation
    if (isClickScrolling) return;

    let currentSectionId = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 200) {
        currentSectionId = section.getAttribute('id');
      }
    });

    // IF AT TOP OR HOME SECTION: Remove pills from all nav links
    if (window.scrollY < 200 || currentSectionId === 'home' || currentSectionId === 'landing') {
      navLinks.forEach(link => link.classList.remove('active'));
    }
    // IF IN A SPECIFIC NAV SECTION: Light up only that link
    else if (currentSectionId) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const fab = document.getElementById('fab-contact');
  const deepDiveSection = document.getElementById('about-details');

  if (!fab || !deepDiveSection) return;

  const observerOptions = {
    root: null,
    threshold: 0.1 /* Triggers when 10% of #about-details is visible */
  };

  const fabObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // If user reaches #about-details or scrolls past it
      if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
        fab.classList.add('is-visible');
      } else {
        fab.classList.remove('is-visible');
      }
    });
  }, observerOptions);

  fabObserver.observe(deepDiveSection);
});

document.addEventListener('DOMContentLoaded', () => {
  const aboutCard = document.querySelector('#about .about-card');
  const homeSection = document.querySelector('#home');

  if (!aboutCard || !homeSection) return;

  // 1. Observer for the About Card entrance
  const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Trigger entrance animation when scrolling down into #about
      if (entry.isIntersecting) {
        aboutCard.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.25 // Triggers when 25% of the card is visible
  });

  aboutObserver.observe(aboutCard);

  // 2. Observer for returning to #home
  const homeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Reset card state when Home section is predominantly back in view
      if (entry.isIntersecting) {
        aboutCard.classList.remove('is-visible');
      }
    });
  }, {
    threshold: 0.6 // Resets when Home takes up 60%+ of the screen
  });

  homeObserver.observe(homeSection);
});

// src/main.js

document.addEventListener('DOMContentLoaded', () => {
  const glitchEl = document.getElementById('glitch-el');

  // REPLACE THIS WITH YOUR REAL NAME OR DISPLAY NAME
  const finalName = "Ashraf Danial";
  const introText = "A Dream";

  if (!glitchEl) return;

  // 1. Set initial text immediately
  glitchEl.textContent = introText;
  glitchEl.setAttribute('data-text', introText);

  // 2. Trigger Glitch Chaos & Swap to Final Name (after 1 second)
  setTimeout(() => {
    glitchEl.classList.add('is-glitching');
    glitchEl.textContent = finalName;
    glitchEl.setAttribute('data-text', finalName);
  }, 1000);

  // 3. Resolve Glitch (Stop chaos, restore clean typography)
  setTimeout(() => {
    glitchEl.classList.remove('is-glitching');
  }, 1800);
});
