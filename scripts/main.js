document.addEventListener("DOMContentLoaded", function () {
  var themeToggle = document.getElementById("themeToggle");
  var hoverTriggers = document.querySelectorAll(".hover-trigger");

  hoveredImageEl = document.querySelector(".hovered-image");
  initEmailCopyButton();
  applySavedTheme();
  setScrolling();
  setPageOverflow();

  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  hoverTriggers.forEach(function (trigger) {
    trigger.addEventListener("mouseenter", function () {
      startIntelligentHoverPreview(trigger);
    });

    trigger.addEventListener("mousemove", updateHoverPreviewParallax);
    trigger.addEventListener("mouseleave", stopIntelligentHoverPreview);
  });

  window.addEventListener("resize", function () {
    setScrolling();
    setPageOverflow();
  });
});

var hoverPreviewTimer = null;
var hoverPreviewIndex = 0;
var hoverPreviewImages = [];
var hoverPreviewParallaxX = 0;
var hoverPreviewParallaxY = 0;
var hoverPreviewTrigger = null;
var hoverParallaxRafPending = false;
var hoveredImageEl = null;

function initEmailCopyButton() {
  var item = document.querySelector(".email-contact-item");
  var btn = item && item.querySelector(".email-copy-button");
  if (!btn) return;
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    copyEmailAddress("cheokhong.design@gmail.com", item);
  });
}

function copyEmailAddress(email, container) {
  function showCopied() {
    container.classList.add("is-copied");
    window.clearTimeout(container._copyTimer);
    container._copyTimer = window.setTimeout(function () {
      container.classList.remove("is-copied");
    }, 1400);
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email).then(showCopied).catch(function () {
      fallbackCopy(email); showCopied();
    });
    return;
  }
  fallbackCopy(email); showCopied();
}

function fallbackCopy(email) {
  var el = document.createElement("textarea");
  el.value = email;
  el.setAttribute("readonly", "");
  el.style.cssText = "position:fixed;top:-9999px;left:-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

function applySavedTheme() {
  var saved = localStorage.getItem("theme");
  setTheme(saved === "orange" || saved === "dark" || saved === "light" ? saved : "light");
}

function toggleTheme() {
  var currentTheme = getCurrentTheme();
  var nextTheme = currentTheme === "light" ? "orange" : currentTheme === "orange" ? "dark" : "light";

  setTheme(nextTheme);
}

function getCurrentTheme() {
  if (document.body.classList.contains("orange-mode")) {
    return "orange";
  }

  if (document.body.classList.contains("dark-mode")) {
    return "dark";
  }

  return "light";
}

function setTheme(theme) {
  document.body.classList.remove("light-mode", "orange-mode", "dark-mode");
  document.body.classList.add(theme + "-mode");
  localStorage.setItem("theme", theme);
}

function setScrolling() {
  var leftContent = document.querySelector(".left-theme .overlay-text");
  var rightContent = document.querySelector(".right-theme .scroll-wrapper");

  if (!leftContent || !rightContent) {
    return;
  }

  if (window.innerWidth <= 768) {
    leftContent.style.overflowY = "hidden";
    rightContent.style.overflowY = "visible";
    return;
  }

  leftContent.style.overflowY = leftContent.scrollHeight > leftContent.clientHeight ? "auto" : "hidden";
  rightContent.style.overflowY = "auto";
}

function setPageOverflow() {
  document.body.style.overflowY = window.innerWidth <= 768 ? "auto" : "hidden";
}

window.addScrollDots = addScrollDots;

// FIX 1: Render progress dots below each image gallery on mobile
function addScrollDots(scrollContainer) {
  var images = scrollContainer.querySelectorAll("img");

  if (images.length < 2) {
    return;
  }

  var dots = document.createElement("div");
  dots.className = "scroll-dots";

  images.forEach(function (_, i) {
    var dot = document.createElement("span");
    dot.className = "scroll-dot" + (i === 0 ? " is-active" : "");
    dots.appendChild(dot);
  });

  scrollContainer.parentNode.insertBefore(dots, scrollContainer.nextSibling);

  var scrollDotRafPending = false;
  scrollContainer.addEventListener("scroll", function () {
    if (scrollDotRafPending) return;
    scrollDotRafPending = true;
    window.requestAnimationFrame(function () {
      scrollDotRafPending = false;
      var index = Math.round(scrollContainer.scrollLeft / scrollContainer.clientWidth);
      dots.querySelectorAll(".scroll-dot").forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    });
  }, { passive: true });
}

function startIntelligentHoverPreview(trigger) {
  stopIntelligentHoverPreview();

  hoverPreviewTrigger = trigger;
  hoverPreviewImages = getHoverPreviewImages(trigger);
  hoverPreviewIndex = 0;
  hoverPreviewParallaxX = 0;
  hoverPreviewParallaxY = 0;

  if (!hoverPreviewImages.length) {
    return;
  }

  showHoveredPreviewImage(hoverPreviewImages[hoverPreviewIndex]);

  // FIX 6: Respect prefers-reduced-motion — skip cycling animation if user requested less motion
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (hoverPreviewImages.length > 1 && !prefersReduced) {
    hoverPreviewTimer = window.setInterval(function () {
      hoverPreviewIndex = (hoverPreviewIndex + 1) % hoverPreviewImages.length;
      showHoveredPreviewImage(hoverPreviewImages[hoverPreviewIndex]);
    }, 950);
  }
}

function stopIntelligentHoverPreview() {
  if (hoverPreviewTimer) {
    window.clearInterval(hoverPreviewTimer);
    hoverPreviewTimer = null;
  }

  hoverPreviewTrigger = null;
  hoverPreviewImages = [];
  hoverPreviewIndex = 0;
  hoverPreviewParallaxX = 0;
  hoverPreviewParallaxY = 0;

  if (hoveredImageEl) {
    hoveredImageEl.style.display = "none";
    hoveredImageEl.style.transform = "";
    hoveredImageEl.removeAttribute("src");
  }
}

function getHoverPreviewImages(trigger) {
  var gallerySrcs = trigger.getAttribute("data-gallery-srcs");

  if (gallerySrcs) {
    return gallerySrcs.split("|").filter(Boolean).slice(0, 4);
  }

  var fallback = trigger.getAttribute("data-image-source");
  return fallback ? [fallback] : [];
}

function showHoveredPreviewImage(source) {
  if (!hoveredImageEl || !source) {
    return;
  }

  hoveredImageEl.alt = hoverPreviewTrigger ? (hoverPreviewTrigger.getAttribute("data-project") || "") : "";
  hoveredImageEl.style.opacity = "0";
  hoveredImageEl.style.display = "block";
  applyHoverPreviewParallax();

  window.setTimeout(function () {
    hoveredImageEl.src = source;
    hoveredImageEl.style.opacity = "1";
    applyHoverPreviewParallax();
  }, 90);
}

function updateHoverPreviewParallax(event) {
  if (!hoveredImageEl || !hoveredImageEl.getAttribute("src")) {
    return;
  }

  var row = event.currentTarget;
  var rect = row.getBoundingClientRect();
  hoverPreviewParallaxX = (rect.width ? (event.clientX - rect.left) / rect.width - 0.5 : 0) * 10;
  hoverPreviewParallaxY = (rect.height ? (event.clientY - rect.top) / rect.height - 0.5 : 0) * 8;

  if (!hoverParallaxRafPending) {
    hoverParallaxRafPending = true;
    window.requestAnimationFrame(function () {
      hoverParallaxRafPending = false;
      applyHoverPreviewParallax();
    });
  }
}

function applyHoverPreviewParallax() {
  if (!hoveredImageEl) {
    return;
  }

  hoveredImageEl.style.transform = "translate(" + hoverPreviewParallaxX + "px, " + hoverPreviewParallaxY + "px)";
}

