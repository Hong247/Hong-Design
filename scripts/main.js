document.addEventListener("DOMContentLoaded", function () {
  var themeToggle = document.getElementById("themeToggle");
  var projectButtons = document.querySelectorAll(".custom-btn[data-target]");
  var hoverTriggers = document.querySelectorAll(".hover-trigger");

  applySavedTheme();
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
          row.classList.remove("is-open");
          setExpandedState(row.id, false);
        }
      });

      var isOpen = target.classList.toggle("is-open");
      setExpandedState(target.id, isOpen);

      if (isOpen) {
        scrollProjectHeaderIntoView(button);
      }
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
  document.body.classList.remove("dark-mode");
  document.body.classList.add("light-mode");
  localStorage.setItem("theme", "light");
}

function toggleTheme() {
  var willBeDark = document.body.classList.contains("light-mode");

  document.body.classList.toggle("dark-mode", willBeDark);
  document.body.classList.toggle("light-mode", !willBeDark);
  localStorage.setItem("theme", willBeDark ? "dark" : "light");
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

function scrollProjectHeaderIntoView(button) {
  var projectHeader = button.closest(".hover-trigger");
  var scrollWrapper = projectHeader ? projectHeader.closest(".scroll-wrapper") : null;
  var tableHeader = document.querySelector("thead");

  if (!projectHeader) {
    return;
  }

  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(function () {
      if (scrollWrapper && window.innerWidth > 768) {
        var headerHeight = tableHeader ? tableHeader.getBoundingClientRect().height : 0;
        var currentTop = projectHeader.getBoundingClientRect().top - scrollWrapper.getBoundingClientRect().top + scrollWrapper.scrollTop;

        scrollWrapper.scrollTo({
          top: currentTop - headerHeight,
          behavior: "smooth"
        });
        return;
      }

      var mobileHeaderHeight = tableHeader && window.getComputedStyle(tableHeader).display !== "none" ? tableHeader.getBoundingClientRect().height : 0;

      window.scrollTo({
        top: projectHeader.getBoundingClientRect().top + window.pageYOffset - mobileHeaderHeight,
        behavior: "smooth"
      });
    });
  });
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
