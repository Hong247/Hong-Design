(function () {
  var inited = typeof WeakSet !== 'undefined' ? new WeakSet() : null;

  function hasInited(el) { return inited ? inited.has(el) : el._sbInited; }
  function markInited(el) { if (inited) inited.add(el); else el._sbInited = true; }

  function getColors() {
    /* White chameleon → dark scroller; black chameleon → light scroller */
    if (document.body.classList.contains('chameleon-light')) {
      return { track: 'rgba(0,0,0,.12)', thumb: '#000' };
    }
    return { track: 'rgba(255,255,255,.12)', thumb: '#fff' };
  }

  /* ── Vertical scrollbar for .scroll-wrapper ── */
  function initY(el) {
    if (!el) return;
    markInited(el);

    var track = document.createElement('div');
    var thumb = document.createElement('div');
    /* position:fixed — sits above all stacking contexts, no layering issues */
    track.style.cssText = 'position:fixed;width:2px;pointer-events:none;z-index:9999;border-radius:2px;transition:opacity .25s';
    thumb.style.cssText = 'position:absolute;left:0;width:100%;border-radius:2px;transition:top .06s linear,height .06s linear,background .2s';
    track.appendChild(thumb);
    document.body.appendChild(track);

    function update() {
      var c = getColors();
      var ratio = el.clientHeight / el.scrollHeight;
      if (ratio >= 1) { track.style.opacity = '0'; return; }
      track.style.opacity = '1';
      track.style.background = c.track;
      thumb.style.background = c.thumb;

      var rect = el.getBoundingClientRect();
      /* Centre the bar in the body's right padding strip (outside the content area) */
      var bodyPad = window.innerWidth - rect.right;
      track.style.right = Math.round(bodyPad / 2) + 'px';
      track.style.top = rect.top + 'px';
      track.style.height = rect.height + 'px';

      var trackH = rect.height;
      var thumbH = Math.max((el.clientHeight / el.scrollHeight) * trackH, 28);
      var scrollRatio = el.scrollTop / (el.scrollHeight - el.clientHeight);
      thumb.style.height = thumbH + 'px';
      thumb.style.top = (scrollRatio * (trackH - thumbH)) + 'px';
    }

    el.addEventListener('scroll', function () { requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', function () { requestAnimationFrame(update); }, { passive: true });
    new MutationObserver(function () { requestAnimationFrame(update); })
      .observe(document.body, { attributes: true, attributeFilter: ['class'] });
    update();
  }

  /* ── Horizontal scrollbar for .scroll-container ── */
  function initX(el) {
    if (!el) return;
    markInited(el);

    el.style.position = 'relative';

    var track = document.createElement('div');
    var thumb = document.createElement('div');
    track.style.cssText = 'position:absolute;left:0;bottom:4px;height:2px;width:100%;pointer-events:none;z-index:10;border-radius:2px;transition:opacity .25s';
    thumb.style.cssText = 'position:absolute;bottom:0;height:100%;border-radius:2px;transition:width .06s linear,background .2s';
    track.appendChild(thumb);
    el.appendChild(track);

    function update() {
      var c = getColors();
      var ratio = el.clientWidth / el.scrollWidth;
      if (ratio >= 1) { track.style.opacity = '0'; return; }
      track.style.opacity = '1';
      track.style.background = c.track;
      thumb.style.background = c.thumb;
      track.style.left = el.scrollLeft + 'px';
      track.style.width = el.clientWidth + 'px';
      var trackW = el.clientWidth;
      var thumbW = Math.max(ratio * trackW, 28);
      var scrollRatio = el.scrollLeft / (el.scrollWidth - el.clientWidth);
      thumb.style.width = thumbW + 'px';
      thumb.style.left = (scrollRatio * (trackW - thumbW)) + 'px';
    }

    el.addEventListener('scroll', function () { requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', function () { requestAnimationFrame(update); }, { passive: true });
    new MutationObserver(function () { requestAnimationFrame(update); })
      .observe(document.body, { attributes: true, attributeFilter: ['class'] });
    update();
  }

  function initAll() {
    var wrapper = document.querySelector('.scroll-wrapper');
    if (wrapper && !hasInited(wrapper)) initY(wrapper);

    var containers = document.querySelectorAll('.scroll-container');
    for (var i = 0; i < containers.length; i++) {
      if (!hasInited(containers[i])) initX(containers[i]);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('js-custom-scrollbar');
    initAll();
    new MutationObserver(initAll).observe(document.body, { childList: true, subtree: true });
  });
})();
