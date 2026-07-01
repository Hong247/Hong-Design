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

  var hoverSelector = 'a, button, .custom-btn, input, textarea, select, [role="button"], img, video, iframe';
  var raf = null;
  var x = 0, y = 0;

  function move() {
    raf = null;
    cursor.style.transform = 'translate(' + x + 'px,' + y + 'px)';
  }

  function onPointerMove(e) {
    x = e.clientX;
    y = e.clientY;
    if (!raf) raf = requestAnimationFrame(move);
    cursor.classList.add('is-active');
  }

  function onPointerOver(e) {
    var target = e.target.closest && e.target.closest(hoverSelector);
    if (target) cursor.classList.add('is-hover');
  }

  function onPointerOut(e) {
    var target = e.target.closest && e.target.closest(hoverSelector);
    if (!target) return;
    var related = e.relatedTarget;
    if (!related || !(related.closest && related.closest(hoverSelector))) {
      cursor.classList.remove('is-hover');
    }
  }

  function onLeave() {
    cursor.classList.remove('is-active');
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(cursor);
    document.body.classList.add('custom-cursor-active');
    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerover', onPointerOver, { passive: true });
    document.addEventListener('pointerout', onPointerOut, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
  });
})();
