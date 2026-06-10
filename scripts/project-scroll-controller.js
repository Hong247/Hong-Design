(function () {
  var savedPositions = {};
  var motionDuration = 650;
  var motionOffset = "translateY(-4px)";

  window.addEventListener("click", handleProjectClick, true);

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
    forceHeaderToTop(projectHeader);
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

    window.clearTimeout(row.openTimer);
    window.clearTimeout(row.closeTimer);
    row.classList.remove("is-open");
    setExpandedState(row.id, false);

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

  function forceHeaderToTop(projectHeader) {
    var scrollWrapper = getScrollWrapper(projectHeader);
    var headerOffset = getHeaderOffset(scrollWrapper);

    function apply() {
      if (scrollWrapper && window.innerWidth > 768) {
        var target = projectHeader.offsetTop - headerOffset;
        scrollWrapper.scrollTop = target < 0 ? 0 : target;
        return;
      }

      projectHeader.scrollIntoView(true);
      window.scrollBy(0, -headerOffset);
    }

    apply();
    window.requestAnimationFrame(apply);
    window.setTimeout(apply, 60);
    window.setTimeout(apply, 180);
    window.setTimeout(apply, 360);
    window.setTimeout(apply, motionDuration);
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
        position.element.scrollTop = position.top;
        return;
      }

      window.scrollTo(0, position.top);
    });
  }
}());