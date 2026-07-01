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

  /* The magnify handle is a SEPARATE element, not a child of `cursor` — for
     the same reason as above: nesting it inside the (transformed) cursor
     div would break its own mix-blend-mode. As an independent sibling with
     its own transform, it blends correctly, same as the main cursor does. */
  var handle = document.createElement('div');
  handle.className = 'custom-cursor-handle';
  handle.setAttribute('aria-hidden', 'true');

  /* Mode selectors, checked in priority order (most specific first). A
     single combined selector finds the nearest matching ancestor in one
     DOM walk; which specific mode it is is then resolved with cheap
     `.matches()` calls instead of walking the tree again per mode. */
  var MODE_SELECTORS = {
    /* Scoped to the label/arrow spans (not the whole <th>, which stretches
       to its column width — ROLE is 34% of the table) and to a handful of
       small, tightly content-sized text controls that get the same
       "merge into the word" treatment. */
    merged: '.year-sort-label, .year-sort-symbol, .social-links a, .email-copy-button, .header-title',
    magnify: '.scroll-container img.fullscreen-image, .scroll-container video.fullscreen-image',
    hover: 'a, button, .custom-btn, input, textarea, select, [role="button"], img, video, iframe'
  };
  var ALL_SELECTOR = [MODE_SELECTORS.merged, MODE_SELECTORS.magnify, MODE_SELECTORS.hover].join(', ');

  var raf = null;
  var x = 0, y = 0;
  var currentMode = null;
  var mergedRoot = null;
  var mergedRects = null;

  /* Merge sizing is tweened in JS rather than left to a CSS transition:
     width, height, and margin must always satisfy margin = -size/2 at every
     single frame or the pill visibly drifts off-center while animating.
     CSS guarantees that in theory (same duration/curve, proportional
     start/end values), but driving all three from one function on one
     frame removes any dependency on a browser's cross-property transition
     timing being exact. */
  var sizeRaf = null;
  var sizeStart = null;
  var sizeDuration = 480;
  var fromW = 22, fromH = 22, toW = 22, toH = 22;

  function easeOutQuint(t) { return 1 - Math.pow(1 - t, 5); }

  function tweenSize(ts) {
    if (sizeStart === null) sizeStart = ts;
    var progress = Math.min(1, (ts - sizeStart) / sizeDuration);
    var eased = easeOutQuint(progress);
    var w = fromW + (toW - fromW) * eased;
    var h = fromH + (toH - fromH) * eased;
    cursor.style.width = w + 'px';
    cursor.style.height = h + 'px';
    cursor.style.margin = (-h / 2) + 'px 0 0 ' + (-w / 2) + 'px';
    sizeRaf = progress < 1 ? requestAnimationFrame(tweenSize) : null;
  }

  function animateSizeTo(w, h) {
    var current = cursor.getBoundingClientRect();
    fromW = current.width || w;
    fromH = current.height || h;
    toW = w;
    toH = h;
    sizeStart = null;
    if (sizeRaf) cancelAnimationFrame(sizeRaf);
    sizeRaf = requestAnimationFrame(tweenSize);
  }

  function move() {
    raf = null;
    if (currentMode === 'merged') return; /* frozen over the word until unmerged */
    cursor.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    if (currentMode === 'magnify') positionHandle();
  }

  function positionHandle() {
    /* Handle sits just outside the ring along the same 45° diagonal as the
       ring's own visual "notch", trailing the pointer like the main ring. */
    var offset = 8;
    handle.style.transform = 'translate(' + (x + offset) + 'px,' + (y + offset) + 'px) rotate(45deg)';
  }

  /* A merge "root" is the element whose content should be covered as one
     shape, and its rects() tells us what to measure. Sort headers merge
     the label + arrow symbol together (whichever one triggered it); the
     rest are simple single-element targets. */
  function getMergeGroup(el) {
    var header = el.closest('.year-sort-header');
    if (header) {
      return {
        root: header,
        rects: function () {
          return [header.querySelector('.year-sort-label'), header.querySelector('.year-sort-symbol')].filter(Boolean);
        }
      };
    }
    var direct = el.closest('.social-links a, .email-copy-button, .header-title');
    if (direct) {
      return { root: direct, rects: function () { return [direct]; } };
    }
    return null;
  }

  function updateMergeRect() {
    if (!mergedRects) return;
    var rects = mergedRects().map(function (el) { return el.getBoundingClientRect(); });
    if (!rects.length) return;
    var left = Math.min.apply(null, rects.map(function (r) { return r.left; }));
    var right = Math.max.apply(null, rects.map(function (r) { return r.right; }));
    var top = Math.min.apply(null, rects.map(function (r) { return r.top; }));
    var bottom = Math.max.apply(null, rects.map(function (r) { return r.bottom; }));
    var padX = 8, padY = 4;
    var w = (right - left) + padX * 2;
    var h = (bottom - top) + padY * 2;
    /* Position snaps immediately (no transition anywhere on transform);
       only the shape (via animateSizeTo) eases into place, so the pill is
       always centered on the word at every frame of the grow animation. */
    cursor.style.transform = 'translate(' + ((left + right) / 2) + 'px,' + ((top + bottom) / 2) + 'px)';
    animateSizeTo(w, h);
  }

  function clearMode() {
    if (currentMode === 'merged') {
      mergedRoot = null;
      mergedRects = null;
      if (sizeRaf) { cancelAnimationFrame(sizeRaf); sizeRaf = null; }
      cursor.style.width = '';
      cursor.style.height = '';
      cursor.style.margin = '';
    }
    if (currentMode === 'magnify') handle.classList.remove('is-visible');
    if (currentMode) cursor.classList.remove('is-' + currentMode);
    currentMode = null;
  }

  function setModeFor(el) {
    if (el.matches(MODE_SELECTORS.merged)) {
      var group = getMergeGroup(el);
      if (!group) return;
      /* Moving between two parts of the same merge target (e.g. the label
         and the arrow symbol) shouldn't re-trigger anything. */
      if (currentMode === 'merged' && mergedRoot === group.root) return;
      clearMode();
      mergedRoot = group.root;
      mergedRects = group.rects;
      currentMode = 'merged';
      cursor.classList.add('is-merged');
      updateMergeRect();
      return;
    }
    var mode = el.matches(MODE_SELECTORS.magnify) ? 'magnify' : 'hover';
    if (currentMode === mode) return;
    clearMode();
    currentMode = mode;
    cursor.classList.add('is-' + mode);
    if (mode === 'magnify') {
      handle.classList.add('is-visible');
      positionHandle();
    }
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
    document.body.appendChild(handle);
    document.body.classList.add('custom-cursor-active');
    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerover', onPointerOver, { passive: true });
    document.addEventListener('pointerout', onPointerOut, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    /* Self-hosted webfont swap can resize text after a merge already
       measured it against the fallback font — recompute once it settles. */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        if (currentMode === 'merged') updateMergeRect();
      });
    }
  });
})();
