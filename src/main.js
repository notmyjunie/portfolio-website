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
    // IF IN A SPECIFIC NAV SECTION: Light up only that link
    if (currentSectionId) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
        else {
          link.classList.remove('active');
        }
      });
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const fab = document.getElementById('fab-contact');
  const deepDiveSection = document.getElementById('about-details');
  const contactSection = document.getElementById('contact');
  const footerSection = document.getElementById('footer');

  if (!fab || !deepDiveSection) return;

  let isPastDeepDive = false;
  let isInContact = false;
  let isInFooter = false;

  // Helper function to update FAB visibility
  const updateFabVisibility = () => {
    // Show only if we are past #about-details AND NOT inside #contact
    if (isPastDeepDive && !isInContact && !isInFooter) {
      fab.classList.add('is-visible');
    } else {
      fab.classList.remove('is-visible');
    }
  };

  // 1. Observer for #about-details (Shows FAB)
  const deepDiveObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isPastDeepDive = entry.isIntersecting || entry.boundingClientRect.top < 0;
      updateFabVisibility();
    });
  }, { root: null, threshold: 0.1 });

  deepDiveObserver.observe(deepDiveSection);

  // 2. Observer for #contact (Hides FAB)
  if (contactSection) {
    const contactObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isInContact = entry.isIntersecting;
        updateFabVisibility();
      });
    }, { root: null, threshold: 0.1 });

    contactObserver.observe(contactSection);
  }

  if (footerSection) {
    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isInFooter = entry.isIntersecting;
        updateFabVisibility();

      });
    }, { root: null, threshold: 0.1 });
    footerObserver.observe(footerSection);
  }
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


document.addEventListener('DOMContentLoaded', () => {
  const matrixText = document.querySelector('.matrix-text');
  if (!matrixText) return;

  const characters = '0123456789ABCDEF@#$%&*!<>?/[]{}';
  const targetName = matrixText.dataset.value || "YOUR NAME";
  const initialText = "A Dream";

  let animationFrame = null;

  const decodeToNameRandomly = () => {
    const targetLength = targetName.length;

    // Build an array tracking each character's status and random resolve time
    const charStates = Array.from({ length: targetLength }, (_, i) => {
      return {
        targetChar: targetName[i],
        // Assign a random frame threshold for when this specific character locks in
        // (Between 15 and 50 frames into the animation)
        resolveAtFrame: Math.floor(Math.random() * 35) + 15,
        isResolved: false
      };
    });

    let currentFrame = 0;

    const animate = () => {
      currentFrame++;

      // Construct the display string for the current frame
      const output = charStates.map((state) => {
        // Space handling
        if (state.targetChar === ' ') return ' ';

        // Check if this position has hit its random resolve threshold
        if (currentFrame >= state.resolveAtFrame) {
          state.isResolved = true;
          return state.targetChar;
        }

        // Otherwise, render a random Matrix glyph
        return characters[Math.floor(Math.random() * characters.length)];
      }).join('');

      matrixText.innerText = output;

      // Check if all non-space characters have resolved
      const allResolved = charStates.every(s => s.isResolved || s.targetChar === ' ');

      if (!allResolved) {
        // Run at ~30 FPS for readable scramble speed
        setTimeout(() => {
          animationFrame = requestAnimationFrame(animate);
        }, 35);
      } else {
        matrixText.innerText = targetName; // Enforce clean final string
      }
    };

    // Cancel any previous animation loops before starting
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animate();
  };

  setTimeout(() => {
    decodeToNameRandomly();
  }, 800);
});
document.addEventListener('DOMContentLoaded', () => {
  const copyBtn = document.getElementById('copy-email-btn');
  const emailText = document.getElementById('contact-email');
  const toast = document.getElementById('toast');

  if (copyBtn && emailText && toast) {
    let toastTimeout;

    copyBtn.addEventListener('click', () => {
      const email = emailText.textContent.trim();

      navigator.clipboard.writeText(email).then(() => {
        // Clear active timeout if clicked repeatedly
        clearTimeout(toastTimeout);

        // Show toast
        toast.classList.add('show');

        // Hide toast after 3 seconds
        toastTimeout = setTimeout(() => {
          toast.classList.remove('show');
        }, 3000);
      }).catch(err => {
        console.error('Failed to copy email: ', err);
      });
    });
  }
});
