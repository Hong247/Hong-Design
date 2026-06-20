(function () {
  var savedPositions = {};
  var motionDuration = 650;
  var scrollDuration = 620;
  var sortMotionDuration = 520;
  var sortStaggerDelay = 42;
  var motionOffset = "translateY(-4px)";
  var activeScrollAnimation = null;
  var currentSortDirection = "desc";

  window.addEventListener("click", handleProjectClick, true);
  document.addEventListener("DOMContentLoaded", initProjectHeaders);

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
    setProjectFocus(projectHeader);

    if (window.innerWidth <= 768) {
      flowHeaderToTop(projectHeader, function () {
        openRow(target);
      });
      return;
    }

    openRow(target);
    flowHeaderToTop(projectHeader);
  }

  function initProjectHeaders() {
    setNumberHeader();
    initYearSort();
  }

  function setNumberHeader() {
    var numberHeader = document.querySelector("thead th:first-child");

    if (numberHeader) {
      numberHeader.textContent = "#";
    }
  }

  function initYearSort() {
    var yearHeader = document.querySelector("thead th:last-child");

    if (!yearHeader || yearHeader.querySelector(".year-sort-label")) {
      return;
    }

    yearHeader.setAttribute("role", "button");
    yearHeader.setAttribute("tabindex", "0");
    yearHeader.setAttribute("aria-label", "Sort projects by year");
    yearHeader.setAttribute("aria-sort", "descending");
    yearHeader.classList.add("year-sort-header", "sort-desc");
    yearHeader.innerHTML = '<span class="year-sort-label">YEAR</span><span class="year-sort-symbol" aria-hidden="true"><span class="year-sort-arrow year-sort-up">▲</span><span class="year-sort-arrow year-sort-down">▼</span></span>';

    yearHeader.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      toggleYearSort(yearHeader);
    });

    yearHeader.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleYearSort(yearHeader);
      }
    });
  }

  function toggleYearSort(yearHeader) {
    currentSortDirection = currentSortDirection === "desc" ? "asc" : "desc";
    sortProjectsByYear(currentSortDirection);
    updateYearSortHeader(yearHeader, currentSortDirection);
  }

  function updateYearSortHeader(yearHeader, direction) {
    if (!yearHeader) {
      return;
    }

    yearHeader.setAttribute("aria-sort", direction === "desc" ? "descending" : "ascending");
    yearHeader.classList.toggle("sort-desc", direction === "desc");
    yearHeader.classList.toggle("sort-asc", direction === "asc");
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
      var numberButton = row.querySelector("td:first-child .custom-btn");
      var yearButton = row.querySelector("td:last-child .custom-btn");
      var projectNumber = numberButton ? parseInt(numberButton.textContent.trim(), 10) : 0;
      var year = yearButton ? parseInt(yearButton.textContent.trim(), 10) : 0;

      pairs.push({
        header: row,
        detail: detail,
        year: year,
        projectNumber: projectNumber
      });
    });

    pairs.sort(function (a, b) {
      if (a.year === b.year) {
        return direction === "desc" ? a.projectNumber - b.projectNumber : b.projectNumber - a.projectNumber;
      }

      return direction === "desc" ? b.year - a.year : a.year - b.year;
    });

    animateSequentialSortReorder(tbody, pairs);

    var scrollWrapper = document.querySelector(".right-theme .scroll-wrapper");

    if (scrollWrapper) {
      animateElementScroll(scrollWrapper, 0, 420);
    }
  }

  function animateSequentialSortReorder(tbody, sortedPairs) {
    var movingRows = [];
    var firstPositions = new Map();
    var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    sortedPairs.forEach(function (pair) {
      movingRows.push(pair.header);

      if (pair.detail) {
        movingRows.push(pair.detail);
      }
    });

    if (prefersReducedMotion || !movingRows.length) {
      appendSortedPairs(tbody, sortedPairs);
      return;
    }

    movingRows.forEach(function (row) {
      firstPositions.set(row, row.getBoundingClientRect());
    });

    movingRows.forEach(function (row) {
      row.style.transition = "opacity 160ms ease, transform 160ms ease";
      row.style.opacity = "0.38";
      row.style.transform = "translateY(8px)";
      row.style.willChange = "transform, opacity";
    });

    window.setTimeout(function () {
      appendSortedPairs(tbody, sortedPairs);

      sortedPairs.forEach(function (pair, index) {
        animateSortedPair(pair, firstPositions, index);
      });

      window.setTimeout(function () {
        movingRows.forEach(function (row) {
          row.style.transition = "";
          row.style.transform = "";
          row.style.opacity = "";
          row.style.willChange = "";
        });
      }, sortMotionDuration + sortedPairs.length * sortStaggerDelay + 120);
    }, 120);
  }

  function appendSortedPairs(tbody, pairs) {
    pairs.forEach(function (pair) {
      tbody.appendChild(pair.header);

      if (pair.detail) {
        tbody.appendChild(pair.detail);
      }
    });
  }

  function animateSortedPair(pair, firstPositions, index) {
    var rows = [pair.header];

    if (pair.detail) {
      rows.push(pair.detail);
    }

    rows.forEach(function (row) {
      var first = firstPositions.get(row);
      var last = row.getBoundingClientRect();
      var deltaY = first ? first.top - last.top : 0;
      var delay = index * sortStaggerDelay;

      row.style.transition = "none";
      row.style.transform = deltaY ? "translateY(" + deltaY + "px)" : "translateY(12px)";
      row.style.opacity = "0";
      row.style.willChange = "transform, opacity";

      window.setTimeout(function () {
        row.style.transition = "transform " + sortMotionDuration + "ms cubic-bezier(0.22, 1, 0.36, 1), opacity " + sortMotionDuration + "ms ease";
        row.style.transform = "translateY(0)";
        row.style.opacity = "1";
      }, delay);
    });
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

  function flowHeaderToTop(projectHeader, afterScroll) {
    var scrollWrapper = getScrollWrapper(projectHeader);
    var duration = scrollDuration;
    var startedAt = window.pageYOffset;
    var headerOffset = getHeaderOffset(scrollWrapper);
    var targetTop = getHeaderTarget(projectHeader, scrollWrapper, headerOffset);
    var distance = Math.abs(targetTop - startedAt);

    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        animateHeaderPosition(projectHeader, scrollWrapper, headerOffset, duration);
      });
    });

    if (typeof afterScroll === "function") {
      if (distance < 8) {
        window.setTimeout(afterScroll, 80);
        return;
      }

      window.setTimeout(afterScroll, duration + 40);
    }
  }

  function getHeaderTarget(projectHeader, scrollWrapper, headerOffset) {
    if (scrollWrapper && window.innerWidth > 768) {
      return projectHeader.offsetTop - headerOffset;
    }

    return projectHeader.getBoundingClientRect().top + window.pageYOffset - headerOffset;
  }

  function animateHeaderPosition(projectHeader, scrollWrapper, headerOffset, duration) {
    var target = getHeaderTarget(projectHeader, scrollWrapper, headerOffset);

    if (scrollWrapper && window.innerWidth > 768) {
      animateElementScroll(scrollWrapper, target < 0 ? 0 : target, duration);
      return;
    }

    animateWindowScroll(target < 0 ? 0 : target, duration);
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
    if (window.innerWidth <= 768) {
      return 22;
    }

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
