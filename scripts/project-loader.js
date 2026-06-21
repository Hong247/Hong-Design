(function () {
  var MOJIBAKE_PATTERN = /[ÃÂâÌæ]/;

  function repairMojibakeString(value) {
    var bytes;
    var index;

    if (typeof value !== "string" || !MOJIBAKE_PATTERN.test(value)) {
      return value;
    }

    bytes = new Uint8Array(value.length);

    for (index = 0; index < value.length; index += 1) {
      if (value.charCodeAt(index) > 255) {
        return value;
      }

      bytes[index] = value.charCodeAt(index);
    }

    try {
      return new TextDecoder("utf-8").decode(bytes);
    } catch (error) {
      return value;
    }
  }

  function normalizeTextContent(value) {
    if (typeof value === "string") {
      return repairMojibakeString(value);
    }

    if (Array.isArray(value)) {
      value.forEach(function (item, index) {
        value[index] = normalizeTextContent(item);
      });

      return value;
    }

    if (value && typeof value === "object") {
      Object.keys(value).forEach(function (key) {
        value[key] = normalizeTextContent(value[key]);
      });
    }

    return value;
  }

  function normalizeProjectRegistry() {
    var legacyProjects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];
    var separatedProjects = Array.isArray(window.PORTFOLIO_PROJECT_MODULES) ? window.PORTFOLIO_PROJECT_MODULES : [];

    if (!separatedProjects.length) {
      window.PORTFOLIO_PROJECTS = normalizeTextContent(legacyProjects);
      return;
    }

    // Build a merged map: later pushes extend earlier ones (Object.assign merge),
    // so projects-content.js can add `description` without losing `detailHtml` from individual files.
    var separatedById = separatedProjects.reduce(function (map, project) {
      if (project && project.id) {
        if (map[project.id]) {
          map[project.id] = Object.assign({}, map[project.id], project);
        } else {
          map[project.id] = project;
        }
      }
      return map;
    }, {});

    var mergedProjects = legacyProjects.map(function (project) {
      if (project && project.id && separatedById[project.id]) {
        return separatedById[project.id];
      }
      return project;
    });

    separatedProjects.forEach(function (project) {
      var alreadyExists = mergedProjects.some(function (existingProject) {
        return existingProject && project && existingProject.id === project.id;
      });

      if (!alreadyExists) {
        mergedProjects.push(project);
      }
    });

    var defaultOrder = [
      "demo-cmarket-tote-bag",
      "demo-cmarket-site",
      "demo-mara-natha-portfolio-document",
      "demo1",
      "demo2",
      "demo3",
      "demo4",
      "demo5",
      "demo6",
      "demo7",
      "demo8",
      "demo9",
      "demo10",
      "demo11",
      "demo12",
      "demo13",
      "demo14"
    ];

    var requestedOrder = Array.isArray(window.PORTFOLIO_PROJECT_ORDER) && window.PORTFOLIO_PROJECT_ORDER.length
      ? window.PORTFOLIO_PROJECT_ORDER
      : defaultOrder;

    var orderIndex = requestedOrder.reduce(function (map, id, index) {
      map[id] = index;
      return map;
    }, {});

    mergedProjects.sort(function (a, b) {
      var aIndex = a && a.id && Object.prototype.hasOwnProperty.call(orderIndex, a.id) ? orderIndex[a.id] : Number.MAX_SAFE_INTEGER;
      var bIndex = b && b.id && Object.prototype.hasOwnProperty.call(orderIndex, b.id) ? orderIndex[b.id] : Number.MAX_SAFE_INTEGER;
      return aIndex - bIndex;
    });

    window.PROJECT_TITLE_OVERRIDES = normalizeTextContent(window.PROJECT_TITLE_OVERRIDES || {});
    window.PORTFOLIO_PROJECTS = normalizeTextContent(mergedProjects);
  }

  normalizeProjectRegistry();
})();
