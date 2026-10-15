# Brief: my academic portfolio website

> This file is the "strong prompt" for the live demo. It is organised into the
> five ingredients from the slides: **context · inputs · goal · constraints · done-when**.

---

## 1. Context
- I'm **Mohamed Al-Begaowe**, a Physics PhD student and HPC Graduate Assistant.
- I want a personal academic website that hiring committees, collaborators and
  conference contacts can skim in under a minute.
- It will be hosted for free on **GitHub Pages**, so it must be a static site.

## 2. Inputs (the only allowed sources of facts)
| Source | Where | What to take from it |
|---|---|---|
| CV | `sources/cv.pdf` | affiliation, headline, summary, experience, education, skills, talks |
| LinkedIn | `sources/linkedin.pdf` (profile "Save to PDF") | experience wording, skills, links |
| Publications | the page listing all my publications, e.g. **Google Scholar**, **arXiv**, INSPIRE-HEP (URL given in the prompt) | papers, year, venue, citations, type, arXiv/DOI links, BibTeX |
| Code | my **GitHub** profile (URL given in the prompt) | top / pinned repositories |
| Fallbacks | `sources/fallback/` | saved copies of the publications page and GitHub if the web is unavailable |

## 3. Goal: what the site looks like

### Overall
- **One long page** that scrolls through sections. **Home** and **About** always
  exist; the other sections appear **only if the sources contain data for them**.
- A **fixed header**: a small **monogram** (initials, as SVG) on the left, and
  links to the sections that exist on the right. On phones, the links collapse
  into a compact menu.
- As the visitor scrolls, it should **feel like moving from one page to the next**:
  - the header **highlights the section in view**;
  - the **page colours change gradually** (each section has its own soft palette,
    blended continuously with scroll position, not switched abruptly);
  - a thin **scroll-progress line** runs under the header.
- Clicking a header link **scrolls smoothly** to that section.

### Home
Fills the screen, content **centred vertically**:
1. small UPPERCASE line with the affiliation
2. the name, **very large**
3. the headline underneath
4. a short summary
5. a row of **rounded tags** for research interests
6. links (LinkedIn, Google Scholar / arXiv, GitHub, ORCID if present) that **open in a new tab**
7. at the bottom, a small **down arrow that bobs gently** and takes you to the next section

### About
Two columns (one column on phones):
- **Left:** work experience as a **vertical timeline**, current roles first. Each entry
  has role title, organisation, dates, and a short description **in my own wording**
  from the sources.
- **Right:** **education timeline**, then **skills as rounded tags**.

### Optional sections (only if there is data)
- **Publications**
  - search box (title, authors, venue)
  - sort by year, citations or title
  - filter chips by type (article / conference paper / preprint / thesis)
  - "showing n of m" counter
  - my name **bold** in each author list
  - a **"copy citation"** button (use the source's BibTeX when available)
  - links to the paper's page / arXiv / DOI
- **Talks & Conferences**: grouped by year, with a small badge (talk / poster / invited).
- **Projects**: cards from GitHub with language, stars, last updated and topics.
- **Contact** (footer): email (obfuscated against spam bots), the same links as Home,
  a **Download CV** button *only if I approve it*, and a "last updated" date.

### Look & feel
- **Minimal.** Generous white space, one or two typefaces, no clutter.
- **Colours that change with each section**: soft, low-saturation palettes. Text
  must keep AA contrast in every palette.
- **Smooth scrolling and gentle motion**: subtle fade/slide reveals, nothing flashy.
- **Works on phones and desktops.**

## 4. Constraints
- Plain **HTML + CSS + JavaScript**. No frameworks, no build step.
- Files: `index.html`, `styles.css`, `main.js`, `data/profile.json`, `assets/` (favicon etc.).
- **Never invent facts.** If something is missing, leave it out or mark it `TODO`.
- Privacy: no phone number, no home address, email obfuscated.
- Accessible: semantic landmarks, keyboard-usable, visible focus, alt text,
  and honour `prefers-reduced-motion` (no colour animation or bobbing when it's set).
- Nice to have: page title + meta description, Open Graph tags, JSON-LD `Person` data.

## 5. Done when
- [ ] The site runs locally with **no console errors**.
- [ ] Scrolling through every section: the **header highlight follows**, the
      **colours blend smoothly**, and the header links **glide** to their sections.
- [ ] Checked at **desktop** (~1440 px) and **phone** (~390 px) widths.
- [ ] Publications **search and sort** work.
- [ ] **Every fact on the page** traces back to a file in `sources/` or the publications / GitHub pages.
- [ ] Deployed to GitHub Pages and the live URL loads.

---

## Appendix: data model (`data/profile.json`)
```json
{
  "name": "", "affiliation": "", "headline": "", "summary": "",
  "interests": [""],
  "links": { "linkedin": "", "scholar": "", "github": "", "orcid": "", "arxiv": "", "email": "" },
  "experience": [{ "role": "", "org": "", "start": "YYYY-MM", "end": "YYYY-MM | present", "description": "", "source": "cv|linkedin" }],
  "education":  [{ "degree": "", "institution": "", "start": "", "end": "", "details": "", "source": "" }],
  "skills": [""],
  "publications": [{ "title": "", "authors": [""], "year": 0, "venue": "", "type": "article|conference|preprint|thesis",
                     "citations": 0, "arxiv": "", "doi": "", "url": "", "bibtex": "" }],
  "talks": [{ "title": "", "event": "", "location": "", "date": "YYYY-MM", "kind": "talk|poster|invited", "source": "" }],
  "projects": [{ "name": "", "description": "", "url": "", "language": "", "stars": 0, "updated": "YYYY-MM-DD", "topics": [""] }],
  "updated": "YYYY-MM-DD"
}
```
