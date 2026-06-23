(function () {
  var overlay, imgEl, closeBtn, prevBtn, nextBtn;
  var startDist = 0, currentScale = 1, baseScale = 1;
  var startMidX = 0, startMidY = 0;
  var translateX = 0, translateY = 0, baseX = 0, baseY = 0;
  var isDragging = false, dragStartX = 0, dragStartY = 0, dragBaseX = 0, dragBaseY = 0;
  var activePointers = {};

  /* swipe tracking (at scale=1 only) */
  var swipeStartX = 0, swipeStartY = 0, swipeActive = false;
  var SWIPE_THRESHOLD = 50;

  /* image set for the active scroll-container */
  var currentImages = [];
  var currentIndex = 0;

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
    prevBtn.addEventListener("click", function () { navigate(-1); });
    nextBtn.addEventListener("click", function () { navigate(1); });

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });

    document.addEventListener("keydown", function (e) {
      if (!overlay.classList.contains("lb-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    });

    imgEl.addEventListener("pointerdown", onPointerDown);
    imgEl.addEventListener("pointermove", onPointerMove);
    imgEl.addEventListener("pointerup", onPointerUp);
    imgEl.addEventListener("pointercancel", onPointerUp);
  }

  function getImagesFromContainer(clickedImg) {
    var container = clickedImg.closest(".scroll-container");
    if (!container) return [clickedImg];
    return Array.from(container.querySelectorAll("img.fullscreen-image"));
  }

  function open(clickedImg) {
    currentImages = getImagesFromContainer(clickedImg);
    currentIndex = currentImages.indexOf(clickedImg);
    if (currentIndex < 0) currentIndex = 0;
    showImage(currentIndex, true);
    overlay.classList.add("lb-open");
    document.body.classList.add("lb-active");
    updateNavButtons();
    closeBtn.focus();
  }

  function showImage(index, instant, dir) {
    var img = currentImages[index];
    if (!img) return;
    if (instant) {
      imgEl.src = img.src;
      imgEl.alt = img.alt || "";
      imgEl.classList.remove("lb-slide-left", "lb-slide-right");
    } else {
      var slideClass = dir > 0 ? "lb-slide-left" : "lb-slide-right";
      imgEl.classList.remove("lb-slide-left", "lb-slide-right");
      /* force reflow so removing then adding triggers re-animation */
      void imgEl.offsetWidth;
      imgEl.src = img.src;
      imgEl.alt = img.alt || "";
      imgEl.classList.add(slideClass);
    }
    resetTransform();
    updateNavButtons();
  }

  function navigate(dir) {
    var next = currentIndex + dir;
    if (next < 0 || next >= currentImages.length) return;
    currentIndex = next;
    showImage(currentIndex, false, dir);
  }

  function updateNavButtons() {
    var single = currentImages.length <= 1;
    prevBtn.style.display = single ? "none" : "";
    nextBtn.style.display = single ? "none" : "";
    prevBtn.style.opacity = currentIndex === 0 ? "0.25" : "";
    nextBtn.style.opacity = currentIndex === currentImages.length - 1 ? "0.25" : "";
  }

  function close() {
    overlay.classList.remove("lb-open");
    document.body.classList.remove("lb-active");
    setTimeout(function () {
      imgEl.src = "";
      imgEl.alt = "";
    }, 260);
  }

  function resetTransform() {
    currentScale = 1;
    baseScale = 1;
    translateX = 0;
    translateY = 0;
    baseX = 0;
    baseY = 0;
    applyTransform(true);
  }

  function applyTransform(instant) {
    imgEl.style.transition = instant ? "none" : "transform .18s ease";
    imgEl.style.transform =
      "translate(" + translateX + "px, " + translateY + "px) scale(" + currentScale + ")";
  }

  function dist(p1, p2) {
    var dx = p1.clientX - p2.clientX;
    var dy = p1.clientY - p2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function mid(p1, p2) {
    return {
      x: (p1.clientX + p2.clientX) / 2,
      y: (p1.clientY + p2.clientY) / 2
    };
  }

  function pointerList() {
    return Object.values(activePointers);
  }

  function onPointerDown(e) {
    imgEl.setPointerCapture(e.pointerId);
    activePointers[e.pointerId] = { clientX: e.clientX, clientY: e.clientY, pointerId: e.pointerId };

    var ptrs = pointerList();
    if (ptrs.length === 2) {
      startDist = dist(ptrs[0], ptrs[1]);
      var m = mid(ptrs[0], ptrs[1]);
      startMidX = m.x;
      startMidY = m.y;
      baseScale = currentScale;
      baseX = translateX;
      baseY = translateY;
      isDragging = false;
      swipeActive = false;
    } else if (ptrs.length === 1) {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragBaseX = translateX;
      dragBaseY = translateY;
      swipeStartX = e.clientX;
      swipeStartY = e.clientY;
      swipeActive = currentScale <= 1.05;
    }
    e.preventDefault();
  }

  function onPointerMove(e) {
    activePointers[e.pointerId] = { clientX: e.clientX, clientY: e.clientY, pointerId: e.pointerId };
    var ptrs = pointerList();

    if (ptrs.length === 2) {
      isDragging = false;
      swipeActive = false;
      var d = dist(ptrs[0], ptrs[1]);
      var newScale = Math.min(Math.max(baseScale * (d / startDist), 1), 5);
      var m = mid(ptrs[0], ptrs[1]);
      var scaleRatio = newScale / baseScale;
      translateX = m.x - startMidX + baseX * scaleRatio + (startMidX - baseX) * (1 - scaleRatio);
      translateY = m.y - startMidY + baseY * scaleRatio + (startMidY - baseY) * (1 - scaleRatio);
      currentScale = newScale;
      applyTransform(true);
    } else if (ptrs.length === 1 && isDragging) {
      if (currentScale > 1.05) {
        swipeActive = false;
        translateX = dragBaseX + (e.clientX - dragStartX);
        translateY = dragBaseY + (e.clientY - dragStartY);
        applyTransform(true);
      }
    }
    e.preventDefault();
  }

  function onPointerUp(e) {
    var wasSwipe = swipeActive;
    var swipeDX = e.clientX - swipeStartX;
    var swipeDY = e.clientY - swipeStartY;

    delete activePointers[e.pointerId];
    var ptrs = pointerList();

    if (ptrs.length < 2) {
      baseScale = currentScale;
      baseX = translateX;
      baseY = translateY;
    }
    if (ptrs.length === 1) {
      isDragging = true;
      dragStartX = ptrs[0].clientX;
      dragStartY = ptrs[0].clientY;
      dragBaseX = translateX;
      dragBaseY = translateY;
      swipeActive = false;
    }
    if (ptrs.length === 0) {
      isDragging = false;
      swipeActive = false;
      if (currentScale <= 1.05) {
        currentScale = 1;
        translateX = 0;
        translateY = 0;
        applyTransform(false);
        /* swipe navigation at scale=1 */
        if (wasSwipe && Math.abs(swipeDX) > SWIPE_THRESHOLD && Math.abs(swipeDX) > Math.abs(swipeDY) * 1.5) {
          navigate(swipeDX < 0 ? 1 : -1);
        }
      }
    }
  }

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
