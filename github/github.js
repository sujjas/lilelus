/* ==============================================
   The "How GitHub works" page
   1. The pretend practice (no real changes)
   2. Missions + diary, read live from GitHub
   ============================================== */

// ✏️ Lizzie's GitHub username (the name on her GitHub profile).
// Missions only tick for this account.
const LIZZIE_GITHUB = "Lizzie-bizi";

// Our recipe book on GitHub
const REPO = "sujjas/lilelus";


/* ---------- 1. Pretend practice ---------- */

const steps = document.querySelectorAll("#sim-steps button");
const say = document.getElementById("sim-say");
const siteTitle = document.getElementById("sim-site-title");
const oven = document.getElementById("sim-oven");
const diff = document.getElementById("sim-diff");
const pr = document.getElementById("sim-pr");
const prPill = document.getElementById("sim-pr-pill");
const branchLine = document.getElementById("g-branch");
const branchLabel = document.getElementById("g-branch-label");
const commitDot = document.getElementById("g-commit");
const mergeLine = document.getElementById("g-merge");
const mergedDot = document.getElementById("g-merged");

// What happens at each step, and the guess question for the next one
const story = {
  1: () => {
    branchLine.classList.add("show");
    branchLabel.classList.add("show");
    return "You made a practice copy. Did the website change? No! The real book is still the same. Guess next: if you change the recipe, will the website change?";
  },
  2: () => {
    diff.hidden = false;
    return "You changed the heading on your practice copy. See the spot-the-difference: red is the old line, green is the new one. But it isn't saved yet. Guess next: what does saving do?";
  },
  3: () => {
    commitDot.classList.add("show");
    return "Saved! Your sticky note says “Change the heading”. That's a commit. The website still hasn't changed, because it's only in your practice copy. Guess next: who checks it?";
  },
  4: () => {
    pr.hidden = false;
    return "You asked the head baker: “Can my change go in the real book?” They look at the green and red lines to check it's right. Guess next: what happens to the website when they say yes?";
  },
  5: () => {
    mergeLine.classList.add("show");
    mergedDot.classList.add("show");
    prPill.textContent = "Merged";
    prPill.classList.add("merged");
    oven.hidden = false;
    setTimeout(() => {
      oven.hidden = true;
      siteTitle.textContent = "Lizzie's favourite cakes";
      siteTitle.classList.add("changed");
    }, 1600);
    return "Yes! Your change is in the real book. The oven (Vercel) sees it and bakes the website again. Watch the website…";
  },
};

steps.forEach((button) => {
  button.addEventListener("click", () => {
    const n = Number(button.dataset.step);
    say.textContent = story[n]();
    button.classList.add("done");
    button.disabled = true;
    const next = document.querySelector(`#sim-steps button[data-step="${n + 1}"]`);
    if (next) {
      next.disabled = false;
      next.focus({ preventScroll: true });
    }
  });
});

document.getElementById("sim-reset").addEventListener("click", () => {
  steps.forEach((b, i) => { b.disabled = i !== 0; b.classList.remove("done"); });
  [branchLine, branchLabel, commitDot, mergeLine, mergedDot].forEach((el) => el.classList.remove("show"));
  diff.hidden = true;
  pr.hidden = true;
  oven.hidden = true;
  prPill.textContent = "Waiting for a check";
  prPill.classList.remove("merged");
  siteTitle.textContent = "Today's cakes";
  siteTitle.classList.remove("changed");
  say.textContent = "Guess first: if we make a practice copy, will the website change?";
});


/* ---------- 2. Missions + diary (live from GitHub) ---------- */

const CLAUDE = /co-authored-by:\s*claude/i;
const me = LIZZIE_GITHUB.trim().toLowerCase();
const isMe = (login) => !!me && !!login && login.toLowerCase() === me;

async function getJSON(path) {
  const key = "gh:" + path;
  try {
    const cached = JSON.parse(sessionStorage.getItem(key));
    if (cached && Date.now() - cached.at < 60000) return cached.data;   // reuse for 1 minute
  } catch (e) { /* no cache: fine */ }

  const res = await fetch(`https://api.github.com/repos/${REPO}/${path}`, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(res.status === 403 ? "busy" : String(res.status));
  const data = await res.json();
  try { sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data })); } catch (e) { /* fine */ }
  return data;
}

function timeAgo(iso) {
  const s = Math.round((Date.now() - new Date(iso)) / 1000);
  if (s < 60) return "just now";
  const m = Math.round(s / 60); if (m < 60) return m + " min ago";
  const h = Math.round(m / 60); if (h < 24) return h + (h === 1 ? " hour ago" : " hours ago");
  const d = Math.round(h / 24); if (d < 30) return d + (d === 1 ? " day ago" : " days ago");
  return new Date(iso).toLocaleDateString();
}

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function tag(cls, text) { return el("span", "tag " + cls, text); }

function renderMissions(commits, pulls, filesByPr) {
  const who = document.getElementById("who");
  if (!me) {
    who.textContent = "Missions will start ticking once your teacher adds your GitHub username to this page.";
    document.querySelectorAll("#missions-list .status").forEach((s) => (s.textContent = "Not yet"));
    return;
  }
  who.textContent = `Checking missions for @${LIZZIE_GITHUB}.`;

  const mine = pulls.filter((p) => isMe(p.user && p.user.login));
  const myCommits = commits.filter((c) => isMe(c.author && c.author.login));
  const results = {
    pr: mine.length > 0,
    merged: mine.some((p) => p.merged_at),
    claude: myCommits.some((c) => CLAUDE.test(c.commit.message)) ||
            mine.some((p) => p.merged_at && CLAUDE.test(p.body || "")),
    revert: mine.some((p) => /^revert/i.test(p.title)),
    // Mum's landing page is index.html in the main folder
    words: mine.some((p) => p.merged_at && (filesByPr[p.number] || []).some((f) => f.filename === "index.html" && f.status === "modified")),
    photo: mine.some((p) => p.merged_at && (filesByPr[p.number] || []).some((f) => /^images\/.+\.(jpe?g|png|webp|gif)$/i.test(f.filename) && f.status === "added")),
    five: myCommits.length >= 5,
  };
  document.getElementById("five-count").textContent = `(${Math.min(myCommits.length, 5)} of 5)`;

  for (const [key, done] of Object.entries(results)) {
    const li = document.querySelector(`[data-mission="${key}"]`);
    li.classList.toggle("complete", done);
    li.querySelector(".status").textContent = done ? "Done ✓" : "Not yet";
  }
}

function renderDiary(commits, pulls) {
  const list = document.getElementById("diary");
  list.innerHTML = "";

  const entries = [];

  for (const c of commits) {
    const msg = c.commit.message;
    const first = msg.split("\n")[0];
    const isMerge = /^Merge pull request #\d+/.test(first);
    if (isMerge) continue;                                  // the pull request itself is shown instead
    entries.push({
      when: c.commit.author.date,
      who: (c.author && c.author.login) || c.commit.author.name,
      avatar: c.author && c.author.avatar_url,
      title: first,
      url: c.html_url,
      kind: "Saved to the real book",
      tags: CLAUDE.test(msg) ? [tag("tag-claude", "Claude helped")] : [],
    });
  }

  for (const p of pulls) {
    const state = p.merged_at ? ["tag-merged", "Merged"] : p.state === "open" ? ["tag-open", "Waiting for a check"] : ["tag-closed", "Closed"];
    entries.push({
      when: p.merged_at || p.created_at,
      who: p.user.login,
      avatar: p.user.avatar_url,
      title: `#${p.number} ${p.title}`,
      url: p.html_url,
      kind: "Pull request",
      tags: [tag("tag-pr", "Pull request"), tag(state[0], state[1])].concat(CLAUDE.test(p.body || "") ? [tag("tag-claude", "Claude helped")] : []),
    });
  }

  entries.sort((a, b) => new Date(b.when) - new Date(a.when));

  if (entries.length === 0) {
    list.append(el("li", "diary-empty", "Nothing in the diary yet."));
    return;
  }

  for (const e of entries.slice(0, 15)) {
    const li = el("li");
    const img = el("img");
    img.alt = "";
    img.width = 40; img.height = 40;
    if (e.avatar) img.src = e.avatar + "&s=80";
    const body = el("div", "diary-body");
    const title = el("p", "diary-title");
    const link = el("a", "", e.title);
    link.href = e.url; link.target = "_blank"; link.rel = "noopener";
    title.append(link);
    const meta = el("p", "diary-meta");
    const who = el("b", "", "@" + e.who + (isMe(e.who) ? " (you!)" : ""));
    meta.append(who, el("span", "", timeAgo(e.when)), ...e.tags);
    body.append(title, meta);
    li.append(img, body);
    list.append(li);
  }
}

async function loadFromGitHub() {
  try {
    const [commits, pulls] = await Promise.all([
      getJSON("commits?sha=main&per_page=100"),
      getJSON("pulls?state=all&per_page=50"),
    ]);
    // Which files did each of Lizzie's merged pull requests change? (for the words + photo missions)
    const filesByPr = {};
    const myMerged = pulls.filter((p) => isMe(p.user && p.user.login) && p.merged_at).slice(0, 10);
    await Promise.all(myMerged.map(async (p) => {
      try { filesByPr[p.number] = await getJSON(`pulls/${p.number}/files?per_page=100`); } catch (e) { filesByPr[p.number] = []; }
    }));
    renderMissions(commits, pulls, filesByPr);
    renderDiary(commits, pulls);
  } catch (err) {
    const msg = err.message === "busy"
      ? "GitHub is busy right now. Wait a few minutes, then refresh."
      : "Couldn't read the diary from GitHub. Check your internet, then refresh.";
    const list = document.getElementById("diary");
    list.innerHTML = "";
    list.append(el("li", "diary-empty", msg));
    document.querySelectorAll("#missions-list .status").forEach((s) => (s.textContent = "?"));
    document.getElementById("who").textContent = msg;
  }
}

loadFromGitHub();
