document.addEventListener("DOMContentLoaded", function () {
  renderProjectArchive();
});

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
    var headerRow = document.createElement("tr");
    var detailRow = document.createElement("tr");
    var titleBtnId = "btn-title-" + project.id;
    var safeTitle = escapeAttr(displayTitle);
    var safeRole = escapeAttr(project.role);

    headerRow.className = "hover-trigger";
    headerRow.setAttribute("data-image-source", displayProject.preview || "");
    headerRow.innerHTML =
      '<td><button type="button" class="custom-btn" data-target="#' + project.id + '" aria-expanded="false" aria-controls="' + project.id + '" aria-label="' + safeTitle + ', expand project">' + number + '</button></td>' +
      '<td><button type="button" id="' + titleBtnId + '" class="custom-btn" data-target="#' + project.id + '" aria-expanded="false" aria-controls="' + project.id + '">' + displayTitle + '</button></td>' +
      '<td class="role-cell"><button type="button" class="custom-btn" data-target="#' + project.id + '" aria-expanded="false" aria-controls="' + project.id + '" aria-label="' + safeRole + ', ' + safeTitle + '">' + project.role + '</button></td>' +
      '<td><button type="button" class="custom-btn" data-target="#' + project.id + '" aria-expanded="false" aria-controls="' + project.id + '" aria-label="Year ' + project.year + ', ' + safeTitle + '">' + project.year + '</button></td>';

    detailRow.id = project.id;
    detailRow.className = "collapse";
    detailRow.setAttribute("role", "region");
    detailRow.setAttribute("aria-labelledby", titleBtnId);
    detailRow.innerHTML = '<td colspan="4">' + buildProjectDetail(displayProject) + '</td>';

    tbody.appendChild(headerRow);
    tbody.appendChild(detailRow);
  });
}

function escapeAttr(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

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

function buildProjectDetail(project) {
  if (project.detailHtml) {
    return project.detailHtml;
  }

  var mediaHtml = '<div class="scroll-container">';
  var descriptionHtml = "";

  (project.media || []).forEach(function (item, index) {
    if (item.type === "image") {
      mediaHtml += '<img class="fullscreen-image" src="' + item.src + '" alt="' + escapeAttr(item.alt) + '" decoding="async"' + (index > 0 ? ' loading="lazy"' : '') + '>';
    }

    if (item.type === "iframe") {
      mediaHtml += '<iframe width="' + (item.width || 1200) + '" height="' + (item.height || 600) + '" src="' + item.src + '" allowfullscreen loading="lazy" title="' + escapeAttr(item.alt || project.title) + '"></iframe>';
    }
  });

  mediaHtml += "</div>";

  (project.description || []).forEach(function (paragraph, index) {
    descriptionHtml += '<p' + (index === 0 ? ' class="max-width-paragraph"' : '') + '><span class="case-label">' + paragraph.label + '</span>' + paragraph.text + '</p>';
  });

  return mediaHtml + descriptionHtml + "<br>";
}
