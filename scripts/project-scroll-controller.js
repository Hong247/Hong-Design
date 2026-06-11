(function () {
  var savedPositions = {};
  var motionDuration = 650;
  var scrollDuration = 620;
  var motionOffset = "translateY(-4px)";
  var activeScrollAnimation = null;
  var currentSortDirection = "desc";

  window.addEventListener("click", handleProjectClick, true);
  document.addEventListener("DOMContentLoaded", initYearSort);

  function handleProjectClick(event) {
    var button = event.target.closest && event.target.closest(".custom-btn[data-target]");

    if (!button) {
      return;
    }

    var targetSelector = button.getAttribute("data-target");
    var target = document.querySelector(targetSelector);
    var projectHeader = button.closest(".hover-trigger");

    if (!target || !projectHeader) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    var wasOpen = target.classList.contains("is-open");

    document.querySelectorAll("tr.collapse.is-open").forEach(function (row) {
      if (row !== target) {
        closeRow(row);
      }
    });

    if (wasOpen) {
      closeRow(target);
      scrollBack(target.id);
      return;
    }

    savedPositions[target.id] = getCurrentScrollPosition(projectHeader);
    openRow(target);
    setProjectFocus(projectHeader);
    flowHeaderToTop(projectHeader);
  }

  function initYearSort() {
    var yearHeader = document.querySelector("thead th:last-child");

    if (!yearHeader || yearHeader.querySelector(".year-sort-button")) {
      return;
    }

    yearHeader.innerHTML = '<button type="button" class="year-sort-button" aria-label="Sort projects by year" aria-sort="descending"><span>YEAR</span><span class="year-sort-icon" aria-hidden="true">↕</span></button>';

    yearHeader.querySelector(".year-sort-button").addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      currentSortDirection = currentSortDirection === "desc" ? "asc" : "desc";
      sortProjectsByYear(currentSortDirection);
      updateYearSortButton(yearHeader, currentSortDirection);
    });
  }

  function updateYearSortButton(yearHeader, direction) {
    var button = yearHeader.querySelector(".year-sort-button");
    var icon = yearHeader.querySelector(".year-sort-icon");

    if (!button || !icon) {
      return;
    }

    button.setAttribute("aria-sort", direction === "desc" ? "descending" : "ascending");
    icon.textContent = direction === "desc" ? "↓" : "↑";
  }

  function sortProjectsByYear(direction) {
    var tbody = document.querySelector("tbody");

    if (!tbody) {
      return;
    }

    closeAllProjects();

    var pairs = [];
    var rows = Array.from(tbody.children);

    rows.forEach(function (row) {
      if (!row.classList || !row.classList.contains("hover-trigger")) {
        return;
      }

      var detail = row.nextElementSibling && row.nextElementSibling.classList.contains("collapse") ? row.nextElementSibling : null;
      var yearButton = row.querySelector("td:last-child .custom-btn");
      var year = yearButton ? parseInt(yearButton.textContent.trim(), 10) : 0;
      var originalIndex = pairs.length;

      pairs.push({
        header: row,
        detail: detail,
        year: year,
        originalIndex: originalIndex
      });
    });

    pairs.sort(function (a, b) {
      if (a.year === b.year) {
        return a.originalIndex - b.originalIndex;
      }

      return direction === "desc" ? b.year - a.year : a.year - b.year;
    });

    pairs.forEach(function (pair) {
      tbody.appendChild(pair.header);

      if (pair.detail) {
        tbody.appendChild(pair.detail);
      }
    });

    var scrollWrapper = document.querySelector(".right-theme .scroll-wrapper");

    if (scrollWrapper) {
      animateElementScroll(scrollWrapper, 0, 420);
    }
  }

  function closeAllProjects() {
    document.querySelectorAll("tr.collapse.is-open").forEach(function (row) {
      closeRow(row);
    });
    clearProjectFocus();
  }

  function setExpandedState(targetId, isExpanded) {
    if (!targetId) {
      return;
    }

    document.querySelectorAll('.custom-btn[data-target="#' + targetId + '"]').forEach(function (button) {
      button.setAttribute("aria-expanded", isExpanded ? "true" : "false");
    });
  }

  function getScrollWrapper(element) {
    return element.closest(".scroll-wrapper") || document.querySelector(".right-theme .scroll-wrapper");
  }

  function getDetail(row) {
    return row ? row.querySelector(".project-detail") : null;
  }

  function getCurrentScrollPosition(projectHeader) {
    var scrollWrapper = getScrollWrapper(projectHeader);

    if (scrollWrapper && window.innerWidth > 768) {
      return { type: "wrapper", element: scrollWrapper, top: scrollWrapper.scrollTop };
    }

    return { type: "window", top: window.pageYOffset };
  }

  function prepareDetailMotion(detail) {
    detail.style.overflow = "hidden";
    detail.style.transition = "max-height 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.55s ease, transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)";
  }

  function openRow(row) {
    var detail = getDetail(row);

    window.clearTimeout(row.closeTimer);
    window.clearTimeout(row.openTimer);
    row.classList.add("is-open");
    setExpandedState(row.id, true);

    if (!detail) {
      return;
    }

    prepareDetailMotion(detail);
    detail.style.maxHeight = "0px";
    detail.style.opacity = "0";
    detail.style.transform = motionOffset;

    window.requestAnimationFrame(function () {
      detail.style.maxHeight = detail.scrollHeight + "px";
      detail.style.opacity = "1";
      detail.style.transform = "translateY(0)";
    });

    row.openTimer = window.setTimeout(function () {
      if (row.classList.contains("is-open")) {
        detail.style.maxHeight = "";
        detail.style.opacity = "";
        detail.style.transform = "";
        detail.style.overflow = "";
      }
    }, motionDuration);
  }

  function closeRow(row) {
    var detail = getDetail(row);
    var header = getHeaderForRow(row);

    window.clearTimeout(row.openTimer);
    window.clearTimeout(row.closeTimer);
    row.classList.remove("is-open");
    setExpandedState(row.id, false);

    if (header) {
      header.classList.remove("is-active-project");
    }

    if (!document.querySelector("tr.collapse.is-open")) {
      clearProjectFocus();
    }

    if (!detail) {
      return;
    }

    prepareDetailMotion(detail);
    detail.style.maxHeight = detail.scrollHeight + "px";
    detail.style.opacity = "1";
    detail.style.transform = "translateY(0)";

    window.requestAnimationFrame(function () {
      detail.style.maxHeight = "0px";
      detail.style.opacity = "0";
      detail.style.transform = motionOffset;
    });

    row.closeTimer = window.setTimeout(function () {
      detail.style.maxHeight = "";
      detail.style.opacity = "";
      detail.style.transform = "";
      detail.style.overflow = "";
    }, motionDuration);
  }

  function setProjectFocus(projectHeader) {
    document.body.classList.add("project-focus-active");
    document.querySelectorAll(".hover-trigger").forEach(function (row) {
      row.classList.toggle("is-active-project", row === projectHeader);
    });
  }

  function clearProjectFocus() {
    document.body.classList.remove("project-focus-active");
    document.querySelectorAll(".hover-trigger").forEach(function (row) {
      row.classList.remove("is-active-project");
    });
  }

  function getHeaderForRow(row) {
    var header = row ? row.previousElementSibling : null;
    return header && header.classList.contains("hover-trigger") ? header : null;
  }

  function flowHeaderToTop(projectHeader) {
    var scrollWrapper = getScrollWrapper(projectHeader);
    var headerOffset = getHeaderOffset(scrollWrapper);

    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        animateHeaderPosition(projectHeader, scrollWrapper, headerOffset, scrollDuration);
      });
    });
  }

  function animateHeaderPosition(projectHeader, scrollWrapper, headerOffset, duration) {
    if (scrollWrapper && window.innerWidth > 768) {
      var target = projectHeader.offsetTop - headerOffset;
      animateElementScroll(scrollWrapper, target < 0 ? 0 : target, duration);
      return;
    }

    var pageTarget = projectHeader.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    animateWindowScroll(pageTarget < 0 ? 0 : pageTarget, duration);
  }

  function animateElementScroll(element, targetTop, duration) {
    animateScroll(element.scrollTop, targetTop, duration, function (value) {
      element.scrollTop = value;
    });
  }

  function animateWindowScroll(targetTop, duration) {
    animateScroll(window.pageYOffset, targetTop, duration, function (value) {
      window.scrollTo(0, value);
    });
  }

  function animateScroll(startTop, targetTop, duration, applyValue) {
    var startTime = performance.now();
    var distance = targetTop - startTop;

    if (activeScrollAnimation) {
      window.cancelAnimationFrame(activeScrollAnimation);
    }

    function step(now) {
      var progress = Math.min(1, (now - startTime) / duration);
      var eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      applyValue(startTop + distance * eased);

      if (progress < 1) {
        activeScrollAnimation = window.requestAnimationFrame(step);
      } else {
        activeScrollAnimation = null;
      }
    }

    activeScrollAnimation = window.requestAnimationFrame(step);
  }

  function getHeaderOffset(scrollWrapper) {
    var header = scrollWrapper ? scrollWrapper.querySelector("thead") : document.querySelector("thead");
    return header ? header.getBoundingClientRect().height : 0;
  }

  function scrollBack(targetId) {
    var position = savedPositions[targetId];

    if (!position) {
      return;
    }

    window.requestAnimationFrame(function () {
      if (position.type === "wrapper" && position.element) {
        animateElementScroll(position.element, position.top, 460);
        return;
      }

      animateWindowScroll(position.top, 460);
    });
  }
}());