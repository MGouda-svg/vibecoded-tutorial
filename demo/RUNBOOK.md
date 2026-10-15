# Live Demo Runbook: "Build your academic portfolio"

**Total: 40 min** · Claude Code in VS Code · workspace `D:\HPC\portfolio-demo\`
Follow slide 24's order. Each step lists **⏱ time · 🏷 terms · 📋 prompt · 🗣 say · 👀 look here · ✅ move on when · 🛟 fallback.**

Replace the placeholders before going on stage (search for `<`):
`<PUBS_URL>` = the page that lists all your publications (Google Scholar, arXiv, INSPIRE-HEP, ORCID…) · `<GH_USER>` = your GitHub username

| # | Step | ⏱ | 🏷 Terms | Clock |
|---|---|---|---|---|
| 0 | Warm-up | 1 | LLM, context window | 0:00 |
| 1 | Write the brief | 5 | prompt engineering | 0:01 |
| 2 | Plan first | 6 | plan mode, agent | 0:06 |
| 3 | Set the rules + make a skill | 7 | CLAUDE.md, skills | 0:12 |
| 4 | Gather the data | 7 | subagents, MCP, context | 0:19 |
| 5 | Design & build | 8 | skills, agent loop | 0:26 |
| 6 | Verify & ship | 6 | MCP, subagents, agent loop | 0:34 → 0:40 |

---

## 0 · Warm-up (1 min)
**🏷** LLM · context window

**Do:** Show the VS Code explorer: only `brief.md` and `sources/`. In Claude Code, type:
```
/context
```
**🗣** "This is the agent's working memory. Almost empty: just its system instructions. Watch it fill up over the next 40 minutes."

---

## 1 · Write the brief (5 min)
**🏷** Prompt engineering

**Do:** Switch to **plan mode** (Shift+Tab in the CLI, or the mode selector in the VS Code panel) so nothing gets built yet.

**📋 Weak prompt:**
```
make me a website
```
**🗣** While it answers: "Notice what it *can't* know: who I am, what the site is for, which data to use, what 'done' means. It will guess, ask generic questions, or both."
Then press **Esc** to stop it, and type `/clear` to start fresh.

**Do:** Open `brief.md` in the editor and scroll through it (≈1 min). Point at the five headings: **context · inputs · goal · constraints · done-when**, and the data model at the bottom.

**📋 Strong prompt** (still in plan mode):
```
Read @brief.md. It is the complete brief for my academic portfolio website.
My raw material is in sources/ (cv.pdf, linkedin.pdf).
All my publications are listed here: <PUBS_URL>
My GitHub profile: https://github.com/<GH_USER>

Do not build anything yet. First ask me any questions you need answered,
then propose a plan organised in these phases:
  1) project rules  2) reusable skill  3) gather data  4) build  5) verify  6) deploy
We will run the plan together one phase at a time. After I approve the plan,
do NOT start; wait for my instruction for each phase.
```
**👀** It reads the brief and the PDFs before answering (tool calls appear in the panel).
**✅** It starts asking questions → go to step 2.
**🛟** If it starts writing files, you're not in plan mode: Esc, `/clear`, switch mode, re-paste.

---

## 2 · Plan first (6 min)
**🏷** Plan mode · agent

**Do:** Answer its questions out loud, briefly. Typical ones and your answers:
- *Publish the CV PDF?* → "No Download CV button for now."
- *Which repos?* → "Pinned repos, or the 4 most recently updated if none are pinned."
- *Colours / fonts?* → "Your call, within the brief: minimal and soft."

**Do:** Read the plan aloud at a skim. Then **push back once** (planned, to show plans are editable):

**📋**
```
Good plan. One change: before deploying, add a fact-check by a separate subagent
that compares every fact on the page against sources/ and lists any mismatch.
Nothing goes live until that list is empty or I've accepted each item.
```
**🗣** "This is the cheap moment to change direction. Two lines now saves twenty minutes later."

**Do:** Approve the plan and pick **auto-accept edits** (saves clicks on stage).
**👀** It does *not* start building, because the prompt told it to wait.
**✅** Approved plan visible on screen.
**🛟** If it starts phase 1 anyway, let it. Step 3's prompt then just refines what it wrote.

---

## 3 · Set the rules + make a skill (7 min)
**🏷** CLAUDE.md · skills

### 3a · Project rules (≈3 min)
**📋**
```
Phase 1. Create CLAUDE.md with these project rules, written concisely:
- Facts come ONLY from sources/, my publications page and my GitHub profile. Never invent; mark unknowns TODO.
- Descriptions use my own wording from the sources; tighten, don't embellish.
- Privacy: no phone number, no home address, obfuscate the email.
- Stack: plain HTML/CSS/JS, no frameworks, no build step.
  Files: index.html, styles.css, main.js, data/profile.json (schema in brief.md), assets/.
- All content lives in data/profile.json; the page renders from it.
- Accessible (landmarks, keyboard, focus, AA contrast) and honours prefers-reduced-motion.
- Show a section only when it has data.
```
**🗣** "CLAUDE.md is the project's memory: every future session in this folder starts with these rules loaded. Other tools read the same kind of file under the name AGENTS.md; same idea, different name."
**👀** Open CLAUDE.md in the editor: short and specific.

### 3b · Reusable skill (≈4 min)
**📋**
```
Phase 2. Use the skill-creator skill to create a project skill at
.claude/skills/academic-portfolio/SKILL.md. Keep it minimal: a single SKILL.md,
no evals, no benchmarks, no extra scripts.
Its description should make it trigger when someone asks for an academic,
research or personal portfolio website.
Its steps: 1) extract facts from each source into data/<source>.json,
2) merge into data/profile.json (schema in brief.md) and report conflicts,
3) render the one-page site described in brief.md,
4) verify in a browser at desktop and phone width, then fact-check against sources.
Nothing in it should be specific to me, so anyone in this room could reuse it.
```
**🗣** "CLAUDE.md is *this project's* rules. A skill is a *reusable procedure*. Copy this folder into any project and it works for your colleague too. And only its one-line description sits in context until it's needed."
**👀** Open the generated `SKILL.md`: front-matter `name` + `description`, then steps.
**✅** Both files exist → `/context` (optional): CLAUDE.md is now in memory.
**🛟** If skill-creator starts building evals or asks many questions: "Skip that, just write the SKILL.md now."

---

## 4 · Gather the data (7 min)
**🏷** Subagents · MCP · context

**📋**
```
Phase 3. Launch three subagents in parallel, one per source. Each writes its own file:
(A) sources/cv.pdf + sources/linkedin.pdf → data/cv.json
    (affiliation, headline, summary, interests, experience, education, skills, talks, links)
(B) Open my publications page in the Chrome browser: <PUBS_URL>
    → data/publications.json (every publication: title, authors, year, venue, type,
    citations if shown, arXiv / DOI / page link, BibTeX if available)
(C) Open https://github.com/<GH_USER> in the Chrome browser
    → data/github.json (pinned repos, otherwise the 4 most recently updated:
    name, description, url, language, stars, last updated, topics)
Every record keeps a "source" field. When all three finish, merge them into
data/profile.json following the schema in brief.md, and list any conflicts
(e.g. different dates in CV vs LinkedIn) for me to decide.
```
**🗣** While they run: "Three workers, three fresh context windows, at the same time. Two of them are driving a real Chrome browser through **MCP**. Watch the tabs open."
**👀** Switch to Chrome briefly to show the agent-controlled tabs. Back in VS Code, point at the three parallel task rows.
**Do:** Resolve conflicts out loud ("CV wins for dates"). Then:
```
/context
```
**🗣** "The subagents read whole PDFs and web pages, but my main context only grew by their *summaries*. That's why we use them."
**✅** `data/profile.json` exists, conflicts resolved.
**🛟** Publications page slow, or Google Scholar shows a CAPTCHA (it often blocks automated browsing): "For (B) use the saved copy in sources/fallback/ instead of the browser." Same for GitHub with `sources/fallback/github.html`.

---

## 5 · Design & build (8 min)
**🏷** Skills · agent loop

**📋**
```
Phase 4. Build the site. Use the academic-portfolio skill for the process and
the frontend-design skill for the visual design. Follow brief.md exactly,
render everything from data/profile.json, and serve it locally on port 8000
(python -m http.server 8000). Tell me the URL when it's up.
```
**🗣** While it writes: "Two skills working together: *our* skill knows the procedure, the design skill knows typography, colour and layout. Neither is in my context until it's needed."
**👀** Points to call out as they happen:
- It loads the skills (a skill-invocation line in the panel).
- It **runs a command** (the local server) and may ask permission first: "the agent can act, but I stay in control."
- If something errors, it **reads the error and fixes itself**: that's the Observe step of the loop.

**Do:** Open `http://localhost:8000` in your normal browser and scroll once, slowly, for the room.
**✅** Site loads with Home + About (+ any optional sections).
**🛟** If it overruns 8 min: let it finish in the background and talk through the code in `main.js` (the scroll-colour blending is a nice thing to show).
**🛟** If the skill isn't picked up in this session: "Read .claude/skills/academic-portfolio/SKILL.md and follow it."

---

## 6 · Verify & ship (6 min)
**🏷** MCP · subagents · agent loop

### 6a · Browser check (≈2 min)
**📋**
```
Phase 5. Verify in the Chrome browser at http://localhost:8000:
scroll through every section and confirm the header highlight follows the scroll,
the colours blend smoothly, and each header link glides to its section;
read the console for errors; resize to phone width (390px) and check the layout
and menu; try the publications search and every sort option.
Fix anything that fails, then give me a pass/fail checklist.
```
### 6b · Fact-check (≈2 min, runs in parallel with 6a if you like)
**📋**
```
Run the fact-check subagent from the plan: compare every fact rendered on the page
against sources/ (and data/publications.json, data/github.json). List each mismatch with
what the page says vs what the source says. Do not fix anything yet.
```
**🗣** "The agent that wrote the site shouldn't be the only one checking it. A fresh subagent with no stake in the code is a better reviewer. Same as in science."
**Do:** Accept or reject each mismatch out loud, then: `Fix the ones I accepted.`

### 6c · Deploy (≈2 min)
**📋**
```
Phase 6. Commit everything with a clear message, create a public GitHub repository
named <GH_USER>.github.io with the gh CLI, push to it, and confirm GitHub Pages is
serving it. Give me the live URL.
```
**👀** It asks permission before running `git` / `gh`, which reaches outside your machine.
**Do:** Open the live URL on your **phone** and hold it up. 🎉
**🛟** Pages can take 1–2 min to go live: talk through the takeaways slide meanwhile. If the deploy fails, show the local site and share the link after the session.

---

## 🛟 Condensed prompt (if you're > 5 min behind)
Use it at any point after step 3a to collapse the remaining phases:
```
We're short on time. Run all remaining phases now without stopping:
gather data with parallel subagents (use sources/fallback/ for publications and GitHub),
build the site per brief.md with the frontend-design skill, verify it in the browser
at desktop and phone width, and fix issues. Report a short checklist at the end.
```

## After the demo (Q&A prompts to have ready)
- "Add a dark-mode toggle." (shows small iterative changes)
- "Make the Publications list also filterable by year." (shows editing existing code)
- "Explain how the colour blending in main.js works, line by line." (shows learning from the agent)
