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
    },
    {
      url:  'https://cdn.jsdelivr.net/npm/@fontsource/ibm-plex-sans@5/files/ibm-plex-sans-latin-700-normal.woff2',
      dest: path.join(ROOT, 'fonts/ibm-plex-sans-700-normal.woff2')
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

function slugify(title) {
  return title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

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
    const discipline = project.discipline || '';
    const year      = project.year  || '';
    const slug      = project.id;
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
    <tr class="hover-trigger" data-image-source="${escHtml(preview)}" data-project="${escHtml(title)}" data-role="${escHtml(role)}" data-discipline="${escHtml(discipline)}" data-year="${escHtml(year)}">
      <td data-label="No"><button type="button" class="custom-btn" data-target="#${slug}">${number}</button></td>
      <td data-label="Project"><button type="button" class="custom-btn" data-target="#${slug}">${escHtml(title)}</button></td>
      <td data-label="Role" class="role-cell"><button type="button" class="custom-btn" data-target="#${slug}">${escHtml(role)}</button></td>
      <td data-label="Year"><button type="button" class="custom-btn" data-target="#${slug}">${escHtml(year)}</button></td>
    </tr>
    <tr id="${slug}" class="collapse">
      <td colspan="4"><div class="project-detail"><div class="project-description">${descHtml}
      </div></div></td>
    </tr>`;
  });

  return html;
}

// 4. CreativeWork schema

function buildCreativeWorkSchema(projects) {
  const base = 'https://hong-design.vercel.app';
  const items = projects
    .filter(p => p && p.id)
    .map(p => {
      const obj = {
        '@type': 'CreativeWork',
        'name': p.title || '',
        'url': base + '/' + p.id,
        'dateCreated': String(p.year || ''),
        'creator': { '@type': 'Person', 'name': 'Cheok Hong Lai' }
      };
      if (p.role) obj['description'] = p.role;
      if (p.discipline) obj['genre'] = p.discipline;
      if (p.preview) obj['image'] = base + '/' + p.preview;
      if (Array.isArray(p.description) && p.description.length) {
        obj['abstract'] = p.description.map(d => d.label + ': ' + d.text).join(' ');
      }
      return obj;
    });

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': 'Hong Design Portfolio',
    'url': base + '/',
    'numberOfItems': items.length,
    'itemListElement': items.map((item, i) => ({
      '@type': 'ListItem',
      'position': i + 1,
      'item': item
    }))
  };

  return '<script type="application/ld+json">\n' + JSON.stringify(schema, null, 2) + '\n</script>';
}

function injectProjectRows(html, projectsHtml, projectCount) {
  if (html.includes('<!-- PRERENDER_PROJECTS -->')) {
    console.log('Pre-rendered', projectCount, 'projects into index.html');
    return html.replace('<!-- PRERENDER_PROJECTS -->', projectsHtml + '\n    ');
  }

  const tbodyRe = /(<tbody id="projectArchive">)[\s\S]*?(<\/tbody>)/;
  if (tbodyRe.test(html)) {
    console.log('Updated pre-rendered project rows in index.html');
    return html.replace(tbodyRe, function (_match, open, close) {
      return open + projectsHtml + '\n    ' + close;
    });
  }

  console.warn('Warning: projectArchive tbody not found in index.html');
  return html;
}

function injectProjectSchema(html, schemaHtml, projectCount) {
  const schemaBlock = '<!-- PRERENDER_SCHEMA_START -->\n' + schemaHtml + '\n<!-- PRERENDER_SCHEMA_END -->';
  const schemaBlockRe = /<!-- PRERENDER_SCHEMA_START -->[\s\S]*?<!-- PRERENDER_SCHEMA_END -->/;

  if (schemaBlockRe.test(html)) {
    console.log('Updated CreativeWork schema for', projectCount, 'projects');
    return html.replace(schemaBlockRe, function () { return schemaBlock; });
  }

  if (html.includes('<!-- PRERENDER_SCHEMA -->')) {
    console.log('Injected CreativeWork schema for', projectCount, 'projects');
    return html.replace('<!-- PRERENDER_SCHEMA -->', function () { return schemaBlock; });
  }

  if (html.includes('</head>')) {
    console.log('Inserted CreativeWork schema for', projectCount, 'projects');
    return html.replace('</head>', function () { return schemaBlock + '\n</head>'; });
  }

  console.warn('Warning: head end not found in index.html');
  return html;
}

// 5. Main

async function main() {
  // Fonts
  await downloadFonts();

  // Project data
  const { projects, titleOverrides } = loadProjectData();
  console.log('Loaded', projects.length, 'projects');

  // Pre-render HTML
  const projectsHtml = buildProjectRows(projects, titleOverrides);
  const schemaHtml   = buildCreativeWorkSchema(projects);

  const indexPath = path.join(ROOT, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');

  html = injectProjectRows(html, projectsHtml, projects.length);
  html = injectProjectSchema(html, schemaHtml, projects.length);

  fs.writeFileSync(indexPath, html, 'utf8');
}

main().catch(err => { console.error(err); process.exit(1); });
