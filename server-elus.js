const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PASSWORD = process.env.VEM_PASSWORD || 'vizille2026';
const DIR = __dirname;

function load(f, d) { try { return JSON.parse(fs.readFileSync(path.join(DIR,f),'utf8')); } catch(e) { return d; } }
function save(f, d) { fs.writeFileSync(path.join(DIR,f), JSON.stringify(d,null,2), 'utf8'); }

let projets  = load('projets.json', []);
let agenda   = load('agenda.json', []);
let documents= load('documents.json', []);
let statuts  = load('statuts.json', {});
let notifs   = load('notifs.json', []);
let notifEmails = (process.env.NOTIF_EMAILS||'').split(',').filter(Boolean);

console.log('projets.json charge: '+projets.length+' projets');

function auth(req) {
  const a=req.headers['authorization']||'';
  if(!a.startsWith('Basic ')) return false;
  return Buffer.from(a.slice(6),'base64').toString().split(':').slice(1).join(':')=== PASSWORD;
}
function deny(res) {
  res.writeHead(401,{'WWW-Authenticate':'Basic realm="VeM Elus"','Content-Type':'text/plain;charset=utf-8'});
  res.end('Espace reserve aux elus');
}
function json(res,d,c){ res.writeHead(c||200,{'Content-Type':'application/json;charset=utf-8','Access-Control-Allow-Origin':'*'}); res.end(JSON.stringify(d)); }
function body(req,cb){ var b=''; req.on('data',function(d){b+=d;if(b.length>2e6)req.destroy();}); req.on('end',function(){try{cb(null,JSON.parse(b));}catch(e){cb(e);}}); }
function nextId(a){ return a.length?Math.max.apply(null,a.map(function(i){return i.id||0;}))+1:1; }

function buildPage() {
  var today = new Date().toLocaleDateString('fr-FR');
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VeM - Espace elus</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"></script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#f4f4ef;color:#111}
header{background:#1a3a2a;color:#fff;padding:.85rem 2rem;display:flex;align-items:center;gap:12px;position:sticky;top:0;z-index:100}
.logo{width:34px;height:34px;background:#4a8a5a;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.85rem;flex-shrink:0}
header h1{font-size:.95rem;font-weight:500;flex:1}
header small{opacity:.6;font-size:.72rem}
nav{background:#1a3a2a;border-top:1px solid rgba(255,255,255,.1);display:flex;flex-wrap:wrap;padding:0 1rem}
nav button{background:none;border:none;color:rgba(255,255,255,.7);padding:.55rem .9rem;cursor:pointer;font-size:.78rem;border-bottom:2px solid transparent}
nav button.active,nav button:hover{color:#fff;border-bottom-color:#7ab87a}
.tab{display:none;padding:1.25rem 2rem 2rem;max-width:1100px}
.tab.active{display:block}
.metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:10px;margin-bottom:1.25rem}
.m{background:#fff;border-radius:10px;padding:.85rem 1rem;border:.5px solid #e0e0d8}
.m .v{font-size:1.7rem;font-weight:600;color:#1a3a2a}
.m .l{font-size:.68rem;color:#999;margin-top:2px}
.charts{display:grid;grid-template-columns:1.4fr 1fr;gap:14px;margin-bottom:1.25rem}
.cc{background:#fff;border-radius:10px;padding:1rem;border:.5px solid #e0e0d8}
.cc h3{font-size:.75rem;color:#666;margin-bottom:.75rem;font-weight:500}
.cw{position:relative;height:200px}
.fl{display:flex;gap:8px;margin-bottom:.85rem;flex-wrap:wrap;align-items:center}
.fl select,.fl input{padding:5px 8px;border:.5px solid #ddd;border-radius:6px;font-size:.75rem;background:#fff;outline:none}
table{width:100%;border-collapse:collapse;font-size:.76rem;background:#fff;border-radius:10px;overflow:hidden;border:.5px solid #e0e0d8}
th{background:#f0f0e8;padding:8px 10px;text-align:left;font-weight:500;color:#555;font-size:.72rem}
td{padding:7px 10px;border-top:.5px solid #f0f0e8;vertical-align:middle}
tr:hover td{background:#f8f8f4}
.b{display:inline-block;padding:1px 6px;border-radius:4px;font-size:.67rem;font-weight:500}
.b1{background:#fde8e8;color:#a33}.b2{background:#e8f0e8;color:#363}.b3{background:#e8eef8;color:#336}.b4{background:#fef3e2;color:#863}.b5{background:#f0f0e8;color:#666}.b6{background:#e8f8e8;color:#2a6}
.card{background:#fff;border-radius:10px;border:.5px solid #e0e0d8;padding:1.1rem;margin-bottom:12px}
.card h4{font-size:.85rem;font-weight:500;margin-bottom:.5rem;color:#1a3a2a}
.card p{font-size:.78rem;color:#666;line-height:1.5}
.meta{font-size:.7rem;color:#aaa;margin-top:.5rem}
.btn{display:inline-block;padding:5px 12px;border-radius:6px;font-size:.75rem;cursor:pointer;border:.5px solid #1a3a2a;background:#1a3a2a;color:#fff}
.btn:hover{background:#2a5a3a}
.btn-sm{padding:3px 8px;font-size:.7rem}
.btn-ghost{background:transparent;color:#1a3a2a;border-color:#ccc}
.btn-ghost:hover{background:#f0f0e8}
.btn-red{background:#a33;border-color:#a33;color:#fff}
.finput{width:100%;padding:6px 10px;border:.5px solid #ddd;border-radius:6px;font-size:.78rem;margin-bottom:8px;font-family:inherit}
textarea.finput{height:80px;resize:vertical}
select.finput{background:#fff}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.modal-bg{display:none;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:200;align-items:center;justify-content:center}
.modal-bg.open{display:flex}
.modal{background:#fff;border-radius:12px;padding:1.5rem;width:min(480px,90vw);max-height:85vh;overflow-y:auto}
.modal h3{font-size:1rem;font-weight:500;margin-bottom:1rem;color:#1a3a2a}
.notif-item{display:flex;align-items:center;gap:8px;padding:8px 12px;background:#fff;border-radius:8px;border:.5px solid #e0e0d8;margin-bottom:8px;font-size:.76rem}
.dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;background:#4a8a5a}
.dot.old{background:#ccc}
.ssel{padding:2px 6px;border:.5px solid #ddd;border-radius:4px;font-size:.7rem;background:#fff}
a{color:#336;text-decoration:none}
a:hover{text-decoration:underline}
.hero{background:#1a3a2a;color:#fff;border-radius:14px;padding:1.75rem;display:flex;align-items:center;gap:1.5rem;margin-bottom:1.25rem}
.hero-logo{width:56px;height:56px;background:#4a8a5a;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0}
.help-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:1rem}
.help-item{display:flex;gap:10px;align-items:flex-start}
.help-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0}
.toast{position:fixed;bottom:20px;right:20px;background:#1a3a2a;color:#fff;padding:10px 16px;border-radius:8px;font-size:.8rem;z-index:300;display:none}
@media(max-width:650px){.charts{grid-template-columns:1fr}.metrics{grid-template-columns:repeat(2,1fr)}.form-row{grid-template-columns:1fr}.help-grid{grid-template-columns:1fr}}
</style>
</head>
<body>
<header>
  <div class="logo">VM</div>
  <h1>Vizille en Mouvement &mdash; Espace &eacute;lus</h1>
  <small>${today}</small>
</header>
<nav>
  <button class="active" onclick="showTab('accueil',this)">&#127968; Accueil</button>
  <button onclick="showTab('global',this)">&#128202; Gestion globale</button>
  <button onclick="showTab('agenda',this)">&#128197; Agenda</button>
  <button onclick="showTab('documents',this)">&#128196; Documents</button>
  <button onclick="showTab('notifs',this)">&#128276; Historique</button>
  <button onclick="showTab('creer',this)">&#10010; Nouveau projet</button>
  <button onclick="showTab('budget',this)">&#128200; Budget</button>
  <button onclick="showTab('elections',this)">&#128499; Elections</button>
  <button onclick="showTab('comms',this)">&#128221; Communications</button>
  <button onclick="showTab('pages',this)">&#128101; Par commission</button>
</nav>

<!-- ACCUEIL -->
<div class="tab active" id="tab-accueil">
  <div class="hero">
    <div class="hero-logo">VM</div>
    <div>
      <h2 style="font-size:1.2rem;font-weight:600;margin-bottom:.3rem">Bienvenue, espace &eacute;lus</h2>
      <p style="opacity:.8;font-size:.85rem;line-height:1.5">Vizille en Mouvement &mdash; Mandat 2026&ndash;2032<br>Tableau de bord r&eacute;serv&eacute; aux conseillers municipaux.</p>
    </div>
  </div>
  <div class="metrics">
    <div class="m"><div class="v" id="acc-total">—</div><div class="l">Projets</div></div>
    <div class="m"><div class="v" id="acc-themes">—</div><div class="l">Th&egrave;mes</div></div>
    <div class="m"><div class="v">13</div><div class="l">Commissions</div></div>
  <div class="m"><div class="v">29</div><div class="l">Conseillers</div></div>
    <div class="m"><div class="v">2032</div><div class="l">Fin de mandat</div></div>
  </div>
  <div class="card">
    <h4 style="font-size:.95rem;margin-bottom:1rem;border-bottom:.5px solid #f0f0e8;padding-bottom:.75rem">&#128218; Mode d&rsquo;emploi</h4>
    <div class="help-grid">
      <div class="help-item"><div class="help-icon" style="background:#e8f0e8">&#128203;</div><div><strong style="font-size:.82rem">Projets</strong><p>Consultez les 91 projets du mandat. Filtrez par th&egrave;me, statut ou ann&eacute;e. Mettez &agrave; jour le statut d&rsquo;un projet via le menu d&eacute;roulant.</p></div></div>
      <div class="help-item"><div class="help-icon" style="background:#e8eef8">&#128197;</div><div><strong style="font-size:.82rem">Agenda</strong><p>Planifiez vos r&eacute;unions (bureau, commissions, conseil). Les &eacute;v&eacute;nements pass&eacute;s s&rsquo;affichent en gris&eacute;.</p></div></div>
      <div class="help-item"><div class="help-icon" style="background:#fef3e2">&#128196;</div><div><strong style="font-size:.82rem">Documents</strong><p>Centralisez vos liens kDrive ou Google Drive. CR, d&eacute;lib&eacute;rations, rapports en un clic.</p></div></div>
      <div class="help-item"><div class="help-icon" style="background:#f0f0e8">&#128276;</div><div><strong style="font-size:.82rem">Historique</strong><p>Journal automatique de toutes les modifications de statut de projets.</p></div></div>
      <div class="help-item"><div class="help-icon" style="background:#e8f8e8">&#10010;</div><div><strong style="font-size:.82rem">Nouveau projet</strong><p>Cr&eacute;ez un projet hors programme. Il est sauvegard&eacute; imm&eacute;diatement.</p></div></div>
      <div class="help-item"><div class="help-icon" style="background:#fde8e8">&#128200;</div><div><strong style="font-size:.82rem">Budget</strong><p>Importez un CSV pour g&eacute;n&eacute;rer un tableau comparatif 2025&ndash;2026 color&eacute;.</p></div></div>
      <div class="help-item"><div class="help-icon" style="background:#e8eef8">&#128499;</div><div><strong style="font-size:.82rem">Elections</strong><p>Liens INSEE, Pr&eacute;fecture, r&eacute;sultats officiels. Composition du conseil.</p></div></div>
      <div class="help-item"><div class="help-icon" style="background:#f3e8f8">&#128221;</div><div><strong style="font-size:.82rem">Communications</strong><p>R&eacute;dacteur Claude AI : arr&ecirc;t&eacute;s, d&eacute;lib&eacute;rations, posts Facebook, discours.</p></div></div>
    </div>
  </div>
  <div class="card">
    <h4 style="font-size:.9rem;margin-bottom:.75rem">&#128274; Acc&egrave;s &amp; s&eacute;curit&eacute;</h4>
    <div style="font-size:.78rem;color:#555;line-height:1.8">
      <p>&#9679; Mot de passe&nbsp;: <code style="background:#f4f4ef;padding:1px 6px;border-radius:4px">vizille2026</code> &mdash; modifiable via <code style="background:#f4f4ef;padding:1px 6px;border-radius:4px">VEM_PASSWORD</code></p>
      <p>&#9679; URL&nbsp;: <a href="https://elus.vizilleenmouvement.fr" target="_blank">https://elus.vizilleenmouvement.fr</a></p>
      <p>&#9679; Pour activer le r&eacute;dacteur Claude&nbsp;: configurer <code style="background:#f4f4ef;padding:1px 6px;border-radius:4px">ANTHROPIC_API_KEY</code> dans Infomaniak &rarr; Avanc&eacute; &rarr; Variables d&rsquo;environnement</p>
    </div>
  </div>
</div>

<!-- PROJETS -->
<div class="tab" id="tab-global">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
    <div>
      <h2 style="font-size:1rem;font-weight:600;color:#1a3a2a;margin-bottom:.2rem">Gestion globale des projets</h2>
      <p style="font-size:.76rem;color:#999">Tous les projets du mandat 2026&ndash;2032 &mdash; mise &agrave; jour des statuts en temps r&eacute;el</p>
    </div>
    <button class="btn btn-sm" onclick="showTab('pages',document.querySelector('nav button:nth-child(9)'))">&#128101; Vue par commission &rarr;</button>
  </div>
  <div class="metrics">
    <div class="m"><div class="v" id="p-total">—</div><div class="l">Projets</div></div>
    <div class="m"><div class="v" id="p-themes">—</div><div class="l">Th&egrave;mes</div></div>
    <div class="m"><div class="v" id="p-prio">—</div><div class="l">Prioritaires</div></div>
    <div class="m"><div class="v" id="p-2026">—</div><div class="l">2026</div></div>
    <div class="m"><div class="v" id="p-2027">—</div><div class="l">2027</div></div>
  </div>
  <div class="charts">
    <div class="cc"><h3>Par th&egrave;me</h3><div class="cw"><canvas id="cT"></canvas></div></div>
    <div class="cc"><h3>Par statut</h3><div class="cw"><canvas id="cS"></canvas></div></div>
  </div>
  <div class="fl">
    <select id="fT" onchange="filtrer()"><option value="">Tous les th&egrave;mes</option></select>
    <select id="fS" onchange="filtrer()"><option value="">Tous les statuts</option></select>
    <select id="fA" onchange="filtrer()"><option value="">Toutes les ann&eacute;es</option></select>
    <input id="fQ" placeholder="Rechercher..." oninput="filtrer()" style="flex:1;min-width:100px">
    <small id="cpt" style="color:#aaa;white-space:nowrap"></small>
  </div>
  <table><thead><tr><th>Commission</th><th>Projet</th><th>Statut</th><th>Ann&eacute;e</th><th>Imp.</th><th>Action</th></tr></thead>
  <tbody id="tb"></tbody></table>
</div>

<!-- AGENDA -->
<div class="tab" id="tab-agenda">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
    <h2 style="font-size:.9rem;color:#666;font-weight:500">R&eacute;unions &amp; &eacute;v&eacute;nements</h2>
    <button class="btn btn-sm" onclick="openModal('agenda')">+ Ajouter</button>
  </div>
  <div id="agenda-list"></div>
</div>

<!-- DOCUMENTS -->
<div class="tab" id="tab-documents">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
    <h2 style="font-size:.9rem;color:#666;font-weight:500">Documents &amp; liens</h2>
    <button class="btn btn-sm" onclick="openModal('doc')">+ Ajouter</button>
  </div>
  <div id="docs-list"></div>
</div>

<!-- HISTORIQUE -->
<div class="tab" id="tab-notifs">
  <h2 style="font-size:.9rem;color:#666;font-weight:500;margin-bottom:1rem">Journal des modifications</h2>
  <div id="notifs-list"></div>
</div>

<!-- CREER PROJET -->
<div class="tab" id="tab-creer">
  <div style="max-width:560px">
    <h2 style="font-size:.9rem;color:#666;font-weight:500;margin-bottom:1rem">Cr&eacute;er un nouveau projet</h2>
    <div class="card">
      <input class="finput" id="np-titre" placeholder="Titre du projet *">
      <div class="form-row">
        <select class="finput" id="np-theme">
          <option value="">-- Th&egrave;me --</option>
          <option>Mobilit&eacute;s</option><option>Tranquillit&eacute; publique</option>
          <option>Enfance/Jeunesse</option><option>Travaux</option>
          <option>Transition &eacute;cologique</option><option>Urbanisme</option>
          <option>Culture</option><option>Patrimoine</option>
          <option>Action sociale</option><option>Animations de proximit&eacute;</option>
          <option>Concertation citoyenne</option><option>Economie</option>
          <option>Sant&eacute;</option><option>Jumelages</option><option>M&eacute;tropole</option>
        </select>
        <select class="finput" id="np-statut">
          <option value="Programm&eacute;">Programm&eacute;</option>
          <option value="Prioritaire">Prioritaire</option>
          <option value="Planifi&eacute;">Planifi&eacute;</option>
          <option value="En cours">En cours</option>
          <option value="Etude">Etude</option>
        </select>
      </div>
      <div class="form-row">
        <input class="finput" id="np-annee" placeholder="Ann&eacute;e (ex: 2026)">
        <select class="finput" id="np-importance">
          <option value="1">Importance 1</option>
          <option value="2">Importance 2</option>
          <option value="3" selected>Importance 3</option>
        </select>
      </div>
      <input class="finput" id="np-resume" placeholder="R&eacute;sum&eacute; court *">
      <textarea class="finput" id="np-description" placeholder="Description (optionnel)"></textarea>
      <input class="finput" id="np-tags" placeholder="Tags (virgule-s&eacute;par&eacute;s)">
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:.5rem">
        <button class="btn btn-ghost" onclick="resetForm()">R&eacute;initialiser</button>
        <button class="btn" onclick="createProjet()">&#10003; Cr&eacute;er</button>
      </div>
      <div id="np-result" style="margin-top:10px"></div>
    </div>
  </div>
</div>

<!-- BUDGET -->
<div class="tab" id="tab-budget">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
    <h2 style="font-size:.9rem;color:#666;font-weight:500">Budget comparatif</h2>
    <label class="btn btn-sm" style="cursor:pointer">&#128196; Importer CSV<input type="file" id="budget-file" accept=".csv" style="display:none" onchange="importBudget(this)"></label>
  </div>
  <div id="budget-table">
    <div class="card" style="font-size:.78rem;color:#666">
      <strong>Format CSV attendu&nbsp;:</strong><br>
      <code style="font-size:.72rem;background:#f4f4ef;padding:2px 6px;border-radius:4px;display:block;margin-top:6px">Poste,Budget2025,Budget2026,Prevision2027<br>Fonctionnement,1200000,1250000,1280000</code>
    </div>
  </div>
</div>

<!-- ELECTIONS -->
<div class="tab" id="tab-elections">
  <h2 style="font-size:.9rem;color:#666;font-weight:500;margin-bottom:1rem">Elections &amp; listes &eacute;lectorales</h2>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:1rem">
    <div class="card">
      <h4>&#128101; Liste &eacute;lectorale Vizille</h4>
      <p style="margin:.5rem 0">Commune de Vizille &mdash; Is&egrave;re (38431)</p>
      <div style="display:flex;flex-direction:column;gap:6px;margin-top:.75rem">
        <a href="https://www.service-public.fr/particuliers/vosdroits/F1367" target="_blank" class="btn btn-ghost btn-sm" style="text-align:center">&#128279; Service-Public.fr</a>
        <a href="https://www.interieur.gouv.fr/Elections/Les-resultats/Municipales" target="_blank" class="btn btn-ghost btn-sm" style="text-align:center">&#128279; R&eacute;sultats officiels</a>
        <a href="https://www.insee.fr/fr/statistiques/zones/3720885" target="_blank" class="btn btn-ghost btn-sm" style="text-align:center">&#128279; INSEE Vizille</a>
      </div>
    </div>
    <div class="card">
      <h4>&#128202; R&eacute;sultats mars 2026</h4>
      <table style="width:100%;font-size:.75rem;border-collapse:collapse;margin-top:.5rem">
        <tr><td style="padding:4px 0;color:#666">Tour 1 — 15 mars</td><td style="text-align:right"><span class="b b2">Victoire VeM</span></td></tr>
        <tr><td style="padding:4px 0;color:#666">Elus</td><td style="text-align:right;font-weight:500">29 conseillers</td></tr>
        <tr><td style="padding:4px 0;color:#666">Maire</td><td style="text-align:right;font-weight:500">Catherine Troton</td></tr>
        <tr><td style="padding:4px 0;color:#666">Vous</td><td style="text-align:right;font-weight:500">Position 22</td></tr>
      </table>
    </div>
  </div>
  <div class="card">
    <h4>&#128203; Liens utiles</h4>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:.75rem">
      <a href="https://www.collectivites-locales.gouv.fr" target="_blank" class="btn btn-ghost btn-sm">Collectivit&eacute;s-locales.gouv.fr</a>
      <a href="https://www.amf.asso.fr" target="_blank" class="btn btn-ghost btn-sm">AMF</a>
      <a href="https://www.legifrance.gouv.fr" target="_blank" class="btn btn-ghost btn-sm">L&eacute;gifrance</a>
      <a href="https://www.maire-info.com" target="_blank" class="btn btn-ghost btn-sm">Maire-info</a>
    </div>
  </div>
</div>

<!-- COMMUNICATIONS -->
<div class="tab" id="tab-comms">
  <h2 style="font-size:.9rem;color:#666;font-weight:500;margin-bottom:1rem">&#128221; R&eacute;dacteur municipal</h2>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
    <div>
      <div class="card">
        <h4 style="margin-bottom:.75rem">Type de document</h4>
        <select class="finput" id="comm-type">
          <option value="arrete">Arr&ecirc;t&eacute; municipal</option>
          <option value="deliberation">D&eacute;lib&eacute;ration</option>
          <option value="facebook">Post Facebook</option>
          <option value="communique">Communiqu&eacute; de presse</option>
          <option value="convocation">Convocation conseil municipal</option>
          <option value="discours">Discours / allocution</option>
        </select>
        <h4 style="margin:.75rem 0 .4rem">Sujet / Instructions</h4>
        <textarea class="finput" id="comm-sujet" style="height:120px" placeholder="Decrivez le contenu souhaite..."></textarea>
        <h4 style="margin:.25rem 0 .4rem">Contexte (optionnel)</h4>
        <input class="finput" id="comm-contexte" placeholder="Ex: Commune de Vizille, 5000 hab.">
        <button class="btn" style="width:100%;margin-top:.25rem" onclick="genereComm()">&#10024; Generer avec Claude</button>
        <div id="comm-status" style="font-size:.72rem;color:#aaa;margin-top:6px;text-align:center"></div>
      </div>
    </div>
    <div>
      <div class="card" style="height:calc(100% - 12px)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem">
          <h4>R&eacute;sultat</h4>
          <button class="btn btn-ghost btn-sm" onclick="copyComm()">&#128203; Copier</button>
        </div>
        <textarea class="finput" id="comm-result" style="height:360px;font-size:.76rem;line-height:1.6;background:#fafaf8" placeholder="Le document apparaitra ici..."></textarea>
      </div>
    </div>
  </div>
</div>

<!-- MODALES -->
<div class="modal-bg" id="modal-agenda">
  <div class="modal">
    <h3>Ajouter une r&eacute;union</h3>
    <input class="finput" id="ag-titre" placeholder="Titre">
    <div class="form-row">
      <input class="finput" type="date" id="ag-date">
      <input class="finput" id="ag-heure" placeholder="Heure (ex: 18h30)">
    </div>
    <input class="finput" id="ag-lieu" placeholder="Lieu">
    <select class="finput" id="ag-type">
      <option value="bureau">Bureau municipal</option>
      <option value="commission">Commission</option>
      <option value="conseil">Conseil municipal</option>
      <option value="autre">Autre</option>
    </select>
    <textarea class="finput" id="ag-notes" placeholder="Notes (optionnel)"></textarea>
    <div style="display:flex;gap:8px;justify-content:flex-end">
      <button class="btn btn-ghost" onclick="closeModal()">Annuler</button>
      <button class="btn" onclick="saveAgenda()">Enregistrer</button>
    </div>
  </div>
</div>

<div class="modal-bg" id="modal-doc">
  <div class="modal">
    <h3>Ajouter un document</h3>
    <input class="finput" id="doc-titre" placeholder="Titre">
    <select class="finput" id="doc-type">
      <option value="cr">Compte-rendu</option>
      <option value="delib">D&eacute;lib&eacute;ration</option>
      <option value="rapport">Rapport</option>
      <option value="autre">Autre</option>
    </select>
    <input class="finput" type="url" id="doc-url" placeholder="Lien (kDrive, Google Drive...)">
    <input class="finput" type="date" id="doc-date">
    <textarea class="finput" id="doc-notes" placeholder="Description (optionnel)"></textarea>
    <div style="display:flex;gap:8px;justify-content:flex-end">
      <button class="btn btn-ghost" onclick="closeModal()">Annuler</button>
      <button class="btn" onclick="saveDoc()">Enregistrer</button>
    </div>
  </div>
</div>


<!-- PAGES COMMISSIONS -->
<div class="tab" id="tab-pages">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
    <div>
      <h2 style="font-size:1rem;font-weight:600;color:#1a3a2a;margin-bottom:.2rem">Gestion par commission</h2>
      <p style="font-size:.76rem;color:#999">Cliquez sur une commission pour acc&eacute;der &agrave; sa page de gestion d&eacute;di&eacute;e</p>
    </div>
    <button class="btn btn-sm btn-ghost" onclick="showTab('global',document.querySelector('nav button:nth-child(2)'))">&#128202; Vue globale &rarr;</button>
  </div>
  <div id="comm-pages-list"></div>
</div>

<div class="toast" id="toast"></div>

<script>
var P=[], ST={}, AG=[], DC=[], NF=[];
var COMMISSIONS = {
  'Culture, Patrimoine & Jumelages': ['Culture','Patrimoine','Jumelages'],
  'Mobilités': ['Mobilités'],
  'Transition écologique': ['Transition écologique'],
  'Action sociale': ['Action sociale'],
  'Concertation citoyenne': ['Concertation citoyenne'],
  'Animations de proximité': ['Animations de proximité'],
  'Économie': ['Économie'],
  'Métropole': ['Métropole'],
  'Enfance/Jeunesse': ['Enfance/Jeunesse'],
  'Tranquillité publique': ['Tranquillité publique'],
  'Travaux & Urbanisme': ['Travaux','Urbanisme'],
  'Santé': ['Santé']
};
var COMM_REFERENTS = {
  'Culture, Patrimoine & Jumelages': 'Marie-Claude',
  'Mobilités': '',
  'Transition écologique': '',
  'Action sociale': '',
  'Concertation citoyenne': '',
  'Animations de proximité': '',
  'Économie': '',
  'Métropole': '',
  'Enfance/Jeunesse': 'Angélique',
  'Tranquillité publique': '',
  'Travaux & Urbanisme': '',
  'Santé': ''
};
function themeToComm(theme) {
  for (var c in COMMISSIONS) {
    if (COMMISSIONS[c].indexOf(theme) >= 0) return c;
  }
  return 'Autre';
}
var SLIST=["Prioritaire","Programme","Planifie","Etude","En cours","Realise","Suspendu"];
var CL=["#1a3a2a","#4a8a5a","#7ab87a","#aad4aa","#2a5a3a","#3a6a4a","#5a9a6a","#8ac08a","#b0d8b0","#c8e8c8","#1a4a2a","#2a6a4a","#6ab06a","#3a7a5a","#9ac89a"];
var cT,cS;

function api(url, opts) {
  opts = opts||{};
  opts.headers = opts.headers||{};
  opts.headers['Authorization'] = 'Basic '+btoa(':'+btoa(':vizille2026').split('').reverse().join(''));
  // On utilise le mot de passe directement
  opts.headers['Authorization'] = 'Basic '+btoa(':vizille2026');
  return fetch(url, opts).then(function(r){return r.json();});
}

function init() {
  api('/api/all').then(function(d) {
    P=d.projets; ST=d.statuts; AG=d.agenda; DC=d.documents; NF=d.notifs;
    buildFilters();
    filtrer();
    buildCharts();
    updateMetrics();
  });
}

function updateMetrics() {
  var t=Object.keys({});
  var themes={},ann={},prio=0,n2026=0,n2027=0;
  P.forEach(function(p){
    themes[p.theme||'?']=1;
    var s=ST[p.id]||p.statut||'';
    if(s==='Prioritaire')prio++;
    var a=p.annee?String(p.annee):'';
    if(a==='2026')n2026++;
    if(a==='2027')n2027++;
  });
  var nth=Object.keys(themes).length;
  el('acc-total',P.length); el('acc-themes',nth);
  el('p-total',P.length); el('p-themes',nth); el('p-prio',prio); el('p-2026',n2026); el('p-2027',n2027);
}
function el(id,v){var e=document.getElementById(id);if(e)e.textContent=v;}

function buildFilters() {
  var themes={},statuts={},annees={};
  P.forEach(function(p){
    if(p.theme)themes[p.theme]=1;
    var s=ST[p.id]||p.statut||'ND';
    statuts[s]=1;
    var a=p.annee?String(p.annee):'?';
    annees[a]=1;
  });
  var commNames = Object.keys(COMMISSIONS);
  fillSelect('fC', commNames, 'Toutes les commissions');
  fillSelect('fT', Object.keys(themes).sort(), 'Tous les themes');
  fillSelect('fS', Object.keys(statuts).sort(), 'Tous les statuts');
  fillSelect('fA', Object.keys(annees).sort(), 'Toutes les annees');
}
function fillSelect(id, opts, def) {
  var s=document.getElementById(id);
  s.innerHTML='<option value="">'+def+'</option>';
  opts.forEach(function(o){var op=document.createElement('option');op.value=o;op.textContent=o;s.appendChild(op);});
}

function bc(s){if(!s)return 'b5';var l=s.toLowerCase();if(l.indexOf('prioritaire')>=0)return 'b1';if(l.indexOf('programm')>=0||l.indexOf('programme')>=0)return 'b2';if(l.indexOf('planifi')>=0)return 'b3';if(l.indexOf('tude')>=0||l.indexOf('cours')>=0)return 'b4';if(l.indexOf('alis')>=0||l.indexOf('alise')>=0)return 'b6';return 'b5';}

function filtrerComm() {
  var c = document.getElementById('fC').value;
  var themes = c ? COMMISSIONS[c] : null;
  var fT = document.getElementById('fT');
  var prev = fT.value;
  fT.innerHTML = '<option value="">Tous les themes</option>';
  var list = themes || Object.keys(COMMISSIONS).reduce(function(acc, k) { return acc.concat(COMMISSIONS[k]); }, []).sort();
  list.sort().forEach(function(t) {
    var o = document.createElement('option');
    o.value = t; o.textContent = t;
    if (t === prev) o.selected = true;
    fT.appendChild(o);
  });
  filtrer();
}

function filtrer() {
  var c=document.getElementById('fC').value;
  var t=document.getElementById('fT').value;
  var s=document.getElementById('fS').value;
  var a=document.getElementById('fA').value;
  var q=document.getElementById('fQ').value.toLowerCase();
  var r=P.filter(function(p){
    var ps=ST[p.id]||p.statut||'ND';
    var pa=p.annee?String(p.annee):'?';
    var pc=themeToComm(p.theme);
    return (!c||pc===c)&&(!t||p.theme===t)&&(!s||ps===s)&&(!a||pa===a)&&(!q||(p.titre||'').toLowerCase().indexOf(q)>=0||(p.resume||'').toLowerCase().indexOf(q)>=0);
  });
  document.getElementById('cpt').textContent=r.length+' projet(s)';
  document.getElementById('tb').innerHTML=r.map(function(p){
    var st=ST[p.id]||p.statut||'ND';
    var imp=p.importance?'\u2605'.repeat(p.importance):'-';
    var opts=SLIST.map(function(sv){return '<option value="'+sv+'"'+(st===sv?' selected':'')+'>'+sv+'</option>';}).join('');
    return '<tr><td style="font-size:.7rem;color:#777">'+(p.theme||'—')+'</td>'
      +'<td><strong>'+(p.titre||'—')+'</strong><br><span style="color:#aaa;font-size:.68rem">'+(p.resume||'')+'</span></td>'
      +'<td><span class="b '+bc(st)+'">'+st+'</span></td>'
      +'<td>'+(p.annee||'—')+'</td>'
      +'<td style="color:#c8a000">'+imp+'</td>'
      +'<td><select class="ssel" onchange="updateStatus('+p.id+',this.value,this.options[this.selectedIndex].text)">'+opts+'</select></td>'
      +'</tr>';
  }).join('');
}

function buildCharts() {
  var themes={},statuts={};
  P.forEach(function(p){
    var t=p.theme||'Autre'; themes[t]=(themes[t]||0)+1;
    var s=ST[p.id]||p.statut||'ND'; statuts[s]=(statuts[s]||0)+1;
  });
  var thK=Object.keys(themes).sort(), thV=thK.map(function(k){return themes[k];});
  var stK=Object.keys(statuts), stV=stK.map(function(k){return statuts[k];});
  if(cT)cT.destroy(); if(cS)cS.destroy();
  cT=new Chart(document.getElementById('cT'),{type:'bar',data:{labels:thK,datasets:[{data:thV,backgroundColor:CL,borderRadius:3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{font:{size:9}}},y:{ticks:{stepSize:1}}}}});
  cS=new Chart(document.getElementById('cS'),{type:'doughnut',data:{labels:stK,datasets:[{data:stV,backgroundColor:['#a33','#363','#336','#863','#888','#4a8a5a','#669']}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:9},padding:5}}}}});
}

function updateStatus(id,newSt,titre) {
  api('/api/statut',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id,statut:newSt,titre:titre})}).then(function(d){
    if(d.ok){ST[id]=newSt;NF.unshift(d.notif);filtrer();buildCharts();updateMetrics();toast('Statut mis a jour');}
  });
}

function showTab(id,btn) {
  document.querySelectorAll('.tab').forEach(function(t){t.classList.remove('active');});
  document.querySelectorAll('nav button').forEach(function(b){b.classList.remove('active');});
  document.getElementById('tab-'+id).classList.add('active');
  btn.classList.add('active');
  if(id==='agenda')renderAgenda();
  else if(id==='documents')renderDocs();
  else if(id==='notifs')renderNotifs();
  else if(id==='pages')renderCommPages();
}

function renderAgenda() {
  var now=new Date().toISOString().slice(0,10);
  var sorted=AG.slice().sort(function(a,b){return a.date>b.date?1:-1;});
  var types={bureau:'Bureau',commission:'Commission',conseil:'Conseil municipal',autre:'Autre'};
  document.getElementById('agenda-list').innerHTML=sorted.length?sorted.map(function(e){
    var past=e.date<now;
    return '<div class="card"'+(past?' style="opacity:.6"':'')+'>'+
      '<div style="display:flex;justify-content:space-between"><h4>'+e.titre+'</h4>'+
      '<button class="btn btn-sm btn-red" onclick="delAgenda('+e.id+')">&#10005;</button></div>'+
      '<p>&#128197; '+e.date+' &#128336; '+(e.heure||'')+'  &#128205; '+(e.lieu||'')+'</p>'+
      '<div class="meta"><span class="b b3">'+(types[e.type]||e.type)+'</span>'+(e.notes?' '+e.notes:'')+'</div>'+
      '</div>';
  }).join(''):'<p style="color:#aaa;font-size:.82rem">Aucune reunion programmee.</p>';
}

function renderDocs() {
  var types={cr:'Compte-rendu',delib:'Deliberation',rapport:'Rapport',autre:'Autre'};
  document.getElementById('docs-list').innerHTML=DC.length?DC.map(function(d){
    return '<div class="card">'+
      '<div style="display:flex;justify-content:space-between"><h4><a href="'+d.url+'" target="_blank">&#128196; '+d.titre+'</a></h4>'+
      '<button class="btn btn-sm btn-red" onclick="delDoc('+d.id+')">&#10005;</button></div>'+
      '<p><span class="b b3">'+(types[d.type]||d.type)+'</span> '+d.date+'</p>'+
      (d.notes?'<p class="meta">'+d.notes+'</p>':'')+
      '</div>';
  }).join(''):'<p style="color:#aaa;font-size:.82rem">Aucun document.</p>';
}

function renderNotifs() {
  document.getElementById('notifs-list').innerHTML=NF.length?NF.slice(0,50).map(function(n){
    return '<div class="notif-item"><div class="dot'+(n.new?'':' old')+'"></div>'+
      '<div><strong>'+n.titre+'</strong> &rarr; '+n.statut+'</div>'+
      '<span style="color:#aaa;font-size:.68rem;margin-left:auto;white-space:nowrap">'+n.ts+'</span></div>';
  }).join(''):'<p style="color:#aaa;font-size:.82rem">Aucune modification.</p>';
}

function openModal(t){document.getElementById('modal-'+t).classList.add('open');}
function closeModal(){document.querySelectorAll('.modal-bg').forEach(function(m){m.classList.remove('open');});}
document.querySelectorAll('.modal-bg').forEach(function(m){m.addEventListener('click',function(e){if(e.target===m)closeModal();});});

function saveAgenda(){
  var d={titre:document.getElementById('ag-titre').value,date:document.getElementById('ag-date').value,heure:document.getElementById('ag-heure').value,lieu:document.getElementById('ag-lieu').value,type:document.getElementById('ag-type').value,notes:document.getElementById('ag-notes').value};
  api('/api/agenda',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)}).then(function(r){if(r.ok){AG.push(r.item);closeModal();renderAgenda();toast('Reunion ajoutee');}});
}
function delAgenda(id){if(!confirm('Supprimer ?'))return;api('/api/agenda/'+id,{method:'DELETE'}).then(function(r){if(r.ok){AG=AG.filter(function(a){return a.id!==id;});renderAgenda();toast('Supprime');}});}

function saveDoc(){
  var d={titre:document.getElementById('doc-titre').value,type:document.getElementById('doc-type').value,url:document.getElementById('doc-url').value,date:document.getElementById('doc-date').value,notes:document.getElementById('doc-notes').value};
  api('/api/document',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)}).then(function(r){if(r.ok){DC.push(r.item);closeModal();renderDocs();toast('Document ajoute');}});
}
function delDoc(id){if(!confirm('Supprimer ?'))return;api('/api/document/'+id,{method:'DELETE'}).then(function(r){if(r.ok){DC=DC.filter(function(d){return d.id!==id;});renderDocs();toast('Supprime');}});}

function createProjet(){
  var titre=document.getElementById('np-titre').value.trim();
  var resume=document.getElementById('np-resume').value.trim();
  if(!titre||!resume){toast('Titre et resume obligatoires');return;}
  var d={titre:titre,theme:document.getElementById('np-theme').value,statut:document.getElementById('np-statut').value,annee:document.getElementById('np-annee').value,importance:document.getElementById('np-importance').value,resume:resume,description:document.getElementById('np-description').value,tags:document.getElementById('np-tags').value};
  api('/api/projet',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)}).then(function(r){
    if(r.ok){P.push(r.projet);buildFilters();filtrer();buildCharts();updateMetrics();resetForm();
    document.getElementById('np-result').innerHTML='<div style="background:#e8f0e8;border-radius:8px;padding:10px;font-size:.8rem;color:#363">Projet cree : '+r.projet.titre+'</div>';
    toast('Projet cree !');}
  });
}
function resetForm(){['np-titre','np-resume','np-description','np-tags','np-annee'].forEach(function(i){document.getElementById(i).value='';});}

function importBudget(input){
  var file=input.files[0];if(!file)return;
  var reader=new FileReader();
  reader.onload=function(e){
    var lines=e.target.result.split(String.fromCharCode(10)).filter(function(l){return l.trim();});
    if(!lines.length)return;
    var headers=lines[0].split(',').map(function(h){return h.trim();});
    var rows=lines.slice(1).map(function(l){return l.split(',').map(function(c){return c.trim();});});
    var html='<table><thead><tr>';
    headers.forEach(function(h,i){html+='<th style="text-align:'+(i>0?'right':'left')+'">'+h+'</th>';});
    html+='</tr></thead><tbody>';
    rows.forEach(function(row){
      html+='<tr>';
      row.forEach(function(cell,i){
        var num=parseFloat(cell.replace(/[^0-9.-]/g,''));
        var fmt=(!isNaN(num)&&i>0)?new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(num):cell;
        var color='';
        if(i===2&&row[1]){var v1=parseFloat(row[1].replace(/[^0-9.-]/g,'')),v2=parseFloat(row[2].replace(/[^0-9.-]/g,''));if(!isNaN(v1)&&!isNaN(v2)){color=v2>v1?'color:#a33':'color:#363';}}
        html+='<td style="text-align:'+(i>0?'right':'left')+';'+color+'">'+fmt+'</td>';
      });
      html+='</tr>';
    });
    html+='</tbody></table>';
    document.getElementById('budget-table').innerHTML=html;
    toast('Budget importe : '+rows.length+' lignes');
  };
  reader.readAsText(file);
}

function genereComm(){
  var type=document.getElementById('comm-type').value;
  var sujet=document.getElementById('comm-sujet').value.trim();
  var contexte=document.getElementById('comm-contexte').value.trim()||'Commune de Vizille, 5000 habitants, Isere 38431, Maire Catherine Troton, mandat 2026-2032';
  if(!sujet){toast('Indiquez le sujet');return;}
  document.getElementById('comm-status').textContent='Generation en cours...';
  document.getElementById('comm-result').value='';
  api('/api/genere',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:type,sujet:sujet,contexte:contexte})}).then(function(d){
    document.getElementById('comm-status').textContent='';
    if(d.ok){document.getElementById('comm-result').value=d.texte;toast('Document genere !');}
    else{document.getElementById('comm-result').value='Erreur: '+d.error;}
  }).catch(function(){document.getElementById('comm-status').textContent='';document.getElementById('comm-result').value='Erreur reseau';});
}
function copyComm(){var t=document.getElementById('comm-result');t.select();document.execCommand('copy');toast('Copie !');}

function toast(msg){var t=document.getElementById('toast');t.textContent=msg;t.style.display='block';setTimeout(function(){t.style.display='none';},2500);}


function renderCommPages() {
  var html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px">';
  Object.keys(COMMISSIONS).forEach(function(comm) {
    var themes = COMMISSIONS[comm];
    var projetsComm = P.filter(function(p){ return themes.indexOf(p.theme) >= 0; });
    var ref = COMM_REFERENTS[comm] || '';
    var stats = {total:projetsComm.length, prio:0, encours:0, realise:0};
    projetsComm.forEach(function(p){
      var s = ST[p.id]||p.statut||'';
      if(s==='Prioritaire') stats.prio++;
      if(s.indexOf('cours')>=0) stats.encours++;
      if(s.indexOf('alis')>=0||s.indexOf('alise')>=0) stats.realise++;
    });
    var pct = stats.total ? Math.round((stats.realise/stats.total)*100) : 0;
    var commIdx = Object.keys(COMMISSIONS).indexOf(comm);
    html += '<div class="card" style="cursor:pointer" onclick="showCommDetail(' + commIdx + ')">';
    html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.75rem">';
    var colors=['#4a8a5a','#5a9a6a','#7ab87a','#3a6a4a','#2a5a3a','#8ac08a','#6ab06a','#1a3a2a','#4a8a5a','#5a9a6a','#3a6a4a','#7ab87a'];
    var commColor = colors[commIdx % colors.length];
    html += '<div style="width:4px;height:40px;background:'+commColor+';border-radius:2px;flex-shrink:0"></div>';
    html += '<div style="flex:1"><h4 style="font-size:.88rem;line-height:1.3">'+comm+'</h4>'
    if(ref) html += '<span class="b b3" style="white-space:nowrap;margin-left:8px">'+ref+'</span></div>';
    html += '</div>';
    html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:.75rem">';
    html += '<div style="text-align:center"><div style="font-size:1.3rem;font-weight:600;color:#1a3a2a">'+stats.total+'</div><div style="font-size:.65rem;color:#999">projets</div></div>';
    html += '<div style="text-align:center"><div style="font-size:1.3rem;font-weight:600;color:#a33">'+stats.prio+'</div><div style="font-size:.65rem;color:#999">prioritaires</div></div>';
    html += '<div style="text-align:center"><div style="font-size:1.3rem;font-weight:600;color:#863">'+stats.encours+'</div><div style="font-size:.65rem;color:#999">en cours</div></div>';
    html += '<div style="text-align:center"><div style="font-size:1.3rem;font-weight:600;color:#363">'+stats.realise+'</div><div style="font-size:.65rem;color:#999">réalisés</div></div>';
    html += '</div>';
    // Barre de progression
    html += '<div style="background:#f0f0e8;border-radius:4px;height:6px;margin-bottom:.5rem">';
    html += '<div style="background:#4a8a5a;height:6px;border-radius:4px;width:'+pct+'%"></div></div>';
    html += '<div style="font-size:.68rem;color:#aaa;display:flex;justify-content:space-between">';
    html += '<span>Thèmes : '+themes.join(', ')+'</span><span>'+pct+'% réalisé</span></div>';
    html += '</div>';
  });
  html += '</div>';
  document.getElementById('comm-pages-list').innerHTML = html;
}

function showCommDetail(idx) {
  var comm = Object.keys(COMMISSIONS)[idx];
  var themes = COMMISSIONS[comm];
  var projetsComm = P.filter(function(p){ return themes.indexOf(p.theme) >= 0; });
  var ref = COMM_REFERENTS[comm]||'';
  var html = '<div style="margin-bottom:1rem;display:flex;align-items:center;gap:10px">';
  html += '</div>'; // end hidden div
  html += '<h3 style="font-size:.95rem;color:#1a3a2a">'+comm+'</h3>';
  if(ref) html += '<span class="b b3">Référent : '+ref+'</span>';
  html += '</div>';
  // Filtres rapides
  html += '<div class="fl" style="margin-bottom:.85rem">';
  html += '<select id="cd-statut" onchange="filtrerCommDetail(window._currentCommIdx)" style="padding:5px 8px;border:.5px solid #ddd;border-radius:6px;font-size:.75rem;background:#fff">';
  html += '<option value="">Tous les statuts</option>';
  ['Prioritaire','Programmé','Planifié','Étude','En cours','Réalisé'].forEach(function(s){html+='<option>'+s+'</option>';});
  html += '</select>';
  html += '<input id="cd-search" placeholder="Rechercher..." oninput="filtrerCommDetail(window._currentCommIdx)" style="padding:5px 8px;border:.5px solid #ddd;border-radius:6px;font-size:.75rem;background:#fff;flex:1">';
  html += '</div>';
  html += '<div id="comm-detail-table"></div>';
  document.getElementById('comm-pages-list').innerHTML = html;
  filtrerCommDetail(comm);
}

function filtrerCommDetail(idx) {
  var comm = Object.keys(COMMISSIONS)[idx];
  var themes = COMMISSIONS[comm];
  var statut = (document.getElementById('cd-statut')||{}).value||'';
  var q = ((document.getElementById('cd-search')||{}).value||'').toLowerCase();
  var r = P.filter(function(p){
    var ps = ST[p.id]||p.statut||'ND';
    return themes.indexOf(p.theme)>=0 && (!statut||ps===statut) && (!q||(p.titre||'').toLowerCase().indexOf(q)>=0||(p.resume||'').toLowerCase().indexOf(q)>=0);
  });
  var html = '<table><thead><tr><th>Thème</th><th>Projet</th><th>Statut</th><th>Année</th><th>Imp.</th><th>Mise à jour</th></tr></thead><tbody>';
  html += r.map(function(p){
    var st=ST[p.id]||p.statut||'ND';
    var imp=p.importance?'★'.repeat(p.importance):'-';
    var opts=['Prioritaire','Programme','Planifie','Etude','En cours','Realise','Suspendu'].map(function(sv){return '<option value="'+sv+'"'+(st===sv?' selected':'')+'>'+sv+'</option>';}).join('');
    return '<tr>'
      +'<td style="font-size:.7rem;color:#777">'+(p.theme||'—')+'</td>'
      +'<td><strong>'+(p.titre||'—')+'</strong><br><span style="color:#aaa;font-size:.68rem">'+(p.resume||'')+'</span></td>'
      +'<td><span class="b '+bc(st)+'">'+st+'</span></td>'
      +'<td>'+(p.annee||'—')+'</td>'
      +'<td style="color:#c8a000">'+imp+'</td>'
      +'<td><select class="ssel" data-pid="'+p.id+'" onchange="updateStatus(+this.dataset.pid,this.value,this.dataset.titre)" data-titre="'+p.titre.replace(/"/g,'&quot;')+'">'+opts+'</select></td>'
      +'</tr>';
  }).join('');
  html += '</tbody></table>';
  if(!r.length) html = '<p style="color:#aaa;font-size:.82rem;padding:.5rem 0">Aucun projet pour ce filtre.</p>';
  document.getElementById('comm-detail-table').innerHTML = html;
}

init();
</script>
</body>
</html>`;
}

const server = http.createServer(function(req, res) {
  var p = req.url.split('?')[0];
  var method = req.method;

  if (method === 'OPTIONS') {
    res.writeHead(200, {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,DELETE','Access-Control-Allow-Headers':'Content-Type,Authorization'});
    return res.end();
  }
  if (!auth(req)) return deny(res);

  // API tout en un
  if (p === '/api/all') {
    return json(res, {projets:projets, statuts:statuts, agenda:agenda, documents:documents, notifs:notifs.slice(0,50)});
  }

  // Statut
  if (p === '/api/statut' && method === 'POST') {
    return body(req, function(err, d) {
      if (err) return json(res, {ok:false}, 400);
      var old = statuts[d.id] || 'ND';
      statuts[d.id] = d.statut;
      save('statuts.json', statuts);
      var ts = new Date().toLocaleString('fr-FR');
      var notif = {id:Date.now(), titre:d.titre, statut:d.statut, ancien:old, ts:ts, new:true};
      notifs.unshift(notif);
      if (notifs.length > 200) notifs = notifs.slice(0, 200);
      save('notifs.json', notifs);
      return json(res, {ok:true, notif:notif});
    });
  }

  // Agenda
  if (p === '/api/agenda' && method === 'POST') {
    return body(req, function(err, d) {
      if (err) return json(res, {ok:false}, 400);
      d.id = nextId(agenda); agenda.push(d); save('agenda.json', agenda);
      return json(res, {ok:true, item:d});
    });
  }
  if (p.match(/^\/api\/agenda\/\d+$/) && method === 'DELETE') {
    var id = parseInt(p.split('/').pop());
    agenda = agenda.filter(function(a){return a.id !== id;});
    save('agenda.json', agenda); return json(res, {ok:true});
  }

  // Documents
  if (p === '/api/document' && method === 'POST') {
    return body(req, function(err, d) {
      if (err) return json(res, {ok:false}, 400);
      d.id = nextId(documents); documents.push(d); save('documents.json', documents);
      return json(res, {ok:true, item:d});
    });
  }
  if (p.match(/^\/api\/document\/\d+$/) && method === 'DELETE') {
    var id = parseInt(p.split('/').pop());
    documents = documents.filter(function(d){return d.id !== id;});
    save('documents.json', documents); return json(res, {ok:true});
  }

  // Créer projet
  if (p === '/api/projet' && method === 'POST') {
    return body(req, function(err, d) {
      if (err) return json(res, {ok:false}, 400);
      var newId = projets.length ? Math.max.apply(null, projets.map(function(x){return x.id||0;})) + 1 : 9000;
      var projet = {id:newId, titre:d.titre||'', theme:d.theme||'Autre', statut:d.statut||'Programme', annee:d.annee?parseInt(d.annee):null, budget:0, resume:d.resume||'', description:d.description||'', importance:parseInt(d.importance)||2, chiffres:[], tags:d.tags?d.tags.split(',').map(function(t){return t.trim();}).filter(Boolean):[], created:new Date().toISOString()};
      projets.push(projet); save('projets.json', projets);
      var notif = {id:Date.now(), titre:projet.titre, statut:'CREE', ancien:'', ts:new Date().toLocaleString('fr-FR'), new:true};
      notifs.unshift(notif); save('notifs.json', notifs);
      return json(res, {ok:true, projet:projet});
    });
  }

  // Claude AI
  if (p === '/api/genere' && method === 'POST') {
    return body(req, function(err, d) {
      if (err) return json(res, {ok:false, error:'Donnees invalides'}, 400);
      var KEY = process.env.ANTHROPIC_API_KEY || '';
      if (!KEY) return json(res, {ok:false, error:'Cle API Claude non configuree (ANTHROPIC_API_KEY)'});
      var prompts = {
        arrete: 'Redigez un arrete municipal officiel pour la Commune de Vizille (Isere, 38431). Incluez numero, visas CGCT, considerants, articles de disposition, article execution. Sujet : ',
        deliberation: 'Redigez une deliberation du conseil municipal de Vizille. Structure : objet, motifs, le conseil municipal delibere. Sujet : ',
        facebook: 'Redigez un post Facebook engageant pour Vizille en Mouvement. Ton chaleureux, emojis, max 300 mots. Sujet : ',
        communique: 'Redigez un communique de presse pour la Ville de Vizille. Titre, chapeau, corps, contact. Sujet : ',
        convocation: 'Redigez une convocation au conseil municipal de Vizille (article L.2121-10 CGCT). Date, heure, lieu, ordre du jour. Sujet : ',
        discours: 'Redigez un discours pour le Maire de Vizille. Ton sincere, ancre dans le territoire. Sujet : '
      };
      var prompt = (prompts[d.type]||'') + (d.sujet||'') + ' Contexte: ' + (d.contexte||'Vizille, Isere');
      var reqBody = JSON.stringify({model:'claude-sonnet-4-20250514', max_tokens:1500, messages:[{role:'user', content:prompt}]});
      var opts = {hostname:'api.anthropic.com', path:'/v1/messages', method:'POST', headers:{'Content-Type':'application/json','x-api-key':KEY,'anthropic-version':'2023-06-01','Content-Length':Buffer.byteLength(reqBody)}};
      var req2 = https.request(opts, function(r2) {
        var data='';
        r2.on('data',function(c){data+=c;});
        r2.on('end',function(){
          try { var resp=JSON.parse(data); return json(res,{ok:true,texte:(resp.content&&resp.content[0]&&resp.content[0].text)||''}); }
          catch(e) { return json(res,{ok:false,error:'Erreur Claude'}); }
        });
      });
      req2.on('error',function(e){json(res,{ok:false,error:e.message});});
      req2.write(reqBody); req2.end();
    });
  }

  // Page principale
  if (p === '/' || p === '/dashboard') {
    res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
    return res.end(buildPage());
  }
  res.writeHead(404); res.end('404');
});

server.listen(PORT, function() {
  console.log('VeM Dashboard v3 port '+PORT);
  console.log('projets.json charge: '+projets.length+' projets');
});
