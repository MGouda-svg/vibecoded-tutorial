/* Portfolio renderer: builds the page from data/profile.json.
   Home and About always render; every other section renders only when it has data. */
(() => {
  "use strict";

  // Soft section palettes (all checked for AA contrast, including blends between neighbours).
  const PALETTES = {
    home:         { bg: "#E8EDF2", ink: "#15202B", muted: "#46525E", accent: "#2F5577", chip: "#D6DFE8", line: "#B9C5D1" },
    about:        { bg: "#E7EDE6", ink: "#18241C", muted: "#46554A", accent: "#335F45", chip: "#D3DFD2", line: "#B5C6B6" },
    publications: { bg: "#ECE9F2", ink: "#201C2C", muted: "#4F4960", accent: "#54478A", chip: "#DDD7EA", line: "#C3BBD6" },
    talks:        { bg: "#F1E8EC", ink: "#2A1C23", muted: "#5A4851", accent: "#7F3F5E", chip: "#E5D5DD", line: "#D2BCC7" },
    projects:     { bg: "#E4EEEE", ink: "#142424", muted: "#435656", accent: "#2B6363", chip: "#D0E1E1", line: "#B1C9C9" },
    contact:      { bg: "#E6E8EF", ink: "#181C28", muted: "#4A5061", accent: "#3B4C80", chip: "#D5D9E6", line: "#B9BFD2" },
  };

  const LINK_LABELS = [
    ["linkedin", "LinkedIn"],
    ["scholar", "Google Scholar"],
    ["inspire", "INSPIRE-HEP"],
    ["arxiv", "arXiv"],
    ["orcid", "ORCID"],
    ["github", "GitHub"],
  ];

  const TYPE_LABELS = { article: "Journal articles", conference: "Conference papers", preprint: "Preprints", thesis: "Theses" };
  const KIND_LABELS = { talk: "Talk", poster: "Poster", invited: "Invited talk", school: "Summer school", workshop: "Workshop", program: "Research program" };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const main = document.getElementById("main");

  // ---------- tiny DOM helper (never uses innerHTML with data) ----------
  function h(tag, attrs, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === false || v == null) continue;
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v === true ? "" : v);
    }
    for (const c of children.flat()) {
      if (c == null || c === false) continue;
      node.append(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return node;
  }

  const has = (v) => Array.isArray(v) ? v.length > 0 : v != null && String(v).trim() !== "" && v !== "TODO";

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function fmtMonth(s) {
    if (!s) return "";
    if (/^present$/i.test(s)) return "Present";
    const m = /^(\d{4})(?:-(\d{2}))?/.exec(s);
    if (!m) return s;
    return m[2] ? `${MONTHS[+m[2] - 1]} ${m[1]}` : m[1];
  }
  function fmtRange(a, b) {
    const s = fmtMonth(a), e = fmtMonth(b);
    if (s && e && s !== e) return `${s} – ${e}`;
    return s || e;
  }
  function fmtDate(iso) {
    const d = new Date(iso + "T00:00:00");
    return isNaN(d) ? iso : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }

  function externalLink(href, label, cls) {
    return h("a", { href, target: "_blank", rel: "noopener noreferrer", class: cls },
      label, h("span", { class: "visually-hidden", text: " (opens in a new tab)" }));
  }

  function linkRow(links) {
    const items = LINK_LABELS.filter(([k]) => has(links && links[k]))
      .map(([k, label]) => h("li", null, externalLink(links[k], label)));
    return items.length ? h("ul", { class: "link-row" }, items) : null;
  }

  function tagList(items, label) {
    return h("ul", { class: "tags", "aria-label": label }, items.map((t) => h("li", { class: "tag", text: t })));
  }

  // Email is stored as parts so the address never appears whole in the HTML or JSON.
  function emailAddress(e) {
    if (!e) return "";
    if (typeof e === "string") return e;
    return e.user && e.domain ? `${e.user}@${e.domain}` : "";
  }

  // ---------- sections ----------
  function section(id, palette, title, ...content) {
    const s = h("section", { id, class: `section ${id}`, "data-palette": palette, "aria-labelledby": `${id}-title` });
    s.append(h("div", { class: "wrap" },
      h("h2", { class: "section-title reveal", id: `${id}-title`, text: title }),
      content));
    return s;
  }

  function renderHome(p) {
    const headline = (p.headline || "").replace(new RegExp(`\\s*\\|\\s*${(p.affiliation || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`), "");
    const s = h("section", { id: "home", class: "section hero", "data-palette": "home", "aria-labelledby": "home-title" },
      h("canvas", { class: "hero-art", "aria-hidden": "true" }),
      h("div", { class: "wrap hero-inner" },
        has(p.affiliation) && h("p", { class: "affiliation", text: p.affiliation }),
        h("h1", { class: "name", id: "home-title", text: p.name }),
        has(headline) && h("p", { class: "headline", text: headline }),
        has(p.summary) && h("p", { class: "summary", text: p.summary }),
        has(p.interests) && tagList(p.interests, "Research interests"),
        linkRow(p.links)),
      h("a", { class: "scroll-cue", href: "#about", "aria-label": "Scroll to About" },
        h("span", { "aria-hidden": "true" }, svgArrow())));
    return s;
  }

  function svgArrow() {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("width", "18"); svg.setAttribute("height", "18");
    svg.setAttribute("focusable", "false");
    const path = document.createElementNS(ns, "path");
    path.setAttribute("d", "M12 4v15m0 0-6-6m6 6 6-6");
    path.setAttribute("fill", "none"); path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "1.6"); path.setAttribute("stroke-linecap", "round"); path.setAttribute("stroke-linejoin", "round");
    svg.append(path);
    return svg;
  }

  function timelineEntry(title, org, start, end, text, extra) {
    const current = /^present$/i.test(end || "");
    return h("li", { class: current ? "is-current reveal" : "reveal" },
      h("h4", { class: "entry-title", text: title }),
      has(org) && h("p", { class: "entry-org", text: org }),
      has(start) || has(end) ? h("time", { class: "entry-dates", text: fmtRange(start, end) }) : null,
      has(text) && h("p", { class: "entry-text", text }),
      extra);
  }

  function renderAbout(p) {
    const left = [], right = [];
    if (has(p.experience)) left.push(h("div", { class: "block" },
      h("h3", { class: "sub-title reveal", text: "Experience" }),
      h("ol", { class: "timeline" }, p.experience.map((e) => timelineEntry(e.role, e.org, e.start, e.end, e.description)))));
    if (has(p.teaching)) left.push(h("div", { class: "block" },
      h("h3", { class: "sub-title reveal", text: "Teaching" }),
      h("ol", { class: "timeline" }, p.teaching.map((t) => timelineEntry(t.role, t.org, t.start, t.end, t.description,
        has(t.courses) && h("ul", { class: "courses", "aria-label": "Courses" }, t.courses.map((c) =>
          h("li", null, has(c.code) && h("span", { class: "code", text: c.code }), c.title, has(c.terms) && ` (${c.terms})`))))))));

    if (has(p.education)) right.push(h("div", { class: "block" },
      h("h3", { class: "sub-title reveal", text: "Education" }),
      h("ol", { class: "timeline" }, p.education.map((e) => timelineEntry(e.degree, e.institution, e.start, e.end, e.details)))));
    if (has(p.awards)) right.push(h("div", { class: "block" },
      h("h3", { class: "sub-title reveal", text: "Awards" }),
      h("ul", { class: "awards" }, p.awards.map((a) => h("li", { class: "reveal" },
        h("h4", { class: "entry-title", text: a.title }),
        has(a.date) && h("time", { class: "entry-dates", text: fmtMonth(a.date) }),
        has(a.description) && h("p", { class: "entry-text", text: a.description }))))));
    if (has(p.skills)) right.push(h("div", { class: "block reveal" },
      h("h3", { class: "sub-title", text: "Skills" }),
      tagList(p.skills, "Skills")));

    return section("about", "about", "About",
      h("div", { class: "about-grid" }, h("div", null, left), h("div", null, right)));
  }

  // ---------- publications ----------
  const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[^a-z]/g, "");

  function isMe(author, variants) {
    const a = norm(author);
    return variants.some((v) => {
      const nv = norm(v);
      return nv.length > 4 && (a === nv || a.endsWith(nv));
    });
  }

  function renderPublications(p) {
    const pubs = p.publications;
    const variants = [p.name, ...(p.nameVariants || [])];
    const types = [...new Set(pubs.map((x) => x.type).filter(Boolean))];
    const state = { q: "", sort: "year", type: "all" };

    const search = h("input", { id: "pub-search", type: "search", placeholder: "Title, author or journal", autocomplete: "off" });
    const sort = h("select", { id: "pub-sort" },
      h("option", { value: "year", text: "Newest first" }),
      h("option", { value: "citations", text: "Most cited" }),
      h("option", { value: "title", text: "Title (A–Z)" }));
    const chipBox = h("div", { class: "chips", role: "group", "aria-label": "Filter by type" });
    const count = h("p", { class: "pub-count", "aria-live": "polite" });
    const list = h("ol", { class: "pub-list" });

    function chip(value, label) {
      return h("button", { type: "button", class: "chip", "aria-pressed": String(state.type === value),
        onclick: () => { state.type = value; chipBox.querySelectorAll(".chip").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.value === value))); draw(); },
        "data-value": value, text: label });
    }
    chipBox.append(chip("all", "All"), ...types.map((t) => chip(t, TYPE_LABELS[t] || t)));

    function pubItem(x) {
      const authors = (x.authors || []).flatMap((a, i) => [i ? ", " : "", isMe(a, variants) ? h("strong", { text: a }) : a]);
      const status = h("span", { class: "visually-hidden", role: "status" });
      const copyBtn = has(x.bibtex) && h("button", { type: "button", class: "btn",
        onclick: async (ev) => {
          const ok = await copyText(x.bibtex);
          ev.currentTarget.textContent = ok ? "Copied" : "Copy failed";
          status.textContent = ok ? "BibTeX citation copied to clipboard" : "Could not copy. Select the text manually.";
          const btn = ev.currentTarget;
          setTimeout(() => { btn.textContent = "Copy citation"; }, 2000);
        }, text: "Copy citation" });
      const venue = [x.venue, has(x.citations) ? `${x.citations} citation${x.citations === 1 ? "" : "s"}` : null].filter(Boolean).join(", ");
      return h("li", { class: "reveal" },
        h("span", { class: "pub-year", text: x.year || "" }),
        h("div", null,
          h("h3", { class: "pub-title" }, has(x.url) ? externalLink(x.url, x.title) : x.title),
          authors.length && h("p", { class: "pub-authors" }, authors),
          has(venue) && h("p", { class: "pub-venue", text: venue }),
          h("div", { class: "pub-actions" },
            copyBtn, status,
            has(x.arxiv) && externalLink(`https://arxiv.org/abs/${x.arxiv}`, `arXiv:${x.arxiv}`),
            has(x.doi) && externalLink(`https://doi.org/${x.doi}`, "DOI"),
            has(x.url) && externalLink(x.url, "INSPIRE record"))));
    }

    function draw() {
      const q = state.q.trim().toLowerCase();
      let rows = pubs.filter((x) => state.type === "all" || x.type === state.type)
        .filter((x) => !q || [x.title, x.venue, ...(x.authors || [])].join(" ").toLowerCase().includes(q));
      const by = {
        year: (a, b) => (b.year || 0) - (a.year || 0) || a.title.localeCompare(b.title),
        citations: (a, b) => (b.citations || 0) - (a.citations || 0) || (b.year || 0) - (a.year || 0),
        title: (a, b) => a.title.localeCompare(b.title),
      }[state.sort];
      rows = rows.slice().sort(by);
      count.textContent = `Showing ${rows.length} of ${pubs.length}`;
      list.replaceChildren(...rows.map(pubItem));
      if (!rows.length) list.append(h("li", { class: "empty", text: q ? `No publications match “${state.q.trim()}”. Clear the search to see all ${pubs.length}.` : "No publications of this type." }));
      observeReveals(list);
    }

    search.addEventListener("input", () => { state.q = search.value; draw(); });
    sort.addEventListener("change", () => { state.sort = sort.value; draw(); });
    draw();

    return section("publications", "publications", "Publications",
      h("div", { class: "pub-controls reveal" },
        h("div", { class: "field" }, h("label", { for: "pub-search", text: "Search publications" }), search),
        h("div", { class: "field" }, h("label", { for: "pub-sort", text: "Sort by" }), sort),
        chipBox),
      count, list);
  }

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      const ta = h("textarea", { "aria-hidden": "true", style: "position:fixed;opacity:0" });
      ta.value = text; document.body.append(ta); ta.select();
      let ok = false; try { ok = document.execCommand("copy"); } catch { ok = false; }
      ta.remove(); return ok;
    }
  }

  function renderTalks(p) {
    const groups = new Map();
    p.talks.slice().sort((a, b) => String(b.date).localeCompare(String(a.date))).forEach((t) => {
      const y = String(t.date || "").slice(0, 4) || "Undated";
      if (!groups.has(y)) groups.set(y, []);
      groups.get(y).push(t);
    });
    return section("talks", "talks", "Schools & workshops",
      h("div", null, [...groups].map(([year, items]) => h("div", { class: "year-group reveal" },
        h("h3", { text: year }),
        h("ul", null, items.map((t) => h("li", null,
          has(t.kind) && h("span", { class: "badge", text: KIND_LABELS[t.kind] || t.kind }),
          h("h4", { class: "entry-title", text: t.title }),
          has(t.event) && t.event !== t.title && h("p", { class: "entry-org", text: t.event }),
          h("time", { class: "entry-dates", text: [fmtRange(t.date, t.end), t.location].filter(Boolean).join(", ") }),
          has(t.description) && h("p", { class: "entry-text", text: t.description }))))))));
  }

  function renderProjects(p) {
    return section("projects", "projects", "Projects",
      h("ul", { class: "project-grid" }, p.projects.map((x) => h("li", { class: "card reveal" },
        h("h3", null, has(x.url) ? externalLink(x.url, x.displayName || x.name) : (x.displayName || x.name)),
        has(x.description) && h("p", { text: x.description }),
        h("dl", { class: "meta" },
          has(x.language) && h("div", null, h("dt", { text: "Language" }), h("dd", { text: x.language })),
          x.stars != null && h("div", null, h("dt", { text: "Stars" }), h("dd", { text: x.stars })),
          has(x.updated) && h("div", null, h("dt", { text: "Updated" }), h("dd", null, h("time", { datetime: x.updated, text: fmtDate(x.updated) })))),
        has(x.topics) && tagList(x.topics, "Topics")))));
  }

  function renderContact(p) {
    const email = emailAddress(p.links && p.links.email);
    const f = h("footer", { id: "contact", class: "section contact", "data-palette": "contact", "aria-labelledby": "contact-title" },
      h("div", { class: "wrap" },
        h("h2", { class: "section-title", id: "contact-title", text: "Contact" }),
        email && h("p", null, h("a", { class: "email-link", href: `mailto:${email}`, text: email })),
        linkRow(p.links),
        has(p.updated) && h("p", { class: "updated" }, "Last updated ", h("time", { datetime: p.updated, text: fmtDate(p.updated) }))));
    return f;
  }

  // ---------- navigation, palette blending, progress ----------
  const NAV_LABELS = { home: "Home", about: "About", publications: "Publications", talks: "Schools & workshops", projects: "Projects", contact: "Contact" };

  function buildNav(sections) {
    const ul = document.querySelector("#site-nav ul");
    ul.replaceChildren(...sections.map((s) => h("li", null, h("a", { href: `#${s.id}`, text: NAV_LABELS[s.id] || s.id }))));
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.getElementById("site-nav");
    const setOpen = (open) => { nav.classList.toggle("is-open", open); toggle.setAttribute("aria-expanded", String(open)); };
    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); } });
  }

  const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const toHex = (rgb) => "#" + rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
  const mix = (a, b, t) => toHex(hex(a).map((v, i) => v + (hex(b)[i] - v) * t));
  const smooth = (t) => t * t * (3 - 2 * t);

  let current = { ...PALETTES.home };

  function startScrollEffects(sections) {
    const root = document.documentElement;
    const bar = document.querySelector(".progress span");
    const links = () => document.querySelectorAll("#site-nav a");
    const meta = document.querySelector('meta[name="theme-color"]');
    let lastActive = "";
    let ticking = false;

    function update() {
      ticking = false;
      const y = window.scrollY, vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;

      const anchor = y + vh * 0.45;
      let i = 0;
      sections.forEach((s, k) => { if (s.offsetTop <= anchor) i = k; });
      if (max > 0 && y >= max - 2) i = sections.length - 1;

      const a = PALETTES[sections[i].dataset.palette];
      const next = sections[i + 1];
      let t = 0;
      if (next && !reduceMotion.matches && y < max - 2) {
        const zone = Math.min(vh * 0.6, sections[i].offsetHeight * 0.5);
        t = Math.max(0, Math.min(1, (anchor - (next.offsetTop - zone)) / zone));
      }
      const b = next ? PALETTES[next.dataset.palette] : a;
      for (const k of Object.keys(a)) {
        current[k] = t > 0 ? mix(a[k], b[k], smooth(t)) : a[k];
        root.style.setProperty(`--${k}`, current[k]);
      }
      if (meta) meta.setAttribute("content", current.bg);

      const id = sections[i].id;
      if (id !== lastActive) {
        lastActive = id;
        links().forEach((l) => {
          if (l.getAttribute("href") === `#${id}`) l.setAttribute("aria-current", "true");
          else l.removeAttribute("aria-current");
        });
      }
    }
    const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    reduceMotion.addEventListener("change", request);
    if (document.fonts) document.fonts.ready.then(request);
    update();
  }

  // ---------- reveals ----------
  let revealObserver = null;
  function observeReveals(scope) {
    if (!revealObserver) return;
    scope.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => revealObserver.observe(el));
  }
  function startReveals() {
    if (!("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("js-reveal");
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); revealObserver.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    observeReveals(document);
  }

  // ---------- hero art: a coordinate grid warped by a smooth "lens" ----------
  function startHeroArt(canvas) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = 0, hgt = 0, t = 0, raf = 0, visible = true;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; hgt = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(hgt * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    // Map grid coordinates (u, v) to screen space through a bulge plus a slow wave.
    function warp(u, v) {
      const aspect = w / Math.max(hgt, 1);
      const cx = 0.72 + 0.03 * Math.sin(t * 0.7), cy = 0.48 + 0.04 * Math.cos(t * 0.5);
      const dx = (u - cx) * aspect, dy = v - cy;
      const r2 = dx * dx + dy * dy;
      const k = 1 + 0.85 * Math.exp(-r2 / 0.05);
      let x = cx + (dx * k) / aspect, y = cy + dy * k;
      x += 0.012 * Math.sin(v * 7 + t);
      y += 0.012 * Math.sin(u * 6 - t * 0.8);
      return [x * w, y * hgt];
    }

    function line(points) {
      ctx.beginPath();
      points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.stroke();
    }

    function draw() {
      if (!w || !hgt) return;
      ctx.clearRect(0, 0, w, hgt);
      const [r, g, b] = hex(current.accent);
      ctx.strokeStyle = `rgba(${r},${g},${b},0.32)`;
      ctx.lineWidth = 1;
      const spacing = Math.max(28, Math.min(w, hgt) / 16);
      const cols = Math.ceil(w / spacing) + 6, rows = Math.ceil(hgt / spacing) + 6;
      const samples = 80;
      for (let c = -3; c <= cols - 3; c++) {
        const u = (c * spacing) / w, pts = [];
        for (let s = 0; s <= samples; s++) pts.push(warp(u, -0.1 + (1.2 * s) / samples));
        line(pts);
      }
      for (let rr = -3; rr <= rows - 3; rr++) {
        const v = (rr * spacing) / hgt, pts = [];
        for (let s = 0; s <= samples; s++) pts.push(warp(-0.1 + (1.2 * s) / samples, v));
        line(pts);
      }
    }

    function loop() {
      t += 0.0035;
      draw();
      raf = visible && !reduceMotion.matches && !document.hidden ? requestAnimationFrame(loop) : 0;
    }
    function maybeStart() { if (!raf && visible && !reduceMotion.matches && !document.hidden) raf = requestAnimationFrame(loop); else draw(); }

    new ResizeObserver(resize).observe(canvas);
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; maybeStart(); }).observe(canvas);
    document.addEventListener("visibilitychange", maybeStart);
    reduceMotion.addEventListener("change", maybeStart);
    window.addEventListener("scroll", () => { if (!raf) draw(); }, { passive: true });
    resize();
    maybeStart();
  }

  // ---------- boot ----------
  function render(p) {
    const parts = [renderHome(p), renderAbout(p)];
    if (has(p.publications)) parts.push(renderPublications(p));
    if (has(p.talks)) parts.push(renderTalks(p));
    if (has(p.projects)) parts.push(renderProjects(p));
    main.replaceChildren(...parts);
    const footer = renderContact(p);
    main.after(footer);

    const sections = [...parts, footer];
    buildNav(sections);
    startScrollEffects(sections);
    startReveals();
    startHeroArt(document.querySelector(".hero-art"));

    // Sections are built after load, so honour a deep link (e.g. /#publications) once they exist.
    const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView({ behavior: "instant" });
  }

  fetch("data/profile.json", { cache: "no-cache" })
    .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then(render)
    .catch((err) => {
      main.replaceChildren(h("p", { class: "status", role: "alert" },
        `Couldn't load data/profile.json (${err.message}). `,
        "If you opened index.html directly from disk, serve the folder instead, for example with ",
        h("code", { text: "python -m http.server" }), ", then open http://localhost:8000."));
    });
})();
