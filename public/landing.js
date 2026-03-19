// landing.js — AnimaType Landing Page

// =============================================
// THEME MANAGEMENT
// =============================================
function initTheme() {
  const savedTheme = localStorage.getItem('animatype_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('animatype_theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.innerHTML = theme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
  }
}

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

// Create backdrop element
const backdrop = document.createElement('div');
backdrop.className = 'menu-backdrop';
document.body.appendChild(backdrop);

function closeMenu() {
  if (navLinks) {
    navLinks.classList.remove('open');
    backdrop.classList.remove('open');
  }
}

function openMenu() {
  if (navLinks) {
    navLinks.classList.add('open');
    backdrop.classList.add('open');
  }
}

if (hamburger && navLinks) {
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (navLinks.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });
  
  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  });
  
  // Close on backdrop click
  backdrop.addEventListener('click', closeMenu);
  
  // Close on clicking outside
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open')) {
      const isClickOnNavBar = document.querySelector('.navbar').contains(e.target);
      if (!isClickOnNavBar) {
        closeMenu();
      }
    }
  });
}

// Highlight type card on click
function highlightType(el) {
  const group = el.closest('.type-group');
  group.querySelectorAll('.type-card').forEach(c => c.classList.remove('type-selected'));
  el.classList.add('type-selected');
}

// Scroll-based navbar shadow
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (window.scrollY > 40) {
      navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.4)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  }
});

// Animate stat pills on load
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  const statNums = document.querySelectorAll('.stat-num');
  statNums.forEach(el => {
    const target = parseInt(el.textContent);
    if (!isNaN(target)) {
      let current = 0;
      const step = target / 40;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.ceil(current) + (el.textContent.includes('+') ? '+' : '');
        if (current >= target) clearInterval(timer);
      }, 30);
    }
  });
});

// Toggle hidden characters
function toggleCharacters() {
  const hiddenChars = document.querySelectorAll('.char-hidden');
  const btn = document.getElementById('viewAllCharsBtn');
  
  if (hiddenChars.length > 0 && hiddenChars[0].style.display === 'none') {
    hiddenChars.forEach(c => {
      c.style.display = 'flex';
      c.style.animation = 'stepFadeIn 0.4s ease forwards';
    });
    btn.textContent = 'Show Less ↑';
  } else {
    hiddenChars.forEach(c => {
      c.style.display = 'none';
      c.style.animation = 'none';
    });
    btn.textContent = 'View All Souls ↓';
    // Scroll back to the start of the section smoothly
    document.getElementById('characters').scrollIntoView({ behavior: 'smooth' });
  }
}
