/**
 * generate-project-files.js - Vercel build script
 * Reads data/projects.js and outputs:
 *   - data/projects-index.js  (lightweight: id/title/role/year/preview only)
 *   - data/projects/{id}.json (full detail: media + description per project)
 */

const fs   = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

global.window = global.window || {};
eval(fs.readFileSync(path.join(ROOT, "data/projects.js"), "utf8"));

const projects = global.window.PORTFOLIO_PROJECTS || [];

// Gallery image srcs for the desktop hover preview (preview first, deduped,
// images only). Excludes the mobile-only "keem" mockups — hover is desktop.
function galleryFor(p) {
  const srcs = [];
  if (p.preview) srcs.push(p.preview);
  (p.media || []).forEach(function (m) {
    if (
      m.type === "image" && m.src &&
      m.className !== "keem" &&          // mobile-only mockups
      !/\.gif($|\?)/i.test(m.src) &&     // skip heavy animated GIFs in the teaser
      srcs.indexOf(m.src) === -1
    ) {
      srcs.push(m.src);
    }
  });
  return srcs;
}

// 1. Lightweight index for initial page load
const index = projects.map(function (p) {
  return {
    id:      p.id,
    title:   p.title,
    role:    p.role,
    year:    p.year,
    preview: p.preview,
    gallery: galleryFor(p)
  };
});

fs.writeFileSync(
  path.join(ROOT, "data/projects-index.js"),
  "window.PORTFOLIO_PROJECTS = " + JSON.stringify(index, null, 2) + ";\n"
);
console.log("data/projects-index.js written (" + index.length + " projects)");

// 2. Per-project JSON detail files
const detailDir = path.join(ROOT, "data/projects");
if (!fs.existsSync(detailDir)) fs.mkdirSync(detailDir, { recursive: true });

projects.forEach(function (p) {
  const detail = {
    id:          p.id,
    title:       p.title,
    role:        p.role,
    year:        p.year,
    preview:     p.preview,
    media:       p.media       || [],
    description: p.description || []
  };
  fs.writeFileSync(
    path.join(detailDir, p.id + ".json"),
    JSON.stringify(detail)
  );
});
console.log("data/projects/*.json written (" + projects.length + " files)");
