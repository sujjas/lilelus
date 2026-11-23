// Code playground: edit HTML, CSS and JavaScript and see the result.

(function () {
  const STARTER = {
    html: `<div class="card">
  <h1>Chocolate cake</h1>
  <p>Soft, rich and very chocolatey.</p>
  <button id="order">Order now</button>
  <p id="message"></p>
</div>`,
    css: `body {
  font-family: sans-serif;
  background: #fbf5ee;
  display: grid;
  place-items: center;
  min-height: 90vh;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #3a2219;
}

button {
  background: #b8406a;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 99px;
  font-size: 16px;
  cursor: pointer;
}`,
    js: `const button = document.getElementById("order");
const message = document.getElementById("message");

button.addEventListener("click", function () {
  message.textContent = "Thank you! Your cake is on its way 🎂";
});`,
  };

  const CHALLENGES = [
    { layer: "html", text: "Change “Chocolate cake” to your favourite cake." },
    { layer: "html", text: "Add a price under the description.", hint: "<p>UGX 50,000</p>" },
    { layer: "css", text: "Make the button a different colour.", hint: "Find background: #b8406a; and try green or orange" },
    { layer: "css", text: "Make the card's corners even rounder.", hint: "border-radius" },
    { layer: "js", text: "Change the thank-you message." },
    { layer: "js", text: "Bonus: make the button say “Ordered!” after it's clicked.", hint: 'button.textContent = "Ordered!";' },
    { layer: "all", text: "Untick CSS and Run. Then untick JavaScript and Run. What changed each time?" },
  ];

  const STORE = "pg-v1";
  const $ = (id) => document.getElementById(id);
  const editors = { html: $("code-html"), css: $("code-css"), js: $("code-js") };
  const tabs = { html: $("tab-html"), css: $("tab-css"), js: $("tab-js") };
  const preview = $("preview");
  const errorBox = $("error");
  const dirty = $("dirty");

  // ---- saving (optional: works without it) ----
  function load() {
    try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch { return {}; }
  }
  function save() {
    try {
      localStorage.setItem(STORE, JSON.stringify({
        html: editors.html.value, css: editors.css.value, js: editors.js.value, done: doneList(),
      }));
    } catch { /* storage blocked: that's fine */ }
  }

  const saved = load();
  for (const k of ["html", "css", "js"]) editors[k].value = saved[k] ?? STARTER[k];

  // ---- tabs ----
  function showTab(name) {
    for (const k in tabs) {
      const on = k === name;
      tabs[k].setAttribute("aria-selected", String(on));
      editors[k].hidden = !on;
    }
    editors[name].focus({ preventScroll: true });
  }
  for (const k in tabs) tabs[k].addEventListener("click", () => showTab(k));

  // ---- run ----
  function run() {
    const useCss = $("use-css").checked;
    const useJs = $("use-js").checked;
    const safeJs = editors.js.value.replace(/<\/script/gi, "<\\/script");
    const reporter = `<script>window.onerror=function(m,s,l){parent.postMessage({pg:"error",message:String(m),line:l},"*")}<\/script>`;
    preview.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">` +
      (useCss ? `<style>${editors.css.value}</style>` : "") +
      `</head><body>${editors.html.value}` +
      (useJs ? `${reporter}<script>${safeJs}<\/script>` : "") +
      `</body></html>`;
    errorBox.hidden = true;
    dirty.hidden = true;
    save();
  }

  window.addEventListener("message", (e) => {
    if (e.source !== preview.contentWindow || !e.data || e.data.pg !== "error") return;
    errorBox.textContent = `Oops! The JavaScript has a mistake: ${e.data.message}. Check your spelling, brackets ( ) { } and quote marks " ".`;
    errorBox.hidden = false;
  });

  $("run").addEventListener("click", run);
  $("use-css").addEventListener("change", run);
  $("use-js").addEventListener("change", run);

  $("reset").addEventListener("click", () => {
    if (!confirm("Put all the code back to how it started?")) return;
    for (const k of ["html", "css", "js"]) editors[k].value = STARTER[k];
    run();
  });

  for (const k in editors) {
    const ed = editors[k];
    ed.addEventListener("input", () => { dirty.hidden = false; save(); });
    ed.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); run(); return; }
      if (e.key === "Tab" && !e.shiftKey) {            // Tab key types 2 spaces
        e.preventDefault();
        const s = ed.selectionStart;
        ed.setRangeText("  ", s, ed.selectionEnd, "end");
        dirty.hidden = false;
      }
    });
  }

  // ---- challenges ----
  const list = $("challenges");
  const done = new Set(saved.done || []);
  function doneList() { return [...list.querySelectorAll("input:checked")].map((i) => Number(i.dataset.i)); }

  CHALLENGES.forEach((c, i) => {
    const li = document.createElement("li");
    li.className = "c-" + c.layer;
    const label = document.createElement("label");
    const box = document.createElement("input");
    box.type = "checkbox";
    box.dataset.i = i;
    box.checked = done.has(i);
    box.addEventListener("change", save);
    const tag = document.createElement("span");
    tag.className = "c-tag";
    tag.textContent = c.layer === "all" ? "ALL" : c.layer.toUpperCase();
    const text = document.createElement("span");
    text.className = "c-text";
    text.textContent = c.text;
    label.append(box, tag, text);
    li.append(label);
    if (c.hint) {
      const d = document.createElement("details");
      const s = document.createElement("summary");
      s.textContent = "Hint";
      const code = document.createElement("code");
      code.textContent = c.hint;
      d.append(s, code);
      li.append(d);
    }
    list.append(li);
  });

  run();
})();
