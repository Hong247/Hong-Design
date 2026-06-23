(function () {
  var overlay, imgEl, closeBtn, prevBtn, nextBtn;

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

    overlay.appendChild(imgEl);
    overlay.appendChild(closeBtn);
    overlay.appendChild(prevBtn);
    overlay.appendChild(nextBtn);
    document.body.appendChild(overlay);

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

    imgEl.addEventListener("pointerdown",  onPointerDown);
    imgEl.addEventListener("pointermove",  onPointerMove);
    imgEl.addEventListener("pointerup",    onPointerUp);
    imgEl.addEventListener("pointercancel", onPointerUp);
  }

  /* ─── image set ─── */
  function getImagesFromContainer(img) {
    var c = img.closest(".scroll-container");
    return c ? Array.from(c.querySelectorAll("img.fullscreen-image")) : [img];
  }

  function open(clickedImg) {
    currentImages = getImagesFromContainer(clickedImg);
    currentIndex  = currentImages.indexOf(clickedImg);
    if (currentIndex < 0) currentIndex = 0;
    loadImage(currentImages[currentIndex]);
    resetTransform(true);
    overlay.classList.add("lb-open");
    document.body.classList.add("lb-active");
    updateNavButtons();
    closeBtn.focus();
  }

  function loadImage(img) {
    imgEl.src = img.src;
    imgEl.alt = img.alt || "";
  }

  function close() {
    overlay.classList.remove("lb-open");
    document.body.classList.remove("lb-active");
    setTimeout(function () { imgEl.src = ""; imgEl.alt = ""; }, 260);
  }

  function updateNavButtons() {
    var single = currentImages.length <= 1;
    prevBtn.style.display = single ? "none" : "";
    nextBtn.style.display = single ? "none" : "";
    prevBtn.style.opacity = currentIndex === 0 ? "0.25" : "";
    nextBtn.style.opacity = currentIndex === currentImages.length - 1 ? "0.25" : "";
  }

  /* ─── smooth navigate with exit → swap → enter ─── */
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

    /* 1. animate current image off-screen */
    setTranslate(fromOffset, 0, "transform .12s cubic-bezier(.4, 0, .6, 1)");

    setTimeout(function () {
      setTranslate(exitX, 0, "none");

      /* 2. swap image */
      currentIndex = next;
      loadImage(currentImages[currentIndex]);

      /* 3. place new image off-screen on the opposite side */
      setTranslate(enterX, 0, "none");

      /* 4. animate into view */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          setTranslate(0, 0, "transform .18s cubic-bezier(.22, 1, .36, 1)");
          setTimeout(function () {
            resetTransform(true);
            isAnimating = false;
            updateNavButtons();
          }, 190);
        });
      });
    }, 120);
  }

  function springBack() {
    setTranslate(0, 0, "transform .32s cubic-bezier(.22, 1, .36, 1)");
    setTimeout(function () { resetTransform(true); }, 340);
  }

  /* ─── transform helpers ─── */
  function setTranslate(tx, ty, transition) {
    swipeOffset = tx;
    panX = ty === 0 ? tx : panX; /* keep in sync for pinch base */
    imgEl.style.transition = transition;
    imgEl.style.transform  = "translate(" + tx + "px, " + ty + "px) scale(" + currentScale + ")";
  }

  function resetTransform(instant) {
    currentScale = 1; baseScale = 1;
    panX = 0; panY = 0; basePanX = 0; basePanY = 0;
    swipeOffset = 0;
    imgEl.style.transition = instant ? "none" : "transform .18s ease";
    imgEl.style.transform  = "translate(0, 0) scale(1)";
  }

  function applyPinch() {
    imgEl.style.transition = "none";
    imgEl.style.transform  =
      "translate(" + panX + "px, " + panY + "px) scale(" + currentScale + ")";
  }

  function applyLiveSwipe() {
    imgEl.style.transition = "none";
    imgEl.style.transform  = "translate(" + swipeOffset + "px, 0) scale(1)";
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
    imgEl.setPointerCapture(e.pointerId);
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
      var img = e.target.closest(".scroll-container img.fullscreen-image");
      if (img) open(img);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    init();
    delegate();
  });
})();
