document.addEventListener("DOMContentLoaded", function () {
  var themeToggle = document.getElementById("themeToggle");
  var hoverTriggers = document.querySelectorAll(".hover-trigger");

  addContactEmailLink();
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

function addContactEmailLink() {
  var socialLinks = document.querySelector(".social-links");

  if (!socialLinks || socialLinks.querySelector('a[href="mailto:cheokhong.design@gmail.com"]')) {
    return;
  }

  var item = document.createElement("li");
  var link = document.createElement("a");
  var copyButton = document.createElement("button");
  var feedback = document.createElement("span");

  item.className = "email-contact-item";
  link.href = "mailto:cheokhong.design@gmail.com";
  link.textContent = "Email";
  copyButton.type = "button";
  copyButton.className = "email-copy-button";
  copyButton.setAttribute("aria-label", "Copy email address");
  copyButton.textContent = "⧉";
  feedback.className = "email-copy-feedback";
  feedback.textContent = "Email copied";

  copyButton.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    copyEmailAddress("cheokhong.design@gmail.com", item);
  });

  item.appendChild(link);
  item.appendChild(copyButton);
  item.appendChild(feedback);
  socialLinks.appendChild(item);
}

function copyEmailAddress(email, container) {
  function showCopiedState() {
    if (!container) {
      return;
    }

    container.classList.add("is-copied");
    window.clearTimeout(container.copyTimer);
    container.copyTimer = window.setTimeout(function () {
      container.classList.remove("is-copied");
    }, 1400);
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email).then(showCopiedState).catch(function () {
      fallbackCopyEmailAddress(email);
      showCopiedState();
    });
    return;
  }

  fallbackCopyEmailAddress(email);
  showCopiedState();
}

function fallbackCopyEmailAddress(email) {
  var temporaryInput = document.createElement("textarea");

  temporaryInput.value = email;
  temporaryInput.setAttribute("readonly", "readonly");
  temporaryInput.style.position = "fixed";
  temporaryInput.style.top = "-9999px";
  temporaryInput.style.left = "-9999px";
  document.body.appendChild(temporaryInput);
  temporaryInput.select();
  document.execCommand("copy");
  document.body.removeChild(temporaryInput);
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

  scrollContainer.addEventListener("scroll", function () {
    var index = Math.round(scrollContainer.scrollLeft / scrollContainer.clientWidth);
    dots.querySelectorAll(".scroll-dot").forEach(function (dot, i) {
      dot.classList.toggle("is-active", i === index);
    });
  });
}

function startIntelligentHoverPreview(trigger) {
  stopIntelligentHoverPreview();

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
  var hoveredImage = document.querySelector(".hovered-image");

  if (hoverPreviewTimer) {
    window.clearInterval(hoverPreviewTimer);
    hoverPreviewTimer = null;
  }

  hoverPreviewImages = [];
  hoverPreviewIndex = 0;
  hoverPreviewParallaxX = 0;
  hoverPreviewParallaxY = 0;

  if (hoveredImage) {
    hoveredImage.style.display = "none";
    hoveredImage.style.transform = "";
    hoveredImage.removeAttribute("src");
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
  var hoveredImage = document.querySelector(".hovered-image");

  if (!hoveredImage || !source) {
    return;
  }

  hoveredImage.style.opacity = "0";
  hoveredImage.style.display = "block";
  applyHoverPreviewParallax();

  window.setTimeout(function () {
    hoveredImage.src = source;
    hoveredImage.style.opacity = "1";
    applyHoverPreviewParallax();
  }, 90);
}

function updateHoverPreviewParallax(event) {
  var hoveredImage = document.querySelector(".hovered-image");
  var row = event.currentTarget;
  var rect = row.getBoundingClientRect();
  var relativeX = rect.width ? (event.clientX - rect.left) / rect.width - 0.5 : 0;
  var relativeY = rect.height ? (event.clientY - rect.top) / rect.height - 0.5 : 0;

  if (!hoveredImage || !hoveredImage.getAttribute("src")) {
    return;
  }

  hoverPreviewParallaxX = relativeX * 10;
  hoverPreviewParallaxY = relativeY * 8;
  applyHoverPreviewParallax();
}

function applyHoverPreviewParallax() {
  var hoveredImage = document.querySelector(".hovered-image");

  if (!hoveredImage) {
    return;
  }

  hoveredImage.style.transform = "translate(" + hoverPreviewParallaxX + "px, " + hoverPreviewParallaxY + "px)";
}

function displayHoveredImage(imageSource) {
  var hoveredImage = document.querySelector(".hovered-image");

  if (!hoveredImage || !imageSource) {
    return;
  }

  hoveredImage.src = imageSource;
  hoveredImage.style.display = "block";
}

function hideHoveredImage() {
  stopIntelligentHoverPreview();
}
