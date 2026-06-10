(function () {
  var savedPositions = {};

  document.addEventListener("click", function (event) {
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
    event.stopImmediatePropagation();

    var wasOpen = target.classList.contains("is-open");

    document.querySelectorAll("tr.collapse.is-open").forEach(function (row) {
      if (row !== target) {
        row.classList.remove("is-open");
        setExpandedState(row.id, false);
      }
    });

    if (wasOpen) {
      target.classList.remove("is-open");
      setExpandedState(target.id, false);
      scrollBack(target.id);
      return;
    }

    savedPositions[target.id] = getCurrentScrollPosition(projectHeader);
    target.classList.add("is-open");
    setExpandedState(target.id, true);
    scrollProjectHeader(projectHeader);
  }, true);

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

  function scrollProjectHeader(projectHeader) {
    var scrollWrapper = getScrollWrapper(projectHeader);

    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        if (scrollWrapper && window.innerWidth > 768) {
          var header = scrollWrapper.querySelector("thead");
          var headerHeight = header ? header.getBoundingClientRect().height : 0;
          var targetTop = projectHeader.getBoundingClientRect().top - scrollWrapper.getBoundingClientRect().top + scrollWrapper.scrollTop - headerHeight;

          scrollWrapper.scrollTo({
            top: targetTop,
            behavior: "smooth"
          });
          return;
        }

        window.scrollTo({
          top: projectHeader.getBoundingClientRect().top + window.pageYOffset,
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
