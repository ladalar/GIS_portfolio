/* =============================================================
   GIS Portfolio – Fruzsina Ladanyi
   main.js
============================================================= */

/* ── Navbar: scroll shadow + mobile toggle ─────────────────── */
(function initNavbar() {
  const navbar     = document.getElementById('navbar');
  const navToggle  = document.getElementById('navToggle');
  const navLinks   = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ── Footer year ───────────────────────────────────────────── */
(function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ── Timelapse animation ───────────────────────────────────── */
(function initAnimation() {
  /*
   * To add your timelapse frames:
   *   1. Place images in images/switrs/  (e.g. frame_01.png, frame_02.png …)
   *   2. Add each filename to the FRAMES array below.
   *   3. If you want custom labels (e.g. "Jan 2020") add them to LABELS.
   *      Otherwise month/year labels are generated automatically from
   *      START_DATE.
   *
   * Example:
   *   const FRAMES = [
   *     'images/switrs/frame_01.png',
   *     'images/switrs/frame_02.png',
   *     // …
   *   ];
   *   const START_DATE = new Date(2020, 0); // January 2020
   *   const LABELS = [];  // leave empty to auto-generate from START_DATE
   */
  const FRAME_COUNT = 13;
  const FRAMES = Array.from({ length: FRAME_COUNT }, (_, i) =>
    `images/switrs/${String(i).padStart(4, '0')}.png`
  );
  const START_DATE = new Date(2020, 0);
  const LABELS     = [];          // ← optional: one label per frame
  const FPS        = 3;           // frames per second during playback

  /* ---- Nothing below needs to change ---- */

  const viewer      = document.getElementById('animationViewer');
  const placeholder = document.getElementById('animationPlaceholder');
  const frameImg    = document.getElementById('animationFrame');
  const controls    = document.getElementById('animationControls');
  const btnFirst    = document.getElementById('btnFirst');
  const btnPrev     = document.getElementById('btnPrev');
  const btnPlay     = document.getElementById('btnPlay');
  const btnNext     = document.getElementById('btnNext');
  const btnLast     = document.getElementById('btnLast');
  const slider      = document.getElementById('frameSlider');
  const frameLabel  = document.getElementById('frameLabel');

  if (!FRAMES.length) {
    // No frames configured – keep placeholder visible, disable controls
    controls.style.opacity = '.4';
    controls.style.pointerEvents = 'none';
    return;
  }

  // Only hide placeholder after an image successfully loads
  let hasLoadedAtLeastOneFrame = false;

  // Initial state: placeholder visible, image loads in background
  placeholder.hidden = false;
  frameImg.hidden = false;
  frameImg.classList.add('hidden');

  frameImg.addEventListener('load', () => {
    hasLoadedAtLeastOneFrame = true;
    placeholder.hidden = true;
    placeholder.textContent = '';
    frameImg.classList.remove('hidden');
  });

  frameImg.addEventListener('error', () => {
    if (!hasLoadedAtLeastOneFrame) {
      placeholder.hidden = false;
      frameImg.classList.add('hidden');
    }
  });

  let currentIndex = 0;
  let playInterval = null;

  slider.max = FRAMES.length - 1;
  slider.value = 0;

  /* Generate label for frame i */
  function getLabel(i) {
    if (LABELS[i]) return LABELS[i];
    const d = new Date(START_DATE.getFullYear(), START_DATE.getMonth() + i);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  /* Render frame i */
  function showFrame(i) {
    currentIndex = Math.max(0, Math.min(i, FRAMES.length - 1));
    frameImg.src = FRAMES[currentIndex];
    slider.value = currentIndex;
    frameLabel.textContent = getLabel(currentIndex);
  }

  /* Play / Pause */
  function play() {
    if (playInterval) return;
    btnPlay.textContent = '⏸';
    btnPlay.setAttribute('aria-label', 'Pause');
    playInterval = setInterval(() => {
      if (currentIndex >= FRAMES.length - 1) {
        showFrame(0); // loop
      } else {
        showFrame(currentIndex + 1);
      }
    }, 1000 / FPS);
  }

  function pause() {
    clearInterval(playInterval);
    playInterval = null;
    btnPlay.textContent = '▶';
    btnPlay.setAttribute('aria-label', 'Play');
  }

  /* Button events */
  btnFirst.addEventListener('click', () => { pause(); showFrame(0); });
  btnPrev.addEventListener('click',  () => { pause(); showFrame(currentIndex - 1); });
  btnPlay.addEventListener('click',  () => { playInterval ? pause() : play(); });
  btnNext.addEventListener('click',  () => { pause(); showFrame(currentIndex + 1); });
  btnLast.addEventListener('click',  () => { pause(); showFrame(FRAMES.length - 1); });
  slider.addEventListener('input',   () => { pause(); showFrame(Number(slider.value)); });

  /* Keyboard shortcuts when the viewer is focused */
  viewer.setAttribute('tabindex', '0');
  viewer.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); pause(); showFrame(currentIndex + 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); pause(); showFrame(currentIndex - 1); }
    if (e.key === ' ')          { e.preventDefault(); playInterval ? pause() : play(); }
  });

  // Initial frame
  showFrame(0);
})();

/* ── Contact form (client-side demo) ──────────────────────── */
(function initContactForm() {
  const form   = document.getElementById('contactForm');
  const notice = document.getElementById('formNotice');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      notice.style.color = '#f85149';
      notice.textContent = 'Please fill in all fields.';
      return;
    }

    // Replace this with your preferred form handling
    // (e.g. Formspree, EmailJS, a backend endpoint, etc.)
    notice.style.color = '';
    notice.textContent = '✓ Thank you! Your message has been received.';
    form.reset();
  });
})();
