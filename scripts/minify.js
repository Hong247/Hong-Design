/**
 * minify.js - final build step (runs on Vercel via `npm run build`)
 * Minifies browser-facing JS and the CSS bundle in place. The committed
 * source stays unminified; Vercel minifies its fresh clone before serving.
 *
 * NOT run by the local per-step workflow — only by the full build pipeline.
 *
 * Safety:
 *   - Only an explicit allowlist of browser JS is minified (never build scripts).
 *   - terser keeps top-level names (toplevel:false) so cross-file globals
 *     like window.renderProjectDetailRow survive.
 *   - The inline <script> in index.html is never touched, so its CSP hash holds.
 */

const fs       = require("fs");
const path     = require("path");
const { minify } = require("terser");
const CleanCSS = require("clean-css");

const ROOT = path.join(__dirname, "..");

// Browser-facing JS (must match the <script src> tags in index.html).
const JS_FILES = [
  "scripts/analytics.js",
  "scripts/clarity.js",
  "scripts/custom-scrollbar.js",
  "scripts/lightbox.js",
  "scripts/main.js",
  "scripts/project-loader.js",
  "scripts/project-renderer.js",
  "scripts/project-scroll-controller.js",
  "data/projects-index.js",
];

const CSS_FILES = ["styles/bundle.css"];

function kb(n) { return (n / 1024).toFixed(1) + "KB"; }

async function minifyJs() {
  let before = 0, after = 0;
  for (const rel of JS_FILES) {
    const file = path.join(ROOT, rel);
    if (!fs.existsSync(file)) { console.warn("minify: skip missing " + rel); continue; }
    const src = fs.readFileSync(file, "utf8");
    const result = await minify(src, { compress: true, mangle: true });
    if (result.error) throw result.error;
    fs.writeFileSync(file, result.code, "utf8");
    before += src.length; after += result.code.length;
  }
  console.log("minify JS:  " + kb(before) + " -> " + kb(after) +
    " (" + Math.round((1 - after / before) * 100) + "% smaller)");
}

function minifyCss() {
  let before = 0, after = 0;
  for (const rel of CSS_FILES) {
    const file = path.join(ROOT, rel);
    if (!fs.existsSync(file)) { console.warn("minify: skip missing " + rel); continue; }
    const src = fs.readFileSync(file, "utf8");
    const out = new CleanCSS({ level: 2 }).minify(src);
    if (out.errors && out.errors.length) throw new Error(out.errors.join("; "));
    fs.writeFileSync(file, out.styles, "utf8");
    before += src.length; after += out.styles.length;
  }
  console.log("minify CSS: " + kb(before) + " -> " + kb(after) +
    " (" + Math.round((1 - after / before) * 100) + "% smaller)");
}

(async function () {
  await minifyJs();
  minifyCss();
})().catch(function (err) {
  console.error("minify failed:", err);
  process.exit(1);
});
