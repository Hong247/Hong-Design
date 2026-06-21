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

    headerRow.className = "hover-trigger";
    headerRow.setAttribute("data-image-source", displayProject.preview || "");
    headerRow.setAttribute("data-project", displayTitle);
    headerRow.setAttribute("data-role", project.role);
    headerRow.setAttribute("data-year", String(project.year));
    headerRow.innerHTML =
      '<td><button type="button" class="custom-btn" data-target="#' + project.id + '">' + number + "</button></td>" +
      '<td><button type="button" class="custom-btn" data-target="#' + project.id + '">' + displayTitle + "</button></td>" +
      '<td class="role-cell"><button type="button" class="custom-btn" data-target="#' + project.id + '">' + project.role + "</button></td>" +
      '<td><button type="button" class="custom-btn" data-target="#' + project.id + '">' + project.year + "</button></td>";

    detailRow.id = project.id;
    detailRow.className = "collapse";
    detailRow.innerHTML = "<td colspan=\"4\">" + buildProjectDetail(displayProject) + "</td>";

    tbody.appendChild(headerRow);
    tbody.appendChild(detailRow);
  });
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
  if (Array.isArray(project.description) && project.description.length) {
    var galleryHtml = "";

    if (project.detailHtml) {
      var scrollStart = project.detailHtml.indexOf('<div class="scroll-container">');
      if (scrollStart !== -1) {
        var divEnd = project.detailHtml.indexOf("</div>", scrollStart);
        if (divEnd !== -1) {
          galleryHtml = project.detailHtml.substring(scrollStart, divEnd + 6);
        }
      }
    }

    if (!galleryHtml) {
      galleryHtml = '<div class="scroll-container">';
      (project.media || []).forEach(function (item, index) {
        if (item.type === "image") {
          galleryHtml +=
            '<img class="fullscreen-image" src="' + item.src + '" alt="' + item.alt + '"' +
            (index > 0 ? ' loading="lazy"' : "") + ">";
        }
        if (item.type === "iframe") {
          galleryHtml +=
            '<iframe width="' + (item.width || 1200) + '" height="' + (item.height || 600) +
            '" src="' + item.src + '" allowfullscreen loading="lazy"></iframe>';
        }
      });
      galleryHtml += "</div>";
    }

    var descriptionHtml = "";
    project.description.forEach(function (paragraph, index) {
      descriptionHtml +=
        "<p" + (index === 0 ? ' class="max-width-paragraph"' : "") + '><span class="case-label">' +
        paragraph.label + "</span>" + paragraph.text + "</p>";
    });

    return galleryHtml + descriptionHtml + "<br>";
  }

  if (project.detailHtml) {
    return project.detailHtml;
  }

  var mediaHtml = '<div class="scroll-container">';
  var legacyDescriptionHtml = "";

  (project.media || []).forEach(function (item, index) {
    if (item.type === "image") {
      mediaHtml +=
        '<img class="fullscreen-image" src="' + item.src + '" alt="' + item.alt + '"' +
        (index > 0 ? ' loading="lazy"' : "") + ">";
    }

    if (item.type === "iframe") {
      mediaHtml +=
        '<iframe width="' + (item.width || 1200) + '" height="' + (item.height || 600) +
        '" src="' + item.src + '" allowfullscreen loading="lazy"></iframe>';
    }
  });

  mediaHtml += "</div>";

  (project.description || []).forEach(function (paragraph, index) {
    legacyDescriptionHtml +=
      "<p" + (index === 0 ? ' class="max-width-paragraph"' : "") + '><span class="case-label">' +
      paragraph.label + "</span>" + paragraph.text + "</p>";
  });

  return mediaHtml + legacyDescriptionHtml + "<br>";
}
