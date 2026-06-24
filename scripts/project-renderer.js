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
      '<td data-label="No"><button type="button" class="custom-btn" data-target="#' + id + '">' + number + '</button></td>' +
      '<td data-label="Project"><button type="button" class="custom-btn" data-target="#' + id + '">' + project.title + '</button></td>' +
      '<td data-label="Role" class="role-cell"><button type="button" class="custom-btn" data-target="#' + id + '">' + project.role + '</button></td>' +
      '<td data-label="Year"><button type="button" class="custom-btn" data-target="#' + id + '">' + project.year + '</button></td>';

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

function populateDetailRow(row) {
  var td = row.querySelector("td");
  if (!td) return;

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

    scrollContainer.scrollLeft = 0;

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "project-close-btn";
    closeBtn.setAttribute("aria-label", "Close project");
    closeBtn.innerHTML =
      '<span class="project-close-line"></span>' +
      '<span class="project-close-label">Close</span>' +
      '<span class="project-close-line"></span>';
    closeBtn.addEventListener("click", function () {
      if (typeof window.closeProjectRow === "function") {
        window.closeProjectRow(row);
      }
    });
    description.appendChild(closeBtn);
  }

  row._projectRendered = true;
}

window.renderProjectDetailRow = function (row) {
  if (row._projectRendered || !row._project) {
    return;
  }

  var td = row.querySelector("td");
  if (!td) return;

  if (row._project.media && row._project.media.length) {
    populateDetailRow(row);
    return;
  }

  td.innerHTML = '<div class="project-loading" aria-label="Loading" aria-live="polite"><span></span><span></span><span></span></div>';

  fetch("/data/projects/" + row._project.id + ".json")
    .then(function (res) { return res.json(); })
    .then(function (data) {
      row._project.media       = data.media       || [];
      row._project.description = data.description || [];
      populateDetailRow(row);
      if (typeof window.updateMetaForProject === "function") {
        window.updateMetaForProject(row._project);
      }
    })
    .catch(function () {
      populateDetailRow(row);
    });
};

function buildGalleryHtml(project) {
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
