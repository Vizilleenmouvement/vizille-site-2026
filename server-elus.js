const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const net = require('net');
const tls = require('tls');

const PORT = process.env.PORT || 3000;
const PASSWORD = process.env.VEM_PASSWORD || 'vizille2026';
const SMTP_HOST = process.env.SMTP_HOST || 'mail.infomaniak.com';
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_FROM = process.env.SMTP_FROM || 'elus@vizilleenmouvement.fr';
const WP_URL = process.env.WP_URL || 'https://wp.vizilleenmouvement.fr';
const WP_USER = process.env.WP_USER || '';
const WP_PASS = process.env.WP_PASS || '';

const DIR = __dirname;

function loadJSON(file, def) {
  try { return JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8')); }
  catch(e) { return def; }
}
function saveJSON(file, data) {
  fs.writeFileSync(path.join(DIR, file), JSON.stringify(data, null, 2), 'utf8');
}

let projets = loadJSON('projets.json', []);
let agenda = loadJSON('agenda.json', []);
let documents = loadJSON('documents.json', []);
let statuts = loadJSON('statuts.json', {});
let notifs = loadJSON('notifs.json', []);

console.log('projets.json charge: ' + projets.length + ' projets');

function checkAuth(req) {
  const a = req.headers['authorization'] || '';
  if (!a.startsWith('Basic ')) return false;
  const pass = Buffer.from(a.slice(6), 'base64').toString().split(':').slice(1).join(':');
  return pass === PASSWORD;
}
function deny(res) {
  res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="VeM Elus"', 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Espace reserve aux elus de Vizille en Mouvement');
}
function json(res, data, code) {
  res.writeHead(code || 200, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

function getStats() {
  const t = {}, s = {}, a = {};
  projets.forEach(function(p) {
    var th = p.theme || 'Autre';
    var st = statuts[p.id] || p.statut || 'ND';
    var an = p.annee ? String(p.annee) : '?';
    t[th] = (t[th] || 0) + 1;
    s[st] = (s[st] || 0) + 1;
    a[an] = (a[an] || 0) + 1;
  });
  return { themes: t, statuts: s, annees: a, total: projets.length };
}

function sendEmail(to, subject, body, cb) {
  if (!SMTP_USER) { console.log('SMTP non configure'); return cb && cb(); }
  try {
    const sock = tls.connect({ host: SMTP_HOST, port: 465 }, function() {
      var step = 0;
      var buf = '';
      sock.on('data', function(d) {
        buf += d.toString();
        if (buf.indexOf('\r\n') < 0) return;
        var lines = buf.split('\r\n'); buf = lines.pop();
        lines.forEach(function(line) {
          step++;
          if (step === 1) sock.write('EHLO elus.vizilleenmouvement.fr\r\n');
          else if (step === 2) sock.write('AUTH LOGIN\r\n');
          else if (step === 3) sock.write(Buffer.from(SMTP_USER).toString('base64') + '\r\n');
          else if (step === 4) sock.write(Buffer.from(SMTP_PASS).toString('base64') + '\r\n');
          else if (step === 5) sock.write('MAIL FROM:<' + SMTP_FROM + '>\r\n');
          else if (step === 6) sock.write('RCPT TO:<' + to + '>\r\n');
          else if (step === 7) sock.write('DATA\r\n');
          else if (step === 8) sock.write('From: VeM Elus <' + SMTP_FROM + '>\r\nTo: ' + to + '\r\nSubject: ' + subject + '\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n' + body + '\r\n.\r\n');
          else if (step === 9) { sock.write('QUIT\r\n'); if (cb) cb(); }
        });
      });
    });
    sock.on('error', function(e) { console.error('SMTP:', e.message); if (cb) cb(); });
  } catch(e) { console.error('SMTP err:', e.message); if (cb) cb(); }
}

function publishToWP(projet, newStatut) {
  if (!WP_USER || !WP_PASS) return;
  const title = 'Avancement : ' + projet.titre;
  const content = '<p>Le projet <strong>' + projet.titre + '</strong> (' + (projet.theme || '') + ') vient de passer au statut : <strong>' + newStatut + '</strong>.</p>';
  const auth = Buffer.from(WP_USER + ':' + WP_PASS).toString('base64');
  const body = JSON.stringify({ title: title, content: content, status: 'publish', categories: [] });
  const u = new URL(WP_URL + '/wp-json/wp/v2/posts');
  const opts = { hostname: u.hostname, path: u.pathname, method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Basic ' + auth, 'Content-Length': Buffer.byteLength(body) } };
  const req = https.request(opts, function(r) { console.log('WP publish:', r.statusCode); });
  req.on('error', function(e) { console.error('WP err:', e.message); });
  req.write(body); req.end();
}

function buildPage() {
  const stats = getStats();
  const today = new Date().toLocaleDateString('fr-FR');
  const thKeys = Object.keys(stats.themes).sort();
  const thVals = thKeys.map(function(k) { return stats.themes[k]; });
  const stKeys = Object.keys(stats.statuts);
  const stVals = stKeys.map(function(k) { return stats.statuts[k]; });
  const themeOpts = Object.keys(stats.themes).sort().map(function(t) {
    return '<option value="' + t.replace(/"/g,'&quot;') + '">' + t + ' (' + stats.themes[t] + ')</option>';
  }).join('');
  const statutOpts = Object.keys(stats.statuts).sort().map(function(s) {
    return '<option value="' + s.replace(/"/g,'&quot;') + '">' + s + '</option>';
  }).join('');
  const anneeOpts = Object.keys(stats.annees).sort().map(function(a) {
    return '<option value="' + a + '">' + a + '</option>';
  }).join('');
  const projetsData = JSON.stringify(projets).replace(/<\/script>/gi, '<\\/script>');
  const statutsData = JSON.stringify(statuts);
  const agendaData = JSON.stringify(agenda);
  const docsData = JSON.stringify(documents);
  const notifsData = JSON.stringify(notifs);

  return '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>VeM - Espace elus</title>' +
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"></script>' +
  '<style>' +
  '*{box-sizing:border-box;margin:0;padding:0}' +
  'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#f4f4ef;color:#111;min-height:100vh}' +
  'header{background:#1a3a2a;color:#fff;padding:.85rem 2rem;display:flex;align-items:center;gap:12px;position:sticky;top:0;z-index:100}' +
  '.logo{width:34px;height:34px;background:#4a8a5a;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.85rem;flex-shrink:0}' +
  'header h1{font-size:.95rem;font-weight:500;flex:1}' +
  'header small{opacity:.6;font-size:.72rem}' +
  'nav{background:#1a3a2a;border-top:1px solid rgba(255,255,255,.1);display:flex;padding:0 2rem}' +
  'nav button{background:none;border:none;color:rgba(255,255,255,.7);padding:.6rem 1rem;cursor:pointer;font-size:.82rem;border-bottom:2px solid transparent;transition:.2s}' +
  'nav button.active{color:#fff;border-bottom-color:#7ab87a}' +
  'nav button:hover{color:#fff}' +
  '.tab{display:none;padding:1.25rem 2rem 2rem}' +
  '.tab.active{display:block}' +
  '.metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:10px;margin-bottom:1.25rem}' +
  '.m{background:#fff;border-radius:10px;padding:.85rem 1rem;border:.5px solid #e0e0d8}' +
  '.m .v{font-size:1.7rem;font-weight:600;color:#1a3a2a}' +
  '.m .l{font-size:.68rem;color:#999;margin-top:2px}' +
  '.charts{display:grid;grid-template-columns:1.4fr 1fr;gap:14px;margin-bottom:1.25rem}' +
  '.cc{background:#fff;border-radius:10px;padding:1rem;border:.5px solid #e0e0d8}' +
  '.cc h3{font-size:.75rem;color:#666;margin-bottom:.75rem;font-weight:500}' +
  '.cw{position:relative;height:200px}' +
  '.fl{display:flex;gap:8px;margin-bottom:.85rem;flex-wrap:wrap;align-items:center}' +
  '.fl select,.fl input{padding:5px 8px;border:.5px solid #ddd;border-radius:6px;font-size:.75rem;background:#fff;outline:none}' +
  'table{width:100%;border-collapse:collapse;font-size:.76rem;background:#fff;border-radius:10px;overflow:hidden;border:.5px solid #e0e0d8}' +
  'th{background:#f0f0e8;padding:8px 10px;text-align:left;font-weight:500;color:#555;font-size:.72rem}' +
  'td{padding:7px 10px;border-top:.5px solid #f0f0e8;vertical-align:middle}' +
  'tr:hover td{background:#f8f8f4}' +
  '.b{display:inline-block;padding:1px 6px;border-radius:4px;font-size:.67rem;font-weight:500}' +
  '.b1{background:#fde8e8;color:#a33}.b2{background:#e8f0e8;color:#363}.b3{background:#e8eef8;color:#336}.b4{background:#fef3e2;color:#863}.b5{background:#f0f0e8;color:#666}.b6{background:#e8f8e8;color:#2a6}' +
  '.card{background:#fff;border-radius:10px;border:.5px solid #e0e0d8;padding:1.1rem;margin-bottom:12px}' +
  '.card h4{font-size:.85rem;font-weight:500;margin-bottom:.5rem;color:#1a3a2a}' +
  '.card p{font-size:.78rem;color:#666;line-height:1.5}' +
  '.card .meta{font-size:.7rem;color:#aaa;margin-top:.5rem}' +
  '.btn{display:inline-block;padding:5px 12px;border-radius:6px;font-size:.75rem;cursor:pointer;border:.5px solid #1a3a2a;background:#1a3a2a;color:#fff}' +
  '.btn:hover{background:#2a5a3a}' +
  '.btn-sm{padding:3px 8px;font-size:.7rem}' +
  '.btn-ghost{background:transparent;color:#1a3a2a}' +
  '.btn-ghost:hover{background:#f0f0e8}' +
  '.btn-red{background:#a33;border-color:#a33}' +
  '.btn-red:hover{background:#c44}' +
  'input[type=text],input[type=date],input[type=url],input[type=email],textarea,select.form{width:100%;padding:6px 10px;border:.5px solid #ddd;border-radius:6px;font-size:.78rem;margin-bottom:8px;font-family:inherit}' +
  'textarea{height:70px;resize:vertical}' +
  '.form-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}' +
  '.modal-bg{display:none;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:200;align-items:center;justify-content:center}' +
  '.modal-bg.open{display:flex}' +
  '.modal{background:#fff;border-radius:12px;padding:1.5rem;width:min(480px,90vw);max-height:85vh;overflow-y:auto}' +
  '.modal h3{font-size:1rem;font-weight:500;margin-bottom:1rem;color:#1a3a2a}' +
  '.notif{display:flex;align-items:center;gap:8px;padding:8px 12px;background:#fff;border-radius:8px;border:.5px solid #e0e0d8;margin-bottom:8px;font-size:.76rem}' +
  '.notif .dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}' +
  '.notif.new .dot{background:#4a8a5a}' +
  '.notif.old .dot{background:#ccc}' +
  '.notif time{color:#aaa;font-size:.68rem;margin-left:auto;white-space:nowrap}' +
  'a{color:#336;text-decoration:none}a:hover{text-decoration:underline}' +
  '.tag{display:inline-block;padding:1px 5px;border-radius:3px;font-size:.65rem;background:#e8eef8;color:#336;margin-right:3px}' +
  '.status-sel{padding:2px 6px;border:.5px solid #ddd;border-radius:4px;font-size:.7rem;background:#fff}' +
  '@media(max-width:650px){.charts{grid-template-columns:1fr}.metrics{grid-template-columns:repeat(2,1fr)}.form-row{grid-template-columns:1fr}}' +
  '</style></head><body>' +

  '<header>' +
  '<div class="logo">VM</div>' +
  '<h1>Vizille en Mouvement &mdash; Espace &eacute;lus</h1>' +
  '<small>' + today + '</small>' +
  '</header>' +

  '<nav>' +
  '<button class="active" onclick="showTab(\'projets\',this)">&#128203; Projets</button>' +
  '<button onclick="showTab(\'agenda\',this)">&#128197; Agenda</button>' +
  '<button onclick="showTab(\'documents\',this)">&#128196; Documents</button>' +
  '<button onclick="showTab(\'notifs\',this)">&#128276; Notifications</button>' +
  '<button onclick="showTab(\'creer\',this)">&#10010; Nouveau projet</button>' +
  '</nav>' +

  // === TAB PROJETS ===
  '<div class="tab active" id="tab-projets">' +
  '<div class="metrics">' +
  '<div class="m"><div class="v">' + stats.total + '</div><div class="l">Projets</div></div>' +
  '<div class="m"><div class="v">' + Object.keys(stats.themes).length + '</div><div class="l">Th&egrave;mes</div></div>' +
  '<div class="m"><div class="v">' + (stats.statuts['Prioritaire'] || 0) + '</div><div class="l">Prioritaires</div></div>' +
  '<div class="m"><div class="v">' + (stats.annees['2026'] || 0) + '</div><div class="l">2026</div></div>' +
  '<div class="m"><div class="v">' + (stats.annees['2027'] || 0) + '</div><div class="l">2027</div></div>' +
  '</div>' +
  '<div class="charts">' +
  '<div class="cc"><h3>Par th&egrave;me</h3><div class="cw"><canvas id="cT"></canvas></div></div>' +
  '<div class="cc"><h3>Par statut</h3><div class="cw"><canvas id="cS"></canvas></div></div>' +
  '</div>' +
  '<div class="fl">' +
  '<select id="fT" onchange="go()"><option value="">Tous les th&egrave;mes</option>' + themeOpts + '</select>' +
  '<select id="fS" onchange="go()"><option value="">Tous les statuts</option>' + statutOpts + '</select>' +
  '<select id="fA" onchange="go()"><option value="">Toutes les ann&eacute;es</option>' + anneeOpts + '</select>' +
  '<input id="fQ" placeholder="Rechercher..." oninput="go()" style="flex:1;min-width:100px">' +
  '<small id="cpt" style="color:#aaa;white-space:nowrap"></small>' +
  '</div>' +
  '<table><thead><tr><th>Th&egrave;me</th><th>Projet</th><th>Statut</th><th>Ann&eacute;e</th><th>Imp.</th><th>Action</th></tr></thead>' +
  '<tbody id="tb"></tbody></table>' +
  '</div>' +

  // === TAB AGENDA ===
  '<div class="tab" id="tab-agenda">' +
  '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">' +
  '<h2 style="font-size:.9rem;color:#666;font-weight:500">R&eacute;unions &amp; &eacute;v&eacute;nements</h2>' +
  '<button class="btn btn-sm" onclick="openModal(\'agenda\')">+ Ajouter</button>' +
  '</div>' +
  '<div id="agenda-list"></div>' +
  '</div>' +

  // === TAB DOCUMENTS ===
  '<div class="tab" id="tab-documents">' +
  '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">' +
  '<h2 style="font-size:.9rem;color:#666;font-weight:500">Documents &amp; liens</h2>' +
  '<button class="btn btn-sm" onclick="openModal(\'doc\')">+ Ajouter</button>' +
  '</div>' +
  '<div id="docs-list"></div>' +
  '</div>' +

  // === TAB NOTIFS ===
  '<div class="tab" id="tab-notifs">' +
  '<h2 style="font-size:.9rem;color:#666;font-weight:500;margin-bottom:1rem">Journal des modifications</h2>' +
  '<div id="notifs-list"></div>' +
  '</div>' +


  // === TAB CREER PROJET ===
  '<div class="tab" id="tab-creer">' +
  '<div style="max-width:600px">' +
  '<h2 style="font-size:.9rem;color:#666;font-weight:500;margin-bottom:1rem">Cr&eacute;er un nouveau projet</h2>' +
  '<div class="card">' +
  '<input type="text" id="np-titre" placeholder="Titre du projet *">' +
  '<div class="form-row">' +
  '<select class="form" id="np-theme">' +
  '<option value="">-- Th&egrave;me --</option>' +
  '<option>Mobilités</option>' +
  '<option>Tranquillité publique</option>' +
  '<option>Enfance/Jeunesse</option>' +
  '<option>Travaux</option>' +
  '<option>Transition écologique</option>' +
  '<option>Urbanisme</option>' +
  '<option>Culture</option>' +
  '<option>Patrimoine</option>' +
  '<option>Action sociale</option>' +
  '<option>Animations de proximité</option>' +
  '<option>Concertation citoyenne</option>' +
  '<option>Economie</option>' +
  '<option>Santé</option>' +
  '<option>Jumelages</option>' +
  '<option>Métropole</option>' +
  '</select>' +
  '<select class="form" id="np-statut">' +
  '<option value="Programmé">Programmé</option>' +
  '<option value="Prioritaire">Prioritaire</option>' +
  '<option value="Planifié">Planifié</option>' +
  '<option value="Étude">Etude</option>' +
  '<option value="En cours">En cours</option>' +
  '</select>' +
  '</div>' +
  '<div class="form-row">' +
  '<input type="text" id="np-annee" placeholder="Année (ex: 2026)">' +
  '<select class="form" id="np-importance">' +
  '<option value="1">Importance 1</option>' +
  '<option value="2">Importance 2</option>' +
  '<option value="3" selected>Importance 3</option>' +
  '</select>' +
  '</div>' +
  '<input type="text" id="np-resume" placeholder="Résumé court *">' +
  '<textarea id="np-description" placeholder="Description détaillée (optionnel)" style="height:90px"></textarea>' +
  '<input type="text" id="np-tags" placeholder="Tags (virgule-séparés, ex: Seniors, Accessibilité)">' +
  '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:.5rem">' +
  '<button class="btn btn-ghost" onclick="resetForm()">Réinitialiser</button>' +
  '<button class="btn" onclick="createProjet()">&#10003; Créer le projet</button>' +
  '</div>' +
  '</div>' +
  '<div id="np-result" style="margin-top:12px"></div>' +
  '</div>' +
  '</div>' +
  // === MODALES ===
  '<div class="modal-bg" id="modal-agenda"><div class="modal">' +
  '<h3>Ajouter une r&eacute;union</h3>' +
  '<input type="text" id="ag-titre" placeholder="Titre (ex: Bureau municipal)">' +
  '<div class="form-row">' +
  '<input type="date" id="ag-date">' +
  '<input type="text" id="ag-heure" placeholder="Heure (ex: 18h30)">' +
  '</div>' +
  '<input type="text" id="ag-lieu" placeholder="Lieu">' +
  '<select class="form" id="ag-type">' +
  '<option value="bureau">Bureau municipal</option>' +
  '<option value="commission">Commission</option>' +
  '<option value="conseil">Conseil municipal</option>' +
  '<option value="autre">Autre</option>' +
  '</select>' +
  '<textarea id="ag-notes" placeholder="Notes (optionnel)"></textarea>' +
  '<div style="display:flex;gap:8px;justify-content:flex-end">' +
  '<button class="btn btn-ghost" onclick="closeModal()">Annuler</button>' +
  '<button class="btn" onclick="saveAgenda()">Enregistrer</button>' +
  '</div></div></div>' +

  '<div class="modal-bg" id="modal-doc"><div class="modal">' +
  '<h3>Ajouter un document</h3>' +
  '<input type="text" id="doc-titre" placeholder="Titre du document">' +
  '<select class="form" id="doc-type">' +
  '<option value="cr">Compte-rendu</option>' +
  '<option value="delib">D&eacute;lib&eacute;ration</option>' +
  '<option value="rapport">Rapport</option>' +
  '<option value="autre">Autre</option>' +
  '</select>' +
  '<input type="url" id="doc-url" placeholder="Lien (kDrive, Google Drive...)">' +
  '<input type="date" id="doc-date">' +
  '<textarea id="doc-notes" placeholder="Description (optionnel)"></textarea>' +
  '<div style="display:flex;gap:8px;justify-content:flex-end">' +
  '<button class="btn btn-ghost" onclick="closeModal()">Annuler</button>' +
  '<button class="btn" onclick="saveDoc()">Enregistrer</button>' +
  '</div></div></div>' +

  '<script>' +
  'var P=' + projetsData + ';' +
  'var ST=' + statutsData + ';' +
  'var AG=' + agendaData + ';' +
  'var DC=' + docsData + ';' +
  'var NF=' + notifsData + ';' +
  'var STATUTS_LIST=["Prioritaire","Programmé","Planifié","Étude","En cours","Réalisé","Suspendu"];' +

  'function showTab(id,btn){' +
  'document.querySelectorAll(".tab").forEach(function(t){t.classList.remove("active");});' +
  'document.getElementById("tab-"+id).classList.add("active");' +
  'document.querySelectorAll("nav button").forEach(function(b){b.classList.remove("active");});' +
  'btn.classList.add("active");' +
  'if(id==="agenda")renderAgenda();' +
  'else if(id==="documents")renderDocs();' +
  'else if(id==="notifs")renderNotifs();' +
  '}' +

  'function bc(s){if(!s)return"b5";var l=s.toLowerCase();if(l.indexOf("prioritaire")>=0)return"b1";if(l.indexOf("programm")>=0)return"b2";if(l.indexOf("planifi")>=0)return"b3";if(l.indexOf("tude")>=0||l.indexOf("cours")>=0)return"b4";if(l.indexOf("alis")>=0)return"b6";return"b5";}' +

  'function go(){' +
  'var t=document.getElementById("fT").value,s=document.getElementById("fS").value,a=document.getElementById("fA").value,q=document.getElementById("fQ").value.toLowerCase();' +
  'var r=P.filter(function(p){var pa=p.annee?String(p.annee):"?",ps=ST[p.id]||p.statut||"ND";return(!t||p.theme===t)&&(!s||ps===s)&&(!a||pa===a)&&(!q||(p.titre||"").toLowerCase().indexOf(q)>=0||(p.resume||"").toLowerCase().indexOf(q)>=0);});' +
  'document.getElementById("cpt").textContent=r.length+" projet(s)";' +
  'document.getElementById("tb").innerHTML=r.map(function(p){' +
  'var st=ST[p.id]||p.statut||"—";' +
  'var imp=p.importance?"\u2605".repeat(p.importance):"-";' +
  'var opts=STATUTS_LIST.map(function(s){return"<option value=\'"+s+"\'"+( st===s?" selected":"")+">"+s+"</option>";}).join("");' +
  'return"<tr><td style=\'font-size:.7rem;color:#777\'>"+(p.theme||"—")+"</td><td><strong>"+(p.titre||"—")+"</strong><br><span style=\'color:#aaa;font-size:.68rem\'>"+(p.resume||"")+"</span></td>"' +
  '+"<td><span class=\'b "+bc(st)+"\'>"+st+"</span></td>"' +
  '+"<td>"+(p.annee||"—")+"</td>"' +
  '+"<td style=\'color:#c8a000\'>"+imp+"</td>"' +
  '+"<td><select class=\'status-sel\' onchange=\'updateStatus("+p.id+",this.value,"+JSON.stringify(p.titre)+")\'>" +opts+"</select></td>"' +
  '+"</tr>";' +
  '}).join("");}' +

  'function updateStatus(id,newSt,titre){' +
  'fetch("/api/statut",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Basic "+btoa(":vizille2026")},body:JSON.stringify({id:id,statut:newSt,titre:titre})})' +
  '.then(function(r){return r.json();}).then(function(d){' +
  'if(d.ok){ST[id]=newSt;NF.unshift(d.notif);go();showToast("Statut mis a jour : "+newSt);}' +
  '});}' +

  'function showToast(msg){var t=document.createElement("div");t.style.cssText="position:fixed;bottom:20px;right:20px;background:#1a3a2a;color:#fff;padding:10px 16px;border-radius:8px;font-size:.8rem;z-index:300;";t.textContent=msg;document.body.appendChild(t);setTimeout(function(){t.remove();},3000);}' +

  'function renderAgenda(){' +
  'var sorted=AG.slice().sort(function(a,b){return a.date>b.date?1:-1;});' +
  'var now=new Date().toISOString().slice(0,10);' +
  'document.getElementById("agenda-list").innerHTML=sorted.length?sorted.map(function(e){' +
  'var past=e.date<now;' +
  'var typeLabel={bureau:"Bureau",commission:"Commission",conseil:"Conseil municipal",autre:"Autre"}[e.type]||e.type;' +
  'return"<div class=\'card\'" + (past?" style=\'opacity:.6\'":"") + ">"' +
  '+"<div style=\'display:flex;align-items:flex-start;justify-content:space-between\'>"' +
  '+"<h4>"+e.titre+"</h4>"' +
  '+"<button class=\'btn btn-sm btn-red btn-ghost\' style=\'border-color:#fcc\' onclick=\'delAgenda("+e.id+")\'>&#10005;</button>"' +
  '+"</div>"' +
  '+"<p>&#128197; "+e.date+" &nbsp; &#128336; "+( e.heure||"")+" &nbsp; &#128205; "+(e.lieu||"")+"</p>"' +
  '+"<div class=\'meta\'><span class=\'b b3\'>"+typeLabel+"</span>"+(e.notes?" &nbsp; "+e.notes:"")+"</div>"' +
  '+"</div>";' +
  '}).join(""):"<p style=\'color:#aaa;font-size:.82rem\'>Aucune r\u00e9union programm\u00e9e.</p>";}' +

  'function renderDocs(){' +
  'document.getElementById("docs-list").innerHTML=DC.length?DC.map(function(d){' +
  'var typeLabel={cr:"Compte-rendu",delib:"D\u00e9lib\u00e9ration",rapport:"Rapport",autre:"Autre"}[d.type]||d.type;' +
  'return"<div class=\'card\'>"' +
  '+"<div style=\'display:flex;align-items:flex-start;justify-content:space-between\'>"' +
  '+"<h4><a href=\'"+d.url+"\' target=\'_blank\'>&#128196; "+d.titre+"</a></h4>"' +
  '+"<button class=\'btn btn-sm btn-red btn-ghost\' style=\'border-color:#fcc\' onclick=\'delDoc("+d.id+")\'>&#10005;</button>"' +
  '+"</div>"' +
  '+"<p><span class=\'b b3\'>"+typeLabel+"</span> &nbsp; "+d.date+"</p>"' +
  '+(d.notes?"<p class=\'meta\'>"+d.notes+"</p>":"")' +
  '+"</div>";' +
  '}).join(""):"<p style=\'color:#aaa;font-size:.82rem\'>Aucun document.</p>";}' +

  'function renderNotifs(){' +
  'document.getElementById("notifs-list").innerHTML=NF.length?NF.slice(0,50).map(function(n){' +
  'return"<div class=\'notif "+(n.new?"new":"old")+"\'>"' +
  '+"<div class=\'dot\'></div>"' +
  '+"<div><strong>"+n.titre+"</strong> &rarr; "+n.statut+"</div>"' +
  '+"<time>"+n.ts+"</time></div>";' +
  '}).join(""):"<p style=\'color:#aaa;font-size:.82rem\'>Aucune modification enregistr\u00e9e.</p>";}' +

  'function openModal(type){document.getElementById("modal-"+type).classList.add("open");}' +
  'function closeModal(){document.querySelectorAll(".modal-bg").forEach(function(m){m.classList.remove("open");});}' +
  'document.querySelectorAll(".modal-bg").forEach(function(m){m.addEventListener("click",function(e){if(e.target===m)closeModal();});});' +

  'function saveAgenda(){' +
  'var data={titre:document.getElementById("ag-titre").value,date:document.getElementById("ag-date").value,heure:document.getElementById("ag-heure").value,lieu:document.getElementById("ag-lieu").value,type:document.getElementById("ag-type").value,notes:document.getElementById("ag-notes").value};' +
  'fetch("/api/agenda",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Basic "+btoa(":vizille2026")},body:JSON.stringify(data)})' +
  '.then(function(r){return r.json();}).then(function(d){if(d.ok){AG.push(d.item);closeModal();renderAgenda();showToast("R\u00e9union ajout\u00e9e !");}});}' +

  'function delAgenda(id){if(!confirm("Supprimer ?"))return;' +
  'fetch("/api/agenda/"+id,{method:"DELETE",headers:{"Authorization":"Basic "+btoa(":vizille2026")}})' +
  '.then(function(r){return r.json();}).then(function(d){if(d.ok){AG=AG.filter(function(a){return a.id!==id;});renderAgenda();showToast("Supprim\u00e9");}})}' +

  'function saveDoc(){' +
  'var data={titre:document.getElementById("doc-titre").value,type:document.getElementById("doc-type").value,url:document.getElementById("doc-url").value,date:document.getElementById("doc-date").value,notes:document.getElementById("doc-notes").value};' +
  'fetch("/api/document",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Basic "+btoa(":vizille2026")},body:JSON.stringify(data)})' +
  '.then(function(r){return r.json();}).then(function(d){if(d.ok){DC.push(d.item);closeModal();renderDocs();showToast("Document ajout\u00e9 !");}});}' +

  'function delDoc(id){if(!confirm("Supprimer ?"))return;' +
  'fetch("/api/document/"+id,{method:"DELETE",headers:{"Authorization":"Basic "+btoa(":vizille2026")}})' +
  '.then(function(r){return r.json();}).then(function(d){if(d.ok){DC=DC.filter(function(d){return d.id!==id;});renderDocs();showToast("Supprim\u00e9");}});}' +


  'function createProjet(){' +
  'var titre=document.getElementById("np-titre").value.trim();' +
  'var resume=document.getElementById("np-resume").value.trim();' +
  'if(!titre||!resume){showToast("Titre et résumé obligatoires");return;}' +
  'var data={titre:titre,theme:document.getElementById("np-theme").value,statut:document.getElementById("np-statut").value,annee:document.getElementById("np-annee").value,importance:document.getElementById("np-importance").value,resume:resume,description:document.getElementById("np-description").value,tags:document.getElementById("np-tags").value};' +
  'fetch("/api/projet",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Basic "+btoa(":vizille2026")},body:JSON.stringify(data)})' +
  '.then(function(r){return r.json();}).then(function(d){' +
  'if(d.ok){' +
  'P.push(d.projet);' +
  'document.getElementById("np-result").innerHTML="<div style=\'background:#e8f0e8;border-radius:8px;padding:10px;font-size:.8rem;color:#363\'><strong>✓ Projet créé !</strong> ID #"+d.projet.id+" &mdash; "+d.projet.titre+"<br><small>Il apparaît maintenant dans l\'onglet Projets.</small></div>";' +
  'resetForm();showToast("Projet créé : "+d.projet.titre);' +
  '}});' +
  '}' +
  'function resetForm(){' +
  'var ids=["np-titre","np-resume","np-description","np-tags","np-annee"];' +
  'ids.forEach(function(id){document.getElementById(id).value="";});' +
  '}' +
  'go();' +
  'var CL=["#1a3a2a","#4a8a5a","#7ab87a","#aad4aa","#2a5a3a","#3a6a4a","#5a9a6a","#8ac08a","#b0d8b0","#c8e8c8","#1a4a2a","#2a6a4a","#6ab06a","#3a7a5a","#9ac89a"];' +
  'new Chart(document.getElementById("cT"),{type:"bar",data:{labels:' + JSON.stringify(thKeys) + ',datasets:[{data:' + JSON.stringify(thVals) + ',backgroundColor:CL,borderRadius:3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{font:{size:9}}},y:{ticks:{stepSize:1}}}}});' +
  'new Chart(document.getElementById("cS"),{type:"doughnut",data:{labels:' + JSON.stringify(stKeys) + ',datasets:[{data:' + JSON.stringify(stVals) + ',backgroundColor:["#a33","#363","#336","#863","#888","#4a8a5a","#669"]}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:"bottom",labels:{font:{size:9},padding:5}}}}});' +
  '</script></body></html>';
}

function readBody(req, cb) {
  var body = '';
  req.on('data', function(d) { body += d; if (body.length > 1e6) req.destroy(); });
  req.on('end', function() { try { cb(null, JSON.parse(body)); } catch(e) { cb(e); } });
}

function nextId(arr) { return arr.length ? Math.max.apply(null, arr.map(function(i){return i.id||0;})) + 1 : 1; }

const server = http.createServer(function(req, res) {
  const p = req.url.split('?')[0];
  const method = req.method;

  if (method === 'OPTIONS') { res.writeHead(200, {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,DELETE','Access-Control-Allow-Headers':'Content-Type,Authorization'}); return res.end(); }
  if (!checkAuth(req)) return deny(res);


  // API créer projet
  if (p === '/api/projet' && method === 'POST') {
    return readBody(req, function(err, data) {
      if (err) return json(res, {ok:false}, 400);
      var newId = projets.length ? Math.max.apply(null, projets.map(function(p){return p.id||0;})) + 1 : 9000;
      var projet = {
        id: newId,
        titre: data.titre || '',
        theme: data.theme || 'Autre',
        statut: data.statut || 'Programmé',
        annee: data.annee ? parseInt(data.annee) : null,
        budget: 0,
        resume: data.resume || '',
        description: data.description || '',
        importance: parseInt(data.importance) || 2,
        chiffres: [],
        tags: data.tags ? data.tags.split(',').map(function(t){return t.trim();}).filter(Boolean) : [],
        created: new Date().toISOString()
      };
      projets.push(projet);
      saveJSON('projets.json', projets);
      var notif = { id: Date.now(), titre: projet.titre, statut: 'CRÉÉ', ancien: '', ts: new Date().toLocaleString('fr-FR'), new: true };
      notifs.unshift(notif);
      saveJSON('notifs.json', notifs);
      return json(res, { ok: true, projet: projet });
    });
  }

  // API statut projet
  if (p === '/api/statut' && method === 'POST') {
    return readBody(req, function(err, data) {
      if (err) return json(res, {ok:false}, 400);
      var old = statuts[data.id] || 'ND';
      statuts[data.id] = data.statut;
      saveJSON('statuts.json', statuts);
      var ts = new Date().toLocaleString('fr-FR');
      var notif = { id: Date.now(), titre: data.titre, statut: data.statut, ancien: old, ts: ts, new: true };
      notifs.unshift(notif);
      if (notifs.length > 200) notifs = notifs.slice(0, 200);
      saveJSON('notifs.json', notifs);
      // Email notif
      notifs_emails.forEach(function(email) {
        sendEmail(email, '[VeM] Projet mis a jour : ' + data.titre, 'Projet : ' + data.titre + '\nNouveau statut : ' + data.statut + '\nAncien statut : ' + old + '\nDate : ' + ts);
      });
      // WordPress publish
      var projet = projets.find(function(pr) { return pr.id === data.id; });
      if (projet) publishToWP(projet, data.statut);
      return json(res, { ok: true, notif: notif });
    });
  }

  // API agenda
  if (p === '/api/agenda' && method === 'POST') {
    return readBody(req, function(err, data) {
      if (err) return json(res, {ok:false}, 400);
      data.id = nextId(agenda);
      agenda.push(data);
      saveJSON('agenda.json', agenda);
      return json(res, { ok: true, item: data });
    });
  }
  if (p.startsWith('/api/agenda/') && method === 'DELETE') {
    var id = parseInt(p.split('/').pop());
    agenda = agenda.filter(function(a) { return a.id !== id; });
    saveJSON('agenda.json', agenda);
    return json(res, { ok: true });
  }

  // API documents
  if (p === '/api/document' && method === 'POST') {
    return readBody(req, function(err, data) {
      if (err) return json(res, {ok:false}, 400);
      data.id = nextId(documents);
      documents.push(data);
      saveJSON('documents.json', documents);
      return json(res, { ok: true, item: data });
    });
  }
  if (p.startsWith('/api/document/') && method === 'DELETE') {
    var id = parseInt(p.split('/').pop());
    documents = documents.filter(function(d) { return d.id !== id; });
    saveJSON('documents.json', documents);
    return json(res, { ok: true });
  }

  // API data
  if (p === '/api/projets') { return json(res, projets); }
  if (p === '/api/stats') { return json(res, getStats()); }
  if (p === '/api/agenda') { return json(res, agenda); }
  if (p === '/api/documents') { return json(res, documents); }
  if (p === '/api/notifs') { return json(res, notifs); }

  if (p === '/' || p === '/dashboard') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(buildPage());
  }
  res.writeHead(404); res.end('404');
});

var notifs_emails = (process.env.NOTIF_EMAILS || '').split(',').filter(Boolean);

server.listen(PORT, function() {
  console.log('VeM Dashboard v2 port ' + PORT);
  console.log('projets.json charge: ' + projets.length + ' projets');
});
