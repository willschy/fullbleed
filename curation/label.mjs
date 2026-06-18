#!/usr/bin/env node
// Full Bleed — A/B taste labeler. A tiny local tool: shows two real candidates from
// the pen's contested zone, you pick the one more worth a creative's time. Active
// sampling focuses on close calls. Picks append to curation/preferences.json, which
// the calibration step consumes to teach the judge your taste.
//
//   node curation/label.mjs   →   open http://localhost:4455
import http from "node:http";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SYNTH = process.argv.includes("synth"); // `node curation/label.mjs synth` -> fictional set
const PREFS = join(ROOT, "curation", SYNTH ? "preferences-synthetic.json" : "preferences.json");
const PORT = 4455;

// ---- build the card pool ----
let cards;
if (SYNTH) {
  // 60 fictional candidates spanning the whole space (curation/synthetic.json)
  cards = JSON.parse(readFileSync(join(ROOT, "curation/synthetic.json"), "utf8"));
} else {
  // real pen, contested zone (judge score 4-8)
  const pen = JSON.parse(readFileSync(join(ROOT, "scraper/data/pen.json"), "utf8"));
  const verdicts = JSON.parse(readFileSync(join(ROOT, "scraper/data/verdicts.json"), "utf8"));
  const byId = new Map(Object.values(pen).map((p) => [p.post.id, p.post]));
  cards = verdicts
    .filter((v) => v.score >= 4 && v.score <= 8 && byId.has(v.id))
    .map((v) => {
      const c = byId.get(v.id);
      return { id: c.id, title: c.title, summary: v.summary || (c.body || "").slice(0, 180),
               source: c.sourceLabel, category: v.category, score: v.score, url: c.outboundUrl || c.url };
    });
}
const cardById = new Map(cards.map((c) => [c.id, c]));

let prefs = existsSync(PREFS) ? JSON.parse(readFileSync(PREFS, "utf8")) : [];
const labelCount = new Map(cards.map((c) => [c.id, 0]));
for (const p of prefs) { // seed counts from prior session
  labelCount.set(p.winner, (labelCount.get(p.winner) || 0) + 1);
  labelCount.set(p.loser, (labelCount.get(p.loser) || 0) + 1);
}

// active sampling: prefer under-labeled cards, require a close call (|Δscore| ≤ 2)
function weightedPick(pool) {
  const tot = pool.reduce((s, c) => s + 1 / (1 + labelCount.get(c.id)), 0);
  let r = Math.random() * tot;
  for (const c of pool) { r -= 1 / (1 + labelCount.get(c.id)); if (r <= 0) return c; }
  return pool[pool.length - 1];
}
function nextPair() {
  for (let t = 0; t < 80; t++) {
    const a = weightedPick(cards);
    const near = cards.filter((c) => c.id !== a.id && (a.score == null || Math.abs(c.score - a.score) <= 2));
    if (!near.length) continue;
    const b = weightedPick(near);
    return [a, b];
  }
  return [cards[0], cards[1]];
}

const send = (res, code, type, body) => { res.writeHead(code, { "Content-Type": type }); res.end(body); };

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") return send(res, 200, "text/html", PAGE);
  if (req.method === "GET" && req.url === "/pair") {
    const [a, b] = nextPair();
    const strip = ({ id, title, summary, source, category, url }) => ({ id, title, summary, source, category, url });
    return send(res, 200, "application/json", JSON.stringify({ a: strip(a), b: strip(b), count: prefs.length }));
  }
  if (req.method === "POST" && req.url === "/pick") {
    let body = "";
    req.on("data", (d) => (body += d));
    req.on("end", () => {
      const { a, b, action } = JSON.parse(body || "{}"); // action: left|right|both|neither|skip
      const ts = new Date().toISOString();
      if (action !== "skip" && cardById.has(a) && cardById.has(b)) {
        if (action === "left") prefs.push({ type: "pick", winner: a, loser: b, ts });
        else if (action === "right") prefs.push({ type: "pick", winner: b, loser: a, ts });
        else if (action === "both") prefs.push({ type: "keep", ids: [a, b], ts });   // both belong
        else if (action === "neither") prefs.push({ type: "kill", ids: [a, b], ts }); // neither belongs
        labelCount.set(a, (labelCount.get(a) || 0) + 1);
        labelCount.set(b, (labelCount.get(b) || 0) + 1);
        writeFileSync(PREFS, JSON.stringify(prefs, null, 1));
      }
      send(res, 200, "application/json", JSON.stringify({ count: prefs.length }));
    });
    return;
  }
  send(res, 404, "text/plain", "not found");
});

server.listen(PORT, () => {
  console.log(`Taste labeler on http://localhost:${PORT}  (${cards.length} cards, ${prefs.length} picks so far)`);
  console.log("Pick the one more worth a creative's time. ← / → to choose, ↓ to skip. Picks save to curation/preferences.json.");
});

const PAGE = `<!doctype html><html><head><meta charset="utf-8"><title>Full Bleed — taste</title>
<style>
  :root{--bg:#111110;--surf:#1c1c1a;--ink:#f2f1ec;--ink50:rgba(242,241,236,.52);--ink35:rgba(242,241,236,.38);--acc:#ff5b27;--line:rgba(242,241,236,.09)}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.5 system-ui,-apple-system,sans-serif;min-height:100vh;display:flex;flex-direction:column}
  header{display:flex;align-items:center;justify-content:space-between;padding:18px 28px;border-bottom:1px solid var(--line)}
  .brand{font-weight:700;letter-spacing:.04em}
  .q{color:var(--ink50);font-size:.9rem}
  .count{font-variant-numeric:tabular-nums;color:var(--ink35);font-size:.85rem}
  main{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:20px;padding:28px;max-width:1100px;margin:0 auto;width:100%;align-items:stretch}
  .card{background:var(--surf);border:1px solid var(--line);border-radius:16px;padding:24px;cursor:pointer;display:flex;flex-direction:column;gap:12px;transition:border-color .12s,transform .12s}
  .card:hover{border-color:var(--acc);transform:translateY(-2px)}
  .src{font:500 .68rem/1 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--ink35)}
  .title{font-size:1.18rem;font-weight:600;line-height:1.25}
  .summary{color:var(--ink50);font-size:.95rem;flex:1}
  .cat{align-self:flex-start;font:500 .7rem/1 ui-monospace,monospace;color:var(--acc);border:1px solid var(--line);border-radius:999px;padding:5px 10px}
  .key{font:500 .7rem/1 ui-monospace,monospace;color:var(--ink35);margin-top:auto}
  footer{display:flex;justify-content:center;gap:18px;padding:14px;border-top:1px solid var(--line)}
  button{background:none;border:1px solid var(--line);color:var(--ink50);border-radius:999px;padding:8px 18px;cursor:pointer;font:inherit;font-size:.85rem}
  button:hover{color:var(--ink);border-color:var(--ink35)}
  a.open{color:var(--ink35);font-size:.8rem;text-decoration:none}
  a.open:hover{color:var(--acc)}
</style></head><body>
<header><span class="brand">FULL BLEED · taste</span><span class="q">Which is more worth a creative's time?</span><span class="count" id="count"></span></header>
<main id="main"></main>
<footer>
  <button data-act="both">Both belong (↑)</button>
  <button data-act="skip">Skip (space)</button>
  <button data-act="neither">Neither (↓)</button>
</footer>
<script>
let cur=null;
async function load(){const r=await fetch('/pair');cur=await r.json();render();}
function card(c,side){return \`<div class="card" data-side="\${side}">
  <span class="src">\${c.source}</span>
  <div class="title">\${esc(c.title)}</div>
  <div class="summary">\${esc(c.summary||'')}</div>
  <span class="cat">\${c.category||''}</span>
  <span class="key">\${side==='left'?'← pick':'pick →'}\${c.url?' · <a class="open" href="'+c.url+'" target="_blank" rel="noopener">open ↗</a>':''}</span>
</div>\`;}
function esc(s){return (s||'').replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));}
function render(){document.getElementById('main').innerHTML=card(cur.a,'left')+card(cur.b,'right');document.getElementById('count').textContent=cur.count+' labeled';}
async function act(action){await fetch('/pick',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({a:cur.a.id,b:cur.b.id,action})});load();}
document.addEventListener('click',e=>{if(e.target.closest('a'))return;const card=e.target.closest('.card');if(card)return act(card.dataset.side);const btn=e.target.closest('button[data-act]');if(btn)act(btn.dataset.act);});
document.addEventListener('keydown',e=>{const k={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'both',ArrowDown:'neither',' ':'skip'}[e.key];if(k){e.preventDefault();act(k);}});
load();
</script></body></html>`;
