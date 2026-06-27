document.addEventListener("DOMContentLoaded", function () {
  var themeToggle = document.getElementById("themeToggle");

  hoverState.imageEl = document.querySelector(".hovered-image");
  hoverState.captionEl = document.querySelector(".hovered-caption");
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
  imageEl: null,
  captionEl: null
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

var THEMES = ["light", "orange", "dark", "chameleon"];

function applySavedTheme() {
  var saved = localStorage.getItem("theme");
  setTheme(THEMES.indexOf(saved) !== -1 ? saved : "light");
}

function toggleTheme() {
  var i = THEMES.indexOf(getCurrentTheme());
  setTheme(THEMES[(i + 1) % THEMES.length]);
}

function getCurrentTheme() {
  if (document.body.classList.contains("orange-mode")) {
    return "orange";
  }
  if (document.body.classList.contains("dark-mode")) {
    return "dark";
  }
  if (document.body.classList.contains("chameleon-mode")) {
    return "chameleon";
  }
  return "light";
}

function setTheme(theme) {
  document.body.classList.remove("light-mode", "orange-mode", "dark-mode", "chameleon-mode");
  document.body.classList.add(theme + "-mode");
  localStorage.setItem("theme", theme);
  /* Drop any live chameleon accent so other modes use the CSS default */
  resetAccent();
}

/* ── Chameleon mode: accent samples the hovered project's preview ── */
var _accentCache = {};

function resetAccent() {
  document.documentElement.style.removeProperty("--accent");
}

function applySampledAccent(src) {
  if (!src) return;
  if (_accentCache[src]) {
    document.documentElement.style.setProperty("--accent", _accentCache[src]);
    return;
  }
  var img = new Image();
  img.onload = function () {
    try {
      var c = document.createElement("canvas");
      var w = (c.width = 16), h = (c.height = 16);
      var ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      var d = ctx.getImageData(0, 0, w, h).data;
      var r = 0, g = 0, b = 0, n = 0, i, rr, gg, bb, mx, mn;
      /* average only the colourful mid-tones — skip near-black / near-white */
      for (i = 0; i < d.length; i += 4) {
        rr = d[i]; gg = d[i + 1]; bb = d[i + 2];
        mx = Math.max(rr, gg, bb); mn = Math.min(rr, gg, bb);
        if (mx < 30 || mn > 228) continue;
        r += rr; g += gg; b += bb; n++;
      }
      if (!n) {
        for (i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; n++; }
      }
      var col = vividRgb(r / n, g / n, b / n);
      _accentCache[src] = col;
      /* only apply if we're still in chameleon mode and still hovering */
      if (document.body.classList.contains("chameleon-mode") && hoverState.trigger) {
        document.documentElement.style.setProperty("--accent", col);
      }
    } catch (e) {}
  };
  img.src = src;
}

/* Nudge saturation/brightness up so the accent always reads as an accent */
function vividRgb(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  var mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, s = 0, h = 0, dd = mx - mn;
  if (dd) {
    s = dd / (1 - Math.abs(2 * l - 1));
    if (mx === r) h = ((g - b) / dd) % 6;
    else if (mx === g) h = (b - r) / dd + 2;
    else h = (r - g) / dd + 4;
    h *= 60; if (h < 0) h += 360;
  }
  s = Math.min(1, s * 1.5 + 0.15);
  l = Math.min(0.62, Math.max(0.42, l));
  return "hsl(" + Math.round(h) + ", " + Math.round(s * 100) + "%, " + Math.round(l * 100) + "%)";
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
  /* Only count images actually visible in this viewport — some projects hide a
     desktop/mobile image set via display:none (e.g. Kee's keem/keen split). */
  var images = Array.prototype.slice
    .call(scrollContainer.querySelectorAll("img"))
    .filter(function (img) {
      return window.getComputedStyle(img).display !== "none";
    });

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
      var offset = img.getBoundingClientRect().left - scrollContainer.getBoundingClientRect().left;
      scrollContainer.scrollTo({ left: scrollContainer.scrollLeft + offset, behavior: "smooth" });
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
      /* Active = whichever visible image sits closest to the container's left edge,
         since image widths vary (no fixed one-image-per-viewport assumption). */
      var containerLeft = scrollContainer.getBoundingClientRect().left;
      var index = 0;
      var closest = Infinity;
      images.forEach(function (img, i) {
        var dist = Math.abs(img.getBoundingClientRect().left - containerLeft);
        if (dist < closest) {
          closest = dist;
          index = i;
        }
      });
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

  if (hoverState.captionEl) {
    var title = trigger.getAttribute("data-project") || "";
    var year = trigger.getAttribute("data-year") || "";
    hoverState.captionEl.textContent = year ? title + "  ·  " + year : title;
  }

  if (document.body.classList.contains("chameleon-mode")) {
    applySampledAccent(trigger.getAttribute("data-image-source"));
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

  /* Chameleon accent breathes back to its default when nothing is hovered */
  if (document.body.classList.contains("chameleon-mode")) {
    resetAccent();
  }
}

function getHoverPreviewImages(trigger) {
  var gallerySrcs = trigger.getAttribute("data-gallery-srcs");

  if (gallerySrcs) {
    return gallerySrcs.split("|").filter(Boolean);
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
