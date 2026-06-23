document.addEventListener("DOMContentLoaded", function () {
  renderProjectArchive();
});

function slugify(title) {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function renderProjectArchive() {
  var tbody = document.getElementById("projectArchive");
  var projects = window.PORTFOLIO_PROJECTS || [];
  var titleOverrides = window.PROJECT_TITLE_OVERRIDES || {};
  var mediaOverrides = window.PROJECT_MEDIA_OVERRIDES || {};

  if (!tbody || !projects.length) {
    return;
  }

  tbody.innerHTML = "";

  projects.forEach(function (project, index) {
    var number = String(index + 1).padStart(2, "0");
    var displayTitle = titleOverrides[project.id] || project.title;
    var displayProject = applyProjectMediaOverride(project, mediaOverrides[project.id]);
    var slug = slugify(displayTitle);
    var headerRow = document.createElement("tr");
    var detailRow = document.createElement("tr");

    headerRow.className = "hover-trigger";
    headerRow.setAttribute("data-image-source", displayProject.preview || "");
    headerRow.setAttribute("data-project", displayTitle);
    headerRow.setAttribute("data-role", project.role);
    headerRow.setAttribute("data-year", String(project.year));
    headerRow.innerHTML =
      '<td><button type="button" class="custom-btn" data-target="#' + slug + '">' + number + "</button></td>" +
      '<td><button type="button" class="custom-btn" data-target="#' + slug + '">' + displayTitle + "</button></td>" +
      '<td class="role-cell"><button type="button" class="custom-btn" data-target="#' + slug + '">' + project.role + "</button></td>" +
      '<td><button type="button" class="custom-btn" data-target="#' + slug + '">' + project.year + "</button></td>";

    headerRow.setAttribute("data-gallery-srcs", getProjectGallerySources(displayProject).join("|"));

    detailRow.id = slug;
    detailRow.className = "collapse";
    detailRow.innerHTML = "<td colspan=\"4\"></td>";
    detailRow._project = displayProject;

    tbody.appendChild(headerRow);
    tbody.appendChild(detailRow);
  });
}

function getProjectGallerySources(project) {
  var sources = [];

  if (project.preview) {
    sources.push(project.preview);
  }

  if (Array.isArray(project.media)) {
    project.media.forEach(function (item) {
      if (item.type === "image" && item.src && sources.indexOf(item.src) === -1) {
        sources.push(item.src);
      }
    });
  } else if (typeof project.detailHtml === "string") {
    var re = /src="([^"]+\.(?:jpe?g|png|gif|webp))"/gi;
    var m;
    while ((m = re.exec(project.detailHtml)) !== null) {
      if (sources.indexOf(m[1]) === -1) {
        sources.push(m[1]);
      }
    }
  }

  return sources.slice(0, 4);
}

window.renderProjectDetailRow = function (row) {
  if (row._projectRendered || !row._project) {
    return;
  }

  var td = row.querySelector("td");

  if (!td) {
    return;
  }

  td.innerHTML = buildProjectDetail(row._project);

  var scrollContainer = td.querySelector(".scroll-container");
  var paragraphs = Array.from(td.querySelectorAll(":scope > p"));

  if (scrollContainer && paragraphs.length) {
    var detail = document.createElement("div");
    detail.className = "project-detail";

    var description = document.createElement("div");
    description.className = "project-description";

    scrollContainer.before(detail);
    detail.appendChild(scrollContainer);
    detail.appendChild(description);

    paragraphs.forEach(function (p) {
      description.appendChild(p);
    });

    Array.from(td.querySelectorAll(":scope > br")).forEach(function (br) {
      br.remove();
    });

    if (typeof window.addScrollDots === "function") {
      window.addScrollDots(scrollContainer);
    }
  }

  row._projectRendered = true;
};

function applyProjectMediaOverride(project, override) {
  if (!override) {
    return project;
  }

  var baseMedia = override.media || project.media || [];
  var prependMedia = override.prependMedia || [];

  return Object.assign({}, project, {
    preview: override.preview || project.preview,
    media: prependMedia.concat(baseMedia)
  });
}

function buildGalleryHtml(project) {
  if (project.detailHtml) {
    var scrollStart = project.detailHtml.indexOf('<div class="scroll-container">');
    if (scrollStart !== -1) {
      var divEnd = project.detailHtml.indexOf("</div>", scrollStart);
      if (divEnd !== -1) {
        return project.detailHtml.substring(scrollStart, divEnd + 6);
      }
    }
  }

  var html = '<div class="scroll-container">';
  (project.media || []).forEach(function (item, index) {
    if (item.type === "image") {
      html +=
        '<img class="fullscreen-image" src="' + item.src + '" alt="' + item.alt + '"' +
        (index > 0 ? ' loading="lazy"' : "") + ">";
    }
    if (item.type === "iframe") {
      html +=
        '<iframe src="' + item.src + '" allow="autoplay; fullscreen" scrolling="no" allowfullscreen></iframe>';
    }
  });
  return html + "</div>";
}

function buildDescriptionHtml(description) {
  var html = "";
  (description || []).forEach(function (paragraph, index) {
    html +=
      "<p" + (index === 0 ? ' class="max-width-paragraph"' : "") + '><span class="case-label">' +
      paragraph.label + "</span>" + paragraph.text + "</p>";
  });
  return html;
}

function buildProjectDetail(project) {
  if (Array.isArray(project.description) && project.description.length) {
    return buildGalleryHtml(project) + buildDescriptionHtml(project.description) + "<br>";
  }

  if (project.detailHtml) {
    return project.detailHtml;
  }

  return buildGalleryHtml(project) + buildDescriptionHtml(project.description) + "<br>";
}
