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

  if (!tbody || !projects.length) {
    return;
  }

  tbody.innerHTML = "";

  projects.forEach(function (project, index) {
    var number = String(index + 1).padStart(2, "0");
    var id = project.id;
    var headerRow = document.createElement("tr");
    var detailRow = document.createElement("tr");

    headerRow.className = "hover-trigger";
    headerRow.setAttribute("data-image-source", project.preview || "");
    headerRow.setAttribute("data-project", project.title);
    headerRow.setAttribute("data-role", project.role);
    headerRow.setAttribute("data-year", String(project.year));
    headerRow.innerHTML =
      '<td><button type="button" class="custom-btn" data-target="#' + id + '">' + number + '</button></td>' +
      '<td><button type="button" class="custom-btn" data-target="#' + id + '">' + project.title + '</button></td>' +
      '<td class="role-cell"><button type="button" class="custom-btn" data-target="#' + id + '">' + project.role + '</button></td>' +
      '<td><button type="button" class="custom-btn" data-target="#' + id + '">' + project.year + '</button></td>';

    headerRow.setAttribute("data-gallery-srcs", getProjectGallerySources(project).join("|"));

    detailRow.id = id;
    detailRow.className = "collapse";
    detailRow.innerHTML = "<td colspan=\"4\"></td>";
    detailRow._project = project;

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

function buildGalleryHtml(project) {
  if (project.detailHtml && !project.media) {
    return project.detailHtml;
  }
  var html = '<div class="scroll-container">';
  (project.media || []).forEach(function (item, index) {
    if (item.type === "image") {
      var cls = "fullscreen-image" + (item.className ? " " + item.className : "");
      html +=
        '<img class="' + cls + '" src="' + item.src + '" alt="' + item.alt + '"' +
        (index > 0 ? ' loading="lazy"' : "") + ">";
    }
    if (item.type === "iframe") {
      var dims = (item.width ? ' width="' + item.width + '"' : "") + (item.height ? ' height="' + item.height + '"' : "");
      html +=
        '<iframe' + dims + ' src="' + item.src + '" allow="autoplay; fullscreen" scrolling="no" allowfullscreen loading="lazy"></iframe>';
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
  return buildGalleryHtml(project) + buildDescriptionHtml(project.description) + "<br>";
}
