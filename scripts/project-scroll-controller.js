(function () {
  var savedPositions = {};
  var motionDuration = 650;
  var scrollDuration = 620;
  var sortMotionDuration = 520;
  var sortStaggerDelay = 42;
  var motionOffset = "translateY(-4px)";
  var activeScrollAnimation = null;
  var currentSortDirection = "desc";
  var currentProjectFilter = "all";
  var currentRoleFilter = "all";

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
    openRow(target);
    setProjectFocus(projectHeader);
    flowHeaderToTop(projectHeader);
  }

  function initProjectHeaders() {
    setNumberHeader();
    initYearSort();
    initProjectFilter();
    initRoleFilter();
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
    yearHeader.innerHTML = '<span class="year-sort-label">YEAR</span><span class="year-sort-symbol" aria-hidden="true"><span class="year-sort-arrow year-sort-up">â²</span><span class="year-sort-arrow year-sort-down">â¼</span></span>';

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

  // ââ Project filter ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

  function initProjectFilter() {
    var th = document.querySelector("thead th:nth-child(2)");

    if (!th || th.querySelector(".filter-label")) {
      return;
    }

    setupFilterHeader(th, "PROJECT", "project");
  }

  function initRoleFilter() {
    var th = document.querySelector("thead th:nth-child(3)");

    if (!th || th.querySelector(".filter-label")) {
      return;
    }

    setupFilterHeader(th, "ROLE", "role");
  }

  function setupFilterHeader(th, defaultLabel, type) {
    th.setAttribute("role", "button");
    th.setAttribute("tabindex", "0");
    th.setAttribute("aria-label", "Filter projects by " + type);
    th.classList.add(type + "-filter-header");
    th.innerHTML =
      '<span class="filter-label">' + defaultLabel + "</span>" +
      '<span class="filter-symbol" aria-hidden="true">' +
      '<span class="filter-arrow filter-arrow-up">â²</span>' +
      '<span class="filter-arrow filter-arrow-down">â¼</span>' +
      "</span>";

    th.addEventListener("click", function (event) {
      var upArrow = event.target.closest && event.target.closest(".filter-arrow-up");
      cycleFilter(type, upArrow ? -1 : 1);
      event.preventDefault();
      event.stopPropagation();
    });

    th.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
        event.preventDefault();
        cycleFilter(type, 1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        cycleFilter(type, -1);
      }
    });
  }

  function getFilterOptions(type) {
    var options = [];
    var seen = {};

    document.querySelectorAll("tbody tr.hover-trigger").forEach(function (row) {
      // Only include rows that pass the OTHER active filter
      var otherOk = true;

      if (type === "project") {
        otherOk =
          currentRoleFilter === "all" ||
          (row.getAttribute("data-role") || "") === currentRoleFilter;
      } else {
        otherOk =
          currentProjectFilter === "all" ||
          (row.getAttribute("data-project") || "") === currentProjectFilter;
      }

      if (!otherOk) {
        return;
      }

      var val = row.getAttribute("data-" + type) || "";

      if (val && !seen[val]) {
        seen[val] = true;
        options.push(val);
      }
    });

    return options.sort(function (a, b) {
      return a.localeCompare(b, undefined, { sensitivity: "base" });
    });
  }

  function cycleFilter(type, direction) {
    var options = getFilterOptions(type);
    var current = type === "project" ? currentProjectFilter : currentRoleFilter;
    var allOptions = ["all"].concat(options);
    var idx = allOptions.indexOf(current);

    if (idx === -1) {
      idx = 0;
    }

    var newIdx = (idx + direction + allOptions.length) % allOptions.length;
    var newVal = allOptions[newIdx];

    if (type === "project") {
      currentProjectFilter = newVal;
    } else {
      currentRoleFilter = newVal;
    }

    updateFilterLabel("project", currentProjectFilter === "all" ? "PROJECT" : currentProjectFilter);
    updateFilterLabel("role", currentRoleFilter === "all" ? "ROLE" : currentRoleFilter);
    applyFilters();
  }

  function updateFilterLabel(type, label) {
    var th = document.querySelector("thead th." + type + "-filter-header");

    if (!th) {
      return;
    }

    var el = th.querySelector(".filter-label");

    if (el) {
      el.textContent = label;
    }

    var isActive = (type === "project" ? currentProjectFilter : currentRoleFilter) !== "all";
    th.classList.toggle("filter-active", isActive);
  }

  function applyFilters() {
    var tbody = document.querySelector("tbody");

    if (!tbody) {
      return;
    }

    closeAllProjects();

    var count = 0;

    Array.from(tbody.children).forEach(function (row) {
      if (!row.classList.contains("hover-trigger")) {
        return;
      }

      var role = row.getAttribute("data-role") || "";
      var project = row.getAttribute("data-project") || "";
      var roleOk = currentRoleFilter === "all" || role === currentRoleFilter;
      var projectOk = currentProjectFilter === "all" || project === currentProjectFilter;
      var visible = roleOk && projectOk;

      row.style.display = visible ? "" : "none";

      var detail = row.nextElementSibling;

      if (detail && detail.classList.contains("collapse")) {
        detail.style.display = visible ? "" : "none";
      }

      if (visible) {
        count++;
        var btn = row.querySelector("td:first-child .custom-btn");

        if (btn) {
          btn.textContent = String(count).padStart(2, "0");
        }
      }
    });

    // Scroll list back to top when a filter is active
    var scrollWrapper = document.querySelector(".right-theme .scroll-wrapper");

    if (scrollWrapper && (currentProjectFilter !== "all" || currentRoleFilter !== "all")) {
      animateElementScroll(scrollWrapper, 0, 320);
    }
  }

  function renumberVisibleRows() {
    var count = 0;

    document.querySelectorAll("tbody tr.hover-trigger").forEach(function (row) {
      if (row.style.display === "none") {
        return;
      }

      count++;
      var btn = row.querySelector("td:first-child .custom-btn");

      if (btn) {
        btn.textContent = String(count).padStart(2, "0");
      }
    });
  }

  // ââ Year sort âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

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

      var detail =
        row.nextElementSibling && row.nextElementSibling.classList.contains("collapse")
          ? row.nextElementSibling
          : null;
      var numberButton = row.querySelector("td:first-child .custom-btn");
      var yearButton = row.querySelector("td:last-child .custom-btn");
      var projectNumber = numberButton ? parseInt(numberButton.textContent.trim(), 10) : 0;
      var year = yearButton ? parseInt(yearButton.textContent.trim(), 10) : 0;
      var isHidden = row.style.display === "none";

      pairs.push({
        header: row,
        detail: detail,
        year: year,
        projectNumber: projectNumber,
        isHidden: isHidden
      });
    });

    pairs.sort(function (a, b) {
      if (a.year === b.year) {
        return direction === "desc"
          ? a.projectNumber - b.projectNumber
          : b.projectNumber - a.projectNumber;
      }

      return direction === "desc" ? b.year - a.year : a.year - b.year;
    });

    // Only animate visible rows; hidden rows are repositioned silently
    var visiblePairs = pairs.filter(function (p) { return !p.isHidden; });
    animateSequentialSortReorder(tbody, pairs, visiblePairs);

    var scrollWrapper = document.querySelector(".right-theme .scroll-wrapper");

    if (scrollWrapper) {
      animateElementScroll(scrollWrapper, 0, 420);
    }
  }

  function animateSequentialSortReorder(tbody, sortedPairs, visiblePairs) {
    var animatePairs = visiblePairs || sortedPairs;
    var movingRows = [];
    var firstPositions = new Map();
    var prefersReducedMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    animatePairs.forEach(function (pair) {
      movingRows.push(pair.header);

      if (pair.detail) {
        movingRows.push(pair.detail);
      }
    });

    if (prefersReducedMotion || !movingRows.length) {
      appendSortedPairs(tbody, sortedPairs);
      reapplyFilterDisplay(sortedPairs);
      renumberVisibleRows();
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
      reapplyFilterDisplay(sortedPairs);

      animatePairs.forEach(function (pair, index) {
        animateSortedPair(pair, firstPositions, index);
      });

      window.setTimeout(function () {
        movingRows.forEach(function (row) {
          row.style.transition = "";
          row.style.transform = "";
          row.style.opacity = "";
          row.style.willChange = "";
        });
        renumberVisibleRows();
      }, sortMotionDuration + animatePairs.length * sortStaggerDelay + 120);
    }, 120);
  }

  function reapplyFilterDisplay(pairs) {
    pairs.forEach(function (pair) {
      pair.header.style.display = pair.isHidden ? "none" : "";

      if (pair.detail) {
        pair.detail.style.display = pair.isHidden ? "none" : "";
      }
    });
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
        row.style.transition =
          "transform " + sortMotionDuration + "ms cubic-bezier(0.22, 1, 0.36, 1), opacity " +
          sortMotionDuration + "ms ease";
        row.style.transform = "translateY(0)";
        row.style.opacity = "1";
      }, delay);
    });
  }

  // ââ Row open / close ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

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

    if (canUsePanelScroll(scrollWrapper)) {
      return { type: "wrapper", element: scrollWrapper, top: scrollWrapper.scrollTop };
    }

    return { type: "window", top: window.pageYOffset };
  }

  function prepareDetailMotion(detail) {
    detail.style.overflow = "hidden";
    detail.style.transition =
      "max-height 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.55s ease, transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)";
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

  // ââ Scroll to header ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

  function flowHeaderToTop(projectHeader) {
    var scrollWrapper = getScrollWrapper(projectHeader);

    function runScroll(duration) {
      animateHeaderPosition(projectHeader, scrollWrapper, getHeaderOffset(scrollWrapper), duration);
    }

    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        runScroll(scrollDuration);
      });
    });

    window.setTimeout(function () {
      runScroll(420);
    }, 160);

    window.setTimeout(function () {
      runScroll(360);
    }, motionDuration + 80);
  }

  function animateHeaderPosition(projectHeader, scrollWrapper, headerOffset, duration) {
    if (canUsePanelScroll(scrollWrapper)) {
      var target = getPanelTargetTop(projectHeader, scrollWrapper, headerOffset);
      animateElementScroll(scrollWrapper, target, duration);
      return;
    }

    var pageTarget =
      projectHeader.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    animateWindowScroll(pageTarget < 0 ? 0 : pageTarget, duration);
  }

  function getPanelTargetTop(projectHeader, scrollWrapper, headerOffset) {
    var headerRect = projectHeader.getBoundingClientRect();
    var wrapperRect = scrollWrapper.getBoundingClientRect();
    var target =
      headerRect.top - wrapperRect.top + scrollWrapper.scrollTop - headerOffset;
    return clampScrollTop(scrollWrapper, target);
  }

  function canUsePanelScroll(scrollWrapper) {
    return Boolean(
      scrollWrapper &&
        window.innerWidth > 768 &&
        scrollWrapper.scrollHeight > scrollWrapper.clientHeight + 1
    );
  }

  function clampScrollTop(element, value) {
    var max = Math.max(0, element.scrollHeight - element.clientHeight);
    return Math.max(0, Math.min(value, max));
  }

  function animateElementScroll(element, targetTop, duration) {
    targetTop = clampScrollTop(element, targetTop);

    animateScroll(
      element.scrollTop,
      targetTop,
      duration,
      function (value) {
        element.scrollTop = value;
      },
      function () {
        element.scrollTop = targetTop;
      }
    );
  }

  function animateWindowScroll(targetTop, duration) {
    targetTop = Math.max(0, targetTop);

    animateScroll(
      window.pageYOffset,
      targetTop,
      duration,
      function (value) {
        window.scrollTo(0, value);
      },
      function () {
        window.scrollTo(0, targetTop);
      }
    );
  }

  function animateScroll(startTop, targetTop, duration, applyValue, onComplete) {
    var startTime = performance.now();
    var distance = targetTop - startTop;

    if (activeScrollAnimation) {
      window.cancelAnimationFrame(activeScrollAnimation);
    }

    if (Math.abs(distance) < 1) {
      applyValue(targetTop);

      if (onComplete) {
        onComplete();
      }

      return;
    }

    function step(now) {
      var progress = Math.min(1, (now - startTime) / duration);
      var eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      applyValue(startTop + distance * eased);

      if (progress < 1) {
        activeScrollAnimation = window.requestAnimationFrame(step);
      } else {
        activeScrollAnimation = null;

        if (onComplete) {
          onComplete();
        }
      }
    }

    activeScrollAnimation = window.requestAnimationFrame(step);
  }

  function getHeaderOffset(scrollWrapper) {
    if (window.innerWidth <= 768) {
      return 22;
    }

    var header = scrollWrapper
      ? scrollWrapper.querySelector("thead")
      : document.querySelector("thead");
    return header ? header.getBoundingClientRect().height : 0;
  }

  function scrollBack(targetId) {
    var position = savedPositions[targetId];

    if (!position) {
      return;
    }

    window.requestAnimationFrame(function () {
      if (
        position.type === "wrapper" &&
        position.element &&
        canUsePanelScroll(position.element)
      ) {
        animateElementScroll(position.element, position.top, 460);
        return;
      }

      animateWindowScroll(position.top, 460);
    });
  }
}());
