Personal website for Vedant K. Naik built with the `al-folio` Jekyll theme.

This repository contains the source for the site hosted at `https://roboticvedant.github.io`.

**Quick start (local development)**

- Prerequisites: Ruby (with Bundler), Node/npm (for tooling), and Git.
- Install Ruby gems:

```powershell
bundle install
```

- Serve the site locally with Jekyll:

```powershell
bundle exec jekyll serve --livereload
```

The site will be available at `http://127.0.0.1:4000` by default.

**Formatting & checks**

- This repo uses Prettier for code formatting. To check and fix formatting locally:

```powershell
npx prettier . --check
npx prettier . --write
```

**Build & deploy**

- Build the static site:

```powershell
bundle exec jekyll build
```

- Deployment can be done via GitHub Pages or the provided deploy scripts in `bin/`.

**Editing site content**

- Main configuration: `_config.yml`
- CV data: `_data/cv.yml` (fallback) or `assets/json/resume.json` (JSON resume)
- Pages and content live in `_pages/`, `_projects/`, `_includes/`, and `_layouts/`.

**Contributing & maintenance**

- Small edits (typos, formatting): open a PR to `main`.
- For larger changes, please open an issue first describing the change.
