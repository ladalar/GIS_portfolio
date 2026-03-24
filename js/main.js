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

/* ── Timelapse animation factory ───────────────────────────── */
/*
 * createAnimation(config) wires up a timelapse animation viewer.
 *
 * config properties:
 *   frames        {string[]}  – array of image paths, one per frame
 *   startDate     {Date}      – date of frame 0 (used for auto-labels)
 *   labels        {string[]}  – optional per-frame label overrides
 *   fps           {number}    – playback speed (default 3)
 *   viewerId      {string}    – id of the outer viewer element
 *   placeholderId {string}    – id of the placeholder element
 *   frameImgId    {string}    – id of the <img> element
 *   controlsId    {string}    – id of the controls bar element
 *   btnFirstId    {string}    – id of the "first" button
 *   btnPrevId     {string}    – id of the "previous" button
 *   btnPlayId     {string}    – id of the "play/pause" button
 *   btnNextId     {string}    – id of the "next" button
 *   btnLastId     {string}    – id of the "last" button
 *   sliderId      {string}    – id of the range slider
 *   frameLabelId  {string}    – id of the label <span>
 */
function createAnimation(config) {
  const {
    frames,
    startDate,
    labels = [],
    fps = 3,
    viewerId,
    placeholderId,
    frameImgId,
    controlsId,
    btnFirstId,
    btnPrevId,
    btnPlayId,
    btnNextId,
    btnLastId,
    sliderId,
    frameLabelId,
  } = config;

  const viewer      = document.getElementById(viewerId);
  const placeholder = document.getElementById(placeholderId);
  const frameImg    = document.getElementById(frameImgId);
  const controls    = document.getElementById(controlsId);
  const btnFirst    = document.getElementById(btnFirstId);
  const btnPrev     = document.getElementById(btnPrevId);
  const btnPlay     = document.getElementById(btnPlayId);
  const btnNext     = document.getElementById(btnNextId);
  const btnLast     = document.getElementById(btnLastId);
  const slider      = document.getElementById(sliderId);
  const frameLabel  = document.getElementById(frameLabelId);

  if (!viewer || !frameImg) return;

  if (!frames.length) {
    if (controls) { controls.style.opacity = '.4'; controls.style.pointerEvents = 'none'; }
    return;
  }

  let hasLoadedAtLeastOneFrame = false;

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

  slider.max = frames.length - 1;
  slider.value = 0;

  function getLabel(i) {
    if (labels[i]) return labels[i];
    const d = new Date(startDate.getFullYear(), startDate.getMonth() + i);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  function showFrame(i) {
    currentIndex = Math.max(0, Math.min(i, frames.length - 1));
    frameImg.src = frames[currentIndex];
    slider.value = currentIndex;
    frameLabel.textContent = getLabel(currentIndex);
  }

  function play() {
    if (playInterval) return;
    btnPlay.textContent = '⏸';
    btnPlay.setAttribute('aria-label', 'Pause');
    playInterval = setInterval(() => {
      showFrame(currentIndex >= frames.length - 1 ? 0 : currentIndex + 1);
    }, 1000 / fps);
  }

  function pause() {
    clearInterval(playInterval);
    playInterval = null;
    btnPlay.textContent = '▶';
    btnPlay.setAttribute('aria-label', 'Play');
  }

  btnFirst.addEventListener('click', () => { pause(); showFrame(0); });
  btnPrev.addEventListener('click',  () => { pause(); showFrame(currentIndex - 1); });
  btnPlay.addEventListener('click',  () => { playInterval ? pause() : play(); });
  btnNext.addEventListener('click',  () => { pause(); showFrame(currentIndex + 1); });
  btnLast.addEventListener('click',  () => { pause(); showFrame(frames.length - 1); });
  slider.addEventListener('input',   () => { pause(); showFrame(Number(slider.value)); });

  viewer.setAttribute('tabindex', '0');
  viewer.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); pause(); showFrame(currentIndex + 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); pause(); showFrame(currentIndex - 1); }
    if (e.key === ' ')          { e.preventDefault(); playInterval ? pause() : play(); }
  });

  showFrame(0);
}

/* ── SWITRS: California Traffic Accidents (13 frames, Jan 2020) */
createAnimation({
  frames:       Array.from({ length: 13 }, (_, i) =>
                  `images/switrs/${String(i).padStart(4, '0')}.png`),
  startDate:    new Date(2020, 0),
  fps:          3,
  viewerId:     'animationViewer',
  placeholderId:'animationPlaceholder',
  frameImgId:   'animationFrame',
  controlsId:   'animationControls',
  btnFirstId:   'btnFirst',
  btnPrevId:    'btnPrev',
  btnPlayId:    'btnPlay',
  btnNextId:    'btnNext',
  btnLastId:    'btnLast',
  sliderId:     'frameSlider',
  frameLabelId: 'frameLabel',
});

/* ── Rent: Southern California Rent Prices (135 frames, Jan 2015) */
createAnimation({
  frames:       Array.from({ length: 135 }, (_, i) =>
                  `images/rent/frame_${String(i).padStart(3, '0')}.png`),
  startDate:    new Date(2015, 0),
  fps:          5,
  viewerId:     'rentViewer',
  placeholderId:'rentPlaceholder',
  frameImgId:   'rentFrame',
  controlsId:   'rentControls',
  btnFirstId:   'rentBtnFirst',
  btnPrevId:    'rentBtnPrev',
  btnPlayId:    'rentBtnPlay',
  btnNextId:    'rentBtnNext',
  btnLastId:    'rentBtnLast',
  sliderId:     'rentSlider',
  frameLabelId: 'rentLabel',
});

