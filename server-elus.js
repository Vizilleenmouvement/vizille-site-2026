const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PASSWORD = process.env.VEM_PASSWORD || 'vizille2026';
const DIR = __dirname;

function load(f, d) { try { return JSON.parse(fs.readFileSync(path.join(DIR,f),'utf8')); } catch(e) { return d; } }
function save(f, d) { fs.writeFileSync(path.join(DIR,f), JSON.stringify(d,null,2), 'utf8'); }

let projets   = load('projets.json', []);
let agenda    = load('agenda.json', []);
let documents = load('documents.json', []);
let statuts   = load('statuts.json', {});
let notifs    = load('notifs.json', []);

console.log('VeM Dashboard v5 — projets: '+projets.length);

function auth(req) {
  const a=req.headers['authorization']||'';
  if(!a.startsWith('Basic ')) return false;
  return Buffer.from(a.slice(6),'base64').toString().split(':').slice(1).join(':')=== PASSWORD;
}
function deny(res) {
  res.writeHead(401,{'WWW-Authenticate':'Basic realm="VeM Elus"','Content-Type':'text/html;charset=utf-8'});
  res.end('<div style="font-family:sans-serif;text-align:center;padding:4rem;color:#2e5e4e"><h2>🏛 Vizille en Mouvement</h2><p>Espace réservé aux élus — Accès protégé</p></div>');
}
function jsonR(res,d,c){ res.writeHead(c||200,{'Content-Type':'application/json;charset=utf-8','Access-Control-Allow-Origin':'*'}); res.end(JSON.stringify(d)); }
function body(req,cb){ let b=''; req.on('data',d=>{b+=d;if(b.length>2e6)req.destroy();}); req.on('end',()=>{try{cb(null,JSON.parse(b));}catch(e){cb(e);}}); }
function nextId(a){ return a.length?Math.max(...a.map(i=>i.id||0))+1:1; }

function buildPage() {
  const today = new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  const COMM_JSON = '{"Culture, Patrimoine & Jumelages": ["Culture", "Patrimoine", "Jumelages"], "Mobilités": ["Mobilités"], "Transition écologique": ["Transition écologique"], "Action sociale": ["Action sociale"], "Concertation citoyenne": ["Concertation citoyenne"], "Animations de proximité": ["Animations de proximité"], "Économie": ["Économie"], "Métropole": ["Métropole"], "Enfance/Jeunesse": ["Enfance/Jeunesse"], "Tranquillité publique": ["Tranquillité publique"], "Travaux & Urbanisme": ["Travaux", "Urbanisme"], "Santé": ["Santé"]}';
  const ICONS_JSON = '{"Culture, Patrimoine & Jumelages": "🎭", "Mobilités": "🚲", "Transition écologique": "🌿", "Action sociale": "🤝", "Concertation citoyenne": "🗣", "Animations de proximité": "🎪", "Économie": "💼", "Métropole": "🏙", "Enfance/Jeunesse": "👦", "Tranquillité publique": "🛡", "Travaux & Urbanisme": "🏗", "Santé": "🏥"}';
  const REFS_JSON = '{"Culture, Patrimoine & Jumelages": "Marie-Claude", "Enfance/Jeunesse": "Angélique", "Animations de proximité": "Jean-Christophe"}';
  const COLORS_JSON = '["#6B8F71", "#4A7C6B", "#3D6B5A", "#7A9E7E", "#2E5E4E", "#8BAE8F", "#5C8A6A", "#1E4D3E", "#6B8F71", "#4A7C6B", "#3D6B5A", "#7A9E7E"]';
  const GRADS_JSON = '["linear-gradient(135deg,#6B8F71,#3D6B5A)", "linear-gradient(135deg,#4A7C6B,#2E5E4E)", "linear-gradient(135deg,#3D6B5A,#1E4D3E)", "linear-gradient(135deg,#7A9E7E,#4A7C6B)", "linear-gradient(135deg,#2E5E4E,#1E4D3E)", "linear-gradient(135deg,#8BAE8F,#5C8A6A)", "linear-gradient(135deg,#5C8A6A,#3D6B5A)", "linear-gradient(135deg,#1E4D3E,#0D3228)", "linear-gradient(135deg,#6B8F71,#4A7C6B)", "linear-gradient(135deg,#4A7C6B,#3D6B5A)", "linear-gradient(135deg,#3D6B5A,#2E5E4E)", "linear-gradient(135deg,#7A9E7E,#5C8A6A)"]';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VeM — Espace élus</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"><\/script>
<style>
:root {
  --g0:#0d1f17; --g1:#1a3a2a; --g2:#2e5e4e; --g3:#3d6b5a; --g4:#4a7c6b;
  --g5:#6b8f71; --g6:#8bae8f; --g7:#c0d9c4; --g8:#e8f3ea; --g9:#f4faf5;
  --sand:#f7f4ef; --sand2:#ede9e0; --sand3:#d4cfc4;
  --ink:#1a1e1c; --ink2:#3a4040; --ink3:#6a7270; --ink4:#9aA4a0;
  --white:#ffffff;
  --red:#e74c3c; --amber:#e67e22; --blue:#2980b9; --teal:#16a085;
  --font:'Outfit',sans-serif;
  --mono:'DM Mono',monospace;
  --r4:4px; --r8:8px; --r12:12px; --r16:16px;
  --sh1:0 1px 3px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.08);
  --sh2:0 4px 12px rgba(0,0,0,.08),0 2px 4px rgba(0,0,0,.06);
  --sh3:0 12px 32px rgba(0,0,0,.1),0 4px 8px rgba(0,0,0,.06);
  --sidebar:240px;
  --top:54px;
}
*, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
html { font-size:15px; }
body { font-family:var(--font); background:var(--sand); color:var(--ink); height:100vh; overflow:hidden; display:flex; flex-direction:column; -webkit-font-smoothing:antialiased; }

/* ── TOPBAR ─────────────────────────────────── */
.topbar {
  height:var(--top); background:var(--g1); display:flex; align-items:center;
  padding:0 1.25rem; gap:14px; flex-shrink:0; position:relative; z-index:200;
  box-shadow:0 2px 8px rgba(0,0,0,.25);
}
.tb-logo {
  display:flex; align-items:center; gap:10px; text-decoration:none;
}
.tb-logo-icon {
  width:32px; height:32px; background:var(--g5); border-radius:var(--r8);
  display:flex; align-items:center; justify-content:center;
  font-size:.85rem; font-weight:700; color:#fff; flex-shrink:0;
  box-shadow:0 2px 6px rgba(0,0,0,.2);
}
.tb-logo-text { font-size:.82rem; font-weight:600; color:rgba(255,255,255,.9); letter-spacing:.01em; }
.tb-logo-sub { font-size:.65rem; color:rgba(255,255,255,.4); letter-spacing:.03em; display:block; }
.tb-sep { width:1px; height:28px; background:rgba(255,255,255,.12); flex-shrink:0; }
.tb-date { font-size:.72rem; color:rgba(255,255,255,.4); flex:1; }
.tb-user {
  width:30px; height:30px; background:var(--g4); border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  font-size:.7rem; font-weight:600; color:#fff; cursor:pointer;
  border:1.5px solid rgba(255,255,255,.2);
}

/* ── LAYOUT ─────────────────────────────────── */
.layout { display:flex; flex:1; overflow:hidden; }

/* ── SIDEBAR ────────────────────────────────── */
.sidebar {
  width:var(--sidebar); background:var(--g1); flex-shrink:0;
  display:flex; flex-direction:column; overflow-y:auto; overflow-x:hidden;
  border-right:1px solid rgba(255,255,255,.06);
}
.sidebar::-webkit-scrollbar { width:3px; }
.sidebar::-webkit-scrollbar-thumb { background:rgba(255,255,255,.1); border-radius:2px; }
.sb-section { padding:.9rem 1rem .3rem; font-size:.62rem; font-weight:600; color:rgba(255,255,255,.25); text-transform:uppercase; letter-spacing:.1em; }
.sb-item {
  display:flex; align-items:center; gap:10px; padding:.5rem 1rem .5rem 1.1rem;
  cursor:pointer; color:rgba(255,255,255,.55); font-size:.8rem; font-weight:400;
  border-left:2px solid transparent; transition:all .15s; position:relative;
  text-decoration:none; white-space:nowrap;
}
.sb-item:hover { background:rgba(255,255,255,.06); color:rgba(255,255,255,.85); }
.sb-item.active { background:rgba(255,255,255,.1); color:#fff; border-left-color:var(--g6); font-weight:500; }
.sb-icon { width:20px; text-align:center; font-size:.95rem; flex-shrink:0; opacity:.8; }
.sb-badge {
  margin-left:auto; background:var(--g4); color:#fff; font-size:.58rem;
  font-weight:700; padding:2px 6px; border-radius:10px; flex-shrink:0;
}
.sb-footer {
  margin-top:auto; padding:1rem 1.1rem; border-top:1px solid rgba(255,255,255,.08);
  font-size:.66rem; color:rgba(255,255,255,.25); line-height:1.6;
}

/* ── MAIN ───────────────────────────────────── */
.main { flex:1; display:flex; flex-direction:column; overflow:hidden; background:var(--sand); }
.page-head {
  padding:.85rem 1.5rem; background:var(--white); border-bottom:1px solid var(--sand2);
  display:flex; align-items:center; gap:12px; flex-shrink:0; box-shadow:var(--sh1);
}
.ph-icon { width:38px; height:38px; border-radius:var(--r8); display:flex; align-items:center; justify-content:center; font-size:1.1rem; flex-shrink:0; }
.ph-title { font-size:1rem; font-weight:600; color:var(--ink); line-height:1.2; }
.ph-sub { font-size:.73rem; color:var(--ink3); margin-top:1px; }
.ph-actions { margin-left:auto; display:flex; gap:8px; align-items:center; }
.content { flex:1; overflow-y:auto; padding:1.25rem 1.5rem; }
.content::-webkit-scrollbar { width:4px; }
.content::-webkit-scrollbar-thumb { background:var(--sand3); border-radius:2px; }

/* ── PAGES ──────────────────────────────────── */
.page { display:none; }
.page.active { display:block; }

/* ── METRIC CARDS ───────────────────────────── */
.kpi-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:12px; margin-bottom:1.25rem; }
.kpi {
  background:var(--white); border-radius:var(--r12); padding:1rem 1.1rem;
  border:1px solid var(--sand2); box-shadow:var(--sh1); position:relative; overflow:hidden;
}
.kpi::after { content:''; position:absolute; bottom:0; left:0; right:0; height:3px; background:var(--g5); opacity:.4; }
.kpi-val { font-size:2rem; font-weight:700; color:var(--g2); line-height:1; font-variant-numeric:tabular-nums; }
.kpi-lbl { font-size:.7rem; color:var(--ink3); margin-top:5px; font-weight:500; text-transform:uppercase; letter-spacing:.04em; }

/* ── CHARTS GRID ────────────────────────────── */
.charts-row { display:grid; grid-template-columns:1.6fr 1fr; gap:14px; margin-bottom:1.25rem; }
.chart-card { background:var(--white); border-radius:var(--r12); border:1px solid var(--sand2); box-shadow:var(--sh1); padding:1.1rem; }
.chart-card-title { font-size:.8rem; font-weight:600; color:var(--ink2); margin-bottom:.85rem; display:flex; align-items:center; gap:8px; }
.chart-card-title::before { content:''; width:3px; height:14px; background:var(--g4); border-radius:2px; display:block; }
.chart-wrap { position:relative; height:200px; }

/* ── HERO ───────────────────────────────────── */
.hero {
  background:linear-gradient(135deg, var(--g0) 0%, var(--g2) 60%, var(--g3) 100%);
  border-radius:var(--r16); padding:1.75rem 2rem; color:#fff; display:flex;
  align-items:center; gap:1.5rem; margin-bottom:1.25rem; position:relative; overflow:hidden;
  box-shadow:var(--sh2);
}
.hero::before {
  content:''; position:absolute; top:-40px; right:-40px; width:200px; height:200px;
  border-radius:50%; background:rgba(255,255,255,.04);
}
.hero::after {
  content:''; position:absolute; bottom:-60px; right:80px; width:160px; height:160px;
  border-radius:50%; background:rgba(255,255,255,.03);
}
.hero-icon { width:60px; height:60px; background:rgba(255,255,255,.12); border-radius:var(--r12); display:flex; align-items:center; justify-content:center; font-size:1.6rem; flex-shrink:0; border:1px solid rgba(255,255,255,.15); position:relative; z-index:1; }
.hero-content { position:relative; z-index:1; }
.hero-title { font-size:1.2rem; font-weight:700; margin-bottom:.4rem; letter-spacing:-.01em; }
.hero-sub { font-size:.82rem; opacity:.65; line-height:1.6; }

/* ── COMMISSION CARDS ───────────────────────── */
.comm-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:16px; }
.cc {
  background:var(--white); border-radius:var(--r16); border:1px solid var(--sand2);
  box-shadow:var(--sh1); overflow:hidden; cursor:pointer;
  transition:transform .2s ease, box-shadow .2s ease;
}
.cc:hover { transform:translateY(-3px); box-shadow:var(--sh3); }
.cc-banner {
  height:80px; display:flex; align-items:flex-end; padding:.85rem 1rem .7rem;
  position:relative;
}
.cc-banner-icon { width:44px; height:44px; background:rgba(255,255,255,.2); border-radius:var(--r8); display:flex; align-items:center; justify-content:center; font-size:1.3rem; border:1px solid rgba(255,255,255,.25); box-shadow:0 2px 8px rgba(0,0,0,.15); }
.cc-banner-ref { margin-left:auto; background:rgba(255,255,255,.2); color:#fff; font-size:.65rem; font-weight:600; padding:2px 8px; border-radius:10px; border:1px solid rgba(255,255,255,.2); }
.cc-body { padding:.9rem 1rem 1rem; }
.cc-title { font-size:.88rem; font-weight:700; color:var(--ink); margin-bottom:.2rem; line-height:1.3; }
.cc-themes { font-size:.68rem; color:var(--ink3); margin-bottom:.85rem; }
.cc-kpis { display:grid; grid-template-columns:repeat(4,1fr); gap:6px; margin-bottom:.85rem; }
.cc-kpi { text-align:center; background:var(--sand); border-radius:var(--r8); padding:.4rem .3rem; }
.cc-kpi-v { font-size:1.2rem; font-weight:700; line-height:1; }
.cc-kpi-l { font-size:.58rem; color:var(--ink4); margin-top:2px; text-transform:uppercase; letter-spacing:.03em; }
.cc-progress { height:6px; background:var(--sand2); border-radius:4px; overflow:hidden; }
.cc-fill { height:6px; border-radius:4px; transition:width .4s ease; }
.cc-pct { display:flex; justify-content:space-between; font-size:.65rem; color:var(--ink4); margin-top:4px; }
.cc-chevron { position:absolute; bottom:.85rem; right:.85rem; color:rgba(255,255,255,.5); font-size:.8rem; }

/* ── TABLE WRAPPER ──────────────────────────── */
.table-box { background:var(--white); border-radius:var(--r12); border:1px solid var(--sand2); box-shadow:var(--sh1); overflow:hidden; }
.filter-bar {
  padding:.75rem 1.1rem; background:var(--sand); border-bottom:1px solid var(--sand2);
  display:flex; align-items:center; gap:8px; flex-wrap:wrap;
}
.fsel {
  padding:5px 10px; border:1px solid var(--sand2); border-radius:6px;
  font-size:.76rem; background:var(--white); color:var(--ink); outline:none;
  font-family:var(--font); cursor:pointer; transition:.15s;
}
.fsel:focus { border-color:var(--g4); box-shadow:0 0 0 3px rgba(74,124,107,.12); }
.fsrch {
  padding:5px 10px; border:1px solid var(--sand2); border-radius:6px;
  font-size:.76rem; background:var(--white); color:var(--ink); outline:none;
  flex:1; min-width:160px; font-family:var(--font); transition:.15s;
}
.fsrch:focus { border-color:var(--g4); box-shadow:0 0 0 3px rgba(74,124,107,.12); }
.fcnt { font-size:.71rem; color:var(--ink4); white-space:nowrap; font-variant-numeric:tabular-nums; }
table { width:100%; border-collapse:collapse; font-size:.78rem; }
thead { position:sticky; top:0; z-index:2; }
th {
  background:var(--sand); padding:9px 12px; text-align:left;
  font-size:.69rem; font-weight:700; color:var(--ink3); border-bottom:2px solid var(--sand2);
  text-transform:uppercase; letter-spacing:.06em; white-space:nowrap;
}
td { padding:9px 12px; border-bottom:1px solid var(--sand); vertical-align:middle; }
tr:last-child td { border-bottom:none; }
tr:hover td { background:var(--g9); }
.pname { font-weight:600; font-size:.8rem; color:var(--ink); }
.presume { font-size:.7rem; color:var(--ink3); margin-top:2px; line-height:1.3; }
.comm-chip { display:inline-block; font-size:.65rem; font-weight:600; background:var(--g8); color:var(--g2); padding:2px 7px; border-radius:10px; }

/* ── STATUS BADGES ──────────────────────────── */
.badge { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:20px; font-size:.67rem; font-weight:600; white-space:nowrap; }
.badge::before { content:''; width:5px; height:5px; border-radius:50%; background:currentColor; opacity:.8; }
.s-pr { background:#fdeaea; color:#c0392b; }
.s-pg { background:#eaf5ea; color:#1e8449; }
.s-pl { background:#eaf0fb; color:#2471a3; }
.s-et { background:#fef5e7; color:#d68910; }
.s-ec { background:#fdf0e0; color:#e67e22; }
.s-re { background:#e8f8f2; color:#148f77; }
.s-nd { background:var(--sand); color:var(--ink4); }

/* ── STATUS SELECT ──────────────────────────── */
.ssel {
  padding:3px 7px; border:1px solid var(--sand2); border-radius:6px;
  font-size:.71rem; background:var(--white); color:var(--ink); cursor:pointer; outline:none;
  font-family:var(--font);
}
.ssel:focus { border-color:var(--g4); }

/* ── AGENDA CARDS ───────────────────────────── */
.ag-card {
  background:var(--white); border-radius:var(--r12); border:1px solid var(--sand2);
  padding:1rem 1.1rem; margin-bottom:10px; display:flex; gap:14px; align-items:flex-start;
  box-shadow:var(--sh1); transition:.15s;
}
.ag-card:hover { box-shadow:var(--sh2); }
.ag-date-box {
  flex-shrink:0; background:var(--g8); border-radius:var(--r8); padding:.5rem .7rem;
  text-align:center; border:1px solid var(--g7); min-width:48px;
}
.ag-day { font-size:1.3rem; font-weight:800; color:var(--g2); line-height:1; font-variant-numeric:tabular-nums; }
.ag-mon { font-size:.6rem; font-weight:600; color:var(--g4); text-transform:uppercase; letter-spacing:.05em; margin-top:1px; }
.ag-info { flex:1; }
.ag-title-row { display:flex; align-items:center; gap:8px; margin-bottom:4px; }
.ag-title { font-size:.88rem; font-weight:600; color:var(--ink); }
.ag-meta { font-size:.72rem; color:var(--ink3); }
.ag-past { opacity:.45; }
.type-chip { font-size:.65rem; font-weight:600; padding:2px 8px; border-radius:10px; }
.tc-bureau { background:#eef4ff; color:#2471a3; }
.tc-commission { background:#f0f9f4; color:#1e8449; }
.tc-conseil { background:#fef9ef; color:#d68910; }
.tc-autre { background:var(--sand); color:var(--ink3); }

/* ── DOC CARDS ──────────────────────────────── */
.dc-card {
  background:var(--white); border-radius:var(--r12); border:1px solid var(--sand2);
  padding:1rem 1.1rem; margin-bottom:10px; display:flex; gap:14px; align-items:flex-start;
  box-shadow:var(--sh1);
}
.dc-icon { width:42px; height:42px; border-radius:var(--r8); background:var(--g8); border:1px solid var(--g7); display:flex; align-items:center; justify-content:center; font-size:1.2rem; flex-shrink:0; }

/* ── NOTIF ITEMS ────────────────────────────── */
.nt-item {
  display:flex; align-items:center; gap:12px; padding:.65rem .85rem;
  background:var(--white); border-radius:var(--r8); border:1px solid var(--sand2);
  margin-bottom:6px; font-size:.78rem; box-shadow:var(--sh1);
}
.nt-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.nt-txt { flex:1; }
.nt-time { font-size:.66rem; color:var(--ink4); white-space:nowrap; font-family:var(--mono); }

/* ── FORMS ──────────────────────────────────── */
.form-card { background:var(--white); border-radius:var(--r12); border:1px solid var(--sand2); padding:1.5rem; box-shadow:var(--sh1); max-width:580px; }
.ff { margin-bottom:.85rem; }
.ff label { display:block; font-size:.71rem; font-weight:700; color:var(--ink2); margin-bottom:.35rem; text-transform:uppercase; letter-spacing:.05em; }
.finput {
  width:100%; padding:8px 11px; border:1.5px solid var(--sand2); border-radius:var(--r8);
  font-size:.8rem; color:var(--ink); background:var(--white); outline:none;
  font-family:var(--font); transition:.15s; line-height:1.4;
}
.finput:focus { border-color:var(--g4); box-shadow:0 0 0 3px rgba(74,124,107,.12); }
textarea.finput { resize:vertical; min-height:90px; }
.fr2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }

/* ── BUTTONS ────────────────────────────────── */
.btn {
  display:inline-flex; align-items:center; gap:6px; padding:7px 16px; border-radius:var(--r8);
  font-size:.78rem; font-weight:600; cursor:pointer; border:1.5px solid transparent;
  font-family:var(--font); transition:all .15s; text-decoration:none;
}
.btn-primary { background:var(--g2); color:#fff; border-color:var(--g2); }
.btn-primary:hover { background:var(--g1); border-color:var(--g1); }
.btn-secondary { background:var(--white); color:var(--ink2); border-color:var(--sand2); }
.btn-secondary:hover { background:var(--sand); }
.btn-ghost { background:transparent; color:var(--ink3); border-color:transparent; }
.btn-ghost:hover { background:var(--sand); color:var(--ink); }
.btn-danger { background:#fdeaea; color:#c0392b; border-color:#f5c6c6; }
.btn-danger:hover { background:#f5c6c6; }
.btn-sm { padding:4px 10px; font-size:.71rem; }

/* ── MODAL ──────────────────────────────────── */
.overlay {
  display:none; position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:500;
  align-items:center; justify-content:center; backdrop-filter:blur(2px);
}
.overlay.open { display:flex; }
.modal {
  background:var(--white); border-radius:var(--r16); padding:1.75rem; width:min(520px,92vw);
  max-height:88vh; overflow-y:auto; box-shadow:0 24px 64px rgba(0,0,0,.18);
  animation:modalIn .2s ease;
}
@keyframes modalIn { from{opacity:0;transform:scale(.96)translateY(8px)} to{opacity:1;transform:none} }
.modal-hd { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; }
.modal-hd h3 { font-size:1rem; font-weight:700; color:var(--ink); }
.modal-close { background:none; border:none; cursor:pointer; color:var(--ink3); font-size:1.3rem; border-radius:var(--r8); padding:2px 7px; }
.modal-close:hover { background:var(--sand); }
.modal-ft { display:flex; gap:8px; justify-content:flex-end; margin-top:1.5rem; padding-top:1.1rem; border-top:1px solid var(--sand2); }

/* ── COMMISSION DETAIL ──────────────────────── */
.cdet-banner {
  border-radius:var(--r16); padding:1.5rem 1.75rem; color:#fff;
  display:flex; align-items:center; gap:1.25rem; margin-bottom:1.25rem;
  box-shadow:var(--sh2);
}
.cdet-icon { width:52px; height:52px; background:rgba(255,255,255,.15); border-radius:var(--r12); display:flex; align-items:center; justify-content:center; font-size:1.4rem; border:1px solid rgba(255,255,255,.2); flex-shrink:0; }
.cdet-info h2 { font-size:1.1rem; font-weight:700; margin-bottom:.25rem; }
.cdet-info p { font-size:.78rem; opacity:.7; }
.cdet-kpis { display:flex; gap:12px; margin-bottom:1.25rem; flex-wrap:wrap; }
.cdet-kpi { background:var(--white); border-radius:var(--r12); border:1px solid var(--sand2); padding:.85rem 1.1rem; flex:1; min-width:110px; box-shadow:var(--sh1); }
.cdet-kpi-v { font-size:1.7rem; font-weight:700; color:var(--g2); line-height:1; }
.cdet-kpi-l { font-size:.68rem; color:var(--ink3); margin-top:4px; text-transform:uppercase; letter-spacing:.05em; font-weight:600; }

/* ── TOAST ──────────────────────────────────── */
.toast {
  position:fixed; bottom:24px; right:24px; background:var(--g1); color:#fff;
  padding:11px 20px; border-radius:var(--r12); font-size:.8rem; font-weight:500;
  z-index:1000; display:none; box-shadow:var(--sh3);
  animation:toastIn .22s ease; border:1px solid rgba(255,255,255,.12);
}
@keyframes toastIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }

/* ── HELP GRID ──────────────────────────────── */
.help-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.help-item {
  display:flex; gap:11px; padding:.9rem; background:var(--sand); border-radius:var(--r8);
  border:1px solid var(--sand2);
}
.help-ico { width:36px; height:36px; border-radius:var(--r8); display:flex; align-items:center; justify-content:center; font-size:1rem; flex-shrink:0; background:var(--white); border:1px solid var(--sand2); }

/* ── RESPONSIVE ─────────────────────────────── */
@media(max-width:900px){
  .sidebar { display:none; }
  .charts-row { grid-template-columns:1fr; }
  .comm-grid { grid-template-columns:1fr; }
  .help-grid { grid-template-columns:1fr; }
  .fr2 { grid-template-columns:1fr; }
  .kpi-grid { grid-template-columns:repeat(3,1fr); }
}
</style>
</head>
<body>

<!-- ░░ TOPBAR ░░ -->
<div class="topbar">
  <div class="tb-logo">
    <div class="tb-logo-icon">VM</div>
    <div>
      <span class="tb-logo-text">Vizille en Mouvement</span>
      <span class="tb-logo-sub">Espace élus — Mandat 2026–2032</span>
    </div>
  </div>
  <div class="tb-sep"></div>
  <span class="tb-date">${today}</span>
  <div class="tb-user" title="Michel T.">MT</div>
</div>

<!-- ░░ LAYOUT ░░ -->
<div class="layout">

<!-- ░░ SIDEBAR ░░ -->
<aside class="sidebar">
  <div class="sb-section">Tableau de bord</div>
  <div class="sb-item active" onclick="gp('accueil',this)"><span class="sb-icon">🏠</span>Accueil</div>

  <div class="sb-section">Projets du mandat</div>
  <div class="sb-item" onclick="gp('global',this)"><span class="sb-icon">📊</span>Gestion globale<span class="sb-badge" id="sb-tot">91</span></div>
  <div class="sb-item" onclick="gp('comm',this)"><span class="sb-icon">👥</span>Par commission</div>

  <div class="sb-section">Collaboration</div>
  <div class="sb-item" onclick="gp('agenda',this)"><span class="sb-icon">📅</span>Agenda des réunions</div>
  <div class="sb-item" onclick="gp('docs',this)"><span class="sb-icon">📄</span>Documents partagés</div>
  <div class="sb-item" onclick="gp('hist',this)"><span class="sb-icon">🔔</span>Historique</div>
  <div class="sb-item" onclick="gp('creer',this)"><span class="sb-icon">✚</span>Nouveau projet</div>

  <div class="sb-section">Outils</div>
  <div class="sb-item" onclick="gp('budget',this)"><span class="sb-icon">📈</span>Budget</div>
  <div class="sb-item" onclick="gp('elec',this)"><span class="sb-icon">🗳</span>Élections</div>
  <div class="sb-item" onclick="gp('comms',this)"><span class="sb-icon">✍</span>Communications IA</div>

  <div class="sb-footer">
    elus.vizilleenmouvement.fr<br>
    Node.js · Infomaniak
  </div>
</aside>

<!-- ░░ MAIN ░░ -->
<main class="main">

<!-- ─── ACCUEIL ─────────────────────────────── -->
<div class="page active" id="p-accueil">
  <div class="page-head">
    <div class="ph-icon" style="background:var(--g8)">🏛</div>
    <div><div class="ph-title">Tableau de bord</div><div class="ph-sub">Vue d'ensemble du mandat 2026–2032</div></div>
  </div>
  <div class="content">
    <div class="hero">
      <div class="hero-icon">🏛</div>
      <div class="hero-content">
        <div class="hero-title">Bienvenue, espace élus</div>
        <div class="hero-sub">Vizille en Mouvement — 29 conseillers élus le 15 mars 2026.<br>Ce tableau de bord est réservé aux membres du conseil municipal.</div>
      </div>
    </div>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-val" id="a-tot">91</div><div class="kpi-lbl">Projets au programme</div></div>
      <div class="kpi"><div class="kpi-val">12</div><div class="kpi-lbl">Commissions</div></div>
      <div class="kpi"><div class="kpi-val">29</div><div class="kpi-lbl">Conseillers élus</div></div>
      <div class="kpi"><div class="kpi-val" id="a-pr">0</div><div class="kpi-lbl">Prioritaires</div></div>
      <div class="kpi"><div class="kpi-val" id="a-26">0</div><div class="kpi-lbl">Projets 2026</div></div>
      <div class="kpi"><div class="kpi-val" id="a-re">0</div><div class="kpi-lbl">Réalisés</div></div>
    </div>
    <div class="charts-row">
      <div class="chart-card">
        <div class="chart-card-title">Projets par thème</div>
        <div class="chart-wrap"><canvas id="chT"></canvas></div>
      </div>
      <div class="chart-card">
        <div class="chart-card-title">Répartition par statut</div>
        <div class="chart-wrap"><canvas id="chS"></canvas></div>
      </div>
    </div>
    <div class="chart-card" style="margin-bottom:1.25rem">
      <div class="chart-card-title" style="margin-bottom:1rem">Mode d'emploi</div>
      <div class="help-grid">
        <div class="help-item"><div class="help-ico">📊</div><div><strong style="font-size:.78rem;display:block;margin-bottom:2px">Gestion globale</strong><span style="font-size:.72rem;color:var(--ink3);line-height:1.4;display:block">Tous les projets avec filtres cascade commission → thème → statut. Mise à jour directe.</span></div></div>
        <div class="help-item"><div class="help-ico">👥</div><div><strong style="font-size:.78rem;display:block;margin-bottom:2px">Par commission</strong><span style="font-size:.72rem;color:var(--ink3);line-height:1.4;display:block">12 cartes avec avancement. Clic → page dédiée avec stats et tableau filtré.</span></div></div>
        <div class="help-item"><div class="help-ico">📅</div><div><strong style="font-size:.78rem;display:block;margin-bottom:2px">Agenda</strong><span style="font-size:.72rem;color:var(--ink3);line-height:1.4;display:block">Réunions bureau, commissions, conseil municipal. Ajout et suppression.</span></div></div>
        <div class="help-item"><div class="help-ico">📄</div><div><strong style="font-size:.78rem;display:block;margin-bottom:2px">Documents</strong><span style="font-size:.72rem;color:var(--ink3);line-height:1.4;display:block">Liens kDrive / Google Drive centralisés. CR, délibérations, rapports.</span></div></div>
        <div class="help-item"><div class="help-ico">✍</div><div><strong style="font-size:.78rem;display:block;margin-bottom:2px">Communications IA</strong><span style="font-size:.72rem;color:var(--ink3);line-height:1.4;display:block">Rédacteur Claude AI — arrêtés, délibérations, posts Facebook, discours.</span></div></div>
        <div class="help-item"><div class="help-ico">🔒</div><div><strong style="font-size:.78rem;display:block;margin-bottom:2px">Accès sécurisé</strong><span style="font-size:.72rem;color:var(--ink3);line-height:1.4;display:block">URL : elus.vizilleenmouvement.fr — mot de passe : <code style="font-family:var(--mono);background:var(--sand2);padding:0 4px;border-radius:3px">vizille2026</code></span></div></div>
      </div>
    </div>
  </div>
</div>

<!-- ─── GESTION GLOBALE ───────────────────────── -->
<div class="page" id="p-global">
  <div class="page-head">
    <div class="ph-icon" style="background:#eaf0fb">📊</div>
    <div><div class="ph-title">Gestion globale des projets</div><div class="ph-sub">Mise à jour des statuts en temps réel — tous les projets du mandat</div></div>
    <div class="ph-actions">
      <button class="btn btn-secondary btn-sm" onclick="gp('comm',qs('.sb-item:nth-child(6)'))">👥 Par commission</button>
    </div>
  </div>
  <div class="content" style="padding:0">
    <div class="filter-bar">
      <select class="fsel" id="fC" onchange="fG()"><option value="">Toutes commissions</option></select>
      <select class="fsel" id="fT" onchange="fG()"><option value="">Tous thèmes</option></select>
      <select class="fsel" id="fS" onchange="fG()"><option value="">Tous statuts</option></select>
      <select class="fsel" id="fA" onchange="fG()"><option value="">Toutes années</option></select>
      <input class="fsrch" id="fQ" placeholder="🔍  Rechercher un projet..." oninput="fG()">
      <span class="fcnt" id="fCnt"></span>
    </div>
    <div class="table-box" style="border-radius:0;border-left:none;border-right:none;border-bottom:none">
      <table>
        <thead><tr>
          <th>Commission</th><th>Projet</th><th>Statut actuel</th><th>Année</th><th>Imp.</th><th>Modifier</th>
        </tr></thead>
        <tbody id="g-tb"></tbody>
      </table>
    </div>
  </div>
</div>

<!-- ─── PAR COMMISSION ─────────────────────────── -->
<div class="page" id="p-comm">
  <div class="page-head">
    <div class="ph-icon" style="background:var(--g8)">👥</div>
    <div><div class="ph-title">Par commission</div><div class="ph-sub">Cliquez sur une commission pour accéder à sa page de gestion dédiée</div></div>
    <div class="ph-actions">
      <button class="btn btn-secondary btn-sm" onclick="gp('global',qs('.sb-item:nth-child(5)'))">📊 Vue globale</button>
    </div>
  </div>
  <div class="content"><div class="comm-grid" id="cg"></div></div>
</div>

<!-- ─── DÉTAIL COMMISSION ──────────────────────── -->
<div class="page" id="p-cdet">
  <div class="page-head" id="cdet-ph">
    <div class="ph-icon" style="background:var(--g8)" id="cdet-ico">📋</div>
    <div><div class="ph-title" id="cdet-title">Commission</div><div class="ph-sub" id="cdet-sub"></div></div>
    <div class="ph-actions">
      <button class="btn btn-secondary btn-sm" onclick="gp('comm',qs('.sb-item:nth-child(6)'))">← Toutes les commissions</button>
    </div>
  </div>
  <div class="content" style="padding:0">
    <div style="padding:1.1rem 1.5rem;background:var(--white);border-bottom:1px solid var(--sand2)">
      <div id="cdet-banner" class="cdet-banner" style="margin-bottom:1rem"></div>
      <div class="cdet-kpis" id="cdet-kpis"></div>
    </div>
    <div class="filter-bar">
      <select class="fsel" id="cd-st" onchange="fCD()"><option value="">Tous statuts</option></select>
      <input class="fsrch" id="cd-q" placeholder="🔍  Rechercher..." oninput="fCD()">
      <span class="fcnt" id="cd-cnt"></span>
    </div>
    <div class="table-box" style="border-radius:0;border-left:none;border-right:none;border-bottom:none">
      <table>
        <thead><tr><th>Thème</th><th>Projet</th><th>Statut</th><th>Année</th><th>Imp.</th><th>Modifier</th></tr></thead>
        <tbody id="cd-tb"></tbody>
      </table>
    </div>
  </div>
</div>

<!-- ─── AGENDA ─────────────────────────────────── -->
<div class="page" id="p-agenda">
  <div class="page-head">
    <div class="ph-icon" style="background:#eef4ff">📅</div>
    <div><div class="ph-title">Agenda des réunions</div><div class="ph-sub">Bureau municipal, commissions, conseil</div></div>
    <div class="ph-actions"><button class="btn btn-primary btn-sm" onclick="om('agenda')">+ Ajouter une réunion</button></div>
  </div>
  <div class="content"><div id="ag-list"></div></div>
</div>

<!-- ─── DOCUMENTS ──────────────────────────────── -->
<div class="page" id="p-docs">
  <div class="page-head">
    <div class="ph-icon" style="background:var(--g8)">📄</div>
    <div><div class="ph-title">Documents partagés</div><div class="ph-sub">CR, délibérations, rapports — liens centralisés</div></div>
    <div class="ph-actions"><button class="btn btn-primary btn-sm" onclick="om('doc')">+ Ajouter un document</button></div>
  </div>
  <div class="content"><div id="dc-list"></div></div>
</div>

<!-- ─── HISTORIQUE ─────────────────────────────── -->
<div class="page" id="p-hist">
  <div class="page-head">
    <div class="ph-icon" style="background:#fff8e8">🔔</div>
    <div><div class="ph-title">Historique des modifications</div><div class="ph-sub">Journal de toutes les mises à jour de statut</div></div>
  </div>
  <div class="content"><div id="nt-list"></div></div>
</div>

<!-- ─── NOUVEAU PROJET ─────────────────────────── -->
<div class="page" id="p-creer">
  <div class="page-head">
    <div class="ph-icon" style="background:var(--g8)">✚</div>
    <div><div class="ph-title">Nouveau projet</div><div class="ph-sub">Ajouter un projet hors programme initial</div></div>
  </div>
  <div class="content">
    <div class="form-card">
      <div class="fr2" style="margin-bottom:0">
        <div class="ff" style="grid-column:1/-1"><label>Titre *</label><input class="finput" id="np-t" placeholder="Intitulé complet du projet"></div>
        <div class="ff"><label>Thème / Commission</label>
          <select class="finput" id="np-th"><option value="">-- Choisir --</option>
          <option>Mobilités</option><option>Tranquillité publique</option><option>Enfance/Jeunesse</option>
          <option>Travaux</option><option>Transition écologique</option><option>Urbanisme</option>
          <option>Culture</option><option>Patrimoine</option><option>Action sociale</option>
          <option>Animations de proximité</option><option>Concertation citoyenne</option>
          <option>Économie</option><option>Santé</option><option>Jumelages</option><option>Métropole</option>
          </select>
        </div>
        <div class="ff"><label>Statut initial</label>
          <select class="finput" id="np-s">
          <option>Programmé</option><option>Prioritaire</option><option>Planifié</option><option>En cours</option><option>Étude</option>
          </select>
        </div>
        <div class="ff"><label>Année prévue</label><input class="finput" id="np-a" placeholder="2026, 2027…"></div>
        <div class="ff"><label>Importance</label>
          <select class="finput" id="np-i">
          <option value="1">★ Faible</option><option value="2">★★ Normale</option><option value="3" selected>★★★ Haute</option>
          </select>
        </div>
        <div class="ff" style="grid-column:1/-1"><label>Résumé *</label><input class="finput" id="np-r" placeholder="Description courte (une ligne)"></div>
        <div class="ff" style="grid-column:1/-1"><label>Description détaillée</label><textarea class="finput" id="np-d" placeholder="Contexte, objectifs, étapes…"></textarea></div>
        <div class="ff" style="grid-column:1/-1"><label>Tags</label><input class="finput" id="np-tags" placeholder="Seniors, Accessibilité, Numérique… (séparés par virgules)"></div>
      </div>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:.5rem">
        <button class="btn btn-ghost" onclick="resetNP()">Réinitialiser</button>
        <button class="btn btn-primary" onclick="createP()">✓ Créer le projet</button>
      </div>
      <div id="np-res" style="margin-top:.85rem"></div>
    </div>
  </div>
</div>

<!-- ─── BUDGET ─────────────────────────────────── -->
<div class="page" id="p-budget">
  <div class="page-head">
    <div class="ph-icon" style="background:#eaf5ea">📈</div>
    <div><div class="ph-title">Budget comparatif</div><div class="ph-sub">Tableau de suivi budgétaire 2025–2026–2027</div></div>
    <div class="ph-actions">
      <label class="btn btn-primary btn-sm" style="cursor:pointer">📂 Importer CSV<input type="file" id="bf" accept=".csv" style="display:none" onchange="impB(this)"></label>
    </div>
  </div>
  <div class="content">
    <div style="background:var(--white);border-radius:var(--r12);border:1px solid var(--sand2);padding:1rem 1.25rem;margin-bottom:1rem;font-size:.78rem;color:var(--ink3)">
      <strong style="color:var(--ink2)">Format CSV attendu :</strong>
      <code style="font-family:var(--mono);background:var(--sand);padding:3px 8px;border-radius:4px;display:inline-block;margin-top:6px;font-size:.72rem">Poste,Budget2025,Budget2026,Prevision2027</code>
    </div>
    <div id="btable"></div>
  </div>
</div>

<!-- ─── ÉLECTIONS ──────────────────────────────── -->
<div class="page" id="p-elec">
  <div class="page-head">
    <div class="ph-icon" style="background:#fff8e8">🗳</div>
    <div><div class="ph-title">Élections municipales 2026</div><div class="ph-sub">Résultats du 15 mars et liens officiels</div></div>
  </div>
  <div class="content">
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px">
      <div style="background:var(--white);border-radius:var(--r12);border:1px solid var(--sand2);padding:1.1rem 1.25rem;box-shadow:var(--sh1)">
        <div style="font-size:.82rem;font-weight:700;margin-bottom:.85rem;color:var(--g2)">📋 Résultats mars 2026</div>
        <table style="font-size:.77rem;width:100%;border-collapse:collapse">
          <tr><td style="padding:6px 0;color:var(--ink3)">Tour 1 — 15 mars</td><td style="text-align:right"><span class="badge s-pg">Victoire VeM</span></td></tr>
          <tr><td style="padding:6px 0;color:var(--ink3)">Élus</td><td style="text-align:right;font-weight:700">29 conseillers</td></tr>
          <tr><td style="padding:6px 0;color:var(--ink3)">Maire</td><td style="text-align:right;font-weight:700">Catherine Troton</td></tr>
          <tr><td style="padding:6px 0;color:var(--ink3)">Votre position</td><td style="text-align:right;font-weight:700">#22 — Élu(e)</td></tr>
          <tr><td style="padding:6px 0;color:var(--ink3)">Commune</td><td style="text-align:right">Vizille — 38431</td></tr>
        </table>
      </div>
      <div style="background:var(--white);border-radius:var(--r12);border:1px solid var(--sand2);padding:1.1rem 1.25rem;box-shadow:var(--sh1)">
        <div style="font-size:.82rem;font-weight:700;margin-bottom:.85rem;color:var(--g2)">🔗 Liens officiels</div>
        <div style="display:flex;flex-direction:column;gap:7px">
          <a href="https://www.service-public.fr/particuliers/vosdroits/F1367" target="_blank" class="btn btn-secondary btn-sm" style="justify-content:center">Service-Public.fr</a>
          <a href="https://www.interieur.gouv.fr/Elections/Les-resultats/Municipales" target="_blank" class="btn btn-secondary btn-sm" style="justify-content:center">Résultats officiels</a>
          <a href="https://www.insee.fr/fr/statistiques/zones/3720885" target="_blank" class="btn btn-secondary btn-sm" style="justify-content:center">INSEE Vizille</a>
          <a href="https://www.amf.asso.fr" target="_blank" class="btn btn-secondary btn-sm" style="justify-content:center">AMF — Association des Maires</a>
          <a href="https://www.collectivites-locales.gouv.fr" target="_blank" class="btn btn-secondary btn-sm" style="justify-content:center">Collectivités-locales.gouv</a>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ─── COMMUNICATIONS ─────────────────────────── -->
<div class="page" id="p-comms">
  <div class="page-head">
    <div class="ph-icon" style="background:#f5f0fa">✍</div>
    <div><div class="ph-title">Rédacteur municipal assisté par IA</div><div class="ph-sub">Génération de documents avec Claude AI</div></div>
  </div>
  <div class="content">
    <div style="display:grid;grid-template-columns:1fr 1.3fr;gap:16px;align-items:start">
      <div class="form-card">
        <div class="ff"><label>Type de document</label>
          <select class="finput" id="ct">
            <option value="arrete">Arrêté municipal</option>
            <option value="deliberation">Délibération du conseil</option>
            <option value="facebook">Post Facebook / Réseaux sociaux</option>
            <option value="communique">Communiqué de presse</option>
            <option value="convocation">Convocation au conseil municipal</option>
            <option value="discours">Discours / Allocution</option>
          </select>
        </div>
        <div class="ff"><label>Sujet et instructions</label>
          <textarea class="finput" id="cs" style="height:140px" placeholder="Décrivez précisément le contenu souhaité…&#10;Ex: Arrêté portant interdiction de stationnement rue de la République du 25 au 30 mars pour travaux de voirie."></textarea>
        </div>
        <div class="ff"><label>Contexte (optionnel)</label>
          <input class="finput" id="cc" placeholder="Commune de Vizille, 5000 hab., Isère 38431">
        </div>
        <button class="btn btn-primary" style="width:100%" onclick="genC()">✨ Générer avec Claude</button>
        <div id="c-st" style="font-size:.72rem;color:var(--ink3);text-align:center;margin-top:.6rem;min-height:1.2rem"></div>
      </div>
      <div style="background:var(--white);border-radius:var(--r12);border:1px solid var(--sand2);padding:1.25rem;box-shadow:var(--sh1);display:flex;flex-direction:column;min-height:500px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.85rem;padding-bottom:.75rem;border-bottom:1px solid var(--sand2)">
          <span style="font-size:.82rem;font-weight:700;color:var(--ink2)">Document généré</span>
          <button class="btn btn-ghost btn-sm" onclick="copyC()">📋 Copier</button>
        </div>
        <textarea class="finput" id="cr" style="flex:1;min-height:420px;font-size:.77rem;line-height:1.7;background:var(--sand);border-color:transparent;resize:none" placeholder="Le document généré apparaîtra ici…"></textarea>
      </div>
    </div>
  </div>
</div>

</main>
</div><!-- /.layout -->

<!-- ░░ MODALES ░░ -->
<div class="overlay" id="ov-agenda">
  <div class="modal">
    <div class="modal-hd"><h3>📅 Ajouter une réunion</h3><button class="modal-close" onclick="cm()">×</button></div>
    <div class="ff"><label>Titre *</label><input class="finput" id="ag-ti" placeholder="Ex : Bureau municipal — ordre du jour Q2"></div>
    <div class="fr2">
      <div class="ff"><label>Date</label><input class="finput" type="date" id="ag-d"></div>
      <div class="ff"><label>Heure</label><input class="finput" id="ag-h" placeholder="18h30"></div>
    </div>
    <div class="ff"><label>Lieu</label><input class="finput" id="ag-l" placeholder="Salle du conseil, Mairie de Vizille…"></div>
    <div class="ff"><label>Type de réunion</label>
      <select class="finput" id="ag-ty">
        <option value="bureau">Bureau municipal</option>
        <option value="commission">Commission thématique</option>
        <option value="conseil">Conseil municipal</option>
        <option value="autre">Autre</option>
      </select>
    </div>
    <div class="ff"><label>Notes / Ordre du jour</label><textarea class="finput" id="ag-n" placeholder="Points à l'ordre du jour, informations pratiques…"></textarea></div>
    <div class="modal-ft">
      <button class="btn btn-ghost" onclick="cm()">Annuler</button>
      <button class="btn btn-primary" onclick="svAg()">Enregistrer la réunion</button>
    </div>
  </div>
</div>

<div class="overlay" id="ov-doc">
  <div class="modal">
    <div class="modal-hd"><h3>📄 Ajouter un document</h3><button class="modal-close" onclick="cm()">×</button></div>
    <div class="ff"><label>Titre *</label><input class="finput" id="dc-ti" placeholder="Nom du document"></div>
    <div class="fr2">
      <div class="ff"><label>Type</label>
        <select class="finput" id="dc-ty">
          <option value="cr">Compte-rendu</option>
          <option value="delib">Délibération</option>
          <option value="rapport">Rapport</option>
          <option value="autre">Autre</option>
        </select>
      </div>
      <div class="ff"><label>Date</label><input class="finput" type="date" id="dc-d"></div>
    </div>
    <div class="ff"><label>Lien (kDrive, Google Drive, URL…)</label><input class="finput" type="url" id="dc-u" placeholder="https://kdrive.infomaniak.com/…"></div>
    <div class="ff"><label>Description</label><textarea class="finput" id="dc-n" placeholder="Résumé, contexte, notes…"></textarea></div>
    <div class="modal-ft">
      <button class="btn btn-ghost" onclick="cm()">Annuler</button>
      <button class="btn btn-primary" onclick="svDc()">Enregistrer</button>
    </div>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
var COMM=${COMM_JSON};
var ICONS=${ICONS_JSON};
var REFS=${REFS_JSON};
var COLS=${COLORS_JSON};
var GRADS=${GRADS_JSON};
var SLIST=["Prioritaire","Programmé","Planifié","Étude","En cours","Réalisé","Suspendu"];
var P=[],ST={},AG=[],DC=[],NF=[],_ci=0,chT=null,chS=null;
var _auth='Basic '+btoa(':vizille2026');

function qs(s){return document.querySelector(s);}
function qsa(s){return document.querySelectorAll(s);}
function gel(id){return document.getElementById(id);}
function v(id){var e=gel(id);return e?e.value:'';}
function el(id,val){var e=gel(id);if(e)e.textContent=val;}
function aPost(u,d){return fetch(u,{method:'POST',headers:{'Content-Type':'application/json','Authorization':_auth},body:JSON.stringify(d)}).then(r=>r.json());}
function aDel(u){return fetch(u,{method:'DELETE',headers:{'Authorization':_auth}}).then(r=>r.json());}
function toast(m,dur=2500){var t=gel('toast');t.textContent=m;t.style.display='block';setTimeout(()=>{t.style.display='none';},dur);}
function om(t){gel('ov-'+t).classList.add('open');}
function cm(){qsa('.overlay').forEach(o=>o.classList.remove('open'));}
qsa('.overlay').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)cm();}));

function init(){
  fetch('/api/all',{headers:{Authorization:_auth}}).then(r=>r.json()).then(d=>{
    P=d.projets;ST=d.statuts;AG=d.agenda;DC=d.documents;NF=d.notifs;
    bFilters();fG();bCG();bCharts();updMeta();
  });
}

function updMeta(){
  var pr=0,n26=0,re=0;
  P.forEach(p=>{var s=ST[p.id]||p.statut||'';if(s==='Prioritaire')pr++;if(p.annee===2026)n26++;if(s.toLowerCase().indexOf('alis')>=0||s.toLowerCase().indexOf('alise')>=0)re++;});
  el('a-tot',P.length);el('a-pr',pr);el('a-26',n26);el('a-re',re);el('sb-tot',P.length);
}

function gp(id,ni){
  qsa('.page').forEach(p=>p.classList.remove('active'));
  qsa('.sb-item').forEach(n=>n.classList.remove('active'));
  var pg=gel('p-'+id);if(pg)pg.classList.add('active');
  if(ni)ni.classList.add('active');
  if(id==='agenda')rAg();
  else if(id==='docs')rDc();
  else if(id==='hist')rNt();
  else if(id==='comm')bCG();
}

function bc(s){if(!s)return 's-nd';var l=s.toLowerCase();if(l.indexOf('prioritaire')>=0)return 's-pr';if(l.indexOf('programm')>=0)return 's-pg';if(l.indexOf('planifi')>=0)return 's-pl';if(l.indexOf('cours')>=0)return 's-ec';if(l.indexOf('tude')>=0)return 's-et';if(l.indexOf('alis')>=0)return 's-re';return 's-nd';}
function imp(n){return n?'<span style="color:#d4a700">'+('★'.repeat(n))+'</span>':'-';}
function t2c(t){for(var c in COMM){if(COMM[c].indexOf(t)>=0)return c;}return 'Autre';}

function bFilters(){
  var th={},st={},an={};
  P.forEach(p=>{th[p.theme||'?']=1;st[ST[p.id]||p.statut||'ND']=1;an[p.annee?String(p.annee):'?']=1;});
  fSel('fC',Object.keys(COMM),'Toutes commissions');
  fSel('fT',Object.keys(th).sort(),'Tous thèmes');
  fSel('fS',Object.keys(st).sort(),'Tous statuts');
  fSel('fA',Object.keys(an).sort(),'Toutes années');
  fSel('cd-st',SLIST,'Tous statuts');
}
function fSel(id,opts,def){var s=gel(id);if(!s)return;s.innerHTML='<option value="">'+def+'</option>';opts.forEach(o=>{var op=document.createElement('option');op.value=o;op.textContent=o;s.appendChild(op);});}

function fG(){
  var c=v('fC'),t=v('fT'),s=v('fS'),a=v('fA'),q=v('fQ').toLowerCase();
  var r=P.filter(p=>{var ps=ST[p.id]||p.statut||'ND',pa=p.annee?String(p.annee):'?',pc=t2c(p.theme);return(!c||pc===c)&&(!t||p.theme===t)&&(!s||ps===s)&&(!a||pa===a)&&(!q||(p.titre||'').toLowerCase().indexOf(q)>=0||(p.resume||'').toLowerCase().indexOf(q)>=0);});
  el('fCnt',r.length+' projet(s)');
  rTb('g-tb',r,true);
}

function rTb(bid,rows,showC){
  var tb=gel(bid);if(!tb)return;
  tb.innerHTML=rows.map(p=>{
    var st=ST[p.id]||p.statut||'ND';
    var opts=SLIST.map(sv=>'<option value="'+sv+'"'+(st===sv?' selected':'')+'>'+sv+'</option>').join('');
    var c1=showC
      ?'<td><span class="comm-chip">'+t2c(p.theme||'')+'</span><br><span style="font-size:.66rem;color:var(--ink4);margin-top:2px;display:block">'+(p.theme||'—')+'</span></td>'
      :'<td style="font-size:.73rem;color:var(--ink3)">'+(p.theme||'—')+'</td>';
    return '<tr>'+c1+'<td><div class="pname">'+(p.titre||'—')+'</div><div class="presume">'+(p.resume||'')+'</div></td><td><span class="badge '+bc(st)+'">'+st+'</span></td><td style="color:var(--ink3);font-family:var(--mono);font-size:.73rem">'+(p.annee||'—')+'</td><td>'+imp(p.importance)+'</td><td><select class="ssel" data-pid="'+p.id+'" data-t="'+p.titre.replace(/"/g,'&quot;')+'" onchange="uSt(+this.dataset.pid,this.value,this.dataset.t)">'+opts+'</select></td></tr>';
  }).join('');
}

function bCG(){
  var ks=Object.keys(COMM);
  gel('cg').innerHTML=ks.map((comm,idx)=>{
    var pp=P.filter(p=>COMM[comm].indexOf(p.theme)>=0);
    var to=pp.length,pr=0,ec=0,re=0;
    pp.forEach(p=>{var s=ST[p.id]||p.statut||'';if(s==='Prioritaire')pr++;if(s.indexOf('cours')>=0)ec++;if(s.indexOf('alis')>=0)re++;});
    var pct=to?Math.round(re/to*100):0;
    var grad=GRADS[idx%GRADS.length];
    var ref=REFS[comm]||'';
    return '<div class="cc" onclick="showCD('+idx+')">'
      +'<div class="cc-banner" style="background:'+grad+'">'
      +'<div class="cc-banner-icon">'+(ICONS[comm]||'📋')+'</div>'
      +(ref?'<span class="cc-banner-ref">'+ref+'</span>':'')
      +'<span class="cc-chevron">›</span>'
      +'</div>'
      +'<div class="cc-body">'
      +'<div class="cc-title">'+comm+'</div>'
      +'<div class="cc-themes">'+COMM[comm].join(' · ')+'</div>'
      +'<div class="cc-kpis">'
      +'<div class="cc-kpi"><div class="cc-kpi-v" style="color:var(--g2)">'+to+'</div><div class="cc-kpi-l">total</div></div>'
      +'<div class="cc-kpi"><div class="cc-kpi-v" style="color:#c0392b">'+pr+'</div><div class="cc-kpi-l">priorit.</div></div>'
      +'<div class="cc-kpi"><div class="cc-kpi-v" style="color:#e67e22">'+ec+'</div><div class="cc-kpi-l">en cours</div></div>'
      +'<div class="cc-kpi"><div class="cc-kpi-v" style="color:#148f77">'+re+'</div><div class="cc-kpi-l">réalisés</div></div>'
      +'</div>'
      +'<div class="cc-progress"><div class="cc-fill" style="width:'+pct+'%;background:'+COLS[idx%COLS.length]+'"></div></div>'
      +'<div class="cc-pct"><span>Avancement du programme</span><span>'+pct+'%</span></div>'
      +'</div></div>';
  }).join('');
}

function showCD(idx){
  _ci=idx;
  var comm=Object.keys(COMM)[idx],themes=COMM[comm],ref=REFS[comm]||'',icon=ICONS[comm]||'📋',grad=GRADS[idx%GRADS.length];
  var pp=P.filter(p=>themes.indexOf(p.theme)>=0);
  var to=pp.length,pr=0,ec=0,re=0;
  pp.forEach(p=>{var s=ST[p.id]||p.statut||'';if(s==='Prioritaire')pr++;if(s.indexOf('cours')>=0)ec++;if(s.indexOf('alis')>=0)re++;});
  var pct=to?Math.round(re/to*100):0;
  gel('cdet-ico').textContent=icon;
  el('cdet-title',comm);
  el('cdet-sub',themes.join(' · ')+(ref?' — Référent·e : '+ref:''));
  gel('cdet-banner').innerHTML='<div class="cdet-icon">'+icon+'</div><div class="cdet-info"><h2>'+comm+'</h2><p>'+themes.join(' · ')+(ref?' — Référent·e : '+ref:'')+'</p></div>';
  gel('cdet-banner').style.background=grad;
  gel('cdet-kpis').innerHTML=
    '<div class="cdet-kpi"><div class="cdet-kpi-v">'+to+'</div><div class="cdet-kpi-l">Projets</div></div>'+
    '<div class="cdet-kpi"><div class="cdet-kpi-v" style="color:#c0392b">'+pr+'</div><div class="cdet-kpi-l">Prioritaires</div></div>'+
    '<div class="cdet-kpi"><div class="cdet-kpi-v" style="color:#e67e22">'+ec+'</div><div class="cdet-kpi-l">En cours</div></div>'+
    '<div class="cdet-kpi"><div class="cdet-kpi-v" style="color:#148f77">'+re+'</div><div class="cdet-kpi-l">Réalisés</div></div>'+
    '<div class="cdet-kpi"><div class="cdet-kpi-v" style="color:var(--g2)">'+pct+'%</div><div class="cdet-kpi-l">Avancement</div></div>';
  gel('cd-st').value='';gel('cd-q').value='';
  qsa('.page').forEach(p=>p.classList.remove('active'));
  qsa('.sb-item').forEach(n=>n.classList.remove('active'));
  gel('p-cdet').classList.add('active');
  fCD();
}

function fCD(){
  var comm=Object.keys(COMM)[_ci],themes=COMM[comm];
  var s=v('cd-st'),q=v('cd-q').toLowerCase();
  var r=P.filter(p=>{var ps=ST[p.id]||p.statut||'ND';return themes.indexOf(p.theme)>=0&&(!s||ps===s)&&(!q||(p.titre||'').toLowerCase().indexOf(q)>=0||(p.resume||'').toLowerCase().indexOf(q)>=0);});
  el('cd-cnt',r.length+' projet(s)');
  rTb('cd-tb',r,false);
}

function uSt(id,nst,titre){
  aPost('/api/statut',{id,statut:nst,titre}).then(d=>{
    if(d.ok){ST[id]=nst;NF.unshift(d.notif);fG();bCG();updMeta();bCharts();
    if(gel('p-cdet').classList.contains('active'))fCD();
    toast('✓ Statut mis à jour : '+nst);}
  });
}

function bCharts(){
  var th={},st={};
  P.forEach(p=>{var t=p.theme||'Autre';th[t]=(th[t]||0)+1;var s=ST[p.id]||p.statut||'ND';st[s]=(st[s]||0)+1;});
  var tk=Object.keys(th).sort(),tv=tk.map(k=>th[k]);
  var sk=Object.keys(st),sv=sk.map(k=>st[k]);
  var G=['#1a3a2a','#2e5e4e','#3d6b5a','#4a7c6b','#6b8f71','#8bae8f','#b0cdb4','#3a5a48','#5a8a70','#7aaa88','#9ac8a0','#c0d9c4','#2a4a38','#4a7a5a'];
  if(chT)chT.destroy();if(chS)chS.destroy();
  var et=gel('chT'),es=gel('chS');
  if(et)chT=new Chart(et,{type:'bar',data:{labels:tk,datasets:[{data:tv,backgroundColor:G,borderRadius:5,borderSkipped:false}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{font:{size:9},color:'#6a7270'}},y:{grid:{color:'rgba(0,0,0,.05)'},ticks:{stepSize:1,font:{size:9},color:'#6a7270'}}}}});
  if(es)chS=new Chart(es,{type:'doughnut',data:{labels:sk,datasets:[{data:sv,backgroundColor:['#c0392b','#1e8449','#2471a3','#d68910','#e67e22','#148f77','#9aA4a0'],borderWidth:2,borderColor:'#fff'}]},options:{responsive:true,maintainAspectRatio:false,cutout:'62%',plugins:{legend:{position:'bottom',labels:{font:{size:10},padding:10,usePointStyle:true,pointStyle:'circle'}}}}});
}

var MOIS=['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
var TCHIPS={bureau:'tc-bureau',commission:'tc-commission',conseil:'tc-conseil',autre:'tc-autre'};
var TLBLS={bureau:'Bureau municipal',commission:'Commission',conseil:'Conseil municipal',autre:'Autre'};
var DTYPES={cr:'Compte-rendu',delib:'Délibération',rapport:'Rapport',autre:'Autre'};

function rAg(){
  var now=new Date().toISOString().slice(0,10);
  var sorted=AG.slice().sort((a,b)=>a.date>b.date?1:-1);
  gel('ag-list').innerHTML=sorted.map(e=>{
    var past=e.date<now;
    return '<div class="ag-card'+(past?' ag-past':'')+'">'
      +'<div class="ag-date-box"><div class="ag-day">'+e.date.slice(8)+'</div><div class="ag-mon">'+MOIS[+e.date.slice(5,7)-1]+'</div></div>'
      +'<div class="ag-info"><div class="ag-title-row"><span class="ag-title">'+e.titre+'</span><span class="type-chip '+(TCHIPS[e.type]||'tc-autre')+'">'+TLBLS[e.type]+'</span></div>'
      +'<div class="ag-meta">'+(e.heure?'🕐 '+e.heure+'  ':'')+( e.lieu?'📍 '+e.lieu:'')+'</div>'
      +(e.notes?'<div style="font-size:.72rem;color:var(--ink3);margin-top:4px">'+e.notes+'</div>':'')+
      '</div>'
      +'<button class="btn btn-danger btn-sm" style="flex-shrink:0;align-self:flex-start" onclick="delAg('+e.id+')">×</button>'
      +'</div>';
  }).join('')||'<p style="color:var(--ink4);font-size:.82rem;padding:.5rem 0">Aucune réunion programmée. Cliquez sur « + Ajouter une réunion ».</p>';
}
function svAg(){aPost('/api/agenda',{titre:v('ag-ti'),date:v('ag-d'),heure:v('ag-h'),lieu:v('ag-l'),type:v('ag-ty'),notes:v('ag-n')}).then(d=>{if(d.ok){AG.push(d.item);cm();rAg();toast('✓ Réunion ajoutée');}});}
function delAg(id){if(!confirm('Supprimer cette réunion ?'))return;aDel('/api/agenda/'+id).then(d=>{if(d.ok){AG=AG.filter(a=>a.id!==id);rAg();toast('Supprimé');}});}

function rDc(){
  gel('dc-list').innerHTML=DC.map(d=>{
    return '<div class="dc-card">'
      +'<div class="dc-icon">📄</div>'
      +'<div style="flex:1"><a href="'+d.url+'" target="_blank" style="font-size:.88rem;font-weight:700;color:var(--g2);text-decoration:none">'+d.titre+'</a>'
      +'<div style="display:flex;align-items:center;gap:8px;margin-top:4px"><span class="badge s-pl" style="font-size:.63rem">'+(DTYPES[d.type]||d.type)+'</span><span style="font-size:.72rem;color:var(--ink3);font-family:var(--mono)">'+d.date+'</span></div>'
      +(d.notes?'<div style="font-size:.72rem;color:var(--ink3);margin-top:5px;line-height:1.4">'+d.notes+'</div>':'')+
      '</div>'
      +'<button class="btn btn-danger btn-sm" style="flex-shrink:0;align-self:flex-start" onclick="delDc('+d.id+')">×</button>'
      +'</div>';
  }).join('')||'<p style="color:var(--ink4);font-size:.82rem;padding:.5rem 0">Aucun document. Cliquez sur « + Ajouter un document ».</p>';
}
function svDc(){aPost('/api/document',{titre:v('dc-ti'),type:v('dc-ty'),url:v('dc-u'),date:v('dc-d'),notes:v('dc-n')}).then(d=>{if(d.ok){DC.push(d.item);cm();rDc();toast('✓ Document ajouté');}});}
function delDc(id){if(!confirm('Supprimer ce document ?'))return;aDel('/api/document/'+id).then(d=>{if(d.ok){DC=DC.filter(x=>x.id!==id);rDc();toast('Supprimé');}});}

function rNt(){
  gel('nt-list').innerHTML=NF.slice(0,100).map(n=>{
    return '<div class="nt-item"><div class="nt-dot" style="background:'+(n.new?'var(--g5)':'var(--ink4)')+'"></div>'
      +'<div class="nt-txt"><strong>'+n.titre+'</strong> &rarr; <span class="badge '+bc(n.statut)+'">'+n.statut+'</span></div>'
      +'<span class="nt-time">'+n.ts+'</span></div>';
  }).join('')||'<p style="color:var(--ink4);font-size:.82rem">Aucune modification enregistrée.</p>';
}

function createP(){
  var t=v('np-t').trim(),r=v('np-r').trim();
  if(!t||!r){toast('⚠ Titre et résumé obligatoires');return;}
  aPost('/api/projet',{titre:t,theme:v('np-th'),statut:v('np-s'),annee:v('np-a'),importance:v('np-i'),resume:r,description:v('np-d'),tags:v('np-tags')}).then(res=>{
    if(res.ok){P.push(res.projet);bFilters();fG();bCG();updMeta();bCharts();resetNP();
    gel('np-res').innerHTML='<div style="background:var(--g8);border-radius:var(--r8);padding:.75rem;font-size:.8rem;color:var(--g2);border:1px solid var(--g7)">✓ Projet créé : <strong>'+res.projet.titre+'</strong> — ID #'+res.projet.id+'</div>';
    toast('✓ Projet créé !');}
  });
}
function resetNP(){['np-t','np-r','np-d','np-tags','np-a'].forEach(i=>{var e=gel(i);if(e)e.value='';});gel('np-res').innerHTML='';}

function impB(inp){var f=inp.files[0];if(!f)return;var rd=new FileReader();rd.onload=function(e){var sep=String.fromCharCode(10);var lines=e.target.result.split(sep).filter(l=>l.trim());if(!lines.length)return;var hd=lines[0].split(',').map(h=>h.trim());var rows=lines.slice(1).map(l=>l.split(',').map(c=>c.trim()));var html='<div class="table-box"><table><thead><tr>'+hd.map((h,i)=>'<th style="text-align:'+(i>0?'right':'left')+'">'+h+'</th>').join('')+'</tr></thead><tbody>';rows.forEach(row=>{html+='<tr>'+row.map((cell,i)=>{var num=parseFloat(cell.replace(/[^0-9.-]/g,''));var fmt=(!isNaN(num)&&i>0)?new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(num):cell;var col='';if(i===2&&row[1]){var v1=parseFloat(row[1].replace(/[^0-9.-]/g,'')),v2=parseFloat(row[2].replace(/[^0-9.-]/g,''));if(!isNaN(v1)&&!isNaN(v2)){col=v2>v1?'color:#c0392b;font-weight:600':'color:#148f77;font-weight:600';}}return'<td style="text-align:'+(i>0?'right':'left')+';'+col+'">'+fmt+'</td>';}).join('')+'</tr>';});html+='</tbody></table></div>';gel('btable').innerHTML=html;toast('✓ Budget importé : '+rows.length+' lignes');};rd.readAsText(f);}

var PROMPTS={arrete:"Rédigez un arrêté municipal officiel pour la Commune de Vizille (Isère 38431). Numéro, visas CGCT, considérants, articles. Sujet : ",deliberation:"Rédigez une délibération du conseil municipal de Vizille. Objet, motifs, décision. Sujet : ",facebook:"Post Facebook pour Vizille en Mouvement. Ton chaleureux, emojis, 300 mots max. Sujet : ",communique:"Communiqué de presse Ville de Vizille. Titre, chapeau, corps, contact. Sujet : ",convocation:"Convocation conseil municipal Vizille art. L.2121-10 CGCT. Date, heure, lieu, ODJ. Sujet : ",discours:"Discours pour élu de Vizille. Ton sincère ancré dans le territoire 2026-2032. Sujet : "};
function genC(){var type=v('ct'),sujet=v('cs').trim(),ctx=v('cc')||'Commune de Vizille, 5000 habitants, Isère (38431), Maire : Catherine Troton, mandat 2026-2032';if(!sujet){toast('⚠ Indiquez le sujet');return;}el('c-st','⏳ Génération en cours…');gel('cr').value='';aPost('/api/genere',{type,sujet,contexte:ctx}).then(d=>{el('c-st','');if(d.ok){gel('cr').value=d.texte;toast('✓ Document généré');}else{gel('cr').value='Erreur : '+d.error;toast('⚠ '+d.error,4000);}}).catch(()=>{el('c-st','');toast('⚠ Erreur réseau');});}
function copyC(){var t=gel('cr');t.select();document.execCommand('copy');toast('Copié !');}

init();
</script>
</body>
</html>`;
}

const server = http.createServer(function(req, res) {
  const p = req.url.split('?')[0];
  const m = req.method;
  if(m==='OPTIONS'){res.writeHead(200,{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,DELETE','Access-Control-Allow-Headers':'Content-Type,Authorization'});return res.end();}
  if(!auth(req)) return deny(res);

  if(p==='/api/all') return jsonR(res,{projets,statuts,agenda,documents,notifs:notifs.slice(0,100)});

  if(p==='/api/statut'&&m==='POST') return body(req,function(err,d){
    if(err)return jsonR(res,{ok:false},400);
    const old=statuts[d.id]||'ND';
    statuts[d.id]=d.statut; save('statuts.json',statuts);
    const ts=new Date().toLocaleString('fr-FR');
    const notif={id:Date.now(),titre:d.titre,statut:d.statut,ancien:old,ts,new:true};
    notifs.unshift(notif); if(notifs.length>200)notifs=notifs.slice(0,200);
    save('notifs.json',notifs);
    return jsonR(res,{ok:true,notif});
  });

  if(p==='/api/agenda'&&m==='POST') return body(req,function(err,d){
    if(err)return jsonR(res,{ok:false},400);
    d.id=nextId(agenda); agenda.push(d); save('agenda.json',agenda);
    return jsonR(res,{ok:true,item:d});
  });
  if(p.match(/^\/api\/agenda\/\d+$/)&&m==='DELETE'){
    const id=parseInt(p.split('/').pop());
    agenda=agenda.filter(a=>a.id!==id); save('agenda.json',agenda); return jsonR(res,{ok:true});
  }

  if(p==='/api/document'&&m==='POST') return body(req,function(err,d){
    if(err)return jsonR(res,{ok:false},400);
    d.id=nextId(documents); documents.push(d); save('documents.json',documents);
    return jsonR(res,{ok:true,item:d});
  });
  if(p.match(/^\/api\/document\/\d+$/)&&m==='DELETE'){
    const id=parseInt(p.split('/').pop());
    documents=documents.filter(d=>d.id!==id); save('documents.json',documents); return jsonR(res,{ok:true});
  }

  if(p==='/api/projet'&&m==='POST') return body(req,function(err,d){
    if(err)return jsonR(res,{ok:false},400);
    const newId=projets.length?Math.max(...projets.map(x=>x.id||0))+1:9000;
    const projet={id:newId,titre:d.titre||'',theme:d.theme||'Autre',statut:d.statut||'Programmé',annee:d.annee?parseInt(d.annee):null,budget:0,resume:d.resume||'',description:d.description||'',importance:parseInt(d.importance)||2,chiffres:[],tags:d.tags?d.tags.split(',').map(t=>t.trim()).filter(Boolean):[],created:new Date().toISOString()};
    projets.push(projet); save('projets.json',projets);
    const notif={id:Date.now(),titre:projet.titre,statut:'CRÉÉ',ancien:'',ts:new Date().toLocaleString('fr-FR'),new:true};
    notifs.unshift(notif); save('notifs.json',notifs);
    return jsonR(res,{ok:true,projet});
  });

  if(p==='/api/genere'&&m==='POST') return body(req,function(err,d){
    if(err)return jsonR(res,{ok:false,error:'Données invalides'},400);
    const KEY=process.env.ANTHROPIC_API_KEY||'';
    if(!KEY)return jsonR(res,{ok:false,error:'Clé API Claude non configurée. Ajouter ANTHROPIC_API_KEY dans Infomaniak → Avancé → Variables d\'environnement.'});
    const prompts={arrete:'Rédigez un arrêté municipal officiel pour la Commune de Vizille (Isère 38431). Incluez : numéro, visas CGCT, considérants, articles. Sujet : ',deliberation:'Rédigez une délibération du conseil municipal de Vizille. Objet, motifs, décision. Sujet : ',facebook:'Post Facebook pour Vizille en Mouvement. Ton chaleureux, emojis, 300 mots max. Sujet : ',communique:'Communiqué de presse Ville de Vizille. Titre, chapeau, corps, contact. Sujet : ',convocation:'Convocation conseil municipal Vizille art. L.2121-10 CGCT. Date, heure, lieu, ODJ. Sujet : ',discours:'Discours pour élu de Vizille. Ton sincère et ancré dans le territoire. Sujet : '};
    const prompt=(prompts[d.type]||'')+(d.sujet||'')+' Contexte: '+(d.contexte||'Vizille Isère');
    const rb=JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1500,messages:[{role:'user',content:prompt}]});
    const opts={hostname:'api.anthropic.com',path:'/v1/messages',method:'POST',headers:{'Content-Type':'application/json','x-api-key':KEY,'anthropic-version':'2023-06-01','Content-Length':Buffer.byteLength(rb)}};
    const r2=https.request(opts,resp=>{let data='';resp.on('data',c=>data+=c);resp.on('end',()=>{try{const r=JSON.parse(data);return jsonR(res,{ok:true,texte:(r.content&&r.content[0]&&r.content[0].text)||''});}catch(e){return jsonR(res,{ok:false,error:'Erreur parsing Claude'});}});});
    r2.on('error',e=>jsonR(res,{ok:false,error:e.message}));
    r2.write(rb);r2.end();
  });

  if(p==='/'||p==='/dashboard'){res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});return res.end(buildPage());}
  res.writeHead(404);res.end('404');
});

server.listen(PORT,()=>{console.log('VeM Dashboard v5 port '+PORT+' — projets: '+projets.length);});
