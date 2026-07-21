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
