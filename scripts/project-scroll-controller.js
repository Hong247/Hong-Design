(function () {
  var savedPositions = {};

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
    scrollProjectHeader(projectHeader);
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
    return element.closest(".scroll-wrapper");
  }

  function getDetail(row) {
    return row ? row.querySelector(".project-detail") : null;
  }

  function getCurrentScrollPosition(projectHeader) {
    var scrollWrapper = getScrollWrapper(projectHeader);

    if (scrollWrapper && window.innerWidth > 768) {
      return {
        type: "wrapper",
        element: scrollWrapper,
        top: scrollWrapper.scrollTop
      };
    }

    return {
      type: "window",
      top: window.pageYOffset
    };
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
        detail.style.maxHeight = "";
        detail.style.opacity = "";
        detail.style.transform = "";
      }
    }, 380);
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

    detail.style.maxHeight = detail.scrollHeight + "px";
    detail.style.opacity = "1";
    detail.style.transform = "translateY(0)";

    window.requestAnimationFrame(function () {
      detail.style.maxHeight = "0px";
      detail.style.opacity = "0";
      detail.style.transform = "translateY(-8px)";
    });

    row.closeTimer = window.setTimeout(function () {
      detail.style.maxHeight = "";
      detail.style.opacity = "";
      detail.style.transform = "";
    }, 380);
  }

  function scrollProjectHeader(projectHeader) {
    var scrollWrapper = getScrollWrapper(projectHeader);

    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        if (scrollWrapper && window.innerWidth > 768) {
          var header = scrollWrapper.querySelector("thead");
          var headerHeight = header ? header.getBoundingClientRect().height : 0;
          var targetTop = projectHeader.getBoundingClientRect().top - scrollWrapper.getBoundingClientRect().top + scrollWrapper.scrollTop - headerHeight;

          scrollWrapper.scrollTo({
            top: Math.max(0, targetTop),
            behavior: "smooth"
          });
          return;
        }

        var mobileHeader = document.querySelector("thead");
        var mobileHeaderHeight = mobileHeader && window.getComputedStyle(mobileHeader).display !== "none" ? mobileHeader.getBoundingClientRect().height : 0;

        window.scrollTo({
          top: Math.max(0, projectHeader.getBoundingClientRect().top + window.pageYOffset - mobileHeaderHeight),
          behavior: "smooth"
        });
      });
    });
  }

  function scrollBack(targetId) {
    var position = savedPositions[targetId];

    if (!position) {
      return;
    }

    window.requestAnimationFrame(function () {
      if (position.type === "wrapper" && position.element) {
        position.element.scrollTo({
          top: position.top,
          behavior: "smooth"
        });
        return;
      }

      window.scrollTo({
        top: position.top,
        behavior: "smooth"
      });
    });
  }
}());
