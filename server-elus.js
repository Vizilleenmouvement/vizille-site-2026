
function buildPage() {
  const today = new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
  const COMM  = {"Culture, Patrimoine & Jumelages": ["Culture", "Patrimoine", "Jumelages"], "Mobilités": ["Mobilités"], "Transition écologique": ["Transition écologique"], "Action sociale": ["Action sociale"], "Concertation citoyenne": ["Concertation citoyenne"], "Animations de proximité": ["Animations de proximité"], "Économie": ["Économie"], "Métropole": ["Métropole"], "Enfance/Jeunesse": ["Enfance/Jeunesse"], "Tranquillité publique": ["Tranquillité publique"], "Travaux & Urbanisme": ["Travaux", "Urbanisme"], "Santé": ["Santé"]};
  const COLORS = {"Culture, Patrimoine & Jumelages": "#8B5CF6", "Mobilités": "#3B82F6", "Transition écologique": "#10B981", "Action sociale": "#F59E0B", "Concertation citoyenne": "#6366F1", "Animations de proximité": "#EC4899", "Économie": "#14B8A6", "Métropole": "#6B7280", "Enfance/Jeunesse": "#F97316", "Tranquillité publique": "#EF4444", "Travaux & Urbanisme": "#84CC16", "Santé": "#06B6D4"};
  const GUIDES = [{"id": "1", "titre": "Droit et devoir de l'élu", "icon": "⚖️", "contenu": "En tant que conseiller municipal, vous bénéficiez de protections juridiques et avez des obligations. Vous disposez d'un droit à la formation (18h/an rémunérées), d'une protection fonctionnelle, et d'indemnités de fonction si applicable. Vous êtes soumis au devoir de réserve et aux règles de déport en cas de conflit d'intérêts. Toute question : contactez le DGS ou l'AMF (amf.asso.fr)."}, {"id": "2", "titre": "Le conseil municipal : comment ça marche ?", "icon": "🏛️", "contenu": "Le conseil municipal se réunit au moins 4 fois/an, convoqué par le Maire au moins 5 jours avant (sauf urgence). L'ordre du jour est joint à la convocation. Vous pouvez poser des questions orales. Le vote est public (à main levée ou scrutin nominal) sauf cas particuliers. Une délibération est adoptée à la majorité simple. Vous devez vous déporter si vous avez un intérêt personnel dans une affaire."}, {"id": "3", "titre": "Comprendre le budget municipal", "icon": "💰", "contenu": "Le budget est voté en 2 parties : fonctionnement (charges courantes, personnel, services) et investissement (travaux, équipements). Vizille dispose d'environ 8-9M€ de budget annuel. Les subventions clés : DETR (État), GAM (Métropole Grenoble), Département Isère, Région AURA. Chaque commission peut proposer des lignes budgétaires. Le DOB (Débat d'Orientations Budgétaires) a lieu avant le vote du budget en décembre."}, {"id": "4", "titre": "Qui fait quoi en mairie ?", "icon": "🏢", "contenu": "Le DGS coordonne les services. Les principaux services : Technique (travaux, voirie), Culturel (patrimoine, médiathèque), CCAS (social, seniors), Police Municipale, Service Enfance/Périscolaire, Urbanisme, Communication. Pour toute question opérationnelle, passez par votre chef de service référent ou le DGS. Ne donnez jamais d'instructions directes aux agents — passez toujours par la hiérarchie."}, {"id": "5", "titre": "Conflit d'intérêts et déport", "icon": "🛡️", "contenu": "Si une délibération concerne directement vos intérêts personnels (famille, activité professionnelle, patrimoine), vous DEVEZ vous retirer de la salle avant le vote. Mentionnez-le au Maire avant la séance. En cas de doute, consultez le DGS. Le préfet peut déférer une délibération entachée de conflit d'intérêts au tribunal administratif."}, {"id": "6", "titre": "Droits à la formation", "icon": "🎓", "contenu": "Tout élu bénéficie de 18 heures de formation/an, remboursées sur le budget communal dans la limite d'un plafond légal. Organismes agréés : AMF Formation, CNFPT, universités. Sujets recommandés pour débutants : finances locales, urbanisme, marchés publics, communication institutionnelle. Demande à adresser au Maire avec justificatifs."}];
  const ELUS0  = [{"id": 1, "nom": "Catherine Troton", "prenom": "", "role": "Maire", "delegation": "Direction générale — Exécutif municipal", "commission": "", "tel": "", "email": "maire@vizille.fr", "avatar": "CT", "color": "#1a3a2a"}, {"id": 2, "nom": "Michel Troton", "prenom": "", "role": "Conseiller", "delegation": "Numérique, communication, histoire locale", "commission": "Culture, Patrimoine & Jumelages", "tel": "", "email": "", "avatar": "MT", "color": "#2d5a40"}, {"id": 3, "nom": "Marie-Claude", "prenom": "", "role": "Adjointe", "delegation": "Culture, Patrimoine, Jumelages", "commission": "Culture, Patrimoine & Jumelages", "tel": "", "email": "", "avatar": "MC", "color": "#8B5CF6"}, {"id": 4, "nom": "Angélique", "prenom": "", "role": "Adjointe", "delegation": "Enfance, Jeunesse, Périscolaire", "commission": "Enfance/Jeunesse", "tel": "", "email": "", "avatar": "AN", "color": "#F97316"}, {"id": 5, "nom": "Jean-Christophe", "prenom": "", "role": "Conseiller", "delegation": "Animations de proximité, Associations", "commission": "Animations de proximité", "tel": "", "email": "", "avatar": "JC", "color": "#EC4899"}];
  const RESS   = [{"titre": "Code Général des Collectivités", "url": "https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006070633/", "icon": "📚", "desc": "Texte de référence des élus locaux"}, {"titre": "AMF — Association des Maires", "url": "https://www.amf.asso.fr", "icon": "🏛", "desc": "Actualités, guides, formations"}, {"titre": "Maire-info", "url": "https://www.maire-info.com", "icon": "📰", "desc": "Actualité quotidienne des communes"}, {"titre": "Légifrance", "url": "https://www.legifrance.gouv.fr", "icon": "⚖️", "desc": "Textes législatifs et réglementaires"}, {"titre": "kMeet (Visio)", "url": "https://kmeet.infomaniak.com", "icon": "🎥", "desc": "Visioconférence sécurisée Infomaniak"}, {"titre": "kDrive (Documents)", "url": "https://kdrive.infomaniak.com", "icon": "📁", "desc": "Stockage partagé de l'équipe"}, {"titre": "Collectivités-locales.gouv", "url": "https://www.collectivites-locales.gouv.fr", "icon": "🏗", "desc": "Informations pour les élus locaux"}, {"titre": "Site Vizille en Mouvement", "url": "https://vizilleenmouvement.fr", "icon": "🌐", "desc": "Site public de la liste"}, {"titre": "WordPress Vizille", "url": "https://wp.vizilleenmouvement.fr", "icon": "🖥", "desc": "Site officiel de la commune"}];
  const PCOMM  = {"Culture, Patrimoine & Jumelages": 15, "Mobilités": 8, "Transition écologique": 11, "Action sociale": 4, "Concertation citoyenne": 5, "Animations de proximité": 9, "Économie": 5, "Métropole": 1, "Enfance/Jeunesse": 8, "Tranquillité publique": 11, "Travaux & Urbanisme": 12, "Santé": 2};
  const SLIST  = ["Prioritaire","Programme","Planifie","Etude","En cours","Realise","Suspendu"];

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VeM — Mon espace élu</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"><\/script>
<style>
:root{
  --g1:#0f2318;--g2:#1d3d2b;--g3:#2d5a40;--g4:#3d7a5a;--g5:#5a9a70;--g6:#7ab890;--g7:#b8d9c4;--g8:#e6f4ea;--g9:#f4fbf6;
  --warm:#f9f7f3;--w2:#f1ede5;--w3:#e4ddd1;--w4:#c8c2b8;
  --ink:#18201c;--i2:#3a4440;--i3:#6a7870;--i4:#9aaca4;
  --red:#dc2626;--amber:#d97706;--blue:#2563eb;--violet:#7c3aed;--pink:#db2777;--cyan:#0891b2;--lime:#65a30d;
  --fn:"Inter",sans-serif;--fd:"DM Sans",sans-serif;--fm:"JetBrains Mono",monospace;
  --r:8px;--R:14px;--rr:20px;
  --s1:0 1px 3px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.05);
  --s2:0 4px 16px rgba(0,0,0,.08),0 2px 6px rgba(0,0,0,.05);
  --s3:0 16px 48px rgba(0,0,0,.12),0 4px 12px rgba(0,0,0,.06);
  --sw:256px;--th:54px;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{font-size:14.5px;}
body{font-family:var(--fn);background:var(--warm);color:var(--ink);height:100vh;overflow:hidden;display:flex;flex-direction:column;-webkit-font-smoothing:antialiased;letter-spacing:.01em;}

/* ─ TOPBAR ─────────────────────────────────────────────── */
.top{height:var(--th);background:var(--g1);display:flex;align-items:center;padding:0 1.25rem;gap:12px;flex-shrink:0;z-index:200;box-shadow:0 2px 12px rgba(0,0,0,.25);}
.top-logo{display:flex;align-items:center;gap:10px;text-decoration:none;}
.top-badge{width:34px;height:34px;background:linear-gradient(135deg,var(--g4),var(--g3));border-radius:9px;display:flex;align-items:center;justify-content:center;font-family:var(--fd);font-weight:700;font-size:.82rem;color:#fff;box-shadow:0 2px 6px rgba(0,0,0,.2);}
.top-name{font-size:.84rem;font-weight:600;color:#fff;font-family:var(--fd);letter-spacing:.01em;}
.top-sub{font-size:.62rem;color:rgba(255,255,255,.38);display:block;margin-top:1px;}
.top-div{width:1px;height:26px;background:rgba(255,255,255,.12);}
.top-date{font-size:.7rem;color:rgba(255,255,255,.4);flex:1;}
.top-actions{display:flex;align-items:center;gap:8px;}
.tbtn{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border-radius:7px;font-size:.72rem;font-weight:600;cursor:pointer;font-family:var(--fn);border:none;transition:.15s;}
.tbtn-visio{background:var(--g4);color:#fff;}.tbtn-visio:hover{background:var(--g3);}
.tbtn-chat{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.85);}.tbtn-chat:hover{background:rgba(255,255,255,.18);}
.top-av{width:30px;height:30px;background:var(--g4);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.68rem;font-weight:700;color:#fff;cursor:pointer;border:1.5px solid rgba(255,255,255,.2);}
.chat-badge{width:7px;height:7px;background:var(--red);border-radius:50%;position:absolute;top:-2px;right:-2px;border:1.5px solid var(--g1);display:none;}

/* ─ LAYOUT ─────────────────────────────────────────────── */
.layout{display:flex;flex:1;overflow:hidden;}

/* ─ SIDEBAR ─────────────────────────────────────────────── */
.sb{width:var(--sw);background:var(--g1);flex-shrink:0;display:flex;flex-direction:column;overflow-y:auto;overflow-x:hidden;border-right:1px solid rgba(255,255,255,.06);}
.sb::-webkit-scrollbar{width:3px;}.sb::-webkit-scrollbar-thumb{background:rgba(255,255,255,.08);border-radius:2px;}
.sb-sec{padding:.8rem 1rem .2rem;font-size:.59rem;font-weight:700;color:rgba(255,255,255,.2);text-transform:uppercase;letter-spacing:.1em;font-family:var(--fd);}
.sb-it{display:flex;align-items:center;gap:9px;padding:.46rem 1rem .46rem 1.1rem;cursor:pointer;color:rgba(255,255,255,.52);font-size:.79rem;border-left:2px solid transparent;transition:all .15s;position:relative;}
.sb-it:hover{background:rgba(255,255,255,.06);color:rgba(255,255,255,.88);}
.sb-it.on{background:rgba(255,255,255,.1);color:#fff;border-left-color:var(--g6);font-weight:600;}
.sb-ic{width:18px;text-align:center;font-size:.9rem;flex-shrink:0;}
.sb-badge{font-size:.58rem;font-weight:700;background:var(--g4);color:#fff;padding:1px 6px;border-radius:8px;margin-left:auto;}
.sb-new{font-size:.56rem;font-weight:700;background:var(--red);color:#fff;padding:1px 5px;border-radius:8px;margin-left:auto;animation:blink 2s infinite;}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.4}}
.sb-ft{margin-top:auto;padding:.85rem 1rem;border-top:1px solid rgba(255,255,255,.07);font-size:.63rem;color:rgba(255,255,255,.2);line-height:1.7;}

/* ─ MAIN ─────────────────────────────────────────────────── */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
.ph{padding:.72rem 1.4rem;background:#fff;border-bottom:1px solid var(--w2);display:flex;align-items:center;gap:12px;flex-shrink:0;box-shadow:var(--s1);}
.ph-icon{width:36px;height:36px;border-radius:var(--r);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0;}
.ph-title{font-size:.94rem;font-weight:700;color:var(--ink);font-family:var(--fd);line-height:1.2;}
.ph-sub{font-size:.69rem;color:var(--i3);margin-top:1px;}
.ph-act{margin-left:auto;display:flex;gap:8px;align-items:center;}
.scr{flex:1;overflow-y:auto;padding:1.2rem 1.4rem;}
.scr::-webkit-scrollbar{width:4px;}.scr::-webkit-scrollbar-thumb{background:var(--w3);border-radius:2px;}

/* ─ PAGES ─────────────────────────────────────────────────── */
.page{display:none;}.page.on{display:block;}

/* ─ AUJOURD'HUI (accueil) ────────────────────────────────── */
.today-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;}
.today-card{background:#fff;border-radius:var(--R);border:1px solid var(--w2);box-shadow:var(--s1);overflow:hidden;}
.tc-head{padding:.75rem 1rem;border-bottom:1px solid var(--w2);display:flex;align-items:center;gap:8px;}
.tc-head-ico{font-size:1rem;}
.tc-head-t{font-size:.78rem;font-weight:700;color:var(--i2);font-family:var(--fd);}
.tc-head-act{margin-left:auto;}
.tc-body{padding:.75rem 1rem;}

/* ─ HERO ─────────────────────────────────────────────────── */
.hero{background:linear-gradient(135deg,var(--g1) 0%,var(--g2) 55%,var(--g3) 100%);border-radius:var(--rr);padding:1.5rem 1.75rem;color:#fff;display:flex;align-items:center;gap:1.5rem;margin-bottom:14px;position:relative;overflow:hidden;box-shadow:var(--s2);}
.hero::before{content:'';position:absolute;top:-50px;right:-50px;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,.04);}
.hero-ico{width:56px;height:56px;background:rgba(255,255,255,.12);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;border:1px solid rgba(255,255,255,.15);flex-shrink:0;position:relative;z-index:1;}
.hero-body{position:relative;z-index:1;}
.hero-t{font-size:1.1rem;font-weight:700;font-family:var(--fd);margin-bottom:.3rem;}
.hero-s{font-size:.78rem;opacity:.62;line-height:1.6;}

/* ─ KPI ROW ──────────────────────────────────────────────── */
.kpi-row{display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;}
.kpi{background:#fff;border-radius:var(--R);padding:.8rem 1rem;border:1px solid var(--w2);box-shadow:var(--s1);flex:1;min-width:120px;position:relative;overflow:hidden;}
.kpi::after{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;background:var(--g5);opacity:.5;}
.kpi-v{font-size:1.9rem;font-weight:800;color:var(--g2);line-height:1;font-variant-numeric:tabular-nums;font-family:var(--fd);}
.kpi-l{font-size:.65rem;color:var(--i3);margin-top:4px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;}

/* ─ PROCHAINE RÉUNION ─────────────────────────────────────── */
.next-mtg{background:linear-gradient(135deg,var(--g2),var(--g3));border-radius:var(--R);padding:1rem 1.2rem;color:#fff;display:flex;gap:14px;align-items:center;box-shadow:var(--s2);cursor:pointer;}
.next-mtg:hover{opacity:.92;}
.mtg-date-box{background:rgba(255,255,255,.15);border-radius:10px;padding:.5rem .7rem;text-align:center;border:1px solid rgba(255,255,255,.2);flex-shrink:0;}
.mtg-day{font-size:1.4rem;font-weight:800;line-height:1;font-family:var(--fd);}
.mtg-mon{font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-top:2px;opacity:.75;}
.mtg-info-t{font-size:.88rem;font-weight:700;margin-bottom:.25rem;font-family:var(--fd);}
.mtg-info-s{font-size:.73rem;opacity:.7;}
.mtg-badge{margin-left:auto;background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.2);color:#fff;font-size:.65rem;font-weight:700;padding:3px 9px;border-radius:8px;flex-shrink:0;}

/* ─ TÂCHES ────────────────────────────────────────────────── */
.task-item{display:flex;align-items:flex-start;gap:10px;padding:.6rem .5rem;border-radius:var(--r);transition:.15s;cursor:pointer;}
.task-item:hover{background:var(--warm);}
.task-cb{width:18px;height:18px;border-radius:5px;border:2px solid var(--w3);flex-shrink:0;display:flex;align-items:center;justify-content:center;margin-top:1px;transition:.15s;}
.task-cb.done{background:var(--g4);border-color:var(--g4);}
.task-txt{font-size:.78rem;color:var(--ink);line-height:1.4;flex:1;}
.task-txt.done{text-decoration:line-through;color:var(--i4);}
.task-del{background:none;border:none;color:var(--i4);cursor:pointer;font-size:.85rem;opacity:0;transition:.15s;padding:0 3px;}
.task-item:hover .task-del{opacity:1;}
.task-due{font-size:.65rem;color:var(--amber);font-weight:600;margin-top:2px;}
.task-add{display:flex;gap:8px;margin-top:.75rem;padding-top:.65rem;border-top:1px solid var(--w2);}
.task-add input{flex:1;padding:6px 9px;border:1.5px solid var(--w2);border-radius:7px;font-size:.76rem;font-family:var(--fn);outline:none;}
.task-add input:focus{border-color:var(--g4);}

/* ─ ANNONCES ──────────────────────────────────────────────── */
.ann-item{display:flex;gap:10px;padding:.65rem .5rem;border-radius:var(--r);margin-bottom:4px;}
.ann-item:hover{background:var(--warm);}
.ann-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:5px;}
.ann-body{flex:1;}
.ann-title{font-size:.78rem;font-weight:600;color:var(--ink);margin-bottom:2px;}
.ann-text{font-size:.72rem;color:var(--i3);line-height:1.4;}
.ann-meta{font-size:.63rem;color:var(--i4);margin-top:3px;font-family:var(--fm);}

/* ─ AGENDA CARDS ──────────────────────────────────────────── */
.ag-card{display:flex;gap:14px;align-items:flex-start;background:#fff;border-radius:var(--R);border:1px solid var(--w2);padding:.85rem 1rem;margin-bottom:10px;box-shadow:var(--s1);transition:.15s;}
.ag-card:hover{box-shadow:var(--s2);}
.ag-card.past{opacity:.45;}
.ag-dbox{flex-shrink:0;background:var(--g8);border-radius:var(--r);padding:.4rem .6rem;text-align:center;border:1px solid var(--g7);min-width:46px;}
.ag-day{font-size:1.25rem;font-weight:800;color:var(--g2);line-height:1;font-family:var(--fd);}
.ag-mon{font-size:.58rem;font-weight:700;color:var(--g4);text-transform:uppercase;margin-top:1px;}
.ag-inf{flex:1;}
.ag-it{font-size:.84rem;font-weight:600;font-family:var(--fd);}
.ag-im{font-size:.7rem;color:var(--i3);margin-top:3px;}
.ag-in{font-size:.68rem;color:var(--i3);margin-top:4px;line-height:1.4;}
.ag-type{font-size:.62rem;font-weight:700;padding:2px 7px;border-radius:7px;}
.at-b{background:#dbeafe;color:#1e40af;}.at-c{background:#dcfce7;color:#166534;}.at-k{background:#fef9c3;color:#854d0e;}.at-a{background:var(--w2);color:var(--i3);}

/* ─ COMMISSION GRID ───────────────────────────────────────── */
.cg{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;}
.cc{background:#fff;border-radius:var(--rr);border:1px solid var(--w2);box-shadow:var(--s1);overflow:hidden;cursor:pointer;transition:transform .18s,box-shadow .18s;}
.cc:hover{transform:translateY(-2px);box-shadow:var(--s3);}
.cc-top{height:76px;padding:.8rem 1rem;display:flex;align-items:flex-end;gap:10px;position:relative;}
.cc-ico{width:40px;height:40px;border-radius:10px;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;font-size:1.2rem;border:1px solid rgba(255,255,255,.2);}
.cc-ref{margin-left:auto;background:rgba(255,255,255,.18);color:#fff;font-size:.62rem;font-weight:600;padding:2px 7px;border-radius:7px;border:1px solid rgba(255,255,255,.18);}
.cc-body{padding:.85rem 1rem;}
.cc-title{font-size:.84rem;font-weight:700;font-family:var(--fd);color:var(--ink);margin-bottom:.2rem;line-height:1.3;}
.cc-themes{font-size:.65rem;color:var(--i3);margin-bottom:.75rem;}
.cc-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-bottom:.65rem;}
.cs{text-align:center;background:var(--warm);border-radius:7px;padding:.32rem .2rem;}
.cs-v{font-size:1.05rem;font-weight:800;line-height:1;font-family:var(--fd);}
.cs-l{font-size:.57rem;color:var(--i4);margin-top:2px;text-transform:uppercase;letter-spacing:.02em;}
.cc-prog{height:4px;background:var(--w2);border-radius:3px;}
.cc-fill{height:4px;border-radius:3px;transition:width .4s;}
.cc-pct{display:flex;justify-content:space-between;font-size:.63rem;color:var(--i4);margin-top:3px;}

/* ─ PROJETS TABLE ─────────────────────────────────────────── */
.tb-wrap{background:#fff;border-radius:var(--R);border:1px solid var(--w2);box-shadow:var(--s1);overflow:hidden;}
.fb{padding:.6rem 1.1rem;background:var(--warm);border-bottom:1px solid var(--w2);display:flex;align-items:center;gap:7px;flex-wrap:wrap;}
.fsel{padding:5px 8px;border:1px solid var(--w2);border-radius:7px;font-size:.73rem;background:#fff;color:var(--ink);outline:none;font-family:var(--fn);cursor:pointer;}
.fsel:focus{border-color:var(--g4);box-shadow:0 0 0 2px rgba(61,122,90,.1);}
.fsrch{padding:5px 9px;border:1px solid var(--w2);border-radius:7px;font-size:.73rem;background:#fff;color:var(--ink);outline:none;flex:1;min-width:150px;font-family:var(--fn);}
.fsrch:focus{border-color:var(--g4);}
.fcnt{font-size:.69rem;color:var(--i4);white-space:nowrap;}
table{width:100%;border-collapse:collapse;font-size:.76rem;}
thead{position:sticky;top:0;z-index:2;}
th{background:var(--warm);padding:8px 11px;text-align:left;font-size:.66rem;font-weight:700;color:var(--i3);border-bottom:2px solid var(--w2);text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;}
td{padding:8px 11px;border-bottom:1px solid var(--warm);vertical-align:middle;}
tr:last-child td{border-bottom:none;}
tr:hover td{background:var(--g9);cursor:pointer;}
.pn{font-weight:600;font-size:.78rem;color:var(--ink);font-family:var(--fd);}
.pr{font-size:.68rem;color:var(--i3);margin-top:1px;line-height:1.3;}
.chip{display:inline-block;font-size:.62rem;font-weight:700;background:var(--g8);color:var(--g2);padding:2px 7px;border-radius:8px;}

/* ─ BADGES ────────────────────────────────────────────────── */
.b{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:20px;font-size:.64rem;font-weight:700;white-space:nowrap;}
.b::before{content:'';width:5px;height:5px;border-radius:50%;background:currentColor;opacity:.8;}
.b-pr{background:#fee2e2;color:#b91c1c;}.b-pg{background:#dcfce7;color:#15803d;}.b-pl{background:#dbeafe;color:#1d4ed8;}
.b-et{background:#fef9c3;color:#a16207;}.b-ec{background:#ffedd5;color:#c2410c;}.b-re{background:#d1fae5;color:#065f46;}.b-nd{background:var(--w2);color:var(--i4);}

.ssel{padding:3px 6px;border:1px solid var(--w2);border-radius:6px;font-size:.69rem;background:#fff;color:var(--ink);cursor:pointer;outline:none;font-family:var(--fn);}

/* ─ ÉLUS ──────────────────────────────────────────────────── */
.elus-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;}
.elu{background:#fff;border-radius:var(--R);border:1px solid var(--w2);padding:.9rem 1rem;box-shadow:var(--s1);display:flex;gap:11px;align-items:flex-start;cursor:pointer;transition:.15s;}
.elu:hover{box-shadow:var(--s2);transform:translateY(-1px);}
.elu-av{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.88rem;font-weight:700;color:#fff;flex-shrink:0;font-family:var(--fd);}
.elu-name{font-size:.8rem;font-weight:700;font-family:var(--fd);color:var(--ink);}
.elu-role{font-size:.67rem;color:var(--i3);margin-top:2px;}
.elu-del{font-size:.65rem;color:var(--g3);margin-top:3px;font-weight:500;line-height:1.3;}

/* ─ GUIDES ────────────────────────────────────────────────── */
.guides-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.guide-card{background:#fff;border-radius:var(--R);border:1px solid var(--w2);box-shadow:var(--s1);cursor:pointer;transition:.15s;overflow:hidden;}
.guide-card:hover{box-shadow:var(--s2);transform:translateY(-1px);}
.guide-head{padding:.85rem 1rem;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--w2);}
.guide-ico{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;background:var(--g8);border:1px solid var(--g7);}
.guide-title{font-size:.82rem;font-weight:700;font-family:var(--fd);color:var(--ink);line-height:1.3;}
.guide-preview{padding:.75rem 1rem;font-size:.72rem;color:var(--i3);line-height:1.5;}
.guide-full{display:none;padding:.75rem 1rem;font-size:.74rem;color:var(--i2);line-height:1.7;border-top:2px solid var(--g8);}
.guide-card.open .guide-preview{display:none;}
.guide-card.open .guide-full{display:block;}
.guide-card.open{border-color:var(--g7);}

/* ─ RESSOURCES ────────────────────────────────────────────── */
.ress-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;}
.ress-card{background:#fff;border-radius:var(--R);border:1px solid var(--w2);padding:.85rem 1rem;box-shadow:var(--s1);text-decoration:none;display:flex;gap:10px;align-items:flex-start;transition:.15s;cursor:pointer;}
.ress-card:hover{box-shadow:var(--s2);transform:translateY(-1px);border-color:var(--g6);}
.ress-ico{width:36px;height:36px;border-radius:9px;background:var(--g8);border:1px solid var(--g7);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0;}
.ress-name{font-size:.78rem;font-weight:700;font-family:var(--fd);color:var(--ink);margin-bottom:3px;}
.ress-desc{font-size:.67rem;color:var(--i3);line-height:1.3;}

/* ─ DOCS ──────────────────────────────────────────────────── */
.dc-card{background:#fff;border-radius:var(--R);border:1px solid var(--w2);padding:.85rem 1rem;margin-bottom:10px;display:flex;gap:12px;align-items:flex-start;box-shadow:var(--s1);}
.dc-ico{width:40px;height:40px;border-radius:var(--r);background:var(--g8);border:1px solid var(--g7);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;}

/* ─ NOTIF ─────────────────────────────────────────────────── */
.nt{display:flex;align-items:center;gap:10px;padding:.58rem .8rem;background:#fff;border-radius:var(--r);border:1px solid var(--w2);margin-bottom:6px;font-size:.75rem;box-shadow:var(--s1);}
.nt-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
.nt-type{font-size:.6rem;font-weight:700;padding:1px 6px;border-radius:5px;}
.nt-tp{background:var(--g8);color:var(--g2);}
.nt-ta{background:#fef9c3;color:#a16207;}
.nt-tc{background:#dbeafe;color:#1d4ed8;}

/* ─ FORMES ────────────────────────────────────────────────── */
.ff{margin-bottom:.72rem;}
.ff label{display:block;font-size:.65rem;font-weight:700;color:var(--i3);margin-bottom:.3rem;text-transform:uppercase;letter-spacing:.05em;}
.fi{width:100%;padding:8px 10px;border:1.5px solid var(--w2);border-radius:var(--r);font-size:.78rem;color:var(--ink);background:#fff;outline:none;font-family:var(--fn);transition:.15s;}
.fi:focus{border-color:var(--g4);box-shadow:0 0 0 3px rgba(61,122,90,.1);}
textarea.fi{resize:vertical;min-height:80px;}
.fr2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}

/* ─ BOUTONS ───────────────────────────────────────────────── */
.btn{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:var(--r);font-size:.75rem;font-weight:600;cursor:pointer;border:1.5px solid transparent;font-family:var(--fn);transition:all .15s;text-decoration:none;}
.btn-p{background:var(--g2);color:#fff;border-color:var(--g2);}.btn-p:hover{background:var(--g1);}
.btn-s{background:#fff;color:var(--i2);border-color:var(--w2);}.btn-s:hover{background:var(--warm);}
.btn-g{background:transparent;color:var(--i3);border-color:transparent;}.btn-g:hover{background:var(--w2);}
.btn-d{background:#fee2e2;color:#b91c1c;border-color:#fca5a5;}.btn-d:hover{background:#fca5a5;}
.btn-sm{padding:4px 9px;font-size:.69rem;}
.btn-full{width:100%;justify-content:center;}

/* ─ MODALE ────────────────────────────────────────────────── */
.ov{display:none;position:fixed;inset:0;background:rgba(0,0,0,.48);z-index:500;align-items:center;justify-content:center;backdrop-filter:blur(3px);}
.ov.on{display:flex;}
.modal{background:#fff;border-radius:var(--rr);padding:1.5rem;width:min(520px,92vw);max-height:88vh;overflow-y:auto;box-shadow:0 24px 72px rgba(0,0,0,.2);animation:mIn .2s ease;}
@keyframes mIn{from{opacity:0;transform:scale(.96)translateY(8px)}to{opacity:1;transform:none}}
.mhd{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.2rem;}
.mhd h3{font-size:.96rem;font-weight:700;font-family:var(--fd);}
.mclose{background:none;border:none;cursor:pointer;color:var(--i3);font-size:1.2rem;border-radius:var(--r);padding:3px 7px;}
.mclose:hover{background:var(--warm);}
.mft{display:flex;gap:8px;justify-content:flex-end;margin-top:1.2rem;padding-top:1rem;border-top:1px solid var(--w2);}

/* ─ FICHE PROJET ─────────────────────────────────────────── */
.proj-modal{width:min(820px,95vw);}
.proj-ban{border-radius:12px;padding:1.25rem 1.5rem;color:#fff;margin-bottom:1.25rem;}
.proj-tabs{display:flex;gap:0;border-bottom:1px solid var(--w2);margin-bottom:1.25rem;overflow-x:auto;}
.ptab{padding:.5rem 1rem;font-size:.74rem;font-weight:600;color:var(--i3);cursor:pointer;border-bottom:2px solid transparent;transition:.15s;white-space:nowrap;}
.ptab.on{color:var(--g2);border-bottom-color:var(--g4);}
.ptab:hover{color:var(--ink);}
.psec{display:none;}.psec.on{display:block;}
.info-row{display:flex;gap:16px;align-items:flex-start;padding:.65rem 0;border-bottom:1px solid var(--warm);}
.info-row:last-child{border-bottom:none;}
.info-lbl{font-size:.67rem;font-weight:700;color:var(--i3);text-transform:uppercase;letter-spacing:.05em;width:130px;flex-shrink:0;padding-top:1px;}
.info-val{font-size:.78rem;color:var(--ink);flex:1;line-height:1.5;}
.member-chip{display:inline-flex;align-items:center;gap:5px;background:var(--g8);border:1px solid var(--g7);border-radius:8px;padding:3px 9px;margin:2px;font-size:.7rem;font-weight:600;color:var(--g2);}
.subv-row{display:flex;gap:8px;align-items:center;padding:.55rem .75rem;background:var(--warm);border-radius:var(--r);border:1px solid var(--w2);margin-bottom:6px;}
.subv-src{flex:1;font-size:.75rem;font-weight:600;}
.subv-mt{font-size:.74rem;color:var(--g2);font-family:var(--fm);font-weight:500;}
.subv-st{font-size:.63rem;padding:2px 7px;border-radius:6px;}
.ss-dem{background:#fef9c3;color:#a16207;}.ss-acc{background:#dcfce7;color:#166534;}.ss-ref{background:#fee2e2;color:#991b1b;}
.contact-card{background:var(--warm);border-radius:var(--r);border:1px solid var(--w2);padding:.65rem .85rem;margin-bottom:6px;font-size:.75rem;}

/* ─ TCHAT ─────────────────────────────────────────────────── */
.chat-panel{position:fixed;top:var(--th);right:0;bottom:0;width:min(340px,100vw);background:#fff;border-left:1px solid var(--w2);box-shadow:-6px 0 24px rgba(0,0,0,.1);z-index:400;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .25s ease;}
.chat-panel.on{transform:none;}
.chat-hd{padding:.75rem 1rem;border-bottom:1px solid var(--w2);display:flex;align-items:center;gap:8px;background:var(--g1);}
.chat-hd-t{font-size:.82rem;font-weight:700;color:#fff;flex:1;font-family:var(--fd);}
.chat-sel{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.18);color:#fff;border-radius:6px;font-size:.69rem;padding:3px 7px;font-family:var(--fn);}
.chat-x{background:none;border:none;color:rgba(255,255,255,.65);font-size:1.1rem;cursor:pointer;}
.chat-msgs{flex:1;overflow-y:auto;padding:.7rem;display:flex;flex-direction:column;gap:8px;background:var(--warm);}
.chat-msgs::-webkit-scrollbar{width:3px;}.chat-msgs::-webkit-scrollbar-thumb{background:var(--w3);border-radius:2px;}
.msg-w{display:flex;flex-direction:column;gap:2px;}
.msg-meta{font-size:.59rem;color:var(--i4);padding:0 6px;}
.msg-bub{background:#fff;border-radius:10px 10px 10px 3px;padding:.5rem .7rem;font-size:.75rem;color:var(--ink);box-shadow:var(--s1);max-width:88%;border:1px solid var(--w2);line-height:1.45;}
.msg-w.me .msg-meta{text-align:right;}
.msg-w.me .msg-bub{background:var(--g3);color:#fff;border-radius:10px 10px 3px 10px;border-color:var(--g3);align-self:flex-end;}
.chat-in{padding:.7rem;border-top:1px solid var(--w2);display:flex;gap:7px;background:#fff;}
.chat-in input{flex:1;padding:7px 10px;border:1.5px solid var(--w2);border-radius:var(--r);font-size:.76rem;font-family:var(--fn);outline:none;}
.chat-in input:focus{border-color:var(--g4);}
.chat-send{background:var(--g3);border:none;color:#fff;border-radius:var(--r);padding:7px 11px;cursor:pointer;font-size:.78rem;}

/* ─ CHARTS ────────────────────────────────────────────────── */
.ch-row{display:grid;grid-template-columns:1.6fr 1fr;gap:12px;margin-bottom:14px;}
.ch-card{background:#fff;border-radius:var(--R);border:1px solid var(--w2);box-shadow:var(--s1);padding:1rem;}
.ch-t{font-size:.76rem;font-weight:700;font-family:var(--fd);color:var(--i2);margin-bottom:.7rem;display:flex;align-items:center;gap:6px;}
.ch-t::before{content:'';width:3px;height:12px;background:var(--g4);border-radius:2px;}
.ch-w{position:relative;height:180px;}

/* ─ TOAST ─────────────────────────────────────────────────── */
.toast{position:fixed;bottom:22px;right:22px;background:var(--g1);color:#fff;padding:10px 18px;border-radius:var(--R);font-size:.77rem;font-weight:500;z-index:1000;display:none;box-shadow:var(--s3);border:1px solid rgba(255,255,255,.1);animation:mIn .2s;}

/* ─ RESPONSIVE ───────────────────────────────────────────── */
@media(max-width:900px){.sb{display:none;}.ch-row{grid-template-columns:1fr;}.cg{grid-template-columns:1fr;}.guides-grid{grid-template-columns:1fr;}.fr2{grid-template-columns:1fr;}.today-grid{grid-template-columns:1fr;}}

/* ─ EMPTY STATE ──────────────────────────────────────────── */
.empty{text-align:center;padding:3rem 1rem;color:var(--i3);}
.empty-ico{font-size:2.5rem;margin-bottom:.75rem;}
.empty-t{font-size:.88rem;font-weight:600;font-family:var(--fd);margin-bottom:.4rem;}
.empty-s{font-size:.74rem;color:var(--i4);}

/* ─ COMM DETAIL BANNER ───────────────────────────────────── */
.cdet-ban{border-radius:var(--R);padding:1.2rem 1.5rem;color:#fff;display:flex;align-items:center;gap:1.2rem;margin-bottom:14px;box-shadow:var(--s2);}
.cdet-ico{width:50px;height:50px;background:rgba(255,255,255,.15);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;border:1px solid rgba(255,255,255,.2);flex-shrink:0;}
.cdet-info h2{font-size:1.05rem;font-weight:800;font-family:var(--fd);margin-bottom:.2rem;}
.cdet-info p{font-size:.74rem;opacity:.7;}
</style>
</head>
<body>

<!-- TOPBAR -->
<div class="top">
  <div class="top-logo">
    <div class="top-badge">VM</div>
    <div>
      <div class="top-name">Vizille en Mouvement</div>
      <span class="top-sub">Espace élus · Mandat 2026–2032</span>
    </div>
  </div>
  <div class="top-div"></div>
  <span class="top-date" id="tdate">${today}</span>
  <div class="top-actions">
    <button class="tbtn tbtn-visio" onclick="openVisio()">🎥 Visio</button>
    <button class="tbtn tbtn-chat" onclick="toggleChat()" style="position:relative">💬 Tchat<span class="chat-badge" id="cbadge"></span></button>
    <div class="top-av" title="Michel T.">MT</div>
  </div>
</div>

<div class="layout">

<!-- SIDEBAR -->
<aside class="sb">
  <div class="sb-sec">Mon espace</div>
  <div class="sb-it on" onclick="gp('today',this)"><span class="sb-ic">📋</span>Aujourd'hui</div>
  <div class="sb-it" onclick="gp('guide',this)"><span class="sb-ic">📖</span>Guide de l'élu</div>
  <div class="sb-it" onclick="gp('ressources',this)"><span class="sb-ic">🔗</span>Ressources utiles</div>

  <div class="sb-sec">Le mandat</div>
  <div class="sb-it" onclick="gp('agenda',this)"><span class="sb-ic">📅</span>Agenda des réunions</div>
  <div class="sb-it" onclick="gp('docs',this)"><span class="sb-ic">📄</span>Documents</div>
  <div class="sb-it" onclick="gp('elus',this)"><span class="sb-ic">🧑‍💼</span>L'équipe (29 élus)</div>

  <div class="sb-sec">Projets du programme</div>
  <div class="sb-it" onclick="gp('comm',this)"><span class="sb-ic">👥</span>Par commission<span class="sb-badge" id="sb-tot">91</span></div>
  <div class="sb-it" onclick="gp('global',this)"><span class="sb-ic">📊</span>Tous les projets</div>
  <div class="sb-it" onclick="gp('creer',this)"><span class="sb-ic">✚</span>Nouveau projet</div>

  <div class="sb-sec">Outils</div>
  <div class="sb-it" onclick="gp('comms',this)"><span class="sb-ic">✍</span>Rédiger un document</div>
  <div class="sb-it" onclick="gp('budget',this)"><span class="sb-ic">📈</span>Budget comparatif</div>
  <div class="sb-it" onclick="gp('hist',this)"><span class="sb-ic">🔔</span>Historique</div>

  <div class="sb-ft">elus.vizilleenmouvement.fr<br>Node.js · Infomaniak Suisse</div>
</aside>

<main class="main">

<!-- ░░ AUJOURD'HUI ░░ -->
<div class="page on" id="p-today">
  <div class="ph">
    <div class="ph-icon" style="background:var(--g8)">📋</div>
    <div><div class="ph-title">Aujourd'hui</div><div class="ph-sub" id="ph-date">Chargement…</div></div>
    <div class="ph-act"><button class="btn btn-p btn-sm" onclick="om('annonce')">📢 Publier une annonce</button></div>
  </div>
  <div class="scr">
    <!-- PROCHAINE RÉUNION -->
    <div id="next-mtg-wrap" style="margin-bottom:14px"></div>
    <div class="today-grid">
      <!-- MES TÂCHES -->
      <div class="today-card">
        <div class="tc-head"><span class="tc-head-ico">✅</span><span class="tc-head-t">Mes tâches</span></div>
        <div class="tc-body">
          <div id="task-list"></div>
          <div class="task-add">
            <input id="task-inp" placeholder="Ajouter une tâche…" onkeydown="if(event.key==='Enter')addTask()">
            <button class="btn btn-p btn-sm" onclick="addTask()">+</button>
          </div>
        </div>
      </div>
      <!-- ANNONCES DE L'ÉQUIPE -->
      <div class="today-card">
        <div class="tc-head"><span class="tc-head-ico">📢</span><span class="tc-head-t">Annonces de l'équipe</span></div>
        <div class="tc-body" id="ann-list">
          <div class="empty"><div class="empty-ico">📭</div><div class="empty-s">Aucune annonce pour l'instant</div></div>
        </div>
      </div>
    </div>
    <!-- STATS -->
    <div class="kpi-row">
      <div class="kpi"><div class="kpi-v" id="k-tot">—</div><div class="kpi-l">Projets au programme</div></div>
      <div class="kpi"><div class="kpi-v" id="k-pr">—</div><div class="kpi-l">Prioritaires</div></div>
      <div class="kpi"><div class="kpi-v" id="k-26">—</div><div class="kpi-l">Projets 2026</div></div>
      <div class="kpi"><div class="kpi-v" id="k-re">—</div><div class="kpi-l">Réalisés</div></div>
      <div class="kpi"><div class="kpi-v" id="k-ec">—</div><div class="kpi-l">En cours</div></div>
    </div>
    <!-- CHARTS -->
    <div class="ch-row">
      <div class="ch-card"><div class="ch-t">Projets par thème</div><div class="ch-w"><canvas id="chT"></canvas></div></div>
      <div class="ch-card"><div class="ch-t">Statuts</div><div class="ch-w"><canvas id="chS"></canvas></div></div>
    </div>
  </div>
</div>

<!-- ░░ GUIDE DE L'ÉLU ░░ -->
<div class="page" id="p-guide">
  <div class="ph">
    <div class="ph-icon" style="background:#fef9c3">📖</div>
    <div><div class="ph-title">Guide pratique de l'élu</div><div class="ph-sub">Tout ce qu'il faut savoir pour exercer son mandat sereinement</div></div>
  </div>
  <div class="scr">
    <div style="background:linear-gradient(135deg,var(--g1),var(--g3));border-radius:var(--rr);padding:1.4rem 1.6rem;color:#fff;margin-bottom:14px;box-shadow:var(--s2);">
      <div style="font-size:1.05rem;font-weight:700;font-family:var(--fd);margin-bottom:.35rem;">📖 Guide pratique du conseiller municipal</div>
      <div style="font-size:.78rem;opacity:.65;line-height:1.6;">Cliquez sur un sujet pour le développer. Ces fiches vous aident à comprendre votre rôle, vos droits et vos obligations en tant qu'élu de Vizille.</div>
    </div>
    <div class="guides-grid" id="guides-grid"></div>
  </div>
</div>

<!-- ░░ RESSOURCES ░░ -->
<div class="page" id="p-ressources">
  <div class="ph">
    <div class="ph-icon" style="background:var(--g8)">🔗</div>
    <div><div class="ph-title">Ressources utiles</div><div class="ph-sub">Liens essentiels pour l'exercice de votre mandat</div></div>
  </div>
  <div class="scr">
    <div class="ress-grid" id="ress-grid"></div>
  </div>
</div>

<!-- ░░ AGENDA ░░ -->
<div class="page" id="p-agenda">
  <div class="ph">
    <div class="ph-icon" style="background:#dbeafe">📅</div>
    <div><div class="ph-title">Agenda des réunions</div><div class="ph-sub">Bureau municipal · Commissions · Conseil municipal</div></div>
    <div class="ph-act"><button class="btn btn-p btn-sm" onclick="om('agenda')">+ Ajouter</button></div>
  </div>
  <div class="scr"><div id="ag-list"></div></div>
</div>

<!-- ░░ DOCUMENTS ░░ -->
<div class="page" id="p-docs">
  <div class="ph">
    <div class="ph-icon" style="background:var(--g8)">📄</div>
    <div><div class="ph-title">Documents partagés</div><div class="ph-sub">CR, délibérations, rapports — accès rapide</div></div>
    <div class="ph-act"><button class="btn btn-p btn-sm" onclick="om('doc')">+ Ajouter</button></div>
  </div>
  <div class="scr"><div id="dc-list"></div></div>
</div>

<!-- ░░ ÉLUS ░░ -->
<div class="page" id="p-elus">
  <div class="ph">
    <div class="ph-icon" style="background:var(--g8)">🧑‍💼</div>
    <div><div class="ph-title">L'équipe — 29 conseillers</div><div class="ph-sub">Délégations, commissions et contacts</div></div>
  </div>
  <div class="scr">
    <div style="background:#fff;border-radius:var(--R);border:1px solid var(--w2);padding:1rem 1.2rem;margin-bottom:14px;box-shadow:var(--s1);font-size:.78rem;color:var(--i2);line-height:1.6;">
      <strong style="font-family:var(--fd)">Maire&nbsp;:</strong> Catherine Troton &nbsp;·&nbsp;
      <strong style="font-family:var(--fd)">Conseil élu le&nbsp;:</strong> 15 mars 2026 &nbsp;·&nbsp;
      <strong style="font-family:var(--fd)">Durée du mandat&nbsp;:</strong> 2026–2032 &nbsp;·&nbsp;
      <strong style="font-family:var(--fd)">Commune&nbsp;:</strong> Vizille, Isère (38431)
    </div>
    <div class="elus-grid" id="elus-grid"></div>
    <div style="margin-top:14px;padding:1rem 1.2rem;background:#fff;border-radius:var(--R);border:1px solid var(--w2);font-size:.75rem;color:var(--i3);box-shadow:var(--s1)">
      ℹ️ Pour mettre à jour les informations de contact, cliquez sur la fiche d'un élu. Les données sont partagées entre tous les membres du tableau de bord.
    </div>
  </div>
</div>

<!-- ░░ PAR COMMISSION ░░ -->
<div class="page" id="p-comm">
  <div class="ph">
    <div class="ph-icon" style="background:var(--g8)">👥</div>
    <div><div class="ph-title">Projets par commission</div><div class="ph-sub">Cliquez sur une commission pour accéder à sa page de suivi</div></div>
    <div class="ph-act"><button class="btn btn-s btn-sm" onclick="gp('global',qss('.sb-it:nth-child(11)'))">📊 Tous les projets</button></div>
  </div>
  <div class="scr"><div class="cg" id="cg"></div></div>
</div>

<!-- ░░ DÉTAIL COMMISSION ░░ -->
<div class="page" id="p-cdet">
  <div class="ph">
    <div class="ph-icon" style="background:var(--g8)" id="cdet-ico">📋</div>
    <div><div class="ph-title" id="cdet-t">Commission</div><div class="ph-sub" id="cdet-s"></div></div>
    <div class="ph-act"><button class="btn btn-s btn-sm" onclick="gp('comm',qss('.sb-it:nth-child(10)'))">← Toutes les commissions</button></div>
  </div>
  <div class="scr" style="padding:0">
    <div style="padding:.85rem 1.4rem;background:#fff;border-bottom:1px solid var(--w2)" id="cdet-kpis"></div>
    <div class="fb">
      <select class="fsel" id="cd-st" onchange="fCD()"><option value="">Tous statuts</option></select>
      <input class="fsrch" id="cd-q" placeholder="🔍  Rechercher…" oninput="fCD()">
      <span class="fcnt" id="cd-cnt"></span>
    </div>
    <div class="tb-wrap" style="border-radius:0;border-left:none;border-right:none;border-bottom:none">
      <table><thead><tr><th>Thème</th><th>Projet</th><th>Statut</th><th>Année</th><th>Imp.</th><th>Modifier</th></tr></thead>
      <tbody id="cd-tb"></tbody></table>
    </div>
  </div>
</div>

<!-- ░░ TOUS LES PROJETS ░░ -->
<div class="page" id="p-global">
  <div class="ph">
    <div class="ph-icon" style="background:#e0e7ff">📊</div>
    <div><div class="ph-title">Tous les projets du mandat</div><div class="ph-sub">91 projets · filtres et mise à jour de statut</div></div>
    <div class="ph-act"><button class="btn btn-s btn-sm" onclick="gp('comm',qss('.sb-it:nth-child(10)'))">👥 Par commission</button></div>
  </div>
  <div class="scr" style="padding:0">
    <div class="fb">
      <select class="fsel" id="fC" onchange="fG()"><option value="">Toutes commissions</option></select>
      <select class="fsel" id="fT" onchange="fG()"><option value="">Tous thèmes</option></select>
      <select class="fsel" id="fS" onchange="fG()"><option value="">Tous statuts</option></select>
      <select class="fsel" id="fA" onchange="fG()"><option value="">Toutes années</option></select>
      <input class="fsrch" id="fQ" placeholder="🔍  Rechercher un projet…" oninput="fG()">
      <span class="fcnt" id="fCnt"></span>
    </div>
    <div class="tb-wrap" style="border-radius:0;border-left:none;border-right:none;border-bottom:none">
      <table>
        <thead><tr><th>Commission</th><th>Projet</th><th>Statut</th><th>Année</th><th>Imp.</th><th>Modifier</th></tr></thead>
        <tbody id="g-tb"></tbody>
      </table>
    </div>
  </div>
</div>

<!-- ░░ NOUVEAU PROJET ░░ -->
<div class="page" id="p-creer">
  <div class="ph">
    <div class="ph-icon" style="background:var(--g8)">✚</div>
    <div><div class="ph-title">Nouveau projet</div><div class="ph-sub">Ajouter un projet hors programme initial</div></div>
  </div>
  <div class="scr">
    <div style="background:#fff;border-radius:var(--R);border:1px solid var(--w2);padding:1.4rem;max-width:580px;box-shadow:var(--s1)">
      <div class="fr2">
        <div class="ff" style="grid-column:1/-1"><label>Titre *</label><input class="fi" id="np-t" placeholder="Intitulé complet du projet"></div>
        <div class="ff"><label>Thème / Commission</label>
          <select class="fi" id="np-th"><option value="">— Choisir —</option>
          <option>Mobilités</option><option>Tranquillité publique</option><option>Enfance/Jeunesse</option>
          <option>Travaux</option><option>Transition écologique</option><option>Urbanisme</option>
          <option>Culture</option><option>Patrimoine</option><option>Action sociale</option>
          <option>Animations de proximité</option><option>Concertation citoyenne</option>
          <option>Économie</option><option>Santé</option><option>Jumelages</option><option>Métropole</option>
          </select>
        </div>
        <div class="ff"><label>Statut initial</label>
          <select class="fi" id="np-s"><option>Programmé</option><option>Prioritaire</option><option>Planifié</option><option>En cours</option><option>Étude</option></select>
        </div>
        <div class="ff"><label>Année prévue</label><input class="fi" id="np-a" placeholder="2026, 2027…"></div>
        <div class="ff"><label>Importance</label>
          <select class="fi" id="np-i"><option value="1">★ Faible</option><option value="2">★★ Normale</option><option value="3" selected>★★★ Haute</option></select>
        </div>
        <div class="ff" style="grid-column:1/-1"><label>Résumé *</label><input class="fi" id="np-r" placeholder="Description en une ligne"></div>
        <div class="ff" style="grid-column:1/-1"><label>Description</label><textarea class="fi" id="np-d" placeholder="Contexte, objectifs, étapes…"></textarea></div>
        <div class="ff" style="grid-column:1/-1"><label>Tags</label><input class="fi" id="np-tags" placeholder="Seniors, Accessibilité…"></div>
      </div>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn btn-g" onclick="resetNP()">Réinitialiser</button>
        <button class="btn btn-p" onclick="createP()">✓ Créer le projet</button>
      </div>
      <div id="np-res" style="margin-top:.85rem"></div>
    </div>
  </div>
</div>

<!-- ░░ RÉDIGER UN DOCUMENT ░░ -->
<div class="page" id="p-comms">
  <div class="ph">
    <div class="ph-icon" style="background:#f3e8ff">✍</div>
    <div><div class="ph-title">Rédiger un document</div><div class="ph-sub">Assisté par Claude AI — arrêtés, délibérations, discours, posts…</div></div>
  </div>
  <div class="scr">
    <div style="display:grid;grid-template-columns:1fr 1.3fr;gap:14px;align-items:start">
      <div style="background:#fff;border-radius:var(--R);border:1px solid var(--w2);padding:1.25rem;box-shadow:var(--s1)">
        <div class="ff"><label>Type de document</label>
          <select class="fi" id="ct">
            <option value="arrete">Arrêté municipal</option>
            <option value="deliberation">Délibération du conseil</option>
            <option value="question">Question orale au conseil</option>
            <option value="courrier">Courrier officiel</option>
            <option value="facebook">Post Facebook / Réseaux sociaux</option>
            <option value="communique">Communiqué de presse</option>
            <option value="convocation">Convocation au conseil municipal</option>
            <option value="discours">Discours / Allocution</option>
          </select>
        </div>
        <div class="ff"><label>Sujet / Instructions</label>
          <textarea class="fi" id="cs" style="height:140px" placeholder="Décrivez précisément le document souhaité…"></textarea>
        </div>
        <div class="ff"><label>Contexte supplémentaire</label>
          <input class="fi" id="cc" placeholder="Réunion du 15 avril, 18h30, Salle du conseil…">
        </div>
        <button class="btn btn-p btn-full" onclick="genC()">✨ Générer avec Claude AI</button>
        <div id="c-st" style="font-size:.7rem;color:var(--i3);text-align:center;margin-top:.55rem;min-height:1.1rem"></div>
      </div>
      <div style="background:#fff;border-radius:var(--R);border:1px solid var(--w2);padding:1.25rem;box-shadow:var(--s1);display:flex;flex-direction:column;min-height:500px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem;padding-bottom:.65rem;border-bottom:1px solid var(--w2)">
          <span style="font-size:.8rem;font-weight:700;font-family:var(--fd);color:var(--i2)">Document généré</span>
          <button class="btn btn-g btn-sm" onclick="copyC()">📋 Copier</button>
        </div>
        <textarea class="fi" id="cr" style="flex:1;min-height:400px;font-size:.75rem;line-height:1.72;background:var(--warm);border-color:transparent;resize:none" placeholder="Le document apparaîtra ici…"></textarea>
      </div>
    </div>
  </div>
</div>

<!-- ░░ BUDGET ░░ -->
<div class="page" id="p-budget">
  <div class="ph">
    <div class="ph-icon" style="background:#dcfce7">📈</div>
    <div><div class="ph-title">Budget comparatif</div><div class="ph-sub">Tableau de suivi 2025–2026–2027</div></div>
    <div class="ph-act"><label class="btn btn-p btn-sm" style="cursor:pointer">📂 Importer CSV<input type="file" id="bf" accept=".csv" style="display:none" onchange="impB(this)"></label></div>
  </div>
  <div class="scr">
    <div style="background:#fff;border-radius:var(--R);border:1px solid var(--w2);padding:1rem 1.2rem;margin-bottom:14px;font-size:.77rem;color:var(--i3);box-shadow:var(--s1)">
      <strong style="color:var(--i2)">Format CSV&nbsp;:</strong>
      <code style="font-family:var(--fm);background:var(--warm);padding:2px 7px;border-radius:5px;display:inline-block;margin-top:5px;font-size:.71rem">Poste,Budget2025,Budget2026,Prevision2027</code>
    </div>
    <div id="btable"></div>
  </div>
</div>

<!-- ░░ HISTORIQUE ░░ -->
<div class="page" id="p-hist">
  <div class="ph">
    <div class="ph-icon" style="background:#fef9c3">🔔</div>
    <div><div class="ph-title">Historique des activités</div><div class="ph-sub">Modifications de statut, nouveaux projets, annonces</div></div>
  </div>
  <div class="scr"><div id="nt-list"></div></div>
</div>

</main>
</div><!-- /.layout -->

<!-- ░░ TCHAT PANEL ░░ -->
<div class="chat-panel" id="chat-panel">
  <div class="chat-hd">
    <span class="chat-hd-t">💬 Tchat de l'équipe</span>
    <select class="chat-sel" id="chat-ch" onchange="switchChannel()">
      <option value="general">💬 Général</option>
      <option value="bureau">🏛 Bureau</option>
      <option value="culture">🎭 Culture</option>
      <option value="mobilites">🚲 Mobilités</option>
      <option value="ecologie">🌿 Écologie</option>
      <option value="social">🤝 Social</option>
      <option value="enfance">👦 Enfance</option>
      <option value="tranquillite">🛡 Tranquillité</option>
      <option value="travaux">🏗 Travaux</option>
    </select>
    <button class="chat-x" onclick="toggleChat()">×</button>
  </div>
  <div class="chat-msgs" id="chat-msgs"></div>
  <div class="chat-in">
    <input id="chat-inp" placeholder="Votre message…" onkeydown="if(event.key==='Enter')sendMsg()">
    <button class="chat-send" onclick="sendMsg()">→</button>
  </div>
</div>

<!-- ░░ MODALES ░░ -->
<div class="ov" id="ov-agenda">
  <div class="modal">
    <div class="mhd"><h3>📅 Ajouter une réunion</h3><button class="mclose" onclick="cm()">×</button></div>
    <div class="ff"><label>Titre *</label><input class="fi" id="ag-ti" placeholder="Ex : Bureau municipal — planification Q2"></div>
    <div class="fr2">
      <div class="ff"><label>Date</label><input class="fi" type="date" id="ag-d"></div>
      <div class="ff"><label>Heure</label><input class="fi" id="ag-h" placeholder="18h30"></div>
    </div>
    <div class="ff"><label>Lieu</label><input class="fi" id="ag-l" placeholder="Salle du conseil, Mairie de Vizille…"></div>
    <div class="ff"><label>Type</label>
      <select class="fi" id="ag-ty">
        <option value="bureau">Bureau municipal</option>
        <option value="commission">Commission thématique</option>
        <option value="conseil">Conseil municipal</option>
        <option value="autre">Autre</option>
      </select>
    </div>
    <div class="ff"><label>Ordre du jour / Notes</label><textarea class="fi" id="ag-n" placeholder="Points à l'ordre du jour, informations pratiques…"></textarea></div>
    <div class="mft"><button class="btn btn-g" onclick="cm()">Annuler</button><button class="btn btn-p" onclick="svAg()">Enregistrer</button></div>
  </div>
</div>

<div class="ov" id="ov-doc">
  <div class="modal">
    <div class="mhd"><h3>📄 Ajouter un document</h3><button class="mclose" onclick="cm()">×</button></div>
    <div class="ff"><label>Titre *</label><input class="fi" id="dc-ti" placeholder="Nom du document"></div>
    <div class="fr2">
      <div class="ff"><label>Type</label>
        <select class="fi" id="dc-ty">
          <option value="cr">Compte-rendu</option><option value="delib">Délibération</option>
          <option value="rapport">Rapport</option><option value="autre">Autre</option>
        </select>
      </div>
      <div class="ff"><label>Date</label><input class="fi" type="date" id="dc-d"></div>
    </div>
    <div class="ff"><label>Lien (kDrive, Google Drive, URL)</label><input class="fi" type="url" id="dc-u" placeholder="https://…"></div>
    <div class="ff"><label>Description</label><textarea class="fi" id="dc-n" placeholder="Résumé, contexte…"></textarea></div>
    <div class="mft"><button class="btn btn-g" onclick="cm()">Annuler</button><button class="btn btn-p" onclick="svDc()">Enregistrer</button></div>
  </div>
</div>

<div class="ov" id="ov-annonce">
  <div class="modal">
    <div class="mhd"><h3>📢 Publier une annonce</h3><button class="mclose" onclick="cm()">×</button></div>
    <div style="background:var(--g8);border:1px solid var(--g7);border-radius:var(--r);padding:.75rem;font-size:.75rem;color:var(--g2);margin-bottom:1rem">
      Les annonces sont visibles par tous les membres connectés sur la page "Aujourd'hui".
    </div>
    <div class="ff"><label>Titre *</label><input class="fi" id="ann-ti" placeholder="Ex : Réunion reportée, Document disponible…"></div>
    <div class="ff"><label>Message</label><textarea class="fi" id="ann-tx" placeholder="Détails de l'annonce…"></textarea></div>
    <div class="ff"><label>Priorité</label>
      <select class="fi" id="ann-pr">
        <option value="normal">Normal</option>
        <option value="important">Important</option>
        <option value="urgent">Urgent</option>
      </select>
    </div>
    <div class="mft"><button class="btn btn-g" onclick="cm()">Annuler</button><button class="btn btn-p" onclick="svAnn()">Publier</button></div>
  </div>
</div>

<div class="ov" id="ov-elu">
  <div class="modal">
    <div class="mhd"><h3 id="ov-elu-title">Fiche élu</h3><button class="mclose" onclick="cm()">×</button></div>
    <div id="ov-elu-body"></div>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
var COMM = {"Culture, Patrimoine & Jumelages": ["Culture", "Patrimoine", "Jumelages"], "Mobilités": ["Mobilités"], "Transition écologique": ["Transition écologique"], "Action sociale": ["Action sociale"], "Concertation citoyenne": ["Concertation citoyenne"], "Animations de proximité": ["Animations de proximité"], "Économie": ["Économie"], "Métropole": ["Métropole"], "Enfance/Jeunesse": ["Enfance/Jeunesse"], "Tranquillité publique": ["Tranquillité publique"], "Travaux & Urbanisme": ["Travaux", "Urbanisme"], "Santé": ["Santé"]};
var COLORS = {"Culture, Patrimoine & Jumelages": "#8B5CF6", "Mobilités": "#3B82F6", "Transition écologique": "#10B981", "Action sociale": "#F59E0B", "Concertation citoyenne": "#6366F1", "Animations de proximité": "#EC4899", "Économie": "#14B8A6", "Métropole": "#6B7280", "Enfance/Jeunesse": "#F97316", "Tranquillité publique": "#EF4444", "Travaux & Urbanisme": "#84CC16", "Santé": "#06B6D4"};
var GUIDES = [{"id": "1", "titre": "Droit et devoir de l'élu", "icon": "⚖️", "contenu": "En tant que conseiller municipal, vous bénéficiez de protections juridiques et avez des obligations. Vous disposez d'un droit à la formation (18h/an rémunérées), d'une protection fonctionnelle, et d'indemnités de fonction si applicable. Vous êtes soumis au devoir de réserve et aux règles de déport en cas de conflit d'intérêts. Toute question : contactez le DGS ou l'AMF (amf.asso.fr)."}, {"id": "2", "titre": "Le conseil municipal : comment ça marche ?", "icon": "🏛️", "contenu": "Le conseil municipal se réunit au moins 4 fois/an, convoqué par le Maire au moins 5 jours avant (sauf urgence). L'ordre du jour est joint à la convocation. Vous pouvez poser des questions orales. Le vote est public (à main levée ou scrutin nominal) sauf cas particuliers. Une délibération est adoptée à la majorité simple. Vous devez vous déporter si vous avez un intérêt personnel dans une affaire."}, {"id": "3", "titre": "Comprendre le budget municipal", "icon": "💰", "contenu": "Le budget est voté en 2 parties : fonctionnement (charges courantes, personnel, services) et investissement (travaux, équipements). Vizille dispose d'environ 8-9M€ de budget annuel. Les subventions clés : DETR (État), GAM (Métropole Grenoble), Département Isère, Région AURA. Chaque commission peut proposer des lignes budgétaires. Le DOB (Débat d'Orientations Budgétaires) a lieu avant le vote du budget en décembre."}, {"id": "4", "titre": "Qui fait quoi en mairie ?", "icon": "🏢", "contenu": "Le DGS coordonne les services. Les principaux services : Technique (travaux, voirie), Culturel (patrimoine, médiathèque), CCAS (social, seniors), Police Municipale, Service Enfance/Périscolaire, Urbanisme, Communication. Pour toute question opérationnelle, passez par votre chef de service référent ou le DGS. Ne donnez jamais d'instructions directes aux agents — passez toujours par la hiérarchie."}, {"id": "5", "titre": "Conflit d'intérêts et déport", "icon": "🛡️", "contenu": "Si une délibération concerne directement vos intérêts personnels (famille, activité professionnelle, patrimoine), vous DEVEZ vous retirer de la salle avant le vote. Mentionnez-le au Maire avant la séance. En cas de doute, consultez le DGS. Le préfet peut déférer une délibération entachée de conflit d'intérêts au tribunal administratif."}, {"id": "6", "titre": "Droits à la formation", "icon": "🎓", "contenu": "Tout élu bénéficie de 18 heures de formation/an, remboursées sur le budget communal dans la limite d'un plafond légal. Organismes agréés : AMF Formation, CNFPT, universités. Sujets recommandés pour débutants : finances locales, urbanisme, marchés publics, communication institutionnelle. Demande à adresser au Maire avec justificatifs."}];
var ELUS0 = [{"id": 1, "nom": "Catherine Troton", "prenom": "", "role": "Maire", "delegation": "Direction générale — Exécutif municipal", "commission": "", "tel": "", "email": "maire@vizille.fr", "avatar": "CT", "color": "#1a3a2a"}, {"id": 2, "nom": "Michel Troton", "prenom": "", "role": "Conseiller", "delegation": "Numérique, communication, histoire locale", "commission": "Culture, Patrimoine & Jumelages", "tel": "", "email": "", "avatar": "MT", "color": "#2d5a40"}, {"id": 3, "nom": "Marie-Claude", "prenom": "", "role": "Adjointe", "delegation": "Culture, Patrimoine, Jumelages", "commission": "Culture, Patrimoine & Jumelages", "tel": "", "email": "", "avatar": "MC", "color": "#8B5CF6"}, {"id": 4, "nom": "Angélique", "prenom": "", "role": "Adjointe", "delegation": "Enfance, Jeunesse, Périscolaire", "commission": "Enfance/Jeunesse", "tel": "", "email": "", "avatar": "AN", "color": "#F97316"}, {"id": 5, "nom": "Jean-Christophe", "prenom": "", "role": "Conseiller", "delegation": "Animations de proximité, Associations", "commission": "Animations de proximité", "tel": "", "email": "", "avatar": "JC", "color": "#EC4899"}];
var RESS = [{"titre": "Code Général des Collectivités", "url": "https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006070633/", "icon": "📚", "desc": "Texte de référence des élus locaux"}, {"titre": "AMF — Association des Maires", "url": "https://www.amf.asso.fr", "icon": "🏛", "desc": "Actualités, guides, formations"}, {"titre": "Maire-info", "url": "https://www.maire-info.com", "icon": "📰", "desc": "Actualité quotidienne des communes"}, {"titre": "Légifrance", "url": "https://www.legifrance.gouv.fr", "icon": "⚖️", "desc": "Textes législatifs et réglementaires"}, {"titre": "kMeet (Visio)", "url": "https://kmeet.infomaniak.com", "icon": "🎥", "desc": "Visioconférence sécurisée Infomaniak"}, {"titre": "kDrive (Documents)", "url": "https://kdrive.infomaniak.com", "icon": "📁", "desc": "Stockage partagé de l'équipe"}, {"titre": "Collectivités-locales.gouv", "url": "https://www.collectivites-locales.gouv.fr", "icon": "🏗", "desc": "Informations pour les élus locaux"}, {"titre": "Site Vizille en Mouvement", "url": "https://vizilleenmouvement.fr", "icon": "🌐", "desc": "Site public de la liste"}, {"titre": "WordPress Vizille", "url": "https://wp.vizilleenmouvement.fr", "icon": "🖥", "desc": "Site officiel de la commune"}];
var PCOMM = {"Culture, Patrimoine & Jumelages": 15, "Mobilités": 8, "Transition écologique": 11, "Action sociale": 4, "Concertation citoyenne": 5, "Animations de proximité": 9, "Économie": 5, "Métropole": 1, "Enfance/Jeunesse": 8, "Tranquillité publique": 11, "Travaux & Urbanisme": 12, "Santé": 2};
var SLIST = ["Prioritaire","Programmé","Planifié","Étude","En cours","Réalisé","Suspendu"];
var _ci=0, chT=null, chS=null, _chatLastId=0, _chatTimer=null;
var P=[], ST={}, AG=[], DC=[], NF=[], CHAT=[], ELUS=ELUS0.slice(), ANN=[], TASKS=[];
var _auth = 'Basic '+btoa(':vizille2026');
var ME = {nom:'Michel Troton', avatar:'MT'};

/* ── UTILS ─────────────────────────────────────────────────────────── */
function $(id){return document.getElementById(id);}
function qss(s){return document.querySelector(s);}
function qsa(s){return document.querySelectorAll(s);}
function v(id){var e=$(id);return e?e.value:'';}
function el(id,val){var e=$(id);if(e)e.textContent=val;}
function apiGet(u){return fetch(u,{headers:{Authorization:_auth}}).then(r=>r.json());}
function apiPost(u,d){return fetch(u,{method:'POST',headers:{'Content-Type':'application/json',Authorization:_auth},body:JSON.stringify(d)}).then(r=>r.json());}
function apiPut(u,d){return fetch(u,{method:'PUT',headers:{'Content-Type':'application/json',Authorization:_auth},body:JSON.stringify(d)}).then(r=>r.json());}
function apiDel(u){return fetch(u,{method:'DELETE',headers:{Authorization:_auth}}).then(r=>r.json());}
function toast(m,t=2500){var e=$('toast');e.textContent=m;e.style.display='block';setTimeout(()=>e.style.display='none',t);}
function om(id){$(('ov-'+id)).classList.add('on');}
function cm(){qsa('.ov').forEach(o=>o.classList.remove('on'));}
qsa('.ov').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)cm();}));

/* ── INIT ──────────────────────────────────────────────────────────── */
function init(){
  var now = new Date();
  $('tdate').textContent = now.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  $('ph-date').textContent = now.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});

  apiGet('/api/all').then(d=>{
    ST=d.statuts; AG=d.agenda; DC=d.documents; NF=d.notifs;
    CHAT=d.chat; ELUS=d.elus&&d.elus.length?d.elus:ELUS0;
    ANN=d.annonces||[]; TASKS=d.tasks||[];
    if(d.stats){
      el('k-tot',d.stats.total); el('k-pr',d.stats.prioritaires);
      el('k-26',d.stats.annee2026); el('k-re',d.stats.realises); el('k-ec',d.stats.en_cours);
      el('sb-tot',d.stats.total);
    }
    renderTasks(); renderAnn(); renderNextMtg();
    buildFilters(); buildGuides(); buildRess(); buildElus(); buildCG();
    renderAg(); renderDc(); renderNt();
    // Charger les projets
    apiGet('/api/projets').then(data=>{
      P=data; fG(); fCD(); buildCharts();
    });
  });

  // Polling chat toutes les 6s
  _chatTimer = setInterval(pollChat, 6000);
  renderChatMsgs([]);
}

/* ── NAVIGATION ────────────────────────────────────────────────────── */
function gp(id,ni){
  qsa('.page').forEach(p=>p.classList.remove('on'));
  qsa('.sb-it').forEach(n=>n.classList.remove('on'));
  var pg=$('p-'+id); if(pg)pg.classList.add('on');
  if(ni)ni.classList.add('on');
}

/* ── ACCUEIL ────────────────────────────────────────────────────────── */
function renderNextMtg(){
  var now=new Date().toISOString().slice(0,10);
  var next=AG.filter(a=>a.date>=now).sort((a,b)=>a.date>b.date?1:-1)[0];
  var wrap=$('next-mtg-wrap');
  if(!next){wrap.innerHTML='';return;}
  var MOIS=['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
  var TMAP={bureau:'Bureau municipal',commission:'Commission',conseil:'Conseil municipal',autre:'Autre'};
  wrap.innerHTML='<div class="next-mtg" onclick="gp('agenda',qss('.sb-it:nth-child(8)'))">'
    +'<div class="mtg-date-box"><div class="mtg-day">'+next.date.slice(8)+'</div><div class="mtg-mon">'+MOIS[+next.date.slice(5,7)-1]+'</div></div>'
    +'<div><div class="mtg-info-t">Prochaine réunion : '+next.titre+'</div>'
    +'<div class="mtg-info-s">'+(next.heure?'🕐 '+next.heure+' — ':'')+( next.lieu?'📍 '+next.lieu:'')+(next.notes?'<br>'+next.notes:'')+'</div></div>'
    +'<span class="mtg-badge">'+(TMAP[next.type]||next.type)+'</span>'
    +'</div>';
}

/* ── TÂCHES ─────────────────────────────────────────────────────────── */
function renderTasks(){
  var tl=$('task-list');
  if(!TASKS.length){tl.innerHTML='<div style="font-size:.74rem;color:var(--i4);padding:.5rem 0">Aucune tâche. Ajoutez-en une ci-dessous !</div>';return;}
  tl.innerHTML=TASKS.map(t=>'<div class="task-item" onclick="toggleTask('+t.id+')">'
    +'<div class="task-cb'+(t.done?' done':'')+'">'+( t.done?'<svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>':'')+
    '</div><div class="task-txt'+(t.done?' done':'')+'">'+t.titre+(t.echeance?'<div class="task-due">⏰ '+t.echeance+'</div>':'')+'</div>'
    +'<button class="task-del" onclick="event.stopPropagation();delTask('+t.id+')">×</button>'
    +'</div>').join('');
}
function addTask(){
  var inp=$('task-inp'),titre=inp.value.trim();
  if(!titre)return;
  apiPost('/api/tasks',{titre}).then(d=>{if(d.ok){TASKS.push(d.item);renderTasks();inp.value='';}});
}
function toggleTask(id){
  apiPut('/api/tasks/'+id+'/done',{}).then(d=>{
    if(d.ok){TASKS=TASKS.map(t=>t.id===id?{...t,done:!t.done}:t);renderTasks();}
  });
}
function delTask(id){
  apiDel('/api/tasks/'+id).then(d=>{if(d.ok){TASKS=TASKS.filter(t=>t.id!==id);renderTasks();}});
}

/* ── ANNONCES ───────────────────────────────────────────────────────── */
var ANN_COLORS={normal:'var(--g4)',important:'var(--amber)',urgent:'var(--red)'};
function renderAnn(){
  var al=$('ann-list');
  if(!ANN.length){al.innerHTML='<div class="empty"><div class="empty-ico">📭</div><div class="empty-s">Aucune annonce pour l'instant</div></div>';return;}
  al.innerHTML=ANN.slice(0,8).map(a=>'<div class="ann-item">'
    +'<div class="ann-dot" style="background:'+(ANN_COLORS[a.priorite]||'var(--g4)')+'"></div>'
    +'<div class="ann-body"><div class="ann-title">'+a.titre+'</div>'
    +(a.texte?'<div class="ann-text">'+a.texte+'</div>':'')
    +'<div class="ann-meta">'+a.ts+'</div></div>'
    +'<button class="btn btn-d btn-sm" style="flex-shrink:0;align-self:flex-start" onclick="delAnn('+a.id+')">×</button>'
    +'</div>').join('');
}
function svAnn(){
  var d={titre:v('ann-ti'),texte:v('ann-tx'),priorite:v('ann-pr')};
  if(!d.titre){toast('Titre obligatoire');return;}
  apiPost('/api/annonces',d).then(r=>{if(r.ok){ANN.unshift(r.item);renderAnn();cm();toast('Annonce publiée');}});
}
function delAnn(id){
  apiDel('/api/annonces/'+id).then(d=>{if(d.ok){ANN=ANN.filter(a=>a.id!==id);renderAnn();}});
}

/* ── GUIDES ─────────────────────────────────────────────────────────── */
function buildGuides(){
  $('guides-grid').innerHTML=GUIDES.map(g=>'<div class="guide-card" onclick="toggleGuide(this)">'
    +'<div class="guide-head"><div class="guide-ico">'+g.icon+'</div><div class="guide-title">'+g.titre+'</div></div>'
    +'<div class="guide-preview">'+g.contenu.substring(0,90)+'…</div>'
    +'<div class="guide-full">'+g.contenu+'</div>'
    +'</div>').join('');
}
function toggleGuide(card){card.classList.toggle('open');}

/* ── RESSOURCES ─────────────────────────────────────────────────────── */
function buildRess(){
  $('ress-grid').innerHTML=RESS.map(r=>'<a href="'+r.url+'" target="_blank" class="ress-card">'
    +'<div class="ress-ico">'+r.icon+'</div>'
    +'<div><div class="ress-name">'+r.titre+'</div><div class="ress-desc">'+r.desc+'</div></div>'
    +'</a>').join('');
}

/* ── ÉLUS ───────────────────────────────────────────────────────────── */
var ELU_BG=['#1d3d2b','#2d5a40','#3d7a5a','#8B5CF6','#F97316','#EC4899','#F59E0B','#3B82F6','#10B981','#EF4444','#14B8A6','#6366F1'];
function buildElus(){
  $('elus-grid').innerHTML=ELUS.map((e,i)=>'<div class="elu" onclick="openElu('+i+')">'
    +'<div class="elu-av" style="background:'+(e.color||ELU_BG[i%ELU_BG.length])+'">'+e.avatar+'</div>'
    +'<div><div class="elu-name">'+(e.prenom?e.prenom+' ':'')+e.nom+'</div>'
    +'<div class="elu-role">'+e.role+'</div>'
    +(e.delegation?'<div class="elu-del">'+e.delegation+'</div>':'')
    +'</div></div>').join('');
}
function openElu(i){
  var e=ELUS[i];
  $('ov-elu-title').textContent='🧑‍💼 '+(e.prenom?e.prenom+' ':'')+e.nom;
  $('ov-elu-body').innerHTML='<div style="display:flex;flex-direction:column;gap:8px">'
    +'<div style="display:flex;gap:12px;align-items:center;padding:.85rem;background:var(--warm);border-radius:var(--r)">'
    +'<div style="width:52px;height:52px;border-radius:50%;background:'+(e.color||'var(--g3)')+';display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:700;color:#fff">'+e.avatar+'</div>'
    +'<div><div style="font-size:.95rem;font-weight:700;font-family:var(--fd)">'+(e.prenom?e.prenom+' ':'')+e.nom+'</div>'
    +'<div style="font-size:.75rem;color:var(--i3)">'+(e.role||'Conseiller(e)')+'</div></div></div>'
    +(e.delegation?'<div class="info-row"><div class="info-lbl">Délégation</div><div class="info-val">'+e.delegation+'</div></div>':'')
    +(e.commission?'<div class="info-row"><div class="info-lbl">Commission</div><div class="info-val"><span class="chip">'+e.commission+'</span></div></div>':'')
    +(e.tel?'<div class="info-row"><div class="info-lbl">Téléphone</div><div class="info-val"><a href="tel:'+e.tel+'" style="color:var(--g3)">'+e.tel+'</a></div></div>':'')
    +(e.email?'<div class="info-row"><div class="info-lbl">Email</div><div class="info-val"><a href="mailto:'+e.email+'" style="color:var(--g3)">'+e.email+'</a></div></div>':'')
    +'<div style="margin-top:.5rem;font-size:.72rem;color:var(--i4)">Pour modifier les coordonnées, contactez l'administrateur du tableau de bord.</div>'
    +'</div>';
  om('elu');
}

/* ── COMMISSION GRID ────────────────────────────────────────────────── */
var COMM_ICONS={
  'Culture, Patrimoine & Jumelages':'🎭','Mobilités':'🚲','Transition écologique':'🌿',
  'Action sociale':'🤝','Concertation citoyenne':'🗣','Animations de proximité':'🎪',
  'Économie':'💼','Métropole':'🏙','Enfance/Jeunesse':'👦',
  'Tranquillité publique':'🛡','Travaux & Urbanisme':'🏗','Santé':'🏥'
};
var REFS={'Culture, Patrimoine & Jumelages':'Marie-Claude','Enfance/Jeunesse':'Angélique','Animations de proximité':'Jean-Christophe'};
function buildCG(){
  var ks=Object.keys(COMM);
  $('cg').innerHTML=ks.map((comm,idx)=>{
    var themes=COMM[comm];
    var pp=P.filter(p=>themes.indexOf(p.theme)>=0);
    var to=pp.length, pr=0, ec=0, re=0;
    pp.forEach(p=>{var s=ST[p.id]||p.statut||'';if(s==='Prioritaire')pr++;if(s.indexOf('cours')>=0)ec++;if(s.indexOf('alis')>=0)re++;});
    var pct=to?Math.round(re/to*100):0;
    var col=COLORS[comm]||'#3d7a5a';
    return '<div class="cc" onclick="showCD('+idx+')">'
      +'<div class="cc-top" style="background:'+col+'20;border-bottom:1px solid '+col+'30">'
      +'<div class="cc-ico" style="background:'+col+';border-color:'+col+'aa">'+(COMM_ICONS[comm]||'📋')+'</div>'
      +(REFS[comm]?'<span class="cc-ref" style="background:'+col+'30;border-color:'+col+'50;color:'+col+'">'+REFS[comm]+'</span>':'')
      +'</div>'
      +'<div class="cc-body">'
      +'<div class="cc-title">'+comm+'</div>'
      +'<div class="cc-themes">'+themes.join(' · ')+'</div>'
      +'<div class="cc-stats">'
      +'<div class="cs"><div class="cs-v" style="color:var(--g2)">'+to+'</div><div class="cs-l">total</div></div>'
      +'<div class="cs"><div class="cs-v" style="color:var(--red)">'+pr+'</div><div class="cs-l">prio.</div></div>'
      +'<div class="cs"><div class="cs-v" style="color:var(--amber)">'+ec+'</div><div class="cs-l">cours</div></div>'
      +'<div class="cs"><div class="cs-v" style="color:var(--g4)">'+re+'</div><div class="cs-l">réal.</div></div>'
      +'</div>'
      +'<div class="cc-prog"><div class="cc-fill" style="width:'+pct+'%;background:'+col+'"></div></div>'
      +'<div class="cc-pct"><span>Avancement</span><span>'+pct+'%</span></div>'
      +'</div></div>';
  }).join('');
}

/* ── COMM DETAIL ────────────────────────────────────────────────────── */
function showCD(idx){
  _ci=idx;
  var comm=Object.keys(COMM)[idx], themes=COMM[comm], col=COLORS[comm]||'#3d7a5a';
  var pp=P.filter(p=>themes.indexOf(p.theme)>=0);
  var to=pp.length,pr=0,ec=0,re=0;
  pp.forEach(p=>{var s=ST[p.id]||p.statut||'';if(s==='Prioritaire')pr++;if(s.indexOf('cours')>=0)ec++;if(s.indexOf('alis')>=0)re++;});
  $('cdet-ico').textContent=COMM_ICONS[comm]||'📋';
  el('cdet-t',comm);
  el('cdet-s',themes.join(' · ')+(REFS[comm]?' — Référent·e : '+REFS[comm]:''));
  $('cdet-kpis').innerHTML=
    '<div class="kpi" style="flex:1;min-width:0"><div class="kpi-v">'+to+'</div><div class="kpi-l">Projets</div></div>'+
    '<div class="kpi" style="flex:1;min-width:0"><div class="kpi-v" style="color:var(--red)">'+pr+'</div><div class="kpi-l">Prioritaires</div></div>'+
    '<div class="kpi" style="flex:1;min-width:0"><div class="kpi-v" style="color:var(--amber)">'+ec+'</div><div class="kpi-l">En cours</div></div>'+
    '<div class="kpi" style="flex:1;min-width:0"><div class="kpi-v" style="color:var(--g4)">'+re+'</div><div class="kpi-l">Réalisés</div></div>';
  $('cd-st').value=''; $('cd-q').value='';
  qsa('.page').forEach(p=>p.classList.remove('on'));
  qsa('.sb-it').forEach(n=>n.classList.remove('on'));
  $('p-cdet').classList.add('on');
  fCD();
}

function fCD(){
  var comm=Object.keys(COMM)[_ci], themes=COMM[comm];
  var s=v('cd-st'), q=v('cd-q').toLowerCase();
  var r=P.filter(p=>{var ps=ST[p.id]||p.statut||'ND';return themes.indexOf(p.theme)>=0&&(!s||ps===s)&&(!q||(p.titre||'').toLowerCase().includes(q)||(p.resume||'').toLowerCase().includes(q));});
  el('cd-cnt',r.length+' projet(s)');
  rTb('cd-tb',r,false);
}

/* ── PROJETS TABLE ──────────────────────────────────────────────────── */
function bc(s){if(!s)return 'b-nd';var l=s.toLowerCase();if(l.includes('prioritaire'))return 'b-pr';if(l.includes('programm'))return 'b-pg';if(l.includes('planifi'))return 'b-pl';if(l.includes('cours'))return 'b-ec';if(l.includes('tude'))return 'b-et';if(l.includes('alis'))return 'b-re';return 'b-nd';}
function imp(n){return n?'<span style="color:#d97706">'+('★'.repeat(n))+'</span>':'-';}
function t2c(t){for(var c in COMM){if(COMM[c].includes(t))return c;}return 'Autre';}

function buildFilters(){
  var th={},st={},an={};
  P.forEach(p=>{th[p.theme||'?']=1;st[ST[p.id]||p.statut||'ND']=1;an[p.annee?String(p.annee):'?']=1;});
  fSel('fC',Object.keys(COMM),'Toutes commissions');
  fSel('fT',Object.keys(th).sort(),'Tous thèmes');
  fSel('fS',Object.keys(st).sort(),'Tous statuts');
  fSel('fA',Object.keys(an).sort(),'Toutes années');
  fSel('cd-st',SLIST,'Tous statuts');
}
function fSel(id,opts,def){var s=$(id);if(!s)return;s.innerHTML='<option value="">'+def+'</option>';opts.forEach(o=>{var op=document.createElement('option');op.value=o;op.textContent=o;s.appendChild(op);});}

function fG(){
  var c=v('fC'),t=v('fT'),s=v('fS'),a=v('fA'),q=v('fQ').toLowerCase();
  var r=P.filter(p=>{var ps=ST[p.id]||p.statut||'ND',pa=p.annee?String(p.annee):'?',pc=t2c(p.theme);return(!c||pc===c)&&(!t||p.theme===t)&&(!s||ps===s)&&(!a||pa===a)&&(!q||(p.titre||'').toLowerCase().includes(q)||(p.resume||'').toLowerCase().includes(q));});
  el('fCnt',r.length+' projet(s)');
  rTb('g-tb',r,true);
}

function rTb(bid,rows,showC){
  var tb=$(bid);if(!tb)return;
  tb.innerHTML=rows.map(p=>{
    var st=ST[p.id]||p.statut||'ND';
    var opts=SLIST.map(sv=>'<option value="'+sv+'"'+(st===sv?' selected':'')+'>'+sv+'</option>').join('');
    var c1=showC
      ?'<td><span class="chip">'+t2c(p.theme||'')+'</span><br><span style="font-size:.63rem;color:var(--i4);">'+(p.theme||'—')+'</span></td>'
      :'<td style="font-size:.72rem;color:var(--i3)">'+(p.theme||'—')+'</td>';
    return '<tr>'+c1
      +'<td><div class="pn">'+(p.titre||'—')+'</div><div class="pr">'+(p.resume||'')+'</div></td>'
      +'<td><span class="b '+bc(st)+'">'+st+'</span></td>'
      +'<td style="color:var(--i3);font-family:var(--fm);font-size:.72rem">'+(p.annee||'—')+'</td>'
      +'<td>'+imp(p.importance)+'</td>'
      +'<td><select class="ssel" data-pid="'+p.id+'" data-t="'+p.titre.replace(/"/g,'&quot;')+'" onchange="uSt(+this.dataset.pid,this.value,this.dataset.t)">'+opts+'</select></td>'
      +'</tr>';
  }).join('');
}

function uSt(id,nst,titre){
  apiPost('/api/statut',{id,statut:nst,titre}).then(d=>{
    if(d.ok){ST[id]=nst;NF.unshift(d.notif);fG();if($('p-cdet').classList.contains('on'))fCD();buildCG();buildCharts();toast('Statut mis à jour : '+nst);}
  });
}

/* ── CHARTS ─────────────────────────────────────────────────────────── */
function buildCharts(){
  var th={},st={};
  P.forEach(p=>{var t=p.theme||'?';th[t]=(th[t]||0)+1;var s=ST[p.id]||p.statut||'ND';st[s]=(st[s]||0)+1;});
  var tk=Object.keys(th).sort(),tv=tk.map(k=>th[k]);
  var sk=Object.keys(st),sv=sk.map(k=>st[k]);
  var G=['#1d3d2b','#2d5a40','#3d7a5a','#5a9a70','#7ab890','#a8d4b4','#b8d9c4','#3a5a48','#5a8a70','#7aaa88','#9ac8a0','#c0d9c4','#2a4a38','#4a7a5a'];
  if(chT)chT.destroy();if(chS)chS.destroy();
  var et=$('chT'),es=$('chS');
  if(et)chT=new Chart(et,{type:'bar',data:{labels:tk,datasets:[{data:tv,backgroundColor:G,borderRadius:6,borderSkipped:false}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{font:{size:9},color:'var(--i3)'}},y:{grid:{color:'rgba(0,0,0,.04)'},ticks:{stepSize:1,font:{size:9},color:'var(--i3)'}}}}});
  if(es)chS=new Chart(es,{type:'doughnut',data:{labels:sk,datasets:[{data:sv,backgroundColor:['#dc2626','#16a34a','#2563eb','#d97706','#ea580c','#0d9488','#9ca3af'],borderWidth:2,borderColor:'#fff'}]},options:{responsive:true,maintainAspectRatio:false,cutout:'64%',plugins:{legend:{position:'bottom',labels:{font:{size:10},padding:10,usePointStyle:true}}}}});
}

/* ── AGENDA ─────────────────────────────────────────────────────────── */
var MOIS=['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
var AT={bureau:'bureau',commission:'commission',conseil:'conseil',autre:'autre'};
var ATL={bureau:'Bureau',commission:'Commission',conseil:'Conseil',autre:'Autre'};
function renderAg(){
  var now=new Date().toISOString().slice(0,10);
  var s=AG.slice().sort((a,b)=>a.date>b.date?1:-1);
  $('ag-list').innerHTML=s.map(e=>'<div class="ag-card'+(e.date<now?' past':'')+'">'
    +'<div class="ag-dbox"><div class="ag-day">'+e.date.slice(8)+'</div><div class="ag-mon">'+MOIS[+e.date.slice(5,7)-1]+'</div></div>'
    +'<div class="ag-inf">'
    +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span class="ag-it">'+e.titre+'</span><span class="ag-type at-'+( AT[e.type]||'a')+'">'+ATL[e.type]+'</span></div>'
    +'<div class="ag-im">'+(e.heure?'🕐 '+e.heure+(e.lieu?' — ':' '):'')+( e.lieu?'📍 '+e.lieu:'')+'</div>'
    +(e.notes?'<div class="ag-in">'+e.notes+'</div>':'')
    +'</div>'
    +'<button class="btn btn-d btn-sm" style="flex-shrink:0;align-self:flex-start" onclick="delAg('+e.id+')">×</button>'
    +'</div>').join('')||'<div class="empty"><div class="empty-ico">📅</div><div class="empty-t">Aucune réunion</div><div class="empty-s">Cliquez sur "+ Ajouter" pour planifier une réunion.</div></div>';
}
function svAg(){apiPost('/api/agenda',{titre:v('ag-ti'),date:v('ag-d'),heure:v('ag-h'),lieu:v('ag-l'),type:v('ag-ty'),notes:v('ag-n')}).then(d=>{if(d.ok){AG.push(d.item);cm();renderAg();renderNextMtg();toast('Réunion ajoutée');}});}
function delAg(id){if(!confirm('Supprimer cette réunion ?'))return;apiDel('/api/agenda/'+id).then(d=>{if(d.ok){AG=AG.filter(a=>a.id!==id);renderAg();renderNextMtg();toast('Supprimé');}});}

/* ── DOCUMENTS ──────────────────────────────────────────────────────── */
var DTYPES={cr:'Compte-rendu',delib:'Délibération',rapport:'Rapport',autre:'Autre'};
function renderDc(){
  $('dc-list').innerHTML=DC.map(d=>'<div class="dc-card">'
    +'<div class="dc-ico">📄</div>'
    +'<div style="flex:1"><a href="'+d.url+'" target="_blank" style="font-size:.85rem;font-weight:700;font-family:var(--fd);color:var(--g2);text-decoration:none">'+d.titre+'</a>'
    +'<div style="display:flex;align-items:center;gap:8px;margin-top:4px"><span class="b b-pg" style="font-size:.62rem">'+(DTYPES[d.type]||d.type)+'</span><span style="font-size:.7rem;color:var(--i3);font-family:var(--fm)">'+d.date+'</span></div>'
    +(d.notes?'<div style="font-size:.71rem;color:var(--i3);margin-top:4px;line-height:1.4">'+d.notes+'</div>':'')+
    '</div><button class="btn btn-d btn-sm" style="flex-shrink:0;align-self:flex-start" onclick="delDc('+d.id+')">×</button></div>').join('')
    ||'<div class="empty"><div class="empty-ico">📄</div><div class="empty-t">Aucun document</div><div class="empty-s">Ajoutez des liens vers vos documents kDrive ou Google Drive.</div></div>';
}
function svDc(){apiPost('/api/document',{titre:v('dc-ti'),type:v('dc-ty'),url:v('dc-u'),date:v('dc-d'),notes:v('dc-n')}).then(d=>{if(d.ok){DC.push(d.item);cm();renderDc();toast('Document ajouté');}});}
function delDc(id){if(!confirm('Supprimer ?'))return;apiDel('/api/document/'+id).then(d=>{if(d.ok){DC=DC.filter(x=>x.id!==id);renderDc();}});}

/* ── HISTORIQUE ─────────────────────────────────────────────────────── */
function renderNt(){
  $('nt-list').innerHTML=NF.slice(0,80).map(n=>{
    var typ=n.type||'statut';
    var tc=typ==='annonce'?'nt-ta':typ==='projet'?'nt-tc':'nt-tp';
    var tl=typ==='annonce'?'Annonce':typ==='projet'?'Créé':'Statut';
    return '<div class="nt"><div class="nt-dot" style="background:'+(n.new?'var(--g4)':'var(--i4)')+'"></div>'
      +'<span class="nt-type '+tc+'">'+tl+'</span>'
      +'<span style="flex:1;font-size:.76rem"><strong>'+n.titre+'</strong>'+(n.statut?' → <span class="b '+bc(n.statut)+'">'+n.statut+'</span>':'')+'</span>'
      +'<span style="font-size:.66rem;color:var(--i4);font-family:var(--fm)">'+n.ts+'</span></div>';
  }).join('')||'<div class="empty"><div class="empty-ico">🔔</div><div class="empty-t">Aucune activité</div></div>';
}

/* ── NOUVEAU PROJET ─────────────────────────────────────────────────── */
function createP(){
  var t=v('np-t').trim(),r=v('np-r').trim();
  if(!t||!r){toast('Titre et résumé obligatoires');return;}
  apiPost('/api/projet',{titre:t,theme:v('np-th'),statut:v('np-s'),annee:v('np-a'),importance:v('np-i'),resume:r,description:v('np-d'),tags:v('np-tags')}).then(res=>{
    if(res.ok){P.push(res.projet);buildFilters();fG();buildCG();buildCharts();resetNP();
    $('np-res').innerHTML='<div style="background:var(--g8);border-radius:var(--r);padding:.75rem;font-size:.79rem;color:var(--g2);border:1px solid var(--g7)">✓ Projet créé : <strong>'+res.projet.titre+'</strong> (ID #'+res.projet.id+')</div>';
    toast('Projet créé !');}
  });
}
function resetNP(){['np-t','np-r','np-d','np-tags','np-a'].forEach(i=>{var e=$(i);if(e)e.value='';});$('np-res').innerHTML='';}

/* ── BUDGET ─────────────────────────────────────────────────────────── */
function impB(inp){var f=inp.files[0];if(!f)return;var rd=new FileReader();rd.onload=function(e){var sep=String.fromCharCode(10);var lines=e.target.result.split(sep).filter(l=>l.trim());if(!lines.length)return;var hd=lines[0].split(',').map(h=>h.trim());var rows=lines.slice(1).map(l=>l.split(',').map(c=>c.trim()));var html='<div class="tb-wrap"><table><thead><tr>'+hd.map((h,i)=>'<th style="text-align:'+(i>0?'right':'left')+'">'+h+'</th>').join('')+'</tr></thead><tbody>';rows.forEach(row=>{html+='<tr>'+row.map((cell,i)=>{var num=parseFloat(cell.replace(/[^0-9.-]/g,''));var fmt=(!isNaN(num)&&i>0)?new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(num):cell;var col='';if(i===2&&row[1]){var v1=parseFloat(row[1].replace(/[^0-9.-]/g,'')),v2=parseFloat(row[2].replace(/[^0-9.-]/g,''));if(!isNaN(v1)&&!isNaN(v2)){col=v2>v1?'color:var(--red);font-weight:600':'color:var(--g3);font-weight:600';}}return'<td style="text-align:'+(i>0?'right':'left')+';'+col+'">'+fmt+'</td>';}).join('')+'</tr>';});html+='</tbody></table></div>';$('btable').innerHTML=html;toast('Budget importé : '+rows.length+' lignes');};rd.readAsText(f);}

/* ── COMMUNICATIONS ─────────────────────────────────────────────────── */
function genC(){var type=v('ct'),sujet=v('cs').trim(),ctx=v('cc');if(!sujet){toast('Indiquez le sujet');return;}el('c-st','⏳ Génération en cours…');$('cr').value='';apiPost('/api/genere',{type,sujet,contexte:ctx}).then(d=>{el('c-st','');if(d.ok){$('cr').value=d.texte;toast('Document généré');}else{$('cr').value='Erreur : '+d.error;toast('Erreur : '+d.error,4000);}}).catch(()=>{el('c-st','');toast('Erreur réseau');});}
function copyC(){var t=$('cr');t.select();document.execCommand('copy');toast('Copié !');}

/* ── CHAT ───────────────────────────────────────────────────────────── */
var chatOpen=false;
function toggleChat(){chatOpen=!chatOpen;$('chat-panel').classList.toggle('on',chatOpen);if(chatOpen){$('cbadge').style.display='none';renderChatMsgs(CHAT);scrollChat();}}
function openVisio(){window.open('https://kmeet.infomaniak.com/vizilleenmouvement','_blank');}
function switchChannel(){CHAT=[];renderChatMsgs([]);pollChat();}
function sendMsg(){
  var inp=$('chat-inp'),txt=inp.value.trim();if(!txt)return;
  inp.value='';
  apiPost('/api/chat',{channel:v('chat-ch'),auteur:ME.nom,avatar:ME.avatar,texte:txt}).then(d=>{
    if(d.ok){CHAT.push(d.message);renderChatMsgs(CHAT);scrollChat();}
  });
}
function pollChat(){
  var ch=v('chat-ch')||'general';
  apiGet('/api/chat?channel='+ch+'&since='+_chatLastId).then(d=>{
    if(d.ok&&d.messages.length){
      CHAT=CHAT.concat(d.messages);_chatLastId=d.lastId;
      if(chatOpen){renderChatMsgs(CHAT);scrollChat();}
      else{$('cbadge').style.display='block';}
    }
  });
}
function renderChatMsgs(msgs){
  var el=$('chat-msgs');if(!el)return;
  el.innerHTML=msgs.slice(-40).map(m=>{
    var me=m.auteur===ME.nom||m.avatar===ME.avatar;
    return '<div class="msg-w'+(me?' me':'')+'">'
      +'<div class="msg-meta">'+m.auteur+' · '+m.ts+'</div>'
      +'<div class="msg-bub'+(me?' me':'')+'">'+m.texte+'</div>'
      +'</div>';
  }).join('')||'<div class="empty" style="padding:2rem"><div class="empty-ico">💬</div><div class="empty-s">Aucun message dans ce canal.</div></div>';
}
function scrollChat(){var e=$('chat-msgs');if(e)e.scrollTop=e.scrollHeight;}

init();
</script>
</body>
</html>`;
}


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
let elus      = load('elus.json', [{"id": 1, "nom": "Catherine Troton", "prenom": "", "role": "Maire", "delegation": "Direction générale — Exécutif municipal", "commission": "", "tel": "", "email": "maire@vizille.fr", "avatar": "CT", "color": "#1a3a2a"}, {"id": 2, "nom": "Michel Troton", "prenom": "", "role": "Conseiller", "delegation": "Numérique, communication, histoire locale", "commission": "Culture, Patrimoine & Jumelages", "tel": "", "email": "", "avatar": "MT", "color": "#2d5a40"}, {"id": 3, "nom": "Marie-Claude", "prenom": "", "role": "Adjointe", "delegation": "Culture, Patrimoine, Jumelages", "commission": "Culture, Patrimoine & Jumelages", "tel": "", "email": "", "avatar": "MC", "color": "#8B5CF6"}, {"id": 4, "nom": "Angélique", "prenom": "", "role": "Adjointe", "delegation": "Enfance, Jeunesse, Périscolaire", "commission": "Enfance/Jeunesse", "tel": "", "email": "", "avatar": "AN", "color": "#F97316"}, {"id": 5, "nom": "Jean-Christophe", "prenom": "", "role": "Conseiller", "delegation": "Animations de proximité, Associations", "commission": "Animations de proximité", "tel": "", "email": "", "avatar": "JC", "color": "#EC4899"}]);
let services  = load('services.json', [{"id": 1, "nom": "DGS", "titre": "Directeur Général des Services"}, {"id": 2, "nom": "Service Technique", "titre": "Chef de service voirie & travaux"}]);
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
    return res.end(buildPage());
  }
  res.writeHead(404); res.end('404');
});

server.listen(PORT,()=>console.log('VeM v6 port '+PORT));
