(function () {
  var overlay, imgEl, closeBtn;
  var startDist = 0, currentScale = 1, baseScale = 1;
  var startMidX = 0, startMidY = 0;
  var translateX = 0, translateY = 0, baseX = 0, baseY = 0;
  var isDragging = false, dragStartX = 0, dragStartY = 0, dragBaseX = 0, dragBaseY = 0;
  var activePointers = {};

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
    closeBtn.textContent = "×";

    overlay.appendChild(imgEl);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);

    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("lb-open")) close();
    });

    imgEl.addEventListener("pointerdown", onPointerDown);
    imgEl.addEventListener("pointermove", onPointerMove);
    imgEl.addEventListener("pointerup", onPointerUp);
    imgEl.addEventListener("pointercancel", onPointerUp);
  }

  function open(src, alt) {
    imgEl.src = src;
    imgEl.alt = alt || "";
    resetTransform();
    overlay.classList.add("lb-open");
    document.body.classList.add("lb-active");
    closeBtn.focus();
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
    } else if (ptrs.length === 1) {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragBaseX = translateX;
      dragBaseY = translateY;
    }
    e.preventDefault();
  }

  function onPointerMove(e) {
    activePointers[e.pointerId] = { clientX: e.clientX, clientY: e.clientY, pointerId: e.pointerId };
    var ptrs = pointerList();

    if (ptrs.length === 2) {
      isDragging = false;
      var d = dist(ptrs[0], ptrs[1]);
      var newScale = Math.min(Math.max(baseScale * (d / startDist), 1), 5);
      var m = mid(ptrs[0], ptrs[1]);
      var scaleRatio = newScale / baseScale;
      translateX = m.x - startMidX + baseX * scaleRatio + (startMidX - baseX) * (1 - scaleRatio);
      translateY = m.y - startMidY + baseY * scaleRatio + (startMidY - baseY) * (1 - scaleRatio);
      currentScale = newScale;
      applyTransform(true);
    } else if (ptrs.length === 1 && isDragging && currentScale > 1) {
      translateX = dragBaseX + (e.clientX - dragStartX);
      translateY = dragBaseY + (e.clientY - dragStartY);
      applyTransform(true);
    }
    e.preventDefault();
  }

  function onPointerUp(e) {
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
    }
    if (ptrs.length === 0) {
      isDragging = false;
      if (currentScale <= 1.05) {
        currentScale = 1;
        translateX = 0;
        translateY = 0;
        applyTransform(false);
      }
    }
  }

  function delegate() {
    document.addEventListener("click", function (e) {
      var img = e.target.closest(".scroll-container img.fullscreen-image");
      if (img) {
        open(img.src, img.alt);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    init();
    delegate();
  });
})();
