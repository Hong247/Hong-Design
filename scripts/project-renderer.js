document.addEventListener("DOMContentLoaded", function () {
  renderProjectArchive();
});

function renderProjectArchive() {
  var tbody = document.getElementById("projectArchive");
  var projects = window.PORTFOLIO_PROJECTS || [];
  var titleOverrides = window.PROJECT_TITLE_OVERRIDES || {};

  if (!tbody || !projects.length) {
    return;
  }

  tbody.innerHTML = "";

  projects.forEach(function (project, index) {
    var number = String(index + 1).padStart(2, "0");
    var displayTitle = titleOverrides[project.id] || project.title;
    var headerRow = document.createElement("tr");
    var detailRow = document.createElement("tr");

    headerRow.className = "hover-trigger";
    headerRow.setAttribute("data-image-source", project.preview || "");
    headerRow.innerHTML = '<td><button type="button" class="custom-btn" data-target="#' + project.id + '">' + number + '</button></td><td><button type="button" class="custom-btn" data-target="#' + project.id + '">' + displayTitle + '</button></td><td class="role-cell"><button type="button" class="custom-btn" data-target="#' + project.id + '">' + project.role + '</button></td><td><button type="button" class="custom-btn" data-target="#' + project.id + '">' + project.year + '</button></td>';

    detailRow.id = project.id;
    detailRow.className = "collapse";
    detailRow.innerHTML = '<td colspan="4">' + buildProjectDetail(project) + '</td>';

    tbody.appendChild(headerRow);
    tbody.appendChild(detailRow);
  });

  loadBase64ProjectImages(document);
}

function buildProjectDetail(project) {
  if (project.detailHtml) {
    return project.detailHtml;
  }

  var mediaHtml = '<div class="scroll-container">';
  var descriptionHtml = "";

  (project.media || []).forEach(function (item, index) {
    if (item.type === "image") {
      mediaHtml += '<img class="fullscreen-image" src="' + item.src + '" alt="' + item.alt + '"' + (index > 0 ? ' loading="lazy"' : '') + '>';
    }

    if (item.type === "base64-image") {
      mediaHtml += '<img class="fullscreen-image js-base64-image" data-base64-src="' + item.src + '" data-mime-type="' + (item.mimeType || 'image/jpeg') + '" alt="' + item.alt + '"' + (index > 0 ? ' loading="lazy"' : '') + '>';
    }

    if (item.type === "iframe") {
      mediaHtml += '<iframe width="' + (item.width || 1200) + '" height="' + (item.height || 600) + '" src="' + item.src + '" allowfullscreen loading="lazy"></iframe>';
    }
  });

  mediaHtml += "</div>";

  (project.description || []).forEach(function (paragraph, index) {
    descriptionHtml += '<p' + (index === 0 ? ' class="max-width-paragraph"' : '') + '><span class="case-label">' + paragraph.label + '</span>' + paragraph.text + '</p>';
  });

  return mediaHtml + descriptionHtml + "<br>";
}

function loadBase64ProjectImages(root) {
  var images = (root || document).querySelectorAll(".js-base64-image[data-base64-src]");

  images.forEach(function (image) {
    var assetPath = image.getAttribute("data-base64-src");
    var mimeType = image.getAttribute("data-mime-type") || "image/jpeg";

    if (!assetPath || image.getAttribute("data-base64-loaded") === "true") {
      return;
    }

    image.setAttribute("data-base64-loaded", "true");

    window.fetch(assetPath)
      .then(function (response) {
        if (!response.ok) {
          return "";
        }
        return response.text();
      })
      .then(function (base64Content) {
        if (base64Content) {
          image.src = "data:" + mimeType + ";base64," + base64Content.trim();
        }
      });
  });
}
