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
const BASE_URL = 'https://hong-design.vercel.app';

const HOME_META = {
  title: 'Hong Design | Visual Identity & Product Design',
  description: 'Portfolio of Cheok Hong Lai — Vancouver-based designer specializing in visual identity and product design with a focus on clarity, restraint, and strong visual structure.',
  twitterDescription: 'Visual identity and product design portfolio by Cheok Hong Lai, Vancouver.',
  image: BASE_URL + '/images/share-icon.jpg',
  url: BASE_URL + '/'
};

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

function stripHtml(str) {
  return String(str || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncateText(str, maxLength) {
  const text = stripHtml(str);

  if (text.length <= maxLength) {
    return text;
  }

  const shortened = text.slice(0, maxLength - 1).replace(/\s+\S*$/, '');
  return shortened.replace(/[.,;:!?-]+$/, '') + '…';
}

function encodePathSegment(segment) {
  try {
    return encodeURIComponent(decodeURIComponent(segment));
  } catch (error) {
    return encodeURIComponent(segment);
  }
}

function toAbsoluteUrl(src) {
  if (!src) {
    return HOME_META.image;
  }

  if (/^https?:\/\//i.test(src)) {
    return src;
  }

  const encodedPath = String(src)
    .replace(/^\//, '')
    .split('/')
    .map(encodePathSegment)
    .join('/');

  return BASE_URL + '/' + encodedPath;
}

function getProjectDescription(project) {
  if (Array.isArray(project.description) && project.description.length) {
    return truncateText(project.description[0].text, 160);
  }

  return truncateText((project.role || 'Design') + ' project by Cheok Hong Lai for the Hong Design portfolio.', 160);
}

function getProjectMeta(project) {
  const title = (project.title || 'Project') + ' | Hong Design';
  const description = getProjectDescription(project) || HOME_META.description;
  const url = BASE_URL + '/' + project.id;
  const image = toAbsoluteUrl(project.preview);

  return { title, description, url, image };
}

function replaceHeadMetadata(html, project) {
  const meta = getProjectMeta(project);

  return html
    .replace(/<title>[\s\S]*?<\/title>/, '<title>' + escHtml(meta.title) + '</title>')
    .replace(/(<meta name="description" content=")[^"]*(")/, '$1' + escHtml(meta.description) + '$2')
    .replace(/(<link rel="canonical" href=")[^"]*(")/, '$1' + escHtml(meta.url) + '$2')
    .replace(/(<meta property="og:title" content=")[^"]*(")/, '$1' + escHtml(meta.title) + '$2')
    .replace(/(<meta property="og:description" content=")[^"]*(")/, '$1' + escHtml(meta.description) + '$2')
    .replace(/(<meta property="og:image" content=")[^"]*(")/, '$1' + escHtml(meta.image) + '$2')
    .replace(/(<meta property="og:url" content=")[^"]*(")/, '$1' + escHtml(meta.url) + '$2')
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, '$1' + escHtml(meta.title) + '$2')
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, '$1' + escHtml(meta.description) + '$2')
    .replace(/(<meta name="twitter:image" content=")[^"]*(")/, '$1' + escHtml(meta.image) + '$2');
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
    <tr class="hover-trigger" data-image-source="${escHtml(preview)}" data-project="${escHtml(title)}" data-role="${escHtml(role)}" data-year="${escHtml(year)}">
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
  const items = projects
    .filter(p => p && p.id)
    .map(p => {
      const obj = {
        '@type': 'CreativeWork',
        'name': p.title || '',
        'url': BASE_URL + '/' + p.id,
        'dateCreated': String(p.year || ''),
        'creator': { '@type': 'Person', 'name': 'Cheok Hong Lai' }
      };
      if (p.role) obj['description'] = p.role;
      if (p.preview) obj['image'] = toAbsoluteUrl(p.preview);
      if (Array.isArray(p.description) && p.description.length) {
        obj['abstract'] = p.description.map(d => d.label + ': ' + stripHtml(d.text)).join(' ');
      }
      return obj;
    });

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': 'Hong Design Portfolio',
    'url': BASE_URL + '/',
    'numberOfItems': items.length,
    'itemListElement': items.map((item, i) => ({
      '@type': 'ListItem',
      'position': i + 1,
      'item': item
    }))
  };

  return '<script type="application/ld+json">\n' + JSON.stringify(schema, null, 2) + '\n</script>';
}

function writeProjectPages(baseHtml, projects) {
  let count = 0;

  projects.forEach(project => {
    if (!project || !project.id) {
      return;
    }

    const pagePath = path.join(ROOT, project.id + '.html');
    fs.writeFileSync(pagePath, replaceHeadMetadata(baseHtml, project), 'utf8');
    count += 1;
  });

  console.log('Wrote', count, 'project metadata pages');
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

  if (!html.includes('<!-- PRERENDER_PROJECTS -->')) {
    console.warn('Warning: placeholder <!-- PRERENDER_PROJECTS --> not found in index.html');
    console.warn('Skipping project injection.');
  } else {
    html = html.replace('<!-- PRERENDER_PROJECTS -->', projectsHtml + '\n    ');
    console.log('Pre-rendered', projects.length, 'projects into index.html');
  }

  if (!html.includes('<!-- PRERENDER_SCHEMA -->')) {
    console.warn('Warning: placeholder <!-- PRERENDER_SCHEMA --> not found in index.html');
  } else {
    html = html.replace('<!-- PRERENDER_SCHEMA -->', schemaHtml);
    console.log('Injected CreativeWork schema for', projects.length, 'projects');
  }

  fs.writeFileSync(indexPath, html, 'utf8');
  writeProjectPages(html, projects);
}

main().catch(err => { console.error(err); process.exit(1); });
