# portfolio-maker

A **snapshot** of the project Claude Code built live in the tutorial demo (15 October 2026): a one-page academic portfolio generated from a CV, a LinkedIn export, INSPIRE-HEP and GitHub.

- **Live site:** https://mgouda-svg.github.io/
- **Live source** (the copy that keeps getting updated): https://github.com/MGouda-svg/MGouda-svg.github.io
- **This snapshot, served from this repo:** https://mgouda-svg.github.io/vibecoded-tutorial/portfolio-maker/

To build your own, follow [../docs/REPRODUCE.md](../docs/REPRODUCE.md).

## Files

| File | Role | Made in phase |
|---|---|---|
| `brief.md` | the spec: context, inputs, goal, constraints, done-when, data model | given (written before the demo) |
| `CLAUDE.md` | project rules plus every decision made during the run | 1, updated in every phase |
| `.claude/skills/academic-portfolio/SKILL.md` | reusable procedure: gather → merge → build → verify → deploy, with a fact-check checklist | 2 |
| `data/profile.json` | **all content**; every record has a `source` field | 3 |
| `index.html` | page shell: header, meta tags, Open Graph, JSON-LD `Person` | 4 |
| `styles.css` | layout, type (Young Serif + Hanken Grotesk), responsive rules, reduced-motion rules | 4 |
| `main.js` | renders every section from `profile.json`, plus palette blending, nav, publications search/sort/filter and the hero grid | 4–5 |
| `assets/favicon.svg` | monogram icon | 4 |

**Not included**, on purpose: `sources/` (the CV and LinkedIn PDFs, plus snapshots of INSPIRE and GitHub) and `data/parts/` (the raw per-source extracts and the conflict log). They contain private details, so you can't re-run phase 3 from this snapshot. You can run everything else.

## Run it locally

```
cd portfolio-maker
python -m http.server 8000
```

Then open http://localhost:8000. Opening `index.html` directly from disk shows an error message instead, because browsers block loading the data file from disk.

## How it works

- **Data-driven.** `main.js` fetches `data/profile.json` and builds every section from it. Home and About always appear; Publications, Schools & workshops and Projects appear only when their list has entries.
- **Section colours.** Each section has a soft palette (`PALETTES` in `main.js`). On scroll, the script blends the current and next palettes and sets them as CSS variables. Every text/background pair was checked for WCAG AA contrast, including the in-between blends.
- **Hero art.** A coordinate grid drawn on a `<canvas>` and warped by a slowly moving bulge, a nod to the manifold geometry in the owner's research. It's static when the visitor prefers reduced motion.
- **Privacy.** The email is stored as `{ "user", "domain" }` and only assembled in the browser. No phone number or address appears anywhere.
- **Publications.** Search (title, author, venue), sorting (year, citations, title) and type filters work on the data in the browser. "Copy citation" copies the BibTeX taken unchanged from INSPIRE.
