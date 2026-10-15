# Build your own academic portfolio with Claude Code

This guide walks you through building a one-page academic website like https://mgouda-svg.github.io/ from **your** CV, LinkedIn profile, publication list and GitHub, and putting it online for free. You don't need to write code. You need to describe what you want, answer the agent's questions, and check its work.

**Time:** about an hour the first time. **Cost:** the tools are free except Claude Code, which needs a Claude subscription or API access.

---

## 1. Install the tools (once)

| Tool | What it's for | How to check it works |
|---|---|---|
| [VS Code](https://code.visualstudio.com/) + the **Claude Code** extension (or the `claude` CLI) | the agent you'll talk to | the Claude panel opens and you're logged in |
| **Claude in Chrome** extension | lets the agent read your publications page in a real browser | ask Claude to "open example.com in Chrome" |
| **git** | version history | `git --version` |
| **GitHub CLI** (`gh`): `winget install GitHub.cli` on Windows, `brew install gh` on macOS | creates the repo and publishes the site | `gh auth login`, then `gh auth status` |
| **Python 3** | runs a local preview server | `python --version` |
| Skills: **frontend-design** and **skill-creator** | design and skill-making know-how for the agent | ask Claude "which skills do you have?" |

## 2. Gather your sources

Create an empty folder for the project, e.g. `my-portfolio/`. Keep it **outside** other projects, so their `CLAUDE.md` files don't get mixed in.

```
my-portfolio/
├── brief.md          copy from portfolio-maker/brief.md in this repo
└── sources/
    ├── cv.pdf
    ├── linkedin.pdf  LinkedIn → your profile → Resources (or More) → Save to PDF
    └── fallback/     optional saved copies of your publications page and GitHub profile
```

Also note two URLs:
- **Your publications page**, one that lists all your papers: Google Scholar, arXiv author listing, INSPIRE-HEP or ORCID. Google Scholar often shows a CAPTCHA to automated browsers. Save a copy (Ctrl+S, or export BibTeX) into `sources/fallback/` just in case.
- **Your GitHub profile**, e.g. `https://github.com/yourname`.

### ⚠️ Check your PDFs for hidden text
A black box drawn over your phone number in a PDF **does not delete it**: the text is still there underneath. To check, open the PDF, press Ctrl+A, copy, and paste into a text editor. If you see private details, export a clean version instead. The agent is told never to publish them, but don't rely on that alone. Your PDFs will also be kept out of git (step 4).

### Edit the brief
Open `brief.md` and change **section 1 (Context)** to describe you: your name, your role, and who the site is for. The rest of the brief (layout, constraints, data model) works for anyone as it is.

**Optional shortcut:** copy `portfolio-maker/.claude/skills/academic-portfolio/` from this repo into `my-portfolio/.claude/skills/`. Then you already have the reusable skill and can skip phase 2.

## 3. Start in plan mode

Open `my-portfolio/` in VS Code, start Claude Code, and switch to **plan mode** (Shift+Tab, or the mode selector). In plan mode the agent can read and ask, but not change anything. Paste this, filling in your two URLs:

```
Read @brief.md. It is the complete brief for my academic portfolio website.
My raw material is in sources/ (cv.pdf, linkedin.pdf).
All my publications are listed here: <YOUR PUBLICATIONS URL>
My GitHub profile: <YOUR GITHUB URL>

Do not build anything yet. First ask me any questions you need answered,
then propose a plan organised in these phases:
  1) project rules  2) reusable skill  3) gather data  4) build  5) verify  6) deploy
We will run the plan together one phase at a time. After I approve the plan,
do NOT start; wait for my instruction for each phase.
```

Expect questions like these. There's no wrong answer; they're your decisions:
- **Your CV and LinkedIn disagree** on dates or titles. Which one wins? (Usually the newer one.)
- **How should your name be spelled?** Publication databases often spell it differently, e.g. "Al-Begaowe", "AlBegaowe" or "Al Begaowe". The site will still bold every variant in author lists.
- **Should visitors be able to download your CV?** Say no unless you have a clean PDF.
- **Which GitHub repos should appear?** Which extra sections (teaching, awards)?

Read the plan and change anything you don't like. This is the cheapest moment to change direction. Then approve it.

## 4. Run the phases

Type **`go phase 1`**, check the result, then `go phase 2`, and so on. Here's what each phase does and what to check before moving on:

| Phase | What the agent does | What you check |
|---|---|---|
| **1. Project rules** | Creates `CLAUDE.md` with the rules for this project (facts only from sources, privacy, stack, accessibility). It's loaded into every future session in this folder. | Read it. Add any rule you care about. Make sure `.gitignore` lists `sources/`. |
| **2. Reusable skill** | Uses skill-creator to write `.claude/skills/academic-portfolio/SKILL.md`, a procedure you can reuse in other projects. | It's short and contains nothing specific to you. |
| **3. Gather data** | Three subagents read your PDFs, your publications page and your GitHub in parallel, then merge everything into `data/profile.json` and list the conflicts. | Answer each conflict. Skim the summary: right papers, right dates? |
| **4. Build** | Designs and writes `index.html`, `styles.css` and `main.js`, and starts a local preview server. | Open the preview URL and scroll through it. Say what you'd like changed, in plain words. |
| **5. Verify** | Tests the page in Chrome (console errors, phone width, search and sort, keyboard) and runs an **independent fact-check subagent** that traces every fact back to a source. | Decide on each item it flags. **Read the whole page yourself too.** It's your name on it. |
| **6. Deploy** | Creates a public repo named `<yourname>.github.io` and pushes. GitHub Pages then serves it at `https://<yourname>.github.io/`. | Before you say yes, see the checklist below. |

### Before you deploy (important)
- **Commit email:** on a public repo, git history shows the email in your git config. To keep your real address private, ask:
  `Use my GitHub no-reply email for commits in this repo only.`
  (It looks like `12345+yourname@users.noreply.github.com`; `gh api user` shows the number.)
- **What gets uploaded:** ask `Show me git ls-files before pushing.` There should be no `sources/` and nothing with your phone number.
- The agent asks before creating the repo and pushing, because it's reaching outside your machine.

## 5. Updating the site later

All content lives in `data/profile.json`. To update, either edit that file or ask Claude, e.g. "add my new paper from INSPIRE" or "refresh the citation counts". Then:

```
git add -A && git commit -m "Update publications" && git push
```

The live site updates about a minute after each push.

## Troubleshooting

| Problem | Fix |
|---|---|
| The page is blank or says it couldn't load `profile.json` | You opened `index.html` straight from disk. Run `python -m http.server 8000` in the folder and open http://localhost:8000. |
| A change doesn't show up | The browser is serving an old cached copy. Hard-refresh with Ctrl+Shift+R (Cmd+Shift+R on a Mac). |
| Google Scholar shows a CAPTCHA to the agent | Tell it to use the saved copy in `sources/fallback/`. |
| The live URL shows a 404 | Wait 1–2 minutes after the first push. Check repo Settings → Pages → source is `main` / root. |
| GitHub tools in Claude fail | Use the `gh` CLI (`gh auth status`). It doesn't depend on the GitHub connector. |
| The agent starts building in phase 0 | You weren't in plan mode. Press Esc, then `/clear`, switch mode and paste the prompt again. |

## What we learned in our run

These all happened while building the reference site. The verification steps caught each one:
- **The CV's phone number was still in the PDF text** under a black box. It was caught before planning, so the CV download button was dropped and `sources/` was git-ignored.
- **INSPIRE spelled the name "Al Begaowe"**, a variant nobody expected. It was added to the name list so the author list still bolds it.
- **The fact-checker found two dates shortened** (one month instead of a range). They were fixed to match the sources.
- **The git commit email would have exposed the private address** on GitHub. It was switched to the no-reply email before the first push.
- **A link to a section like `/#publications` landed at the top**, because the content loads after the page. It was fixed and re-tested.
