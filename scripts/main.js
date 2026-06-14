document.addEventListener("DOMContentLoaded", function () {
  var themeToggle = document.getElementById("themeToggle");
  var projectButtons = document.querySelectorAll(".custom-btn[data-target]");
  var hoverTriggers = document.querySelectorAll(".hover-trigger");

  addContactEmailLink();
  applySavedTheme();
  elevatePortfolioIntroCopy();
  applyRefinedRoleLabels();
  groupProjectDescriptions();
  setScrolling();
  setPageOverflow();

  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  projectButtons.forEach(function (button) {
    button.setAttribute("aria-expanded", "false");

    button.addEventListener("click", function () {
      var targetSelector = button.getAttribute("data-target");
      var target = document.querySelector(targetSelector);

      if (!target) {
        return;
      }

      document.querySelectorAll("tr.collapse").forEach(function (row) {
        if (row !== target) {
          closeProjectRow(row);
        }
      });

      if (target.classList.contains("is-open")) {
        closeProjectRow(target);
        return;
      }

      openProjectRow(target);
      forceProjectHeaderToTop(button);
    });
  });

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

function renumberProjectArchive() {
  document.querySelectorAll("tbody .hover-trigger").forEach(function (row, index) {
    var numberButton = row.querySelector("td:first-child .custom-btn");

    if (numberButton) {
      numberButton.textContent = String(index + 1).padStart(2, "0");
    }
  });
}

function applySavedTheme() {
  setTheme("light");
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

function elevatePortfolioIntroCopy() {
  setText(".intro-kicker", "Vancouver, BC / brand systems, visual direction, product thinking");
  setText(".intro-statement", "I build visual systems that translate strategy into clear, memorable, and commercially usable design.");
  setText(".intro-detail", "My work sits between brand identity, campaign direction, digital experience, product design, and rendered visualization. I approach design as a system of decisions: how an idea is positioned, how it behaves across touchpoints, how visual language supports business intent, and how a concept can remain coherent when it moves from presentation into production.");

  updateFact("Focus", "Brand systems / campaign direction / product-led visual experiences");
  updateFact("Tools", "Adobe CC / Figma / SolidWorks / KeyShot / research / art direction");
  updateFact("Experience", "Work across hospitality, retail, mobility, recruitment, environmental campaigns, and product concepts");
}

function setText(selector, value) {
  var element = document.querySelector(selector);

  if (element) {
    element.textContent = value;
  }
}

function updateFact(label, value) {
  document.querySelectorAll(".profile-facts div").forEach(function (item) {
    var term = item.querySelector("dt");
    var description = item.querySelector("dd");

    if (term && description && term.textContent.trim() === label) {
      description.textContent = value;
    }
  });
}

function applyRefinedRoleLabels() {
  var roleLabels = {
    "demo-cmarket-tote-bag": "Merchandise Design",
    "demo-cmarket-site": "Web Design",
    demo1: "Brand Identity",
    demo2: "Brand Identity",
    demo3: "Art Direction",
    demo4: "UI Prototype",
    demo5: "Poster Design",
    demo6: "Campaign Design",
    demo7: "Editorial Design",
    demo8: "Brand Identity",
    demo9: "UI/UX Design",
    demo10: "Product Design",
    demo11: "Web Design",
    demo12: "Furniture Design",
    demo13: "Industrial Design",
    demo14: "Logo Design"
  };

  Object.keys(roleLabels).forEach(function (targetId) {
    document.querySelectorAll('.custom-btn[data-target="#' + targetId + '"]').forEach(function (button) {
      var cell = button.closest("td");

      if (cell && cell.classList.contains("role-cell")) {
        button.textContent = roleLabels[targetId];
      }
    });
  });
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

function groupProjectDescriptions() {
  document.querySelectorAll("tr.collapse > td").forEach(function (cell) {
    if (cell.querySelector(".project-detail")) {
      return;
    }

    var media = cell.querySelector(":scope > .scroll-container");
    var paragraphs = Array.from(cell.querySelectorAll(":scope > p"));

    if (!media || !paragraphs.length) {
      return;
    }

    var detail = document.createElement("div");
    detail.className = "project-detail";

    var description = document.createElement("div");
    description.className = "project-description";

    media.before(detail);
    detail.appendChild(media);
    detail.appendChild(description);

    paragraphs.forEach(function (paragraph) {
      description.appendChild(paragraph);
    });

    Array.from(cell.querySelectorAll(":scope > br")).forEach(function (breakElement) {
      breakElement.remove();
    });
  });
}

function setExpandedState(targetId, isExpanded) {
  if (!targetId) {
    return;
  }

  document.querySelectorAll('.custom-btn[data-target="#' + targetId + '"]').forEach(function (button) {
    button.setAttribute("aria-expanded", isExpanded ? "true" : "false");
  });
}

function getProjectDetail(row) {
  return row ? row.querySelector(".project-detail") : null;
}

function openProjectRow(row) {
  var detail = getProjectDetail(row);

  if (!row || !detail) {
    return;
  }

  window.clearTimeout(row.closeTimer);
  window.clearTimeout(row.openTimer);
  row.classList.remove("is-closing");
  row.classList.add("is-open");
  setExpandedState(row.id, true);

  detail.style.maxHeight = "0px";
  detail.style.opacity = "0";
  detail.style.transform = "translateY(-8px)";

  window.requestAnimationFrame(function () {
    detail.style.maxHeight = detail.scrollHeight + "px";
    detail.style.opacity = "1";
    detail.style.transform = "translateY(0)";
  });

  row.openTimer = window.setTimeout(function () {
    if (row.classList.contains("is-open")) {
      detail.style.maxHeight = "none";
    }
  }, 340);
}

function closeProjectRow(row) {
  var detail = getProjectDetail(row);

  if (!row || !detail || (!row.classList.contains("is-open") && !row.classList.contains("is-closing"))) {
    return;
  }

  window.clearTimeout(row.closeTimer);
  window.clearTimeout(row.openTimer);
  row.classList.add("is-closing");
  row.classList.remove("is-open");
  setExpandedState(row.id, false);

  detail.style.maxHeight = detail.scrollHeight + "px";
  detail.style.opacity = "1";
  detail.style.transform = "translateY(0)";

  window.requestAnimationFrame(function () {
    detail.style.maxHeight = "0px";
    detail.style.opacity = "0";
    detail.style.transform = "translateY(-8px)";
  });

  row.closeTimer = window.setTimeout(function () {
    row.classList.remove("is-closing");
    detail.style.maxHeight = "";
    detail.style.opacity = "";
    detail.style.transform = "";
  }, 340);
}

function forceProjectHeaderToTop(button) {
  var projectHeader = button.closest(".hover-trigger");
  var topOffset = window.innerWidth <= 768 ? 18 : 32;

  if (!projectHeader) {
    return;
  }

  function scrollEveryContainer() {
    var targetRect = projectHeader.getBoundingClientRect();
    var current = projectHeader.parentElement;

    while (current && current !== document.documentElement) {
      var style = window.getComputedStyle(current);
      var canScroll = current.scrollHeight > current.clientHeight + 2;
      var allowsScroll = /(auto|scroll|overlay)/.test(style.overflowY) || /(auto|scroll|overlay)/.test(style.overflow);

      if (canScroll && allowsScroll) {
        var parentRect = current.getBoundingClientRect();
        current.scrollTop += targetRect.top - parentRect.top - topOffset;
      }

      current = current.parentElement;
    }

    projectHeader.scrollIntoView({ block: "start", inline: "nearest" });
    window.scrollBy(0, -topOffset);
  }

  scrollEveryContainer();
  window.requestAnimationFrame(scrollEveryContainer);
  window.setTimeout(scrollEveryContainer, 80);
  window.setTimeout(scrollEveryContainer, 220);
  window.setTimeout(scrollEveryContainer, 420);
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

  if (hoverPreviewImages.length > 1) {
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
  var fallback = trigger.getAttribute("data-image-source");
  var targetButton = trigger.querySelector(".custom-btn[data-target]");
  var targetSelector = targetButton ? targetButton.getAttribute("data-target") : "";
  var detail = targetSelector ? document.querySelector(targetSelector) : null;
  var sources = [];

  if (fallback) {
    sources.push(fallback);
  }

  if (detail) {
    detail.querySelectorAll("img.fullscreen-image").forEach(function (image) {
      var source = image.getAttribute("src");

      if (source && sources.indexOf(source) === -1) {
        sources.push(source);
      }
    });
  }

  return sources.slice(0, 4);
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
