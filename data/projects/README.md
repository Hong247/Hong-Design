# Project content separation

This folder is for the new one-project-per-file structure.

Rules:

1. Do not edit `main` directly for large project migrations.
2. Do not rewrite `data/projects.js` from truncated tool output.
3. Keep `data/projects.js` as the original backup/source until every project has been safely migrated and verified.
4. Add one project file at a time.
5. Verify project count and preview before merging.

Planned structure:

- `index.js` — project order / registry only
- `cmarket-tote-bag.js` — C Market Coffee Tote Bag only
- `cmarket-website.js` — C Market Coffee Official Site only
- one file per remaining project
