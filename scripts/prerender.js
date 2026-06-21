/**
 * prerender.js - Vercel build script
 * Runs before deployment to:
 *   1. Download IBM Plex Sans woff2 font from Fontsource CDN (self-host at runtime)
 *   2. Pre-render the project table into index.html so Google can crawl project content
 */

const fs   = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');

// 1. Font download

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    const file = fs.createWriteStream(destPath);
    https.get(url, res => {
      if (res.statusCode !== 200) {
        return reject(new Error('HTTP ' + res.statusCode + ' downloading ' + url));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', err => { fs.unlink(destPath, () => {}); reject(err); });
  });
}

async function downloadFonts() {
  const fonts = [
    {
      url:  'https://cdn.jsdelivr.net/npm/@fontsource/ibm-plex-sans@5/files/ibm-plex-sans-latin-400-normal.woff2',
      dest: path.join(ROOT, 'fonts/ibm-plex-sans-400-normal.woff2')
    },
    {
      url:  'https://cdn.jsdelivr.net/npm/@fontsource/ibm-plex-sans@5/files/ibm-plex-sans-latin-400-italic.woff2',
      dest: path.join(ROOT, 'fonts/ibm-plex-sans-400-italic.woff2')
    }
  ];

  for (const { url, dest } of fonts) {
    if (fs.existsSync(dest)) {
      console.log('Font already cached:', path.basename(dest));
      continue;
    }
    console.log('Downloading:', url);
    await downloadFile(url, dest);
    console.log('Saved:', dest);
  }
}

// 2. Project data loading

function loadProjectData() {
  // Mock browser environment
  global.window = global.window || {};

  // Files to load in the same order as index.html
  const dataFiles = [
    'data/projects.js',
    'data/project-title-overrides.js',
    'data/project-media-overrides.js',
    'data/projects/cmarket-tote-bag.js',
    'data/projects/cmarket-website.js',
    'data/projects/mara-natha-portfolio-document.js',
    'data/projects/kee.js',
    'data/projects/maia.js',
    'data/projects/browns.js',
    'data/projects/monday.js',
    'data/projects/kill-the-bride.js',
    'data/projects/wwf-stop-haunting-mother-nature.js',
    'data/projects/xway.js',
    'data/projects/raku-haru.js',
    'data/projects/trapo-digital-catalogue.js',
    'data/projects/trapo-smartphone-holder.js',
    'data/projects/talentlounge-virtual-career-fair.js',
    'data/projects/nexus.js',
    'data/projects/motorola-solutions-internship.js',
    'data/projects/ek-logo.js',
    'data/projects-content.js',
    'scripts/project-loader.js',
  ];

  dataFiles.forEach(rel => {
    const fullPath = path.join(ROOT, rel);
    if (!fs.existsSync(fullPath)) {
      console.warn('Skipping (not found):', rel);
      return;
    }
    try {
      eval(fs.readFileSync(fullPath, 'utf8'));
    } catch (e) {
      console.warn('Warning loading', rel + ':', e.message);
    }
  });

  return {
    projects:       global.window.PORTFOLIO_PROJECTS || [],
    titleOverrides: global.window.PROJECT_TITLE_OVERRIDES || {},
  };
}

// 3. HTML generation

function escHtml(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}

/** Extract <p>...</p> blocks from a detailHtml string (for SEO text) */
function extractParagraphs(html) {
  const results = [];
  const re = /<p([^>]*)>([\s\S]*?)<\/p>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    results.push('<p' + m[1] + '>' + m[2] + '</p>');
  }
  return results.join('\n          ');
}

function buildProjectRows(projects, titleOverrides) {
  let html = '';

  projects.forEach((project, index) => {
    if (!project || !project.id) return;

    const number    = String(index + 1).padStart(2, '0');
    const title     = titleOverrides[project.id] || project.title || '';
    const role      = project.role  || '';
    const year      = project.year  || '';
    const id        = project.id;
    const preview   = project.preview || '';

    // Build crawlable description content
    let descHtml = '';
    if (Array.isArray(project.description) && project.description.length) {
      project.description.forEach(para => {
        descHtml += '\n          <p><span class="case-label">' + escHtml(para.label) + '</span>' + para.text + '</p>';
      });
    } else if (typeof project.detailHtml === 'string') {
      descHtml = '\n          ' + extractParagraphs(project.detailHtml);
    }

    html += `
    <tr class="hover-trigger" data-image-source="${escHtml(preview)}" data-project="${escHtml(title)}" data-role="${escHtml(role)}" data-year="${escHtml(year)}">
      <td><button type="button" class="custom-btn" data-target="#${escHtml(id)}">${number}</button></td>
      <td><button type="button" class="custom-btn" data-target="#${escHtml(id)}">${escHtml(title)}</button></td>
      <td class="role-cell"><button type="button" class="custom-btn" data-target="#${escHtml(id)}">${escHtml(role)}</button></td>
      <td><button type="button" class="custom-btn" data-target="#${escHtml(id)}">${escHtml(year)}</button></td>
    </tr>
    <tr id="${escHtml(id)}" class="collapse">
      <td colspan="4"><div class="project-detail"><div class="project-description">${descHtml}
      </div></div></td>
    </tr>`;
  });

  return html;
}

// 4. Main

async function main() {
  // Fonts
  await downloadFonts();

  // Project data
  const { projects, titleOverrides } = loadProjectData();
  console.log('Loaded', projects.length, 'projects');

  // Pre-render HTML
  const projectsHtml = buildProjectRows(projects, titleOverrides);

  const indexPath = path.join(ROOT, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');

  if (!html.includes('<!-- PRERENDER_PROJECTS -->')) {
    console.warn('Warning: placeholder <!-- PRERENDER_PROJECTS --> not found in index.html');
    console.warn('Skipping project injection.');
  } else {
    html = html.replace(
      '<!-- PRERENDER_PROJECTS -->',
      projectsHtml + '\n    '
    );
    fs.writeFileSync(indexPath, html, 'utf8');
    console.log('Pre-rendered', projects.length, 'projects into index.html');
  }
}

main().catch(err => { console.error(err); process.exit(1); });
