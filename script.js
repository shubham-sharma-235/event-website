/* ══════════════════════════════════════════════════════════════
   Visva Events - script.js
   All JavaScript for interactions, animations, and behavior
   ══════════════════════════════════════════════════════════════ */

'use strict';

// ─── Custom Cursor ──────────────────────────────────────────────
(function initCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let animId;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    animId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Scale ring on interactive elements
  document.querySelectorAll('a, button, .filter-btn, .portfolio-item, .service-card, .blog-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width  = '60px';
      ring.style.height = '60px';
      ring.style.borderColor = 'var(--gold)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width  = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = 'rgba(201, 169, 110, 0.6)';
    });
  });
})();

// ─── Navbar ─────────────────────────────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ─── Mobile Menu ─────────────────────────────────────────────────
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const navbar = document.getElementById('navbar');
  if (!hamburger || !navLinks || !navbar) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
})();

// ─── Smooth Scrolling ───────────────────────────────────────────
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('navbar')?.offsetHeight || 80;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// ─── Scroll Reveal Animations ───────────────────────────────────
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
})();

// ─── Counter Animations ─────────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2200;
    const startTime = performance.now();

    function ease(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(ease(progress) * target);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

// ─── Portfolio Filter ────────────────────────────────────────────
(function initPortfolioFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const items   = document.querySelectorAll('.portfolio-item');
  if (!buttons.length || !items.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      items.forEach((item, i) => {
        const category = item.dataset.category;
        const show = filter === 'all' || category === filter;

        if (show) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity    = '1';
            item.style.transform  = 'scale(1)';
          }, i * 60);
        } else {
          item.style.transition = 'opacity 0.3s ease';
          item.style.opacity    = '0';
          setTimeout(() => item.classList.add('hidden'), 300);
        }
      });
    });
  });
})();

// ─── Testimonial Slider ─────────────────────────────────────────
(function initTestimonialSlider() {
  const track   = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('sliderDots');
  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;
  let current = 0;
  let autoInterval;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('slider-dot');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(calc(-${current * 100}% - ${current * 8}px))`;
    dotsContainer.querySelectorAll('.slider-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
    resetAuto();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  // Auto advance
  function startAuto() {
    autoInterval = setInterval(next, 5500);
  }
  function resetAuto() {
    clearInterval(autoInterval);
    startAuto();
  }

  startAuto();

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  });
})();

// ─── Video Play Button ──────────────────────────────────────────
(function initVideoSection() {
  const playBtn = document.getElementById('playBtn');
  if (!playBtn) return;

  playBtn.addEventListener('click', () => {
    // In a real implementation, this would open a modal with a video player
    // For demonstration, we'll show a visual feedback
    const container = playBtn.closest('.video-center-content');
    if (!container) return;

    playBtn.style.transform = 'scale(1.2)';
    playBtn.style.background = 'var(--gold)';
    setTimeout(() => {
      playBtn.style.transform = '';
      playBtn.style.background = '';
      // Show a toast message
      showToast('🎬 Video player would open here in production');
    }, 300);
  });
})();

// ─── Contact Form ────────────────────────────────────────────────
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.textContent = 'Sending...';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    // Simulate submission
    setTimeout(() => {
      btn.textContent = '✓ Enquiry Sent!';
      btn.style.opacity = '1';
      btn.style.background = '#2d7a2d';
      btn.style.color = '#fff';

      showToast('🥂 Thank you! We\'ll be in touch within 24 hours.');
      form.reset();

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
      }, 3000);
    }, 1800);
  });
})();

// ─── Toast Notification ─────────────────────────────────────────
function showToast(message) {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;

  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '100px',
    left: '50%',
    transform: 'translateX(-50%) translateY(20px)',
    background: 'rgba(8, 8, 8, 0.95)',
    border: '1px solid rgba(201, 169, 110, 0.4)',
    color: '#f5f0e8',
    padding: '14px 28px',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontFamily: 'Jost, sans-serif',
    letterSpacing: '0.05em',
    backdropFilter: 'blur(20px)',
    zIndex: '9000',
    opacity: '0',
    transition: 'opacity 0.4s ease, transform 0.4s ease',
    maxWidth: '90vw',
    textAlign: 'center',
    boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ─── Parallax Effect on Hero ────────────────────────────────────
(function initParallax() {
  const heroGrid = document.querySelector('.hero-grid-overlay');
  if (!heroGrid) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroGrid.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
  }, { passive: true });
})();

// ─── Navbar Active Link on Scroll ───────────────────────────────
(function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');
  if (!sections.length || !navLinks.length) return;

  function updateActiveLink() {
    const scrollPos = window.scrollY + 120;
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionH   = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionH) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${current}`) {
        link.style.color = 'var(--gold)';
      } else {
        link.style.color = '';
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
})();

// ─── Service Card Tilt Effect ────────────────────────────────────
(function initCardTilt() {
  const cards = document.querySelectorAll('.service-card, .why-card, .blog-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;
      const rotateX = ((y - midY) / midY) * -4;
      const rotateY = ((x - midX) / midX) *  4;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ─── Animate Floating Stats in Hero ────────────────────────────
(function initHeroStatCounters() {
  const statNums = document.querySelectorAll('.hero .stat-num');
  if (!statNums.length) return;

  let animated = false;

  function animateStats() {
    if (animated) return;
    animated = true;

    statNums.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      let start = null;
      const duration = 2000;

      function ease(t) { return 1 - Math.pow(1 - t, 3); }

      function step(timestamp) {
        if (!start) start = timestamp;
        const elapsed  = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        el.textContent = Math.round(ease(progress) * target);
        if (progress < 1) requestAnimationFrame(step);
      }

      // Small stagger
      setTimeout(() => requestAnimationFrame(step), 800);
    });
  }

  // Trigger after short delay (page load)
  setTimeout(animateStats, 600);
})();

// ─── Timeline Alternation Fix for Mobile ────────────────────────
(function fixTimelineOnMobile() {
  function checkMobile() {
    const isMobile = window.innerWidth <= 768;
    const items = document.querySelectorAll('.timeline-item');
    // CSS handles the layout; this just ensures transitions happen
    items.forEach(item => {
      item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
  }
  window.addEventListener('resize', checkMobile);
  checkMobile();
})();

// ─── Page Load Animation ─────────────────────────────────────────
(function initPageLoad() {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;

  // Ensure hero content animates in on load
  const revealElements = heroContent.querySelectorAll('.reveal-up');
  revealElements.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 200 + (i * 150));
  });

  // Animate stat cards
  setTimeout(() => {
    document.querySelectorAll('.stat-card.reveal-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 120);
    });
  }, 600);
})();

// ─── Gold Particle Background Decoration ────────────────────────
(function initParticles() {
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: absolute; inset: 0;
    pointer-events: none; z-index: 1;
    opacity: 0.35;
  `;
  heroSection.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = heroSection.offsetWidth;
    H = canvas.height = heroSection.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.5 - 0.1,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.6 + 0.1,
      life: 0,
      maxLife: Math.random() * 300 + 200,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 60 }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life++;

      const lifeRatio = p.life / p.maxLife;
      const alpha = lifeRatio < 0.2
        ? (lifeRatio / 0.2) * p.alpha
        : lifeRatio > 0.8
          ? ((1 - lifeRatio) / 0.2) * p.alpha
          : p.alpha;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 169, 110, ${alpha})`;
      ctx.fill();

      if (p.life >= p.maxLife || p.y < -10) {
        particles[i] = createParticle();
        particles[i].y = H + 10;
      }
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  init();
  draw();
})();

// ─── Initialize all on DOM ready ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  console.log('Visva Events experience initialized');
});
