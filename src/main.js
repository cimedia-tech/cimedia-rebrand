import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  // ── 1. CUSTOM TRAILING CURSOR ───────────────────────────────────────────────
  const cursor = document.getElementById('custom-cursor');
  const cursorGlow = document.getElementById('custom-cursor-glow');

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth animation loop for trailing cursor
  function animateCursor() {
    // Direct position for the dot
    cursorX += (mouseX - cursorX) * 0.2;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY + (mouseY - cursorY) * 0.2}px`;
    cursorY += (mouseY - cursorY) * 0.2;

    // Lagged position for the outer glow circle
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    cursorGlow.style.left = `${glowX}px`;
    cursorGlow.style.top = `${glowY}px`;

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Scale cursor on hoverable elements
  const hoverElements = document.querySelectorAll('a, button, [data-tilt], input, select, textarea');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('active');
      cursorGlow.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('active');
      cursorGlow.classList.remove('active');
    });
  });

  // ── 2. SCROLL PARALLAX SYSTEM ───────────────────────────────────────────────
  const heroBg = document.getElementById('hero-bg');
  const circle1 = document.querySelector('.circle-1');
  const circle2 = document.querySelector('.circle-2');

  window.addEventListener('scroll', () => {
    const scrollOffset = window.pageYOffset;
    
    // Parallax background translations (slower scroll speed)
    if (heroBg) {
      heroBg.style.transform = `translateY(${scrollOffset * 0.4}px)`;
    }

    // Parallax decorative elements
    if (circle1) {
      circle1.style.transform = `translateY(${scrollOffset * 0.15}px) rotate(${scrollOffset * 0.05}deg)`;
    }
    if (circle2) {
      circle2.style.transform = `translateY(${scrollOffset * -0.1}px) rotate(${scrollOffset * -0.05}deg)`;
    }
  });

  // ── 3. SCROLL ANIMATION TRIGGERS (IntersectionObserver) ──────────────────────
  const scrollElements = document.querySelectorAll('.animate-on-scroll');

  const elementObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        elementObserver.unobserve(entry.target); // Trigger once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  scrollElements.forEach(el => {
    elementObserver.observe(el);
  });

  // ── 4. 3D MOCKUP INTERACTIVES (Card Tilt) ────────────────────────────────────
  const cards3D = document.querySelectorAll('.card-3d-wrapper');

  cards3D.forEach(wrapper => {
    const card = wrapper.querySelector('.card-3d');
    
    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within card
      const y = e.clientY - rect.top;  // y position within card

      // Calculate tilt angles based on mouse offset from center (max 20deg)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((centerY - y) / centerY) * 15;
      const rotateY = ((x - centerX) / centerX) * 15;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      
      // Update mouse shine gradients
      const shineX = (x / rect.width) * 100;
      const shineY = (y / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${shineX}%`);
      card.style.setProperty('--mouse-y', `${shineY}%`);
    });

    wrapper.addEventListener('mouseleave', () => {
      // Smoothly snap back to origin
      card.style.transform = 'rotateX(0deg) rotateY(0deg)';
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    });
  });

  // ── 5. BRAND SANCTUM FORM SUBMISSION ──────────────────────────────────────────
  const bookingForm = document.getElementById('booking-form');
  const successMessage = document.getElementById('form-success-message');

  if (bookingForm && successMessage) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Transition out form and transition in success brief
      bookingForm.style.transition = 'opacity 0.4s ease';
      bookingForm.style.opacity = '0';
      
      setTimeout(() => {
        bookingForm.style.display = 'none';
        successMessage.style.display = 'block';
        successMessage.style.opacity = '0';
        successMessage.style.transition = 'opacity 0.6s ease';
        
        // Trigger repaint to enable transition
        successMessage.offsetHeight;
        successMessage.style.opacity = '1';
      }, 400);
    });
  }

  // ── 6. CAROUSEL DRAG NAVIGATION ──────────────────────────────────────────────
  const carousel = document.getElementById('exhibit-carousel');
  let isDown = false;
  let startX;
  let scrollLeft;

  if (carousel) {
    carousel.addEventListener('mousedown', (e) => {
      isDown = true;
      carousel.style.cursor = 'grabbing';
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('mouseleave', () => {
      isDown = false;
      carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mouseup', () => {
      isDown = false;
      carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.5; // Scroll speed
      carousel.scrollLeft = scrollLeft - walk;
    });
  }
});
