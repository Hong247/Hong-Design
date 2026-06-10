document.addEventListener("DOMContentLoaded", function () {
  var themeToggle = document.getElementById("themeToggle");
  var projectButtons = document.querySelectorAll(".custom-btn[data-target]");
  var hoverTriggers = document.querySelectorAll(".hover-trigger");

  applySavedTheme();
  elevatePortfolioIntroCopy();
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
      displayHoveredImage(trigger.getAttribute("data-image-source"));
    });

    trigger.addEventListener("mouseleave", hideHoveredImage);
  });

  window.addEventListener("resize", function () {
    setScrolling();
    setPageOverflow();
  });
});

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

  function scrollAncestor(element) {
    if (!element) {
      return false;
    }

    var current = element.parentElement;

    while (current && current !== document.body) {
      if (current.scrollHeight > current.clientHeight + 2) {
        var parentRect = current.getBoundingClientRect();
        var childRect = element.getBoundingClientRect();
        current.scrollTop += childRect.top - parentRect.top - topOffset;
        return true;
      }

      current = current.parentElement;
    }

    return false;
  }

  function moveNow() {
    if (window.innerWidth > 768 && scrollAncestor(projectHeader)) {
      return;
    }

    projectHeader.scrollIntoView({ block: "start", inline: "nearest" });
    window.scrollBy(0, -topOffset);
  }

  moveNow();
  window.requestAnimationFrame(moveNow);
  window.setTimeout(moveNow, 80);
  window.setTimeout(moveNow, 220);
  window.setTimeout(moveNow, 420);
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
  var hoveredImage = document.querySelector(".hovered-image");

  if (hoveredImage) {
    hoveredImage.style.display = "none";
  }
}
