/* =============================================
   BERCEAU DES PETITS — JAVASCRIPT
   Institution Rosette D. Gabilus — IMRDG
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- MOBILE MENU ---- */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks   = document.getElementById('navLinks');

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    const spans  = menuToggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity   = '';
      });
    });
  });


  /* ---- NAVBAR SCROLL EFFECT ---- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });


  /* ---- REVEAL ON SCROLL ---- */
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  reveals.forEach(el => observer.observe(el));


  /* ---- SMOOTH ACTIVE NAV LINK ---- */
  const sections    = document.querySelectorAll('section[id]');
  const navAnchors  = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAnchors.forEach(a => a.classList.remove('active'));
          const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    },
    { threshold: 0.35 }
  );
  sections.forEach(s => sectionObserver.observe(s));


  /* ---- GALLERY LIGHTBOX ---- */
  const galleryItems = document.querySelectorAll('.gallery-item');

  const lightbox     = document.createElement('div');
  lightbox.id        = 'lightbox';
  lightbox.innerHTML = `
    <div class="lb-backdrop"></div>
    <div class="lb-content">
      <img class="lb-img" src="" alt="">
      <button class="lb-close" aria-label="Fermer">&#10005;</button>
      <button class="lb-prev" aria-label="Précédent">&#8592;</button>
      <button class="lb-next" aria-label="Suivant">&#8594;</button>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lbImg      = lightbox.querySelector('.lb-img');
  const lbClose    = lightbox.querySelector('.lb-close');
  const lbPrev     = lightbox.querySelector('.lb-prev');
  const lbNext     = lightbox.querySelector('.lb-next');
  const lbBackdrop = lightbox.querySelector('.lb-backdrop');

  let currentIndex = 0;
  const images = Array.from(galleryItems).map(item => ({
    src: item.querySelector('img').src,
    alt: item.querySelector('img').alt
  }));

  function openLightbox(index) {
    currentIndex     = index;
    lbImg.src        = images[index].src;
    lbImg.alt        = images[index].alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lbImg.src    = images[currentIndex].src;
    lbImg.alt    = images[currentIndex].alt;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lbImg.src    = images[currentIndex].src;
    lbImg.alt    = images[currentIndex].alt;
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  lbClose.addEventListener('click',    closeLightbox);
  lbBackdrop.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click',     (e) => { e.stopPropagation(); showPrev(); });
  lbNext.addEventListener('click',     (e) => { e.stopPropagation(); showNext(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  /* Lightbox styles injected dynamically */
  const lbStyle       = document.createElement('style');
  lbStyle.textContent = `
    #lightbox {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 9999;
      align-items: center;
      justify-content: center;
    }
    #lightbox.active { display: flex; }
    .lb-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(9,32,20,0.92);
      backdrop-filter: blur(6px);
    }
    .lb-content {
      position: relative;
      z-index: 1;
      max-width: 90vw;
      max-height: 90vh;
    }
    .lb-img {
      max-width: 90vw;
      max-height: 85vh;
      border-radius: 16px;
      box-shadow: 0 32px 80px rgba(0,0,0,0.7);
      object-fit: contain;
      display: block;
    }
    .lb-close, .lb-prev, .lb-next {
      position: absolute;
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.18);
      color: #fff;
      cursor: pointer;
      border-radius: 50%;
      width: 42px;
      height: 42px;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .lb-close:hover, .lb-prev:hover, .lb-next:hover {
      background: rgba(201,146,10,0.55);
    }
    .lb-close { top: -18px; right: -18px; }
    .lb-prev  { top: 50%; left: -54px; transform: translateY(-50%); }
    .lb-next  { top: 50%; right: -54px; transform: translateY(-50%); }
    @media (max-width: 600px) {
      .lb-prev { left: 8px; }
      .lb-next { right: 8px; }
      .lb-close { top: -48px; right: 0; }
    }
  `;
  document.head.appendChild(lbStyle);


  /* ---- CONTACT FORM ---- */
  const submitBtn  = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const inputs = document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form select');
      let valid    = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = 'rgba(255,80,80,0.6)';
          valid = false;
        } else {
          input.style.borderColor = '';
        }
      });

      if (!valid) return;

      submitBtn.textContent = 'Envoi en cours...';
      submitBtn.disabled    = true;

      setTimeout(() => {
        submitBtn.textContent = 'Message envoyé !';
        formSuccess.classList.add('visible');
        inputs.forEach(input => { input.value = ''; input.style.borderColor = ''; });

        setTimeout(() => {
          submitBtn.textContent = 'Envoyer le Message';
          submitBtn.disabled    = false;
          formSuccess.classList.remove('visible');
        }, 4000);
      }, 1200);
    });
  }


  /* ---- COUNTER ANIMATION (stats in hero) ---- */
  const statNums = document.querySelectorAll('.stat-num');
  let counted    = false;

  function animateCounters() {
    if (counted) return;
    statNums.forEach(el => {
      const target = parseInt(el.textContent.replace(/\D/g, ''), 10);
      const suffix = el.textContent.replace(/[\d]/g, '');
      let current  = 0;
      const step   = Math.ceil(target / 50);
      const timer  = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current + suffix;
      }, 28);
    });
    counted = true;
  }

  const heroSection = document.querySelector('.hero');
  const heroObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) animateCounters();
    },
    { threshold: 0.5 }
  );
  if (heroSection) heroObserver.observe(heroSection);

});
