const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PASSWORD = process.env.VEM_PASSWORD || 'vizille2026';

let projets = [];
try {
  projets = JSON.parse(fs.readFileSync(path.join(__dirname, 'projets.json'), 'utf8'));
  console.log('projets.json chargé: ' + projets.length + ' projets');
} catch(e) {
  console.error('Erreur projets.json:', e.message);
}

function checkAuth(req) {
  const a = req.headers['authorization'] || '';
  if (!a.startsWith('Basic ')) return false;
  const pass = Buffer.from(a.slice(6), 'base64').toString().split(':').slice(1).join(':');
  return pass === PASSWORD;
}

function deny(res) {
  res.writeHead(401, {
    'WWW-Authenticate': 'Basic realm="VeM Elus"',
    'Content-Type': 'text/plain; charset=utf-8'
  });
  res.end('Espace reserve aux elus de Vizille en Mouvement');
}

function getStats() {
  const t = {}, s = {}, a = {};
  projets.forEach(function(p) {
    var th = p.theme || 'Autre';
    var st = p.statut || 'ND';
    var an = p.annee ? String(p.annee) : '?';
    t[th] = (t[th] || 0) + 1;
    s[st] = (s[st] || 0) + 1;
    a[an] = (a[an] || 0) + 1;
  });
  return { themes: t, statuts: s, annees: a, total: projets.length };
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

  return '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>VeM - Espace elus</title>' +
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"></script>' +
    '<style>' +
    '*{box-sizing:border-box;margin:0;padding:0}' +
    'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#f4f4ef;color:#111}' +
    'header{background:#1a3a2a;color:#fff;padding:1rem 2rem;display:flex;align-items:center;gap:14px}' +
    '.logo{width:36px;height:36px;background:#4a8a5a;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.9rem;flex-shrink:0}' +
    'header h1{font-size:1rem;font-weight:500;flex:1}' +
    'header small{opacity:.6;font-size:.75rem}' +
    '.metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;padding:1.25rem 2rem 0}' +
    '.m{background:#fff;border-radius:10px;padding:.9rem 1rem;border:.5px solid #e0e0d8}' +
    '.m .v{font-size:1.8rem;font-weight:600;color:#1a3a2a}' +
    '.m .l{font-size:.7rem;color:#999;margin-top:2px}' +
    '.charts{display:grid;grid-template-columns:1.4fr 1fr;gap:14px;padding:1.25rem 2rem}' +
    '.cc{background:#fff;border-radius:10px;padding:1.1rem;border:.5px solid #e0e0d8}' +
    '.cc h3{font-size:.78rem;color:#666;margin-bottom:.9rem;font-weight:500}' +
    '.cw{position:relative;height:210px}' +
    '.ts{padding:0 2rem 2rem}' +
    '.ts h2{font-size:.82rem;color:#666;margin-bottom:.7rem;font-weight:500}' +
    '.fl{display:flex;gap:8px;margin-bottom:.9rem;flex-wrap:wrap;align-items:center}' +
    '.fl select,.fl input{padding:5px 8px;border:.5px solid #ddd;border-radius:6px;font-size:.76rem;background:#fff;outline:none}' +
    'table{width:100%;border-collapse:collapse;font-size:.76rem;background:#fff;border-radius:10px;overflow:hidden;border:.5px solid #e0e0d8}' +
    'th{background:#f0f0e8;padding:8px 11px;text-align:left;font-weight:500;color:#555;font-size:.72rem}' +
    'td{padding:7px 11px;border-top:.5px solid #f0f0e8;vertical-align:top}' +
    'tr:hover td{background:#f8f8f4}' +
    '.b{display:inline-block;padding:1px 6px;border-radius:4px;font-size:.67rem;font-weight:500}' +
    '.b1{background:#fde8e8;color:#a33}.b2{background:#e8f0e8;color:#363}.b3{background:#e8eef8;color:#336}.b4{background:#fef3e2;color:#863}.b5{background:#f0f0e8;color:#666}' +
    '@media(max-width:650px){.charts{grid-template-columns:1fr}.metrics{grid-template-columns:repeat(2,1fr)}}' +
    '</style></head><body>' +
    '<header><div class="logo">VM</div>' +
    '<h1>Vizille en Mouvement &mdash; Tableau de bord mandat 2026&ndash;2032</h1>' +
    '<small>Espace r&eacute;serv&eacute; aux &eacute;lus &middot; ' + today + '</small></header>' +
    '<div class="metrics">' +
    '<div class="m"><div class="v">' + stats.total + '</div><div class="l">Projets</div></div>' +
    '<div class="m"><div class="v">' + Object.keys(stats.themes).length + '</div><div class="l">Th&egrave;mes</div></div>' +
    '<div class="m"><div class="v">' + (stats.statuts['Prioritaire'] || 0) + '</div><div class="l">Prioritaires</div></div>' +
    '<div class="m"><div class="v">' + (stats.annees['2026'] || 0) + '</div><div class="l">Projets 2026</div></div>' +
    '<div class="m"><div class="v">' + (stats.annees['2027'] || 0) + '</div><div class="l">Projets 2027</div></div>' +
    '</div>' +
    '<div class="charts">' +
    '<div class="cc"><h3>Projets par th&egrave;me</h3><div class="cw"><canvas id="cT"></canvas></div></div>' +
    '<div class="cc"><h3>Par statut</h3><div class="cw"><canvas id="cS"></canvas></div></div>' +
    '</div>' +
    '<div class="ts"><h2>Liste des projets</h2>' +
    '<div class="fl">' +
    '<select id="fT" onchange="go()"><option value="">Tous les th&egrave;mes</option>' + themeOpts + '</select>' +
    '<select id="fS" onchange="go()"><option value="">Tous les statuts</option>' + statutOpts + '</select>' +
    '<select id="fA" onchange="go()"><option value="">Toutes les ann&eacute;es</option>' + anneeOpts + '</select>' +
    '<input id="fQ" placeholder="Rechercher..." oninput="go()" style="flex:1;min-width:100px">' +
    '<small id="cpt" style="color:#aaa;white-space:nowrap"></small>' +
    '</div>' +
    '<table><thead><tr><th>Th&egrave;me</th><th>Projet</th><th>Statut</th><th>Ann&eacute;e</th><th>Imp.</th></tr></thead>' +
    '<tbody id="tb"></tbody></table></div>' +
    '<script>var P=' + projetsData + ';' +
    'function bc(s){if(!s)return"b5";var l=s.toLowerCase();if(l.indexOf("prioritaire")>=0)return"b1";if(l.indexOf("programm")>=0)return"b2";if(l.indexOf("planifi")>=0)return"b3";if(l.indexOf("tude")>=0)return"b4";return"b5";}' +
    'function go(){var t=document.getElementById("fT").value,s=document.getElementById("fS").value,a=document.getElementById("fA").value,q=document.getElementById("fQ").value.toLowerCase();' +
    'var r=P.filter(function(p){var pa=p.annee?String(p.annee):"?",ps=p.statut||"ND";return(!t||p.theme===t)&&(!s||ps===s)&&(!a||pa===a)&&(!q||(p.titre||"").toLowerCase().indexOf(q)>=0||(p.resume||"").toLowerCase().indexOf(q)>=0);});' +
    'document.getElementById("cpt").textContent=r.length+" projet(s)";' +
    'document.getElementById("tb").innerHTML=r.map(function(p){var imp=p.importance?"\u2605".repeat(p.importance):"-";return"<tr><td style=\'font-size:.7rem;color:#777\'>"+(p.theme||"-")+"</td><td><strong>"+(p.titre||"-")+"</strong><br><span style=\'color:#aaa;font-size:.68rem\'>"+(p.resume||"")+"</span></td><td><span class=\'b "+bc(p.statut)+"\'>"+(p.statut||"-")+"</span></td><td>"+(p.annee||"-")+"</td><td style=\'color:#c8a000\'>"+(p.importance?"\u2605".repeat(p.importance):"-")+"</td></tr>";}).join("");}' +
    'go();' +
    'var CL=["#1a3a2a","#4a8a5a","#7ab87a","#aad4aa","#2a5a3a","#3a6a4a","#5a9a6a","#8ac08a","#b0d8b0","#c8e8c8","#1a4a2a","#2a6a4a","#6ab06a","#3a7a5a","#9ac89a"];' +
    'new Chart(document.getElementById("cT"),{type:"bar",data:{labels:' + JSON.stringify(thKeys) + ',datasets:[{data:' + JSON.stringify(thVals) + ',backgroundColor:CL,borderRadius:3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{font:{size:9}}},y:{ticks:{stepSize:1}}}}});' +
    'new Chart(document.getElementById("cS"),{type:"doughnut",data:{labels:' + JSON.stringify(stKeys) + ',datasets:[{data:' + JSON.stringify(stVals) + ',backgroundColor:["#a33","#363","#336","#863","#888","#669"]}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:"bottom",labels:{font:{size:9},padding:6}}}}});' +
    '</script></body></html>';
}

const server = http.createServer(function(req, res) {
  const p = req.url.split('?')[0];
  if (!checkAuth(req)) return deny(res);
  if (p === '/api/projets') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify(projets));
  }
  if (p === '/api/stats') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify(getStats()));
  }
  if (p === '/' || p === '/dashboard') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(buildPage());
  }
  res.writeHead(404);
  res.end('404');
});

server.listen(PORT, function() {
  console.log('VeM Dashboard port ' + PORT);
});
