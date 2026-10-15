---
name: academic-portfolio
description: Build or update a researcher's static academic portfolio website (GitHub Pages) from their CV, LinkedIn export, publication list (Google Scholar, arXiv, INSPIRE-HEP, ORCID…) and GitHub. Use this whenever the task involves gathering a researcher's profile data into profile.json, rendering a personal/academic homepage, adding publications/talks/projects to it, or fact-checking such a site, even if the user just says "my website", "portfolio" or "homepage".
---

# Academic portfolio

A portfolio is read by hiring committees and collaborators. One wrong fact (a paper that isn't yours, an inflated title) costs more trust than a missing section. Everything below follows from that: **traceable facts first, design second**.

## Workflow
1. **Rules.** Read the project's `CLAUDE.md` and brief. Project decisions there override this skill.
2. **Gather** each source into its own part file under `data/parts/` so the sources can be gathered in parallel and checked separately:
   - documents (CV, LinkedIn PDF) → `profile-core.json` + `conflicts.md`
   - publications page → `publications.json` (+ a snapshot in `sources/fallback/`)
   - GitHub → `projects.json` (+ a snapshot in `sources/fallback/`)
3. **Merge** into `data/profile.json` (schema below). Show the user a short summary and the conflicts before building.
4. **Build** a data-driven static site: plain HTML/CSS/JS reading `profile.json`, with no framework and no build step.
5. **Verify** in a real browser (console, desktop + phone widths, interactions), then run an independent fact-check pass (checklist below).
6. **Deploy** only after the user explicitly says so.

## Source rules
- **Only facts from the given sources.** If something is missing, omit it or write `"TODO"`. Don't fill gaps from general knowledge, even when it seems obvious.
- **Keep the person's own wording** for descriptions. Trim it if needed, but don't embellish ("led", "pioneered", "world-class").
- **Conflicts:** follow the precedence in CLAUDE.md. If none is given, ask. Record every conflict in `conflicts.md` as `field | source A says | source B says | used`.
- **Tag provenance:** every record gets a `source` (`cv`, `linkedin`, `scholar`, `arxiv`, `inspire`, `orcid`, `github`).
- **Privacy:** never output phone numbers or home addresses. Obfuscate the email (assemble it in JS). Never commit raw sources: PDFs can carry hidden text layers under visual redactions.
- **Publications:** include only papers where the person is an author; check name variants (hyphens, missing spaces, initials). Prefer the source's own BibTeX over generated BibTeX.
- **GitHub:** show public repos only, never private ones, and respect any repo selection in CLAUDE.md.

## Data model: `data/profile.json`
```json
{
  "name": "", "nameVariants": [""], "affiliation": "", "headline": "", "summary": "",
  "interests": [""],
  "links": { "linkedin": "", "scholar": "", "inspire": "", "arxiv": "", "orcid": "", "github": "", "email": "" },
  "experience": [{ "role": "", "org": "", "start": "YYYY-MM", "end": "YYYY-MM | present", "description": "", "source": "" }],
  "education":  [{ "degree": "", "institution": "", "start": "", "end": "", "details": "", "source": "" }],
  "skills": [""],
  "teaching": [{ "role": "", "org": "", "courses": [{ "code": "", "title": "", "terms": "" }], "start": "", "end": "", "source": "" }],
  "awards":   [{ "title": "", "date": "YYYY-MM", "description": "", "source": "" }],
  "publications": [{ "title": "", "authors": [""], "year": 0, "venue": "", "type": "article|conference|preprint|thesis",
                     "citations": 0, "arxiv": "", "doi": "", "url": "", "bibtex": "", "source": "" }],
  "talks": [{ "title": "", "event": "", "location": "", "date": "YYYY-MM", "kind": "talk|poster|invited|school|workshop", "description": "", "source": "" }],
  "projects": [{ "name": "", "description": "", "url": "", "language": "", "stars": 0, "updated": "YYYY-MM-DD", "topics": [""], "source": "github" }],
  "updated": "YYYY-MM-DD"
}
```
- Leave empty arrays or strings empty; don't delete keys. The site decides visibility from emptiness.
- `nameVariants` drives the bolding of the person's name in author lists.

## Site rules
- **Home and About always render. Every other section renders only if its array is non-empty,** and the nav is built from the sections that rendered.
- Links open in a new tab with `rel="noopener"`.
- Accessibility: landmarks, keyboard nav, visible focus, alt text, AA contrast in *every* palette, and `prefers-reduced-motion` disables colour animation, bobbing and reveals.
- No console errors. The page must still show something useful if `profile.json` fails to load (an error message, not a blank page).

## Fact-check checklist (run as an independent subagent)
Hand the checker the rendered page text plus the sources, and **not** the build conversation, so it can't simply trust what was intended. It reports in a table: `fact | where on page | traced to (file/URL + quote) | status: ok / mismatch / untraceable`.
- [ ] Name, affiliation, headline and summary match a source.
- [ ] Every role, organisation and date range matches (after applying conflict precedence).
- [ ] Every degree and institution matches; nothing extra (GPAs, languages) appears unless the project allows it.
- [ ] Every publication exists at the publications source with the same title, year and venue; citation counts are no newer than the snapshot.
- [ ] Every project is a public repo with matching language, stars and updated date.
- [ ] No phone number, no address, and no plain-text email in the HTML source.
- [ ] Nothing on the page is untraceable.
