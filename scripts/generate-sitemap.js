const fs = require("fs");
const path = require("path");

const projectsJs = fs.readFileSync(path.join(__dirname, "../data/projects-index.js"), "utf8");
const ids = [];
const idRegex = /"id"\s*:\s*"([^"]+)"/g;
let match;
while ((match = idRegex.exec(projectsJs)) !== null) {
  ids.push(match[1]);
}

const today = new Date().toISOString().slice(0, 10);
const base = "https://hong-design.vercel.app";

const urls = [
  `  <url><loc>${base}/</loc><lastmod>${today}</lastmod><priority>1.0</priority></url>`,
  ...ids.map(id =>
    `  <url><loc>${base}/${id}</loc><lastmod>${today}</lastmod><priority>0.8</priority></url>`
  )
].join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

fs.writeFileSync(path.join(__dirname, "../sitemap.xml"), xml);
console.log(`sitemap.xml written with ${ids.length + 1} URLs`);
