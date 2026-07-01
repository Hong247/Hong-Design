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
    /* Scoped to the label/arrow spans, not the whole <th> — sort header
       cells stretch to their column width (e.g. ROLE is 34% of the table),
       so matching the <th> itself merges across all that empty space
       instead of just near the word. Hovering the rest of the header cell
       falls through to the generic [role="button"] grow-circle below. */
    merged: '.year-sort-label, .year-sort-symbol',
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
    /* Cover the label AND the sort arrows together as one tube, regardless
       of which of the two the pointer is actually over. */
    var label = mergedEl.querySelector('.year-sort-label');
    var symbol = mergedEl.querySelector('.year-sort-symbol');
    var rects = [label, symbol].filter(Boolean).map(function (el) { return el.getBoundingClientRect(); });
    if (!rects.length) return;
    var left = Math.min.apply(null, rects.map(function (r) { return r.left; }));
    var right = Math.max.apply(null, rects.map(function (r) { return r.right; }));
    var top = Math.min.apply(null, rects.map(function (r) { return r.top; }));
    var bottom = Math.max.apply(null, rects.map(function (r) { return r.bottom; }));
    var padX = 12, padY = 7;
    var w = (right - left) + padX * 2;
    var h = (bottom - top) + padY * 2;
    cursor.style.width = w + 'px';
    cursor.style.height = h + 'px';
    cursor.style.margin = (-h / 2) + 'px 0 0 ' + (-w / 2) + 'px';
    cursor.style.transform = 'translate(' + ((left + right) / 2) + 'px,' + ((top + bottom) / 2) + 'px)';
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
      var header = el.closest('.year-sort-header');
      if (!header) return;
      /* Moving between the label and the arrow symbol within the same
         header shouldn't re-trigger anything — both cover the same tube. */
      if (currentMode === 'merged' && mergedEl === header) return;
      clearMode();
      mergedEl = header;
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
