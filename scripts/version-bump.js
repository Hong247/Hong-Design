/**
 * version-bump.js
 * Replaces all ?v=XXXXXXXX query strings in index.html with a fresh
 * timestamp stamp so browsers bust their caches on every deploy.
 * Run as part of the build before prerender.js.
 */

const fs   = require('fs');
const path = require('path');

const stamp     = new Date().toISOString().replace(/\D/g, '').slice(0, 12); // YYYYMMDDHHmm
const indexPath = path.join(__dirname, '..', 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

// Replace every ?v=<alphanum> occurrence with the new stamp
const updated = html.replace(/\?v=[a-z0-9]+/gi, '?v=' + stamp);

if (updated === html) {
  console.log('version-bump: no version strings found — nothing changed');
} else {
  const count = (html.match(/\?v=[a-z0-9]+/gi) || []).length;
  fs.writeFileSync(indexPath, updated, 'utf8');
  console.log('version-bump: updated ' + count + ' version strings to ?v=' + stamp);
}
