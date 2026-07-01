(function () {
  var coarse = window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (coarse) return;

  /* One element carries both position (transform) and the blend effect —
     Chromium fails to blend a mix-blend-mode child against the page when its
     parent has its own `transform` (the child ends up composited in an
     isolated layer). Position is set every frame via transform with no
     transition; the hover grow animates via width/height instead, so the two
     never fight over the same CSS property. */
  var cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.setAttribute('aria-hidden', 'true');

  /* Mode selectors, checked in priority order (most specific first). A
     single combined selector finds the nearest matching ancestor in one
     DOM walk; which specific mode it is is then resolved with cheap
     `.matches()` calls instead of walking the tree again per mode. */
  var MODE_SELECTORS = {
    merged: '.year-sort-header',
    magnify: '.scroll-container img.fullscreen-image, .scroll-container video.fullscreen-image',
    copy: '.email-copy-button',
    hover: 'a, button, .custom-btn, input, textarea, select, [role="button"], img, video, iframe'
  };
  var ALL_SELECTOR = [MODE_SELECTORS.merged, MODE_SELECTORS.magnify, MODE_SELECTORS.copy, MODE_SELECTORS.hover].join(', ');

  var raf = null;
  var x = 0, y = 0;
  var currentMode = null;
  var mergedEl = null;

  function move() {
    raf = null;
    if (currentMode === 'merged') return; /* frozen over the word until unmerged */
    cursor.style.transform = 'translate(' + x + 'px,' + y + 'px)';
  }

  function updateMergeRect() {
    if (!mergedEl) return;
    var label = mergedEl.querySelector('.year-sort-label') || mergedEl;
    var rect = label.getBoundingClientRect();
    var padX = 10, padY = 6;
    var w = rect.width + padX * 2;
    var h = rect.height + padY * 2;
    cursor.style.width = w + 'px';
    cursor.style.height = h + 'px';
    cursor.style.margin = (-h / 2) + 'px 0 0 ' + (-w / 2) + 'px';
    cursor.style.transform = 'translate(' + (rect.left + rect.width / 2) + 'px,' + (rect.top + rect.height / 2) + 'px)';
  }

  function clearMode() {
    if (currentMode === 'merged') {
      mergedEl = null;
      cursor.style.width = '';
      cursor.style.height = '';
      cursor.style.margin = '';
    }
    if (currentMode) cursor.classList.remove('is-' + currentMode);
    currentMode = null;
  }

  function setModeFor(el) {
    if (el.matches(MODE_SELECTORS.merged)) {
      if (currentMode === 'merged' && mergedEl === el) return;
      clearMode();
      mergedEl = el;
      currentMode = 'merged';
      cursor.classList.add('is-merged');
      updateMergeRect();
      return;
    }
    var mode = el.matches(MODE_SELECTORS.magnify) ? 'magnify' : el.matches(MODE_SELECTORS.copy) ? 'copy' : 'hover';
    if (currentMode === mode) return;
    clearMode();
    currentMode = mode;
    cursor.classList.add('is-' + mode);
  }

  function onPointerMove(e) {
    x = e.clientX;
    y = e.clientY;
    if (!raf) raf = requestAnimationFrame(move);
    cursor.classList.add('is-active');
  }

  function onPointerOver(e) {
    var el = e.target.closest && e.target.closest(ALL_SELECTOR);
    if (el) setModeFor(el);
  }

  function onPointerOut(e) {
    var el = e.target.closest && e.target.closest(ALL_SELECTOR);
    if (!el) return;
    var related = e.relatedTarget;
    var relatedEl = related && related.closest && related.closest(ALL_SELECTOR);
    if (relatedEl === el) return; /* moved within the same matched ancestor */
    if (relatedEl) setModeFor(relatedEl);
    else clearMode();
  }

  function onScroll() {
    if (currentMode === 'merged') updateMergeRect();
  }

  function onLeave() {
    cursor.classList.remove('is-active');
    clearMode();
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(cursor);
    document.body.classList.add('custom-cursor-active');
    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerover', onPointerOver, { passive: true });
    document.addEventListener('pointerout', onPointerOut, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
  });
})();
