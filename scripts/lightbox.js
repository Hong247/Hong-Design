(function () {
  var overlay, imgEl, videoEl, closeBtn, prevBtn, nextBtn;
  var hbarEl, hthumbEl; /* horizontal position indicator */
  var mediaEl; /* the element currently shown (imgEl or videoEl) */

  /* wheel-to-navigate state */
  var wheelAccum = 0, wheelCooldownUntil = 0;

  /* zoom / pan state */
  var currentScale = 1, baseScale = 1;
  var startDist = 0, startMidX = 0, startMidY = 0;
  var panX = 0, panY = 0, basePanX = 0, basePanY = 0;
  var isPan = false, panStartX = 0, panStartY = 0;

  /* swipe state (scale = 1 only) */
  var swipeOffset = 0;    /* live horizontal offset while dragging */
  var isSwipe = false;
  var swipeAxis = null;   /* "h" | "v" | null — locked after first move */
  var swipeStartX = 0, swipeStartY = 0;
  var COMMIT_RATIO = 0.25; /* fraction of screen width to commit */
  var isAnimating = false;

  var activePointers = {};

  /* image set */
  var currentImages = [];
  var currentIndex  = 0;

  /* ─── init ─── */
  function init() {
    overlay = document.createElement("div");
    overlay.id = "lb-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Image lightbox");

    imgEl = document.createElement("img");
    imgEl.id = "lb-img";
    imgEl.alt = "";

    videoEl = document.createElement("video");
    videoEl.id = "lb-video";
    videoEl.setAttribute("playsinline", "");
    videoEl.setAttribute("loop", "");
    videoEl.setAttribute("disablepictureinpicture", "");
    videoEl.disablePictureInPicture = true;
    videoEl.muted = true;

    closeBtn = document.createElement("button");
    closeBtn.id = "lb-close";
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Close image");
    closeBtn.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round">' +
      '<line x1="2" y1="2" x2="16" y2="16"/><line x1="16" y1="2" x2="2" y2="16"/></svg>';

    prevBtn = document.createElement("button");
    prevBtn.id = "lb-prev";
    prevBtn.type = "button";
    prevBtn.setAttribute("aria-label", "Previous image");
    prevBtn.innerHTML =
      '<svg width="20" height="36" viewBox="0 0 20 36" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">' +
      '<polyline points="16,4 4,18 16,32"/></svg>';

    nextBtn = document.createElement("button");
    nextBtn.id = "lb-next";
    nextBtn.type = "button";
    nextBtn.setAttribute("aria-label", "Next image");
    nextBtn.innerHTML =
      '<svg width="20" height="36" viewBox="0 0 20 36" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">' +
      '<polyline points="4,4 16,18 4,32"/></svg>';

    /* Horizontal position indicator: mirrors the gallery's own scrollbar
       grammar — a quiet track with a thumb showing which image you're on. */
    hbarEl = document.createElement("div");
    hbarEl.id = "lb-hbar";
    hbarEl.setAttribute("aria-hidden", "true");
    hthumbEl = document.createElement("div");
    hthumbEl.id = "lb-hthumb";
    hbarEl.appendChild(hthumbEl);

    overlay.appendChild(imgEl);
    overlay.appendChild(videoEl);
    overlay.appendChild(closeBtn);
    overlay.appendChild(prevBtn);
    overlay.appendChild(nextBtn);
    overlay.appendChild(hbarEl);
    document.body.appendChild(overlay);

    /* Wheel = horizontal navigation. Vertical page scroll is blocked while
       the lightbox is open (preventDefault below + body.lb-active overflow);
       instead a wheel/trackpad gesture on either axis steps through the set.
       Accumulate deltas so one trackpad flick is one step, with a short
       cooldown so momentum scrolling doesn't skip several images. */
    overlay.addEventListener("wheel", function (e) {
      e.preventDefault();
      if (isAnimating || currentScale > 1.05) return;
      var now = Date.now();
      if (now < wheelCooldownUntil) return;
      var d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      wheelAccum += d;
      if (Math.abs(wheelAccum) > 60) {
        var dir = wheelAccum > 0 ? 1 : -1;
        wheelAccum = 0;
        wheelCooldownUntil = now + 450;
        navigateAnimated(dir, 0);
      }
    }, { passive: false });

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", function () { navigateAnimated(-1, 0); });
    nextBtn.addEventListener("click", function () { navigateAnimated(1, 0); });

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });

    document.addEventListener("keydown", function (e) {
      if (!overlay.classList.contains("lb-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft")  navigateAnimated(-1, 0);
      if (e.key === "ArrowRight") navigateAnimated(1, 0);
    });

    [imgEl, videoEl].forEach(function (el) {
      el.addEventListener("pointerdown",  onPointerDown);
      el.addEventListener("pointermove",  onPointerMove);
      el.addEventListener("pointerup",    onPointerUp);
      el.addEventListener("pointercancel", onPointerUp);
    });
    mediaEl = imgEl;
  }

  /* ─── media set (images + videos, in gallery order) ─── */
  function getImagesFromContainer(el) {
    var c = el.closest(".scroll-container");
    if (!c) return [el];
    return Array.from(c.querySelectorAll("img.fullscreen-image, video.fullscreen-image"))
      .filter(function (m) { return window.getComputedStyle(m).display !== "none"; });
  }

  function open(clickedEl) {
    currentImages = getImagesFromContainer(clickedEl);
    currentIndex  = currentImages.indexOf(clickedEl);
    if (currentIndex < 0) currentIndex = 0;
    loadItem(currentImages[currentIndex]);
    resetTransform(true);
    wheelAccum = 0;
    wheelCooldownUntil = 0;
    overlay.classList.add("lb-open");
    document.body.classList.add("lb-active");
    updateNavButtons();
    closeBtn.focus();
  }

  /* Show the given gallery element; switches mediaEl between img and video. */
  function loadItem(el) {
    if (el.tagName === "VIDEO") {
      imgEl.style.display = "none";
      var src = el.currentSrc ||
        (el.querySelector("source") && el.querySelector("source").src) || "";
      if (videoEl.getAttribute("src") !== src) videoEl.src = src;
      videoEl.style.display = "block";
      var p = videoEl.play();
      if (p && p.catch) p.catch(function () {});
      mediaEl = videoEl;
    } else {
      if (!videoEl.paused) videoEl.pause();
      videoEl.style.display = "none";
      imgEl.src = el.src;
      imgEl.alt = el.alt || "";
      imgEl.style.display = "";
      mediaEl = imgEl;
    }
  }

  function close() {
    overlay.classList.remove("lb-open");
    document.body.classList.remove("lb-active");
    if (!videoEl.paused) videoEl.pause();
    setTimeout(function () {
      imgEl.src = ""; imgEl.alt = "";
      videoEl.removeAttribute("src");
      videoEl.load();
    }, 260);
  }

  function updateNavButtons() {
    var single = currentImages.length <= 1;
    prevBtn.style.display = single ? "none" : "";
    nextBtn.style.display = single ? "none" : "";
    prevBtn.style.opacity = currentIndex === 0 ? "0.25" : "";
    nextBtn.style.opacity = currentIndex === currentImages.length - 1 ? "0.25" : "";
    hbarEl.style.display = single ? "none" : "";
    if (!single) {
      hthumbEl.style.width = (100 / currentImages.length) + "%";
      hthumbEl.style.left = (currentIndex * 100 / currentImages.length) + "%";
    }
  }

  /* ─── smooth navigate with exit → swap → enter ───
     The outgoing item genuinely glides off-screen (an earlier version held it
     in place briefly and then teleported it out, which read as an abrupt
     snap), fading as it goes; the incoming one eases in from the opposite
     side on a longer decelerate-only curve with a soft fade-up, so the whole
     move reads as one continuous slide instead of a swap. */
  function navigateAnimated(dir, fromOffset) {
    var next = currentIndex + dir;
    if (next < 0 || next >= currentImages.length) {
      /* revert swipe if at boundary */
      if (fromOffset !== 0) springBack();
      return;
    }
    if (isAnimating) return;
    isAnimating = true;

    var W = window.innerWidth;
    var exitX  = dir > 0 ? -W * 1.05 : W * 1.05;
    var enterX = -exitX;
    var oldEl  = mediaEl;

    /* 1. glide the current item off-screen from wherever the swipe left it */
    oldEl.style.transition = "transform .26s cubic-bezier(.5, 0, .75, .6), opacity .26s ease";
    oldEl.style.transform  = "translate(" + exitX + "px, 0) scale(1)";
    oldEl.style.opacity    = "0";

    setTimeout(function () {
      /* 2. swap to new item (may switch between img and video element) */
      currentIndex = next;
      loadItem(currentImages[currentIndex]);
      var newEl = mediaEl;
      if (newEl !== oldEl) {
        /* park the outgoing element (loadItem display:none'd it) */
        oldEl.style.transition = "none";
        oldEl.style.transform  = "translate(0, 0) scale(1)";
        oldEl.style.opacity    = "";
      }

      /* 3. place new item off-screen on the opposite side */
      newEl.style.transition = "none";
      newEl.style.transform  = "translate(" + enterX + "px, 0) scale(1)";
      newEl.style.opacity    = "0";

      /* 4. ease into view */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          newEl.style.transition = "transform .44s cubic-bezier(.22, 1, .36, 1), opacity .3s ease";
          newEl.style.transform  = "translate(0, 0) scale(1)";
          newEl.style.opacity    = "1";
          setTimeout(function () {
            newEl.style.opacity = "";
            resetTransform(true);
            isAnimating = false;
            updateNavButtons();
          }, 450);
        });
      });
    }, 240);
  }

  function springBack() {
    setTranslate(0, 0, "transform .32s cubic-bezier(.22, 1, .36, 1)");
    setTimeout(function () { resetTransform(true); }, 340);
  }

  /* ─── transform helpers ─── */
  function setTranslate(tx, ty, transition) {
    swipeOffset = tx;
    panX = ty === 0 ? tx : panX; /* keep in sync for pinch base */
    mediaEl.style.transition = transition;
    mediaEl.style.transform  = "translate(" + tx + "px, " + ty + "px) scale(" + currentScale + ")";
  }

  function resetTransform(instant) {
    currentScale = 1; baseScale = 1;
    panX = 0; panY = 0; basePanX = 0; basePanY = 0;
    swipeOffset = 0;
    mediaEl.style.transition = instant ? "none" : "transform .18s ease";
    mediaEl.style.transform  = "translate(0, 0) scale(1)";
  }

  function applyPinch() {
    mediaEl.style.transition = "none";
    mediaEl.style.transform  =
      "translate(" + panX + "px, " + panY + "px) scale(" + currentScale + ")";
  }

  function applyLiveSwipe() {
    mediaEl.style.transition = "none";
    mediaEl.style.transform  = "translate(" + swipeOffset + "px, 0) scale(1)";
  }

  /* ─── pointer helpers ─── */
  function dist(a, b) {
    return Math.sqrt(Math.pow(a.clientX - b.clientX, 2) + Math.pow(a.clientY - b.clientY, 2));
  }
  function mid(a, b) {
    return { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 };
  }
  function ptrs() { return Object.values(activePointers); }

  /* ─── pointer events ─── */
  function onPointerDown(e) {
    if (isAnimating) { e.preventDefault(); return; }
    mediaEl.setPointerCapture(e.pointerId);
    activePointers[e.pointerId] = { clientX: e.clientX, clientY: e.clientY };

    var list = ptrs();
    if (list.length === 2) {
      /* start pinch */
      startDist  = dist(list[0], list[1]);
      var m      = mid(list[0], list[1]);
      startMidX  = m.x; startMidY = m.y;
      baseScale  = currentScale;
      basePanX   = panX; basePanY = panY;
      isSwipe    = false; isPan = false;
    } else if (list.length === 1) {
      swipeStartX = e.clientX; swipeStartY = e.clientY;
      panStartX   = e.clientX; panStartY   = e.clientY;
      basePanX    = panX;      basePanY    = panY;
      isSwipe     = currentScale <= 1.05;
      swipeAxis   = null;
      isPan       = currentScale > 1.05;
    }
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (isAnimating) { e.preventDefault(); return; }
    activePointers[e.pointerId] = { clientX: e.clientX, clientY: e.clientY };
    var list = ptrs();

    if (list.length === 2) {
      isSwipe = false; isPan = false;
      var d  = dist(list[0], list[1]);
      var ns = Math.min(Math.max(baseScale * (d / startDist), 1), 5);
      var m  = mid(list[0], list[1]);
      var sr = ns / baseScale;
      panX = m.x - startMidX + basePanX * sr + (startMidX - basePanX) * (1 - sr);
      panY = m.y - startMidY + basePanY * sr + (startMidY - basePanY) * (1 - sr);
      currentScale = ns;
      applyPinch();
    } else if (list.length === 1) {
      if (isPan) {
        panX = basePanX + (e.clientX - panStartX);
        panY = basePanY + (e.clientY - panStartY);
        applyPinch();
      } else if (isSwipe) {
        var dx = e.clientX - swipeStartX;
        var dy = e.clientY - swipeStartY;
        /* lock axis on first significant move */
        if (!swipeAxis) {
          if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
            swipeAxis = Math.abs(dx) >= Math.abs(dy) ? "h" : "v";
          }
        }
        if (swipeAxis === "h") {
          /* resist at boundaries */
          var atEdge = (dx > 0 && currentIndex === 0) ||
                       (dx < 0 && currentIndex === currentImages.length - 1);
          swipeOffset = atEdge ? dx * 0.18 : dx;
          applyLiveSwipe();
        }
        /* vertical: do nothing */
      }
    }
    e.preventDefault();
  }

  function onPointerUp(e) {
    var finalDX = e.clientX - swipeStartX;
    var finalDY = e.clientY - swipeStartY;
    var wasSwipe = isSwipe;
    var swipeLocked = isSwipe && swipeAxis === "h";

    delete activePointers[e.pointerId];
    var list = ptrs();

    if (list.length < 2) {
      baseScale = currentScale;
      basePanX  = panX; basePanY = panY;
    }
    if (list.length === 1) {
      isPan = currentScale > 1.05;
      isSwipe = false; swipeAxis = null;
      panStartX = list[0].clientX; panStartY = list[0].clientY;
      basePanX  = panX;            basePanY  = panY;
    }
    if (list.length === 0) {
      isPan = false; isSwipe = false; swipeAxis = null;
      if (currentScale <= 1.05) {
        currentScale = 1;
        if (wasSwipe && swipeLocked && Math.abs(finalDX) > window.innerWidth * COMMIT_RATIO) {
          navigateAnimated(finalDX < 0 ? 1 : -1, swipeOffset);
        } else {
          springBack();
        }
      }
    }
  }

  /* ─── delegate tap on gallery images ─── */
  function delegate() {
    document.addEventListener("click", function (e) {
      var el = e.target.closest(".scroll-container img.fullscreen-image, .scroll-container video.fullscreen-image");
      if (el) open(el);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    init();
    delegate();
  });
})();
