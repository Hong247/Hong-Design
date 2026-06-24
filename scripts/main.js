document.addEventListener("DOMContentLoaded", function () {
  var themeToggle = document.getElementById("themeToggle");

  hoverState.imageEl = document.querySelector(".hovered-image");
  initEmailCopyButton();
  applySavedTheme();
  setScrolling();
  setPageOverflow();
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
      stopIntelligentHoverPreview();
      var item = document.querySelector(".email-contact-item");
      if (item && item._copyTimer) {
        window.clearTimeout(item._copyTimer);
        item._copyTimer = null;
        item.classList.remove("is-copied");
      }
    }
  });
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  /* Event delegation — single listener on the table instead of one per row */
  var tableEl = document.querySelector(".scroll-wrapper table");
  if (tableEl) {
    tableEl.addEventListener("mouseover", function (e) {
      var trigger = e.target.closest && e.target.closest(".hover-trigger");
      if (trigger && trigger !== hoverState.trigger) {
        startIntelligentHoverPreview(trigger);
      }
    });

    tableEl.addEventListener("mousemove", function (e) {
      if (!hoverState.trigger) return;
      updateHoverPreviewParallax({ currentTarget: hoverState.trigger, clientX: e.clientX, clientY: e.clientY });
    });

    tableEl.addEventListener("mouseout", function (e) {
      var trigger = e.target.closest && e.target.closest(".hover-trigger");
      if (trigger && !trigger.contains(e.relatedTarget)) {
        stopIntelligentHoverPreview();
      }
    });
  }

  window.addEventListener("resize", function () {
    setScrolling();
    setPageOverflow();
  });

  /* Re-apply layout on bfcache restore (mobile browsers cache pages on back nav) */
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) {
      applySavedTheme();
      setScrolling();
      setPageOverflow();
      stopIntelligentHoverPreview();
    }
  });
});

var hoverState = {
  timer: null,
  index: 0,
  images: [],
  parallaxX: 0,
  parallaxY: 0,
  trigger: null,
  rafPending: false,
  imageEl: null
};

function initEmailCopyButton() {
  var item = document.querySelector(".email-contact-item");
  var btn = item && item.querySelector(".email-copy-button");
  var link = item && item.querySelector("a[href^='mailto:']");
  if (!btn || !link) return;
  var email = link.href.replace("mailto:", "").trim();
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (!email) return;
    function showCopied() {
      item.classList.add("is-copied");
      window.clearTimeout(item._copyTimer);
      item._copyTimer = window.setTimeout(function () {
        item.classList.remove("is-copied");
      }, 1400);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(showCopied).catch(showCopied);
    }
  });
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

function addScrollDots(scrollContainer) {
  var images = scrollContainer.querySelectorAll("img");

  if (images.length < 2) {
    return;
  }

  var dots = document.createElement("div");
  dots.className = "scroll-dots";
  dots.setAttribute("role", "tablist");
  dots.setAttribute("aria-label", "Gallery navigation");

  images.forEach(function (img, i) {
    var dot = document.createElement("button");
    dot.type = "button";
    dot.className = "scroll-dot" + (i === 0 ? " is-active" : "");
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", "Image " + (i + 1) + " of " + images.length);
    dot.setAttribute("aria-selected", i === 0 ? "true" : "false");
    dot.addEventListener("click", function () {
      scrollContainer.scrollTo({ left: scrollContainer.clientWidth * i, behavior: "smooth" });
    });
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
        var active = i === index;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-selected", active ? "true" : "false");
      });
    });
  }, { passive: true });
}

function startIntelligentHoverPreview(trigger) {
  stopIntelligentHoverPreview();

  hoverState.trigger = trigger;
  hoverState.images = getHoverPreviewImages(trigger);
  hoverState.index = 0;
  hoverState.parallaxX = 0;
  hoverState.parallaxY = 0;

  if (!hoverState.images.length) {
    return;
  }

  showHoveredPreviewImage(hoverState.images[hoverState.index]);

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (hoverState.images.length > 1 && !prefersReduced) {
    hoverState.timer = window.setInterval(function () {
      hoverState.index = (hoverState.index + 1) % hoverState.images.length;
      showHoveredPreviewImage(hoverState.images[hoverState.index]);
    }, 750);
  }
}

function stopIntelligentHoverPreview() {
  if (hoverState.timer) {
    window.clearInterval(hoverState.timer);
    hoverState.timer = null;
  }

  hoverState.trigger = null;
  hoverState.images = [];
  hoverState.index = 0;
  hoverState.parallaxX = 0;
  hoverState.parallaxY = 0;

  if (hoverState.imageEl) {
    hoverState.imageEl.style.display = "none";
    hoverState.imageEl.style.transform = "";
    hoverState.imageEl.removeAttribute("src");
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
  if (!hoverState.imageEl || !source) {
    return;
  }

  hoverState.imageEl.alt = hoverState.trigger ? (hoverState.trigger.getAttribute("data-project") || "") : "";
  hoverState.imageEl.style.opacity = "0";
  hoverState.imageEl.style.display = "block";
  applyHoverPreviewParallax();

    window.setTimeout(function () {
    hoverState.imageEl.onerror = function () {
      hoverState.imageEl.style.display = "none";
      hoverState.imageEl.onerror = null;
    };
    hoverState.imageEl.src = source;
    hoverState.imageEl.style.opacity = "1";
    applyHoverPreviewParallax();
  }, 90);
}

function updateHoverPreviewParallax(event) {
  if (!hoverState.imageEl || !hoverState.imageEl.getAttribute("src")) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  var row = event.currentTarget;
  var rect = row.getBoundingClientRect();
  hoverState.parallaxX = (rect.width ? (event.clientX - rect.left) / rect.width - 0.5 : 0) * 10;
  hoverState.parallaxY = (rect.height ? (event.clientY - rect.top) / rect.height - 0.5 : 0) * 8;

  if (!hoverState.rafPending) {
    hoverState.rafPending = true;
    window.requestAnimationFrame(function () {
      hoverState.rafPending = false;
      applyHoverPreviewParallax();
    });
  }
}

function applyHoverPreviewParallax() {
  if (!hoverState.imageEl) {
    return;
  }

  hoverState.imageEl.style.transform = "translate(" + hoverState.parallaxX + "px, " + hoverState.parallaxY + "px)";
}
