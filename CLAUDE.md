# project context
you are an expert in vibe coding givina an introductry tutorial for reasercher along with a live vibecoding demo

# instuctions
1. keep CLAUDE.md updated
2. don't make assumption, ask questions.
3. use available skills and tools

# decisions (keep updated)
- Presenter: Mohamed Al-Begaowe, Physics PhD student / HPC Graduate Assistant
- Audience: mixed researchers (coders + non-coders); session ~90 min (~30 min slides, ~60 min demo + Q&A)
- Tutorial structure: §1 what is vibe coding · §2 why researchers should care · §3 vocabulary (LLM/context, prompt eng, agent, plan mode, CLAUDE.md/AGENTS.md, skills, MCP, subagents) · live demo
- Phase 1 (done): slides → `slides/index.html` (single-file HTML, 25 slides, "Lab Notebook" style: beige graph paper, burgundy accents, Fraunces / Newsreader / JetBrains Mono, high density, smooth fades). Built with the frontend-slides skill.
  - Keys: arrows/space navigate · N speaker notes · E inline edit (autosaves to localStorage; Ctrl+S downloads HTML). Bump `DECK_KEY` in the script when regenerating so stale local edits don't override new content.
  - Slide 11's SLURM script contains a deliberate bug (mkdir logs/ inside the job) used as a "verify" teaching moment.
- Phase 2 (kit done, demo itself built LIVE on stage): `demo/RUNBOOK.md` (40-min, 6-step stage script with copy-paste prompts, mirrors slide 24), `demo/brief.md` (the strong-prompt site spec + profile.json schema), `demo/PREFLIGHT.md` (setup checklist).
  - Sources: CV PDF, LinkedIn PDF export (no scraping), GitHub, and any page listing all publications (Google Scholar, arXiv, INSPIRE-HEP… → `<PUBS_URL>` placeholder). Publications + GitHub are read live via Chrome MCP, with saved fallbacks in `sources/fallback/`.
  - Everything is created live: the demo's CLAUDE.md with project rules (no AGENTS.md in the demo; the slides still explain AGENTS.md as the cross-tool name, so leave them as they are), the `academic-portfolio` skill (via skill-creator, minimal), data via 3 parallel subagents, site via frontend-design skill, fact-check subagent, deploy to `<user>.github.io`.
  - Demo runs in `D:\HPC\portfolio-demo\` (outside this folder, so this CLAUDE.md doesn't leak into it).
  - `gh` CLI installed and logged in as MGouda-svg (resolved). The GitHub MCP still fails, so the demo uses `gh`.
  - Demo run (2026-10-15), plan approved:
    - publications = INSPIRE-HEP (inspirehep.net/authors/2683744); GitHub = MGouda-svg
    - deploy to a new repo `MGouda-svg.github.io`
    - LinkedIn wins conflicts with the CV; display name "Mohamed Al-Begaowe"
    - no Download-CV button (cv.pdf's text layer still contains the phone number), and `sources/` is git-ignored
    - projects = only The-shape-of-a-wrong-answer
    - show Teaching + Awards, not languages or GPAs
    - Talks becomes "Schools & Workshops" (IAIFI 2025, WSRI 2026)
  - Demo phase 1 done: `D:\HPC\portfolio-demo\` contains sources/ (+ fallback/), brief.md, CLAUDE.md and .gitignore; `git init` on main.
  - Demo phase 2 done: `.claude/skills/academic-portfolio/SKILL.md`, a single minimal file with no evals. It holds the workflow, source rules, the extended profile.json schema (nameVariants, links.inspire, teaching, awards, talk kinds school/workshop), the site rules and the fact-check checklist. Person-specific decisions stay in the demo's CLAUDE.md.
  - Demo phase 3 done. `data/profile.json` was merged from `data/parts/` (3 agents; snapshots are in `sources/fallback/{inspire,github}`). INSPIRE has 1 paper (PRB 112, 134416; arXiv 2307.15792; 10 citations) and spells the name "Al Begaowe", which is now a name variant.
    - User decisions:
      - Physics-dept role title = "Graduate Researcher"
      - WSRI appears only in Schools & Workshops
      - README grammar fixed on the project card
      - the 6 interest tags stay
    - Still to check in phase 5: the LinkedIn URL hyphen (`mohamed-albegaowe-b6465937a`).
  - Demo phase 4 done (frontend-design skill).
    - Files: index.html, styles.css, main.js, assets/favicon.svg.
    - The design is the "warped grid" hero (a canvas coordinate grid deformed by a lens bulge, a nod to manifold geometry). Fonts are Young Serif and Hanken Grotesk, left-aligned and editorial.
    - Six section palettes blend with scroll; all text pairs are ≥5.07:1, including mid-blend.
    - The email is stored as {user, domain} in profile.json, and `data/parts/` is git-ignored too because it holds the whole address.
    - Local preview: `python -m http.server 8765` in the demo folder.
    - The Chrome window wouldn't resize below 1280×575, so the phone check in phase 5 uses a 390 px iframe.
  - Demo phase 5 done.
    - Fact-check subagent: no invented facts; privacy checks pass.
    - Fixed:
      - talk date ranges (Jul–Aug 2025, Jun–Jul 2026)
      - deep-link (#hash) scrolling after the async render
      - fainter hero grid on phones
    - Verified:
      - console clean
      - palette blend and header highlight
      - smooth header links
      - search/sort/filter (tested with injected dummy papers)
      - 390 px layout and menu
      - keyboard focus and skip link
      - LinkedIn URL with the hyphen
    - User decisions: WSRI badge "Research program"; readable project title.
    - Gotchas for the stage: Chrome cached main.js (use a `cache: 'reload'` fetch), and rAF pauses when the Chrome window is hidden.
    - Reduced motion was only checked in code (CSS + JS guards), not emulated.
  - Demo phase 6 done (2026-10-15). Live at https://mgouda-svg.github.io/ (repo MGouda-svg/MGouda-svg.github.io, public, main, Pages from root, `.nojekyll`).
    - Commits use the GitHub no-reply email (repo-local git config), because the global git email is the bc.edu address.
    - Pushed: the site files plus brief.md, CLAUDE.md and the skill (user approved).
    - Verified live: sources/ and data/parts/ return 404; no console errors.
- Phase 3 (done 2026-10-15): this folder is now the public repo **MGouda-svg/vibecoded-tutorial**. Pages serves it at https://mgouda-svg.github.io/vibecoded-tutorial/ (root `index.html` landing page, `.nojekyll`, slides at `/slides/`).
  - `portfolio-maker/` is a **snapshot copy** of D:\HPC\portfolio-demo, without sources/, data/parts/ or .git. It's also served at `/portfolio-maker/`. The live site keeps deploying from MGouda-svg.github.io; re-copy the snapshot only if asked.
  - Docs: `README.md` (overview, folder map, how the demo ran), `docs/REPRODUCE.md` (guide for other researchers), `portfolio-maker/README.md`. No build log (the user didn't want one).
  - **PREFLIGHT.md must NOT be in the repo** (user's decision). It's git-ignored, and the first commit was amended and force-pushed to erase it from history. Keep it local only, and don't link to it from public docs.
  - Git ignores `**/sources/`, `**/data/parts/` and `PREFLIGHT.md`. Commits use the no-reply email (repo-local config).
  - License (user: "it can be used by users"): MIT for code and the skill (`LICENSE`), CC BY 4.0 for content (`LICENSE-CONTENT.md`). The personal data in profile.json is excluded.
- Rule: do NOT motivate running AI agents on the HPC cluster (no SSH / login-node / "run on HPC" agent use) anywhere in the slides or demo. SLURM content is allowed only as "AI drafts a job script locally, a human reviews it before submitting" (slides 10–11).
- Slides name Google Scholar as the example publications source (slides 17, 21–24); keep them that way.
