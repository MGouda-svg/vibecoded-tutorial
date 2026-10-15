# Vibe coding for researchers

A 90-minute introductory tutorial on **vibe coding**: building software by describing what you want to an AI agent and steering it, rather than writing every line yourself. It is aimed at researchers, coders and non-coders alike.

It has two parts:
1. **Slides (~30 min):** what vibe coding is, why researchers should care, and the vocabulary: LLMs and context, prompt engineering, agents, plan mode, `CLAUDE.md`/`AGENTS.md`, skills, MCP and subagents.
2. **Live demo (~60 min with Q&A):** Claude Code builds and deploys a real academic portfolio website from a CV, a LinkedIn export, a publications page and a GitHub profile. Every fact is checked against the sources.

| | Link |
|---|---|
| Slides (online) | https://mgouda-svg.github.io/vibecoded-tutorial/slides/ |
| The portfolio built in the demo (live) | https://mgouda-svg.github.io/ |
| Build your own portfolio | [docs/REPRODUCE.md](docs/REPRODUCE.md) |

Created by **Mohamed Al-Begaowe** (Physics PhD student and HPC Graduate Assistant, Boston College), with [Claude Code](https://claude.com/claude-code).

---

## What's in this repo

```
vibecoded-tutorial/
├── slides/index.html      the slide deck: one self-contained HTML file, 25 slides
├── demo/
│   ├── RUNBOOK.md         the 40-minute stage script, step by step, with copy-paste prompts
│   └── brief.md           the "strong prompt": the full spec of the portfolio site
├── portfolio-maker/       snapshot of the project the demo produced (see its README)
├── docs/REPRODUCE.md      guide: build your own portfolio the same way
├── CLAUDE.md              the rules and decisions Claude Code used while preparing this tutorial
└── index.html             landing page for GitHub Pages
```

`CLAUDE.md` is published deliberately. It shows what a project-memory file looks like after a real project: the rules at the top, and the decisions added as the work went on.

## Viewing the slides

Open `slides/index.html` in any modern browser, or use the online link above.

| Key | Action |
|---|---|
| ← → / Space | Previous / next slide |
| N | Show or hide speaker notes |
| E | Edit text in place (saved in your browser; Ctrl+S downloads the edited HTML) |

## Running the demo yourself

1. Set up the tools and your sources as described in sections 1–2 of [docs/REPRODUCE.md](docs/REPRODUCE.md).
2. Follow [demo/RUNBOOK.md](demo/RUNBOOK.md) step by step. Each step has its prompt, what to say, and a fallback if something goes wrong.
3. If you're doing it for yourself rather than on stage, [docs/REPRODUCE.md](docs/REPRODUCE.md) on its own is the simpler guide.

## How the demo was run

The portfolio was built in six phases. Claude Code proposed the plan in plan mode, and each phase only started when the presenter said "go phase N":

| Phase | What happened | Concepts shown |
|---|---|---|
| 1. Project rules | `CLAUDE.md` with the rules (facts only from sources, privacy, stack, accessibility) | project memory |
| 2. Reusable skill | `academic-portfolio` skill made with the skill-creator skill | skills |
| 3. Gather data | Three subagents in parallel: PDFs, INSPIRE-HEP (via Chrome) and GitHub (via `gh`), merged into `data/profile.json` with a conflict log | subagents, MCP |
| 4. Build | The site, made with the frontend-design skill and reviewed with screenshots | skills, agent loop |
| 5. Verify | Browser checks plus an independent fact-check subagent, then fixes | verification |
| 6. Deploy | Privacy audit of the files to commit, then a new public repo and GitHub Pages | tools that reach outside your machine |

Each step's prompt is in [demo/RUNBOOK.md](demo/RUNBOOK.md). What the run produced is in [portfolio-maker/](portfolio-maker/).

## Privacy

The raw sources (CV and LinkedIn PDFs) and the intermediate data files are **not** in this repo. They are excluded by `.gitignore`. The rules followed throughout:
- Only facts from the sources appear on the site, and every record notes where it came from.
- No phone number or home address appears anywhere. The email address is assembled in the browser, so it never appears whole in the files.
- Commits use a GitHub no-reply email address.

## License and reuse

You're free to use, adapt and share this material, including for your own tutorials and your own portfolio.
- **Code** (the site, the slides' HTML/JS, the skill): [MIT](LICENSE)
- **Content** (slide text, docs, runbook, brief): [CC BY 4.0](LICENSE-CONTENT.md). Just credit the original.
- **Not licensed:** the personal data in `portfolio-maker/data/profile.json`. Replace it with your own.

The details are in [LICENSE-CONTENT.md](LICENSE-CONTENT.md).
