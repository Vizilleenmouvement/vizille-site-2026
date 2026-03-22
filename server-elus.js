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
let chat      = load('chat.json', []);
let elus      = load('elus.json', require('./elus_default.json'));
let services  = load('services.json', require('./services_default.json'));
let projExtra = load('proj_extra.json', {}); // {id: {membres,chef_service,budget,subventions,contacts,notes}}

console.log('VeM Dashboard v6 — projets:'+projets.length+' elus:'+elus.length);

function auth(req) {
  const a=req.headers['authorization']||'';
  if(!a.startsWith('Basic ')) return false;
  return Buffer.from(a.slice(6),'base64').toString().split(':').slice(1).join(':') === PASSWORD;
}
function deny(res) {
  res.writeHead(401,{'WWW-Authenticate':'Basic realm="VeM Elus"','Content-Type':'text/html;charset=utf-8'});
  res.end('<div style="font-family:sans-serif;text-align:center;padding:4rem;color:#2e5e4e"><h2>Vizille en Mouvement — Espace élus</h2><p>Accès protégé — identifiants requis</p></div>');
}
function J(res,d,c){ res.writeHead(c||200,{'Content-Type':'application/json;charset=utf-8','Access-Control-Allow-Origin':'*'}); res.end(JSON.stringify(d)); }
function body(req,cb){ let b=''; req.on('data',d=>{b+=d;if(b.length>2e6)req.destroy();}); req.on('end',()=>{try{cb(null,JSON.parse(b));}catch(e){cb(e);}}); }
function nextId(a){ return a.length?Math.max(...a.map(i=>i.id||0))+1:1; }
function ts(){ return new Date().toLocaleString('fr-FR'); }

// ── Routes ──────────────────────────────────────────────────────────────────
const server = http.createServer(function(req, res) {
  const p = req.url.split('?')[0];
  const q = Object.fromEntries(new URL('http://x'+req.url).searchParams);
  const m = req.method;
  if(m==='OPTIONS'){res.writeHead(200,{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,PUT,DELETE','Access-Control-Allow-Headers':'Content-Type,Authorization'});return res.end();}
  if(!auth(req)) return deny(res);

  // ── GET /api/all ──────────────────────────────────────────────────────────
  if(p==='/api/all') return J(res,{
    projets, statuts, agenda, documents, notifs:notifs.slice(0,100),
    elus, services, chat:chat.slice(-50)
  });

  // ── GET /api/proj/:id ─────────────────────────────────────────────────────
  if(p.match(/^\/api\/proj\/\d+$/) && m==='GET') {
    const id=parseInt(p.split('/').pop());
    const base=projets.find(x=>x.id===id)||{};
    const extra=projExtra[id]||{membres:[],chef_service:'',budget_prevu:0,subventions:[],contacts:[],notes:''};
    return J(res,{...base,...extra,statut:statuts[id]||base.statut||'ND'});
  }

  // ── PUT /api/proj/:id ─────────────────────────────────────────────────────
  if(p.match(/^\/api\/proj\/\d+$/) && m==='PUT') {
    const id=parseInt(p.split('/').pop());
    return body(req,function(err,d){
      if(err)return J(res,{ok:false},400);
      // Mettre à jour statut si changé
      if(d.statut && d.statut !== (statuts[id]||'')) {
        const old=statuts[id]||'ND';
        statuts[id]=d.statut; save('statuts.json',statuts);
        notifs.unshift({id:Date.now(),titre:d.titre||'',statut:d.statut,ancien:old,ts:ts(),new:true});
        if(notifs.length>200)notifs=notifs.slice(0,200);
        save('notifs.json',notifs);
      }
      // Sauvegarder les extras
      projExtra[id]={
        membres:d.membres||[],
        chef_service:d.chef_service||'',
        budget_prevu:d.budget_prevu||0,
        subventions:d.subventions||[],
        contacts:d.contacts||[],
        notes:d.notes||''
      };
      save('proj_extra.json',projExtra);
      return J(res,{ok:true});
    });
  }

  // ── POST /api/statut ──────────────────────────────────────────────────────
  if(p==='/api/statut' && m==='POST') return body(req,function(err,d){
    if(err)return J(res,{ok:false},400);
    const old=statuts[d.id]||'ND';
    statuts[d.id]=d.statut; save('statuts.json',statuts);
    const notif={id:Date.now(),titre:d.titre,statut:d.statut,ancien:old,ts:ts(),new:true};
    notifs.unshift(notif); if(notifs.length>200)notifs=notifs.slice(0,200);
    save('notifs.json',notifs);
    return J(res,{ok:true,notif});
  });

  // ── AGENDA ────────────────────────────────────────────────────────────────
  if(p==='/api/agenda' && m==='POST') return body(req,function(err,d){
    if(err)return J(res,{ok:false},400);
    d.id=nextId(agenda); d.created=ts(); agenda.push(d); save('agenda.json',agenda);
    return J(res,{ok:true,item:d});
  });
  if(p.match(/^\/api\/agenda\/\d+$/) && m==='DELETE'){
    const id=parseInt(p.split('/').pop());
    agenda=agenda.filter(a=>a.id!==id); save('agenda.json',agenda); return J(res,{ok:true});
  }

  // ── DOCUMENTS ─────────────────────────────────────────────────────────────
  if(p==='/api/document' && m==='POST') return body(req,function(err,d){
    if(err)return J(res,{ok:false},400);
    d.id=nextId(documents); documents.push(d); save('documents.json',documents);
    return J(res,{ok:true,item:d});
  });
  if(p.match(/^\/api\/document\/\d+$/) && m==='DELETE'){
    const id=parseInt(p.split('/').pop());
    documents=documents.filter(d=>d.id!==id); save('documents.json',documents); return J(res,{ok:true});
  }

  // ── CHAT ──────────────────────────────────────────────────────────────────
  if(p==='/api/chat' && m==='GET'){
    const since=parseInt(q.since||0);
    const channel=q.channel||'general';
    const msgs=chat.filter(m=>m.channel===channel && m.id>since);
    return J(res,{ok:true,messages:msgs,lastId:chat.length?Math.max(...chat.map(m=>m.id)):0});
  }
  if(p==='/api/chat' && m==='POST') return body(req,function(err,d){
    if(err)return J(res,{ok:false},400);
    const msg={id:nextId(chat),channel:d.channel||'general',auteur:d.auteur||'Élu',avatar:d.avatar||'?',texte:d.texte||'',ts:ts(),date:new Date().toISOString()};
    chat.push(msg); if(chat.length>500)chat=chat.slice(-400);
    save('chat.json',chat);
    return J(res,{ok:true,message:msg});
  });

  // ── ÉLUS ──────────────────────────────────────────────────────────────────
  if(p==='/api/elus' && m==='GET') return J(res,elus);
  if(p==='/api/elus' && m==='POST') return body(req,function(err,d){
    if(err)return J(res,{ok:false},400);
    d.id=nextId(elus); elus.push(d); save('elus.json',elus);
    return J(res,{ok:true,item:d});
  });
  if(p.match(/^\/api\/elus\/\d+$/) && m==='PUT') return body(req,function(err,d){
    if(err)return J(res,{ok:false},400);
    const id=parseInt(p.split('/').pop());
    elus=elus.map(e=>e.id===id?{...e,...d}:e); save('elus.json',elus);
    return J(res,{ok:true});
  });

  // ── NOUVEAU PROJET ────────────────────────────────────────────────────────
  if(p==='/api/projet' && m==='POST') return body(req,function(err,d){
    if(err)return J(res,{ok:false},400);
    const newId=projets.length?Math.max(...projets.map(x=>x.id||0))+1:9000;
    const projet={id:newId,titre:d.titre||'',theme:d.theme||'Autre',statut:d.statut||'Programmé',annee:d.annee?parseInt(d.annee):null,budget:0,resume:d.resume||'',description:d.description||'',importance:parseInt(d.importance)||2,chiffres:[],tags:d.tags?d.tags.split(',').map(t=>t.trim()).filter(Boolean):[],created:new Date().toISOString()};
    projets.push(projet);
    // Extras
    if(d.chef_service||d.membres||d.budget_prevu) {
      projExtra[newId]={membres:d.membres||[],chef_service:d.chef_service||'',budget_prevu:d.budget_prevu||0,subventions:[],contacts:[],notes:d.notes||''};
      save('proj_extra.json',projExtra);
    }
    save('projets.json',projets);
    const notif={id:Date.now(),titre:projet.titre,statut:'CRÉÉ',ancien:'',ts:ts(),new:true};
    notifs.unshift(notif); save('notifs.json',notifs);
    return J(res,{ok:true,projet});
  });

  // ── CLAUDE AI ─────────────────────────────────────────────────────────────
  if(p==='/api/genere' && m==='POST') return body(req,function(err,d){
    if(err)return J(res,{ok:false,error:'Données invalides'},400);
    const KEY=process.env.ANTHROPIC_API_KEY||'';
    if(!KEY)return J(res,{ok:false,error:'Clé ANTHROPIC_API_KEY non configurée dans Infomaniak.'});
    const prompts={
      arrete:'Rédigez un arrêté municipal pour la Commune de Vizille (Isère 38431). Numéro, visas CGCT, considérants, articles. Sujet : ',
      deliberation:'Rédigez une délibération du conseil de Vizille. Objet, motifs, décision. Sujet : ',
      facebook:'Post Facebook pour Vizille en Mouvement. Ton chaleureux, emojis, 300 mots max. Sujet : ',
      communique:'Communiqué de presse Ville de Vizille. Titre, chapeau, corps, contact. Sujet : ',
      convocation:'Convocation conseil municipal Vizille art.L2121-10 CGCT. Date, heure, lieu, ODJ. Sujet : ',
      discours:'Discours pour élu de Vizille. Ton sincère et ancré territoire 2026-2032. Sujet : '
    };
    const prompt=(prompts[d.type]||'')+(d.sujet||'')+' Contexte: '+(d.contexte||'Vizille Isère 38431, Maire: Catherine Troton');
    const rb=JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1500,messages:[{role:'user',content:prompt}]});
    const opts={hostname:'api.anthropic.com',path:'/v1/messages',method:'POST',headers:{'Content-Type':'application/json','x-api-key':KEY,'anthropic-version':'2023-06-01','Content-Length':Buffer.byteLength(rb)}};
    const r2=https.request(opts,resp=>{let data='';resp.on('data',c=>data+=c);resp.on('end',()=>{try{const r=JSON.parse(data);return J(res,{ok:true,texte:(r.content&&r.content[0]&&r.content[0].text)||''});}catch(e){return J(res,{ok:false,error:'Erreur Claude'});}});});
    r2.on('error',e=>J(res,{ok:false,error:e.message}));
    r2.write(rb);r2.end();
  });

  // ── HTML ──────────────────────────────────────────────────────────────────
  if(p==='/' || p==='/dashboard'){
    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
    return res.end(require('./srv6-html').buildPage());
  }
  res.writeHead(404); res.end('404');
});

server.listen(PORT,()=>console.log('VeM v6 port '+PORT));
