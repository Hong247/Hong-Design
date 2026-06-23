(function () {
  var inited = typeof WeakSet !== 'undefined' ? new WeakSet() : null;

  function hasInited(el) { return inited ? inited.has(el) : el._sbInited; }
  function markInited(el) { if (inited) inited.add(el); else el._sbInited = true; }

  function getColors() {
    var b = document.body;
    if (b.classList.contains('light-mode'))  return { track: 'rgba(0,0,0,.1)',       thumb: '#000' };
    if (b.classList.contains('orange-mode')) return { track: 'rgba(0,0,0,.12)',      thumb: '#000' };
    return                                          { track: 'rgba(255,255,255,.12)', thumb: '#fff' };
  }

  /* ── Vertical scrollbar for .scroll-wrapper ── */
  function initY(el, container) {
    if (!el || !container) return;
    markInited(el);

    var prevPos = window.getComputedStyle(container).position;
    if (prevPos === 'static') container.style.position = 'relative';

    var track = document.createElement('div');
    var thumb = document.createElement('div');
    /* 4px from right edge — scroll-wrapper has matching padding-right:14px so YEAR column clears it */
    track.style.cssText = 'position:absolute;right:4px;top:0;width:2px;height:100%;pointer-events:none;z-index:10;border-radius:2px;transition:opacity .25s';
    thumb.style.cssText = 'position:absolute;right:0;width:100%;border-radius:2px;transition:top .06s linear,height .06s linear,background .2s';
    track.appendChild(thumb);
    container.appendChild(track);

    function update() {
      var c = getColors();
      var ratio = el.clientHeight / el.scrollHeight;
      if (ratio >= 1) { track.style.opacity = '0'; return; }
      track.style.opacity = '1';
      track.style.background = c.track;
      thumb.style.background = c.thumb;
      var trackH = el.clientHeight;
      var thumbH = Math.max(ratio * trackH, 28);
      var scrollRatio = el.scrollTop / (el.scrollHeight - el.clientHeight);
      thumb.style.height = thumbH + 'px';
      thumb.style.top = (scrollRatio * (trackH - thumbH)) + 'px';
      track.style.top = el.offsetTop + 'px';
      track.style.height = el.clientHeight + 'px';
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

    /* Track lives inside the scroll container so it naturally sits below the images.
       We update its left to match scrollLeft so it stays in the visible viewport. */
    el.style.position = 'relative';

    var track = document.createElement('div');
    var thumb = document.createElement('div');
    /* 6px top gap (above track) + 4px bottom gap = sits neatly in padding-bottom area */
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
      /* pin track to visible viewport */
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
    var rightTheme = document.querySelector('.right-theme');
    if (wrapper && rightTheme && !hasInited(wrapper)) initY(wrapper, rightTheme);

    var containers = document.querySelectorAll('.scroll-container');
    for (var i = 0; i < containers.length; i++) {
      if (!hasInited(containers[i])) initX(containers[i]);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initAll();
    new MutationObserver(initAll).observe(document.body, { childList: true, subtree: true });
  });
})();
