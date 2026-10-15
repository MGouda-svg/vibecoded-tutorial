# Academic portfolio: Mohamed Al-Begaowe

Static one-page portfolio for GitHub Pages. **The spec is `brief.md`.** Read it before any work.

## Sources of truth (the only allowed facts)
- `sources/cv.pdf`, `sources/linkedin.pdf`
- Publications: https://inspirehep.net/authors/2683744 (INSPIRE-HEP)
- Code: https://github.com/MGouda-svg
- Fallback snapshots: `sources/fallback/`
- Every record in `data/profile.json` carries a `source` field (`cv`, `linkedin`, `inspire`, `github`).

## Rules
1. **Never invent facts.** If something is missing, leave it out or mark it `TODO`. Don't paraphrase it into new claims; keep my own wording.
2. **Conflicts: LinkedIn wins** (it's the newer source). Use the CV only for detail LinkedIn lacks (supervisors, research bullets, skills, teaching courses). Log every conflict in `data/parts/conflicts.md`.
3. **Privacy:** never publish a phone number or home address. Obfuscate the email in the HTML and assemble it in JS. `sources/` is git-ignored and must never be committed (the CV's text layer contains a phone number).
4. **Stack:** plain HTML + CSS + JS. No frameworks, no build step, no npm.
5. **Files:** `index.html`, `styles.css`, `main.js`, `data/profile.json`, `assets/`. Nothing else at the root except `brief.md`, `CLAUDE.md` and `.gitignore`.
6. **Accessibility:** semantic landmarks, keyboard-usable, visible focus, alt text, AA contrast in every section palette. Honour `prefers-reduced-motion` (no colour animation, no bobbing).
7. **Ask before deploying** or doing anything outward-facing (creating repos, pushing).
8. Work phase by phase: rules → skill → data → build → verify → deploy. Wait for my go between phases.

## Content decisions
- Display name: **Mohamed Al-Begaowe**. In author lists, bold any of `Al-Begaowe`, `AlBegaowe`, `Albegaowe` and `Al Begaowe` (INSPIRE's spelling).
- LinkedIn URL is verified: `https://www.linkedin.com/in/mohamed-albegaowe-b6465937a` (the version without the hyphen 404s).
- The WSRI badge is **Research program** (`kind: program`). The project card shows the readable title "The shape of a wrong answer" (user-approved).
- **No "Download CV" button.**
- Projects: only the repo `The-shape-of-a-wrong-answer`.
- Show **Teaching** (TA courses) and **Awards** in About. Don't show languages or GPAs.
- The "Talks" section is titled **Schools & Workshops**: IAIFI 2025 (incl. the MMCRepLearn hackathon) and WSRI 2026, with `kind: school|workshop|program`. No invented talk titles.
- Publications link is INSPIRE-HEP (`links.inspire`), not Google Scholar.
- The Boston College Physics-dept research role (2022–2024) is titled **Graduate Researcher** (user-confirmed).
- WSRI 2026 appears only in Schools & Workshops, not in the experience timeline.
- The project-card description is the README's first sentence with grammar fixes only.
- All decisions and conflicts are logged in `data/parts/conflicts.md`.
- `links.email` in profile.json is stored as `{ "user", "domain" }` and assembled in JS. `data/parts/` is git-ignored (it holds the raw email).
- No invented copy in my voice: UI labels only, every claim must come from the sources.

## Build notes
- Section palettes live in `PALETTES` in `main.js`, keyed by `data-palette`. All are AA-checked, including the blends between neighbours. Re-check if you change any of them.
- Sections render after `fetch`, so `main.js` scrolls to `location.hash` itself once they exist (deep links like `/#publications`).
- When testing in Chrome after edits, Chrome may serve a cached `main.js`/`styles.css`. Force a refetch with `fetch(url, {cache: 'reload'})` before trusting a result. In a hidden or background window, rAF is paused, so scroll-driven effects only update when a screenshot forces a frame.
- Preview locally: `python -m http.server 8765`, then open http://127.0.0.1:8765/ (opening index.html from disk shows a load error, which is expected).

## Deploy
- Repo `MGouda-svg.github.io` (new, public), branch `main`, Pages from root → https://mgouda-svg.github.io/
- Use the `gh` CLI (the GitHub MCP is unavailable).
- Live since 2026-10-15. Pages builds automatically on every push to `main` (`.nojekyll`, no Jekyll).
- Commits use the no-reply email `180580028+MGouda-svg@users.noreply.github.com` (set in this repo's git config). Never commit with the bc.edu address.
- Before every push, check that `git ls-files` contains no `sources/` or `data/parts/` files, and run `git grep --cached` for the email and phone number.
