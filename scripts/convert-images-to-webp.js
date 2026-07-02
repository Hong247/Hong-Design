/**
 * convert-images-to-webp.js
 * One-off migration: converts every project content image (referenced from
 * data/projects.js) from JPG/PNG to WebP where doing so is a clear win, then
 * rewrites data/projects.js to point at the new .webp files and deletes the
 * originals that got converted.
 *
 * "Clear win" = strictly smaller AND no visible quality loss:
 *   - PNG (lossless source): try lossless WebP first (pixel-identical).
 *     Some PNGs here are photographic/gradient-heavy rather than flat
 *     graphics, where lossless WebP can end up LARGER than a well-compressed
 *     source PNG — in that case fall back to WebP q=95 (visually
 *     indistinguishable from lossless at normal viewing sizes).
 *   - JPG (already-lossy source): WebP q=90, which is at least as good
 *     visually as the source and normally smaller. Some source JPGs were
 *     already saved at fairly aggressive compression, where re-encoding at
 *     q90 targets *more* fidelity than the source has left to give and ends
 *     up larger, not smaller — a first pass at a flat q=90 for every file
 *     produced 39 files that grew (some by 100-300%).
 * Whenever no attempt beats the original size, the file is left as-is
 * (original format kept, untouched) rather than trading size for quality or
 * shipping a same-or-bigger file.
 *
 * Run once with: node scripts/convert-images-to-webp.js
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const PROJECTS_FILE = path.join(ROOT, "data", "projects.js");
const TMP = path.join(ROOT, ".webp-tmp");

function findReferencedImages() {
  const src = fs.readFileSync(PROJECTS_FILE, "utf8");
  const matches = [...src.matchAll(/"(images\/[^"]+\.(?:jpe?g|png))"/gi)].map((m) => m[1]);
  return [...new Set(matches)];
}

function encode(absSrc, absOut, args) {
  execFileSync("cwebp", [...args, "-quiet", absSrc, "-o", absOut]);
  return fs.statSync(absOut).size;
}

/** Returns the path of the smallest attempt that beats originalSize, or null. */
function bestAttempt(absSrc, attempts, originalSize) {
  let best = null;
  attempts.forEach((args, i) => {
    const candidate = path.join(TMP, "candidate-" + i + ".webp");
    try {
      const size = encode(absSrc, candidate, args);
      if (size < originalSize && (!best || size < best.size)) {
        if (best) fs.unlinkSync(best.candidate);
        best = { candidate, size };
      } else {
        fs.unlinkSync(candidate);
      }
    } catch (e) {
      console.warn("  cwebp failed on", absSrc, args.join(" "), e.message);
    }
  });
  return best;
}

function convertOne(relPath) {
  const absPath = path.join(ROOT, relPath);
  const ext = path.extname(relPath).toLowerCase();
  const webpRel = relPath.slice(0, -ext.length) + ".webp";
  const webpAbs = path.join(ROOT, webpRel);
  const originalSize = fs.statSync(absPath).size;

  const attempts = ext === ".png"
    ? [["-lossless"], ["-q", "95", "-m", "6"]]
    : [["-q", "90", "-m", "6"]];

  const best = bestAttempt(absPath, attempts, originalSize);
  if (!best) {
    return { relPath, converted: false, beforeSize: originalSize, afterSize: originalSize };
  }

  fs.renameSync(best.candidate, webpAbs);
  fs.unlinkSync(absPath);
  return { relPath, webpRel, converted: true, beforeSize: originalSize, afterSize: best.size };
}

function main() {
  fs.mkdirSync(TMP, { recursive: true });

  const images = findReferencedImages();
  console.log("convert-images-to-webp: " + images.length + " referenced images found");

  const results = images.map(convertOne);
  fs.rmdirSync(TMP, { recursive: true });

  const converted = results.filter((r) => r.converted);
  const skipped = results.filter((r) => !r.converted);

  let projectsSrc = fs.readFileSync(PROJECTS_FILE, "utf8");
  for (const r of converted) {
    projectsSrc = projectsSrc.split('"' + r.relPath + '"').join('"' + r.webpRel + '"');
  }
  fs.writeFileSync(PROJECTS_FILE, projectsSrc, "utf8");

  const totalBefore = results.reduce((s, r) => s + r.beforeSize, 0);
  const totalAfter = results.reduce((s, r) => s + r.afterSize, 0);
  const pct = Math.round((1 - totalAfter / totalBefore) * 100);
  console.log(
    "convert-images-to-webp: " + converted.length + "/" + results.length + " converted, " +
    skipped.length + " kept as original format (no WebP win found), " +
    (totalBefore / 1048576).toFixed(1) + "MB -> " + (totalAfter / 1048576).toFixed(1) +
    "MB (" + pct + "% smaller)"
  );
  if (skipped.length) {
    console.log("Kept as original:");
    skipped.forEach((r) => console.log("  " + r.relPath));
  }
}

main();
