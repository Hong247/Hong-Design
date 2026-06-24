const fs   = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

global.window = global.window || {};
eval(fs.readFileSync(path.join(ROOT, "data/projects.js"), "utf8"));
const projects = global.window.PORTFOLIO_PROJECTS || [];

if (!projects.length) {
  console.error("generate-sitemap: no projects loaded — aborting");
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const base  = "https://hong-design.vercel.app";

const urls = [
  `  <url><loc>${base}/</loc><lastmod>${today}</lastmod><priority>1.0</priority></url>`,
  ...projects.filter(p => p && p.id).map(p =>
    `  <url><loc>${base}/${p.id}</loc><lastmod>${today}</lastmod><priority>0.8</priority></url>`
  )
].join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml);
console.log(`sitemap.xml written with ${projects.length + 1} URLs`);
