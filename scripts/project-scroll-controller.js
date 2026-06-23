(function () {
  var savedPositions = {};
  var motionDuration = 220;
  var scrollDuration = 280;
  var sortMotionDuration = 180;
  var sortStaggerDelay = 14;
  var motionOffset = "translateY(-4px)";
  var activeScrollAnimation = null;

  // Sort state â one column active at a time
  var activeSortColumn = "year";  // "year" | "project" | "role"
  var yearSortDir = "desc";       // "desc" | "asc"
  var projectCycleDir = null;     // null | "asc" | "desc"
  var roleCycleDir = null;        // null | "asc" | "desc"

  window.addEventListener("click", handleProjectClick, true);
  document.addEventListener("DOMContentLoaded", initProjectHeaders);
  document.addEventListener("DOMContentLoaded", openProjectFromHash);
  window.addEventListener("popstate", function () {
    document.querySelectorAll("tr.collapse.is-open").forEach(function (row) {
      closeRow(row);
    });
    openProjectFromHash();
  });

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

  function openProjectFromHash() {
    var slug = null;
    var match = window.location.pathname.match(/^\/([^/]+)$/);
    if (match) {
      slug = match[1];
    } else if (window.location.hash) {
      slug = window.location.hash.slice(1);
    }
    if (!slug) return;
    var target = document.querySelector("tr.collapse#" + slug);
    var header = target ? target.previousElementSibling : null;
    if (!target || !header || !header.classList.contains("hover-trigger")) return;
    savedPositions[target.id] = getCurrentScrollPosition(header);
    openRow(target);
    setProjectFocus(header);
    flowHeaderToTop(header);
  }

  function initProjectHeaders() {
    setNumberHeader();
    initYearSort();
    initColumnSortHeader("role");
    updateSortHeaders();
    initAriaExpandedState();
  }

  function initAriaExpandedState() {
    document.querySelectorAll(".custom-btn[data-target]").forEach(function (btn) {
      btn.setAttribute("aria-expanded", "false");
    });
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
    yearHeader.classList.add("year-sort-header");
    yearHeader.innerHTML = '<span class="year-sort-label">YEAR</span><span class="year-sort-symbol" aria-hidden="true"><span class="year-sort-arrow year-sort-up">&#9650;</span><span class="year-sort-arrow year-sort-down">&#9660;</span></span>';

    yearHeader.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      handleYearClick();
    });

    yearHeader.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleYearClick();
      }
    });
  }

  function handleYearClick() {
    yearSortDir = yearSortDir === "desc" ? "asc" : "desc";
    activeSortColumn = "year";
    projectCycleDir = null;
    roleCycleDir = null;
    sortProjectsByYear(yearSortDir);
    updateSortHeaders();
  }

  function initColumnSortHeader(column) {
    var headerEl = column === "project"
      ? document.querySelector("thead th:nth-child(2)")
      : document.querySelector("thead th:nth-child(3)");

    if (!headerEl || headerEl.querySelector(".year-sort-label")) {
      return;
    }

    var label = column === "project" ? "PROJECT" : "ROLE";
    headerEl.setAttribute("role", "button");
    headerEl.setAttribute("tabindex", "0");
    headerEl.setAttribute("aria-label", "Sort projects by " + label.toLowerCase());
    headerEl.setAttribute("aria-sort", "none");
    headerEl.classList.add("year-sort-header");
    headerEl.innerHTML = '<span class="year-sort-label">' + label + '</span><span class="year-sort-symbol" aria-hidden="true"><span class="year-sort-arrow year-sort-up">&#9650;</span><span class="year-sort-arrow year-sort-down">&#9660;</span></span>';

    headerEl.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      handleColumnClick(column);
    });

    headerEl.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleColumnClick(column);
      }
    });
  }

  function handleColumnClick(column) {
    var cycleDir = column === "project" ? projectCycleDir : roleCycleDir;

    if (activeSortColumn !== column) {
      // Switch to this column, start ascending
      activeSortColumn = column;
      cycleDir = "asc";
    } else if (cycleDir === "asc") {
      cycleDir = "desc";
    } else {
      // Third click: reset to year sort
      activeSortColumn = "year";
      projectCycleDir = null;
      roleCycleDir = null;
      sortProjectsByYear(yearSortDir);
      updateSortHeaders();
      return;
    }

    if (column === "project") {
      projectCycleDir = cycleDir;
    } else {
      roleCycleDir = cycleDir;
    }

    sortByColumnDir(column, cycleDir);
    updateSortHeaders();
  }

  function sortByColumnDir(column, dir) {
    var tbody = document.querySelector("tbody");

    if (!tbody) {
      return;
    }

    closeAllProjects();

    var pairs = [];

    Array.from(tbody.children).forEach(function (row) {
      if (!row.classList || !row.classList.contains("hover-trigger")) {
        return;
      }

      var detail = row.nextElementSibling && row.nextElementSibling.classList.contains("collapse")
        ? row.nextElementSibling : null;
      var titleBtn = row.querySelector("td:nth-child(2) .custom-btn");
      var roleBtn = row.querySelector("td:nth-child(3) .custom-btn");
      var numBtn = row.querySelector("td:first-child .custom-btn");

      pairs.push({
        header: row,
        detail: detail,
        title: titleBtn ? titleBtn.textContent.trim() : "",
        role: roleBtn ? roleBtn.textContent.trim() : "",
        projectNumber: numBtn ? parseInt(numBtn.textContent.trim(), 10) : 0
      });
    });

    var field = column === "project" ? "title" : "role";

    pairs.sort(function (a, b) {
      var valA = a[field].toLowerCase();
      var valB = b[field].toLowerCase();

      if (valA === valB) {
        return a.projectNumber - b.projectNumber;
      }

      var cmp = valA < valB ? -1 : 1;
      return dir === "asc" ? cmp : -cmp;
    });

    animateSequentialSortReorder(tbody, pairs);

    var scrollWrapper = document.querySelector(".right-theme .scroll-wrapper");

    if (scrollWrapper) {
      animateElementScroll(scrollWrapper, 0, 200);
    }
  }

  function updateSortHeaders() {
    var yearHeader = document.querySelector("thead th:last-child");
    var projectHeader = document.querySelector("thead th:nth-child(2)");
    var roleHeader = document.querySelector("thead th:nth-child(3)");

    var yearActiveDir = activeSortColumn === "year" ? yearSortDir : null;
    var projectActiveDir = activeSortColumn === "project" ? projectCycleDir : null;
    var roleActiveDir = activeSortColumn === "role" ? roleCycleDir : null;

    setSortHeaderState(yearHeader, yearActiveDir,
      activeSortColumn === "year" ? (yearSortDir === "desc" ? "descending" : "ascending") : "none");

    setSortHeaderState(projectHeader, projectActiveDir,
      activeSortColumn === "project" ? (projectCycleDir === "asc" ? "ascending" : "descending") : "none");

    setSortHeaderState(roleHeader, roleActiveDir,
      activeSortColumn === "role" ? (roleCycleDir === "asc" ? "ascending" : "descending") : "none");
  }

  function setSortHeaderState(header, dir, ariaSortValue) {
    if (!header) {
      return;
    }

    header.classList.toggle("sort-asc", dir === "asc");
    header.classList.toggle("sort-desc", dir === "desc");
    header.setAttribute("aria-sort", ariaSortValue || "none");
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
    var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || !sortedPairs.length) {
      appendSortedPairs(tbody, sortedPairs);
      return;
    }

    appendSortedPairs(tbody, sortedPairs);

    var allRows = [];
    sortedPairs.forEach(function (pair) {
      allRows.push(pair.header);
      if (pair.detail) allRows.push(pair.detail);
    });

    allRows.forEach(function (row) {
      row.style.transition = "none";
      row.style.opacity = "0";
      row.style.transform = "translateY(4px)";
      row.style.willChange = "transform, opacity";
    });

    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        sortedPairs.forEach(function (pair, index) {
          var rows = [pair.header];
          if (pair.detail) rows.push(pair.detail);
          var delay = index * 8;
          rows.forEach(function (row) {
            window.setTimeout(function () {
              row.style.transition = "opacity 140ms ease, transform 140ms cubic-bezier(0.22, 1, 0.36, 1)";
              row.style.opacity = "1";
              row.style.transform = "translateY(0)";
            }, delay);
          });
        });
        window.setTimeout(function () {
          allRows.forEach(function (row) {
            row.style.transition = "";
            row.style.opacity = "";
            row.style.transform = "";
            row.style.willChange = "";
          });
        }, sortedPairs.length * 8 + 180);
      });
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
    detail.style.transition = "max-height 0.20s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.16s ease, transform 0.20s cubic-bezier(0.22, 1, 0.36, 1)";
  }

  function openRow(row) {
    if (window.renderProjectDetailRow) {
      window.renderProjectDetailRow(row);
    }

    var scrollContainer = row.querySelector(".scroll-container");
    if (scrollContainer) {
      scrollContainer.scrollTo({ left: 0, behavior: "instant" });
    }

    var detail = getDetail(row);

    window.clearTimeout(row.closeTimer);
    window.clearTimeout(row.openTimer);
    row.classList.add("is-open");
    setExpandedState(row.id, true);
    history.pushState(null, "", "/" + row.id);

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
    if (window.location.pathname === "/" + row.id) {
      history.pushState(null, "", "/");
    }

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

    function runScroll(duration) {
      animateHeaderPosition(projectHeader, scrollWrapper, getHeaderOffset(scrollWrapper), duration);
    }

    /* Single RAF — layout is already available, no need for double-RAF */
    window.requestAnimationFrame(function () {
      runScroll(scrollDuration);
    });

    /* One correction pass after the expand animation settles */
    window.setTimeout(function () {
      runScroll(160);
    }, motionDuration + 20);
  }

  function animateHeaderPosition(projectHeader, scrollWrapper, headerOffset, duration) {
    if (canUsePanelScroll(scrollWrapper)) {
      var target = getPanelTargetTop(projectHeader, scrollWrapper, headerOffset);
      animateElementScroll(scrollWrapper, target, duration);
      return;
    }

    var pageTarget = projectHeader.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    animateWindowScroll(pageTarget < 0 ? 0 : pageTarget, duration);
  }

  function getPanelTargetTop(projectHeader, scrollWrapper, headerOffset) {
    var headerRect = projectHeader.getBoundingClientRect();
    var wrapperRect = scrollWrapper.getBoundingClientRect();
    var target = headerRect.top - wrapperRect.top + scrollWrapper.scrollTop - headerOffset;

    return clampScrollTop(scrollWrapper, target);
  }

  function canUsePanelScroll(scrollWrapper) {
    return Boolean(scrollWrapper && window.innerWidth > 768 && scrollWrapper.scrollHeight > scrollWrapper.clientHeight + 1);
  }

  function clampScrollTop(element, value) {
    var max = Math.max(0, element.scrollHeight - element.clientHeight);
    return Math.max(0, Math.min(value, max));
  }

  function animateElementScroll(element, targetTop, duration) {
    targetTop = clampScrollTop(element, targetTop);

    animateScroll(element.scrollTop, targetTop, duration, function (value) {
      element.scrollTop = value;
    }, function () {
      element.scrollTop = targetTop;
    });
  }

  function animateWindowScroll(targetTop, duration) {
    targetTop = Math.max(0, targetTop);

    animateScroll(window.pageYOffset, targetTop, duration, function (value) {
      window.scrollTo(0, value);
    }, function () {
      window.scrollTo(0, targetTop);
    });
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
      var eased = progress < 0.5
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

    var header = scrollWrapper ? scrollWrapper.querySelector("thead") : document.querySelector("thead");
    return header ? header.getBoundingClientRect().height : 0;
  }

  function scrollBack(targetId) {
    var position = savedPositions[targetId];

    if (!position) {
      return;
    }

    window.requestAnimationFrame(function () {
      if (position.type === "wrapper" && position.element && canUsePanelScroll(position.element)) {
        animateElementScroll(position.element, position.top, 220);
        return;
      }

      animateWindowScroll(position.top, 220);
    });
  }
}());
