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

/* Two modes only: black chameleon and white (light) chameleon */
var THEMES = ["chameleon", "chameleon-light"];

function applySavedTheme() {
  var saved = localStorage.getItem("theme");
  setTheme(THEMES.indexOf(saved) !== -1 ? saved : "chameleon");
}

function toggleTheme() {
  var i = THEMES.indexOf(getCurrentTheme());
  setTheme(THEMES[(i + 1) % THEMES.length]);
}

function getCurrentTheme() {
  return document.body.classList.contains("chameleon-light") ? "chameleon-light" : "chameleon";
}

function setTheme(theme) {
  /* Both modes share .chameleon-mode; the white one adds .chameleon-light */
  document.body.classList.remove(
    "light-mode", "orange-mode", "dark-mode", "chameleon-light", "chroma-locked"
  );
  document.body.classList.add("chameleon-mode");
  if (theme === "chameleon-light") {
    document.body.classList.add("chameleon-light");
  }
  localStorage.setItem("theme", theme);
  resetAccent();
}

/* ── Chameleon: accent + animated background sample the hovered project ── */
var _accentCache = {};

function resetAccent() {
  var s = document.body.style;
  s.removeProperty("--accent");
  s.removeProperty("--chroma-1");
  s.removeProperty("--chroma-2");
  s.removeProperty("--chroma-3");
}

function applyColours(res) {
  var s = document.body.style;
  s.setProperty("--accent", res.accent);
  s.setProperty("--chroma-1", res.chroma[0]);
  s.setProperty("--chroma-2", res.chroma[1]);
  s.setProperty("--chroma-3", res.chroma[2]);
}

function applySampledAccent(src) {
  if (!src) return;
  var light = document.body.classList.contains("chameleon-light");
  var key = src + (light ? "|l" : "|d");
  if (_accentCache[key]) {
    applyColours(_accentCache[key]);
    return;
  }
  var img = new Image();
  img.onload = function () {
    try {
      var c = document.createElement("canvas");
      var w = (c.width = 24), h = (c.height = 24);
      var ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      var d = ctx.getImageData(0, 0, w, h).data;
      /* three horizontal bands → background palette; colourful overall → accent */
      var bands = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
      var av = [0, 0, 0, 0], cv = [0, 0, 0, 0], x, y, i, rr, gg, bb, mx, mn, band;
      for (y = 0; y < h; y++) {
        band = y < h / 3 ? 0 : y < (2 * h) / 3 ? 1 : 2;
        for (x = 0; x < w; x++) {
          i = (y * w + x) * 4; rr = d[i]; gg = d[i + 1]; bb = d[i + 2];
          bands[band][0] += rr; bands[band][1] += gg; bands[band][2] += bb; bands[band][3]++;
          av[0] += rr; av[1] += gg; av[2] += bb; av[3]++;
          mx = Math.max(rr, gg, bb); mn = Math.min(rr, gg, bb);
          if (mx < 30 || mn > 228) continue;
          cv[0] += rr; cv[1] += gg; cv[2] += bb; cv[3]++;
        }
      }
      var a = cv[3] ? cv : av;
      /* White mode wants light blobs + a dark accent; black mode the reverse */
      var accLo = light ? 0.30 : 0.55, accHi = light ? 0.46 : 0.72;
      var bgLo = light ? 0.62 : 0.26, bgHi = light ? 0.82 : 0.5;
      var res = {
        accent: vividRgb(a[0] / a[3], a[1] / a[3], a[2] / a[3], accLo, accHi),
        chroma: bands.map(function (bd) {
          return vividRgb(bd[0] / bd[3], bd[1] / bd[3], bd[2] / bd[3], bgLo, bgHi);
        })
      };
      _accentCache[key] = res;
      if (document.body.classList.contains("chameleon-mode") && hoverState.trigger) {
        applyColours(res);
      }
    } catch (e) {}
  };
  img.src = src;
}

/* Convert rgb → hsl, boost saturation, clamp lightness to a usable band */
function vividRgb(r, g, b, lMin, lMax) {
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
  l = Math.min(lMax, Math.max(lMin, l));
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
    document.body.classList.add("chroma-locked");
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

  /* Release the lock so the idle hue-cycle resumes when nothing is hovered */
  if (document.body.classList.contains("chameleon-mode")) {
    document.body.classList.remove("chroma-locked");
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
