(function () {
  function normalizeProjectRegistry() {
    var legacyProjects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];
    var separatedProjects = Array.isArray(window.PORTFOLIO_PROJECT_MODULES) ? window.PORTFOLIO_PROJECT_MODULES : [];

    if (!separatedProjects.length) {
      window.PORTFOLIO_PROJECTS = legacyProjects;
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

    window.PORTFOLIO_PROJECTS = mergedProjects;
  }

  normalizeProjectRegistry();
})();
