// VeM Dashboard v7 - 20260323 - interface grand public

function buildPage() {
  const COMM  = {"Culture, Patrimoine & Jumelages":["Culture","Patrimoine","Jumelages"],"Mobilités":["Mobilités"],"Transition écologique":["Transition écologique"],"Action sociale":["Action sociale"],"Concertation citoyenne":["Concertation citoyenne"],"Animations de proximité":["Animations de proximité"],"Économie":["Économie"],"Métropole":["Métropole"],"Enfance/Jeunesse":["Enfance/Jeunesse"],"Tranquillité publique":["Tranquillité publique"],"Travaux & Urbanisme":["Travaux","Urbanisme"],"Santé":["Santé"]};
  const CCOLORS = {"Culture, Patrimoine & Jumelages":"#8B5CF6","Mobilités":"#3B82F6","Transition écologique":"#10B981","Action sociale":"#F59E0B","Concertation citoyenne":"#6366F1","Animations de proximité":"#EC4899","Économie":"#14B8A6","Métropole":"#6B7280","Enfance/Jeunesse":"#F97316","Tranquillité publique":"#EF4444","Travaux & Urbanisme":"#84CC16","Santé":"#06B6D4"};
  const GUIDES = [
    {id:"1",icon:"⚖️",titre:"Droits et devoirs de l'élu",court:"18h de formation/an, protection fonctionnelle, devoir de réserve.",
     contenu:"En tant que conseiller municipal, vous bénéficiez de protections juridiques et avez des obligations. Vous disposez d'un droit à la formation (18h/an rémunérées), d'une protection fonctionnelle, et d'indemnités de fonction si applicable. Vous êtes soumis au devoir de réserve et aux règles de déport en cas de conflit d'intérêts. Toute question : contactez le DGS ou l'AMF.",
     liens:[
       {label:"Guide de l'élu — AMF",url:"https://www.amf.asso.fr/documents-guide-de-lelu-local/19779"},
       {label:"Statut de l'élu local — Légifrance",url:"https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006070633/LEGISCTA000006149583/"},
       {label:"Indemnités et droits — collectivités-locales.gouv.fr",url:"https://www.collectivites-locales.gouv.fr/les-elus/statut-de-lelu"},
       {label:"Maire-info : actualités sur le statut de l'élu",url:"https://www.maire-info.com/statut-des-elus"}
     ]},
    {id:"2",icon:"🏛️",titre:"Le conseil municipal",court:"Au moins 4 réunions/an, vote à la majorité simple.",
     contenu:"Le conseil municipal se réunit au moins 4 fois/an, convoqué par le Maire au moins 5 jours avant (sauf urgence). L'ordre du jour est joint à la convocation. Vous pouvez poser des questions orales. Le vote est public (à main levée ou scrutin nominal) sauf cas particuliers. Une délibération est adoptée à la majorité simple. Vous devez vous déporter si vous avez un intérêt personnel dans une affaire.",
     liens:[
       {label:"Fonctionnement du conseil municipal — service-public.fr",url:"https://www.service-public.fr/particuliers/vosdroits/F32341"},
       {label:"CGCT — Articles L2121-1 et suivants",url:"https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006070633/LEGISCTA000006149563/"},
       {label:"Questions orales au conseil — AMF",url:"https://www.amf.asso.fr/documents-les-questions-orales-au-conseil-municipal/11390"},
       {label:"Modèles de délibérations — AMF",url:"https://www.amf.asso.fr/page-modeles-de-deliberations/20588"}
     ]},
    {id:"3",icon:"💰",titre:"Comprendre le budget",court:"8-9M€/an pour Vizille, vote en décembre.",
     contenu:"Le budget est voté en 2 parties : fonctionnement (charges courantes, personnel, services) et investissement (travaux, équipements). Vizille dispose d'environ 8-9M€ de budget annuel. Les subventions clés : DETR (État), GAM (Métropole Grenoble), Département Isère, Région AURA. Chaque commission peut proposer des lignes budgétaires. Le DOB (Débat d'Orientations Budgétaires) a lieu avant le vote du budget en décembre.",
     liens:[
       {label:"Les finances locales — collectivités-locales.gouv.fr",url:"https://www.collectivites-locales.gouv.fr/finances-locales"},
       {label:"Budget communal expliqué — AMF",url:"https://www.amf.asso.fr/documents-le-budget-communal/19160"},
       {label:"DETR — dotation État pour travaux",url:"https://www.collectivites-locales.gouv.fr/dotation-dequipement-des-territoires-ruraux-detr"},
       {label:"Comptes des communes — data.gouv.fr",url:"https://www.data.gouv.fr/fr/datasets/comptes-individuels-des-communes/"}
     ]},
    {id:"4",icon:"🏢",titre:"Qui fait quoi en mairie ?",court:"DGS = coordinateur. Passez toujours par la hiérarchie.",
     contenu:"Le DGS coordonne les services. Les principaux services : Technique (travaux, voirie), Culturel (patrimoine, médiathèque), CCAS (social, seniors), Police Municipale, Service Enfance/Périscolaire, Urbanisme, Communication. Pour toute question opérationnelle, passez par votre chef de service référent ou le DGS. Ne donnez jamais d'instructions directes aux agents — passez toujours par la hiérarchie.",
     liens:[
       {label:"Rôle du DGS — CNFPT",url:"https://www.cnfpt.fr/content/directeur-general-services"},
       {label:"Organisation des services communaux — AMF",url:"https://www.amf.asso.fr/documents-lorganisation-des-services-communaux/20415"},
       {label:"CCAS — Centre Communal d'Action Sociale",url:"https://www.service-public.fr/particuliers/vosdroits/F17482"},
       {label:"Police municipale — cadre juridique",url:"https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006070633/LEGISCTA000006149573/"}
     ]},
    {id:"5",icon:"🛡️",titre:"Conflit d'intérêts",court:"Vous devez quitter la salle si vous êtes concerné.",
     contenu:"Si une délibération concerne directement vos intérêts personnels (famille, activité professionnelle, patrimoine), vous DEVEZ vous retirer de la salle avant le vote. Mentionnez-le au Maire avant la séance. En cas de doute, consultez le DGS. Le préfet peut déférer une délibération entachée de conflit d'intérêts au tribunal administratif.",
     liens:[
       {label:"HATVP — Autorité anticorruption des élus",url:"https://www.hatvp.fr/espace-elus/"},
       {label:"Déclaration d'intérêts — formulaire",url:"https://www.hatvp.fr/deposer-une-declaration/"},
       {label:"Conflit d'intérêts — guide DGCL",url:"https://www.collectivites-locales.gouv.fr/les-elus/deontologie-et-prevention-des-conflits-d-interets"},
       {label:"Déport et abstention — Légifrance",url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038834440"}
     ]},
    {id:"6",icon:"🎓",titre:"Droits à la formation",court:"18h remboursées/an — AMF Formation, CNFPT.",
     contenu:"Tout élu bénéficie de 18 heures de formation/an, remboursées sur le budget communal dans la limite d'un plafond légal. Organismes agréés : AMF Formation, CNFPT, universités. Sujets recommandés pour débutants : finances locales, urbanisme, marchés publics, communication institutionnelle. Demande à adresser au Maire avec justificatifs.",
     liens:[
       {label:"AMF Formation — catalogue des stages",url:"https://www.amf.asso.fr/page-amf-formation/20586"},
       {label:"CNFPT — formations pour élus",url:"https://www.cnfpt.fr/elus"},
       {label:"Droit à la formation — service-public.fr",url:"https://www.service-public.fr/particuliers/vosdroits/F32341"},
       {label:"Financement de la formation des élus",url:"https://www.collectivites-locales.gouv.fr/les-elus/formation-des-elus"}
     ]}
  ];
  const RESS = [
    {titre:"kMeet — Visioconférence",url:"https://kmeet.infomaniak.com",icon:"🎥",desc:"Réunion en ligne sécurisée"},
    {titre:"kDrive — Documents partagés",url:"https://kdrive.infomaniak.com",icon:"📁",desc:"Vos fichiers d'équipe"},
    {titre:"Site public VeM",url:"https://vizilleenmouvement.fr",icon:"🌐",desc:"vizilleenmouvement.fr"},
    {titre:"AMF — Association des Maires",url:"https://www.amf.asso.fr",icon:"🏛",desc:"Actualités, guides, formations"},
    {titre:"Maire-info",url:"https://www.maire-info.com",icon:"📰",desc:"Actualité quotidienne des communes"},
    {titre:"Légifrance",url:"https://www.legifrance.gouv.fr",icon:"⚖️",desc:"Textes législatifs"},
    {titre:"Collectivités-locales.gouv",url:"https://www.collectivites-locales.gouv.fr",icon:"🏗",desc:"Informations pour les élus"},
    {titre:"WordPress Vizille",url:"https://wp.vizilleenmouvement.fr",icon:"🖥",desc:"Site officiel de la commune"}
  ];
  const TYPES_DOC = ["Question orale au conseil","Délibération","Arrêté municipal","Post Facebook","Communiqué de presse","Discours","Courrier officiel","Convocation"];
  const TYPE_API  = {"Question orale au conseil":"deliberation","Délibération":"deliberation","Arrêté municipal":"arrete","Post Facebook":"facebook","Communiqué de presse":"communique","Discours":"discours","Courrier officiel":"communique","Convocation":"convocation"};

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Vizille en Mouvement — Espace élus</title>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bleu:#1a3a6b;--bleu2:#2d5a9e;--or:#c9a84c;--vert:#2d7a4e;
  --bg:#f5f3ef;--card:#fff;--border:#e8e2d8;
  --texte:#1a1a2e;--gris:#6b7280;--gris2:#9ca3af;
  --rouge:#dc2626;--amber:#d97706;
  --radius:16px;--radius-sm:10px;
  --ombre:0 4px 24px rgba(0,0,0,.08);--ombre-lg:0 8px 40px rgba(0,0,0,.13);
}
html,body{height:100%;font-family:'Nunito',sans-serif;background:var(--bg);color:var(--texte);}
body{display:flex;flex-direction:column;-webkit-font-smoothing:antialiased;}

/* ── HEADER ── */
.header{background:var(--bleu);color:#fff;padding:0 1.5rem;height:64px;display:flex;align-items:center;gap:1rem;flex-shrink:0;box-shadow:0 2px 16px rgba(0,0,0,.2);}
.header-logo{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:700;color:#fff;text-decoration:none;}
.header-logo span{color:var(--or);}
.header-sub{font-size:.72rem;color:rgba(255,255,255,.5);margin-left:.2rem;}
.header-date{flex:1;text-align:center;font-size:.8rem;color:rgba(255,255,255,.5);}
.header-btn{display:flex;align-items:center;gap:.5rem;padding:.5rem 1rem;border-radius:8px;font-size:.82rem;font-weight:700;cursor:pointer;border:none;font-family:'Nunito',sans-serif;text-decoration:none;transition:all .2s;}
.btn-visio{background:var(--or);color:#fff;}.btn-visio:hover{background:#b8913e;}
.btn-out{background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.2);}.btn-out:hover{background:rgba(255,255,255,.22);}

/* ── LAYOUT ── */
.layout{flex:1;display:flex;overflow:hidden;}
.sidebar{width:220px;background:#fff;border-right:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0;overflow-y:auto;}
.main{flex:1;overflow-y:auto;padding:2rem;}

/* ── NAV SIDEBAR ── */
.nav-section{padding:.8rem 1rem .3rem;font-size:.62rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--gris2);}
.nav-item{display:flex;align-items:center;gap:.75rem;padding:.75rem 1.2rem;cursor:pointer;color:var(--gris);font-size:.9rem;font-weight:600;border-left:3px solid transparent;transition:all .15s;}
.nav-item:hover{background:#f8f6f2;color:var(--bleu);}
.nav-item.active{background:#f0f4ff;color:var(--bleu);border-left-color:var(--bleu);font-weight:800;}
.nav-icon{font-size:1.1rem;width:24px;text-align:center;}
.nav-badge{margin-left:auto;background:var(--rouge);color:#fff;font-size:.62rem;font-weight:800;padding:1px 6px;border-radius:20px;}

/* ── PAGES ── */
.page{display:none;}.page.active{display:block;}

/* ── TITRES ── */
.page-title{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:700;color:var(--bleu);margin-bottom:.3rem;}
.page-sub{font-size:.9rem;color:var(--gris);margin-bottom:1.8rem;}

/* ── CARDS GRILLE ── */
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:1.2rem;}
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;}
.card{background:var(--card);border-radius:var(--radius);border:1px solid var(--border);box-shadow:var(--ombre);padding:1.5rem;transition:transform .2s,box-shadow .2s;}
.card:hover{transform:translateY(-2px);box-shadow:var(--ombre-lg);}

/* ── STAT CARD ── */
.stat-card{text-align:center;padding:1.5rem 1rem;}
.stat-ico{font-size:2.2rem;margin-bottom:.5rem;}
.stat-val{font-size:2rem;font-weight:900;color:var(--bleu);line-height:1;}
.stat-label{font-size:.8rem;color:var(--gris);margin-top:.3rem;font-weight:600;}

/* ── BIG NAV TILES (accueil) ── */
.tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:1.2rem;margin-bottom:2rem;}
.tile{background:var(--card);border-radius:var(--radius);border:1px solid var(--border);box-shadow:var(--ombre);padding:2rem 1rem;text-align:center;cursor:pointer;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:.75rem;border-bottom:4px solid transparent;}
.tile:hover{transform:translateY(-4px);box-shadow:var(--ombre-lg);}
.tile-ico{font-size:2.5rem;}
.tile-label{font-size:1rem;font-weight:800;color:var(--bleu);}
.tile-desc{font-size:.78rem;color:var(--gris);line-height:1.4;}
.tile.t-agenda{border-bottom-color:#3B82F6;}.tile.t-agenda:hover{background:#eff6ff;}
.tile.t-projets{border-bottom-color:var(--vert);}.tile.t-projets:hover{background:#f0fdf4;}
.tile.t-equipe{border-bottom-color:var(--or);}.tile.t-equipe:hover{background:#fffbeb;}
.tile.t-guides{border-bottom-color:#8B5CF6;}.tile.t-guides:hover{background:#f5f3ff;}
.tile.t-chat{border-bottom-color:#EC4899;}.tile.t-chat:hover{background:#fdf2f8;}
.tile.t-rediger{border-bottom-color:#14B8A6;}.tile.t-rediger:hover{background:#f0fdfa;}
.tile.t-ressources{border-bottom-color:#F59E0B;}.tile.t-ressources:hover{background:#fffbeb;}
.tile.t-site{border-bottom-color:var(--bleu);}.tile.t-site:hover{background:#eff6ff;}

/* ── PROCHAINE RÉUNION ── */
.next-meeting{background:linear-gradient(135deg,var(--bleu),var(--bleu2));color:#fff;border-radius:var(--radius);padding:1.5rem 2rem;display:flex;align-items:center;gap:1.5rem;margin-bottom:1.5rem;box-shadow:var(--ombre-lg);}
.next-ico{font-size:3rem;flex-shrink:0;}
.next-label{font-size:.78rem;font-weight:700;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:.08em;margin-bottom:.3rem;}
.next-titre{font-size:1.3rem;font-weight:800;margin-bottom:.2rem;}
.next-date{font-size:.9rem;color:rgba(255,255,255,.75);}
.next-empty{font-size:.95rem;color:rgba(255,255,255,.6);font-style:italic;}

.tile.t-evenements{border-bottom-color:#EF4444;}.tile.t-evenements:hover{background:#fff5f5;}

/* ── ÉVÉNEMENTS ── */
.ev-card{background:var(--card);border-radius:var(--radius);border:1px solid var(--border);box-shadow:var(--ombre);padding:1.2rem 1.5rem;margin-bottom:.9rem;display:grid;grid-template-columns:auto 1fr auto;gap:1rem;align-items:start;transition:box-shadow .2s;}
.ev-card:hover{box-shadow:var(--ombre-lg);}
.ev-cat-dot{width:14px;height:14px;border-radius:50%;flex-shrink:0;margin-top:4px;}
.ev-titre{font-weight:800;font-size:.95rem;margin-bottom:.3rem;}
.ev-meta{font-size:.78rem;color:var(--gris);margin-bottom:.4rem;}
.ev-desc{font-size:.85rem;color:var(--i2);line-height:1.5;}
.ev-statut-wrap{display:flex;flex-direction:column;align-items:flex-end;gap:.4rem;}
.ev-statut{padding:.3rem .9rem;border-radius:20px;font-size:.72rem;font-weight:800;white-space:nowrap;}
.ev-Nouveau{background:#fee2e2;color:#991b1b;}
.ev-En-cours{background:#fef3c7;color:#92400e;}
.ev-Transmis{background:#dbeafe;color:#1e40af;}
.ev-Traite{background:#dcfce7;color:#166534;}
.ev-Archive{background:#f3f4f6;color:#6b7280;}
.ev-filters{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1.2rem;}
.cat-colors{--col-Signalement:#EF4444;--col-Incident:#F97316;--col-Voirie:#F59E0B;--col-Eclairage:#EAB308;--col-Proprete:#10B981;--col-Nuisance:#8B5CF6;--col-Demande:#3B82F6;--col-Autre:#6B7280;}
.agenda-item{display:flex;align-items:flex-start;gap:1rem;padding:1rem 1.2rem;background:var(--card);border-radius:var(--radius-sm);border:1px solid var(--border);margin-bottom:.8rem;transition:box-shadow .2s;}
.agenda-item:hover{box-shadow:var(--ombre);}
.agenda-date-box{background:var(--bleu);color:#fff;border-radius:8px;width:52px;text-align:center;padding:.4rem .3rem;flex-shrink:0;}
.agenda-day{font-size:1.4rem;font-weight:900;line-height:1;}
.agenda-month{font-size:.6rem;font-weight:700;text-transform:uppercase;opacity:.8;}
.agenda-title{font-weight:700;font-size:.95rem;margin-bottom:.2rem;}
.agenda-meta{font-size:.78rem;color:var(--gris);}
.agenda-del{background:none;border:none;color:var(--gris2);cursor:pointer;font-size:1.1rem;margin-left:auto;padding:.2rem .4rem;border-radius:4px;}
.agenda-del:hover{background:#fee2e2;color:var(--rouge);}

/* ── FORM ── */
.form-card{background:var(--card);border-radius:var(--radius);border:1px solid var(--border);box-shadow:var(--ombre);padding:1.5rem;}
.form-row{margin-bottom:1rem;}
.form-label{display:block;font-size:.85rem;font-weight:700;color:var(--bleu);margin-bottom:.4rem;}
.form-input,.form-select,.form-textarea{width:100%;padding:.7rem 1rem;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:.9rem;font-family:'Nunito',sans-serif;color:var(--texte);background:#fff;transition:border-color .2s;}
.form-input:focus,.form-select:focus,.form-textarea:focus{outline:none;border-color:var(--bleu);}
.form-textarea{min-height:80px;resize:vertical;}
.form-row-2{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;}

/* ── BOUTONS ── */
.btn{display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 1.5rem;border-radius:var(--radius-sm);font-size:.9rem;font-weight:800;cursor:pointer;border:none;font-family:'Nunito',sans-serif;transition:all .2s;}
.btn-primary{background:var(--bleu);color:#fff;}.btn-primary:hover{background:var(--bleu2);}
.btn-green{background:var(--vert);color:#fff;}.btn-green:hover{background:#256040;}
.btn-gold{background:var(--or);color:#fff;}.btn-gold:hover{background:#b8913e;}
.btn-ghost{background:#f3f4f6;color:var(--texte);border:1px solid var(--border);}.btn-ghost:hover{background:#e5e7eb;}
.btn-danger{background:#fee2e2;color:var(--rouge);border:1px solid #fecaca;}.btn-danger:hover{background:#fecaca;}
.btn-full{width:100%;justify-content:center;}
.btn-sm{padding:.45rem 1rem;font-size:.8rem;}

/* ── PROJETS ── */
.projet-card{background:var(--card);border-radius:var(--radius);border:1px solid var(--border);box-shadow:var(--ombre);padding:1.2rem 1.5rem;margin-bottom:1rem;display:flex;align-items:center;gap:1rem;cursor:pointer;transition:all .2s;}
.projet-card:hover{box-shadow:var(--ombre-lg);transform:translateX(3px);}
.projet-theme-dot{width:12px;height:12px;border-radius:50%;flex-shrink:0;}
.projet-info{flex:1;}
.projet-titre{font-weight:800;font-size:.95rem;margin-bottom:.2rem;}
.projet-meta{font-size:.78rem;color:var(--gris);}
.statut-badge{padding:.3rem .8rem;border-radius:20px;font-size:.72rem;font-weight:800;white-space:nowrap;flex-shrink:0;}
.s-Prioritaire{background:#fef3c7;color:#92400e;}
.s-Programme{background:#dbeafe;color:#1e40af;}
.s-Planifie,.s-Planifié{background:#e0e7ff;color:#3730a3;}
.s-Etude,.s-Étude{background:#f3f4f6;color:#374151;}
.s-En.cours{background:#d1fae5;color:#065f46;}
.s-Realise,.s-Réalisé{background:#dcfce7;color:#166534;}
.s-Suspendu{background:#fee2e2;color:#991b1b;}

/* ── FILTRE THÈME ── */
.filtre-row{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1.5rem;}
.filtre-btn{padding:.4rem 1rem;border-radius:20px;font-size:.8rem;font-weight:700;cursor:pointer;border:2px solid var(--border);background:#fff;color:var(--gris);transition:all .15s;}
.filtre-btn:hover,.filtre-btn.active{background:var(--bleu);color:#fff;border-color:var(--bleu);}

/* ── GUIDE ── */
.guide-card{background:var(--card);border-radius:var(--radius);border:1px solid var(--border);box-shadow:var(--ombre);padding:1.5rem;cursor:pointer;transition:all .2s;border-left:4px solid #8B5CF6;}
.guide-card:hover{box-shadow:var(--ombre-lg);transform:translateY(-2px);}
.guide-ico{font-size:2rem;margin-bottom:.75rem;}
.guide-titre{font-weight:800;font-size:1rem;color:var(--bleu);margin-bottom:.4rem;}
.guide-court{font-size:.82rem;color:var(--gris);line-height:1.5;}
.guide-lire{margin-top:.8rem;font-size:.78rem;font-weight:700;color:#8B5CF6;}

/* ── ÉQUIPE ── */
.elu-card{background:var(--card);border-radius:var(--radius);border:1px solid var(--border);box-shadow:var(--ombre);padding:1.2rem;text-align:center;transition:all .2s;}
.elu-card:hover{box-shadow:var(--ombre-lg);}
.elu-avatar{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.1rem;color:#fff;margin:0 auto .75rem;}
.elu-nom{font-weight:800;font-size:.9rem;margin-bottom:.2rem;}
.elu-role{font-size:.75rem;color:var(--or);font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.3rem;}
.elu-deleg{font-size:.75rem;color:var(--gris);line-height:1.4;}

/* ── RESSOURCES ── */
.ress-card{display:flex;align-items:center;gap:1rem;background:var(--card);border-radius:var(--radius-sm);border:1px solid var(--border);padding:1rem 1.2rem;text-decoration:none;color:var(--texte);transition:all .2s;}
.ress-card:hover{box-shadow:var(--ombre);transform:translateX(3px);border-color:var(--bleu);}
.ress-ico{font-size:1.8rem;flex-shrink:0;}
.ress-title{font-weight:800;font-size:.9rem;color:var(--bleu);}
.ress-desc{font-size:.76rem;color:var(--gris);}
.ress-arr{margin-left:auto;font-size:1.2rem;color:var(--gris2);}

/* ── CHAT ── */
.chat-wrap{display:grid;grid-template-columns:200px 1fr;gap:1.2rem;}
.chat-channels{display:flex;flex-direction:column;gap:.5rem;}
.channel-btn{padding:.75rem 1rem;border-radius:var(--radius-sm);border:2px solid var(--border);background:#fff;font-size:.85rem;font-weight:700;cursor:pointer;text-align:left;transition:all .15s;font-family:'Nunito',sans-serif;}
.channel-btn:hover{border-color:var(--bleu);}
.channel-btn.active{background:var(--bleu);color:#fff;border-color:var(--bleu);}
.chat-box{background:var(--card);border-radius:var(--radius);border:1px solid var(--border);box-shadow:var(--ombre);display:flex;flex-direction:column;height:520px;}
.chat-head{padding:1rem 1.2rem;border-bottom:1px solid var(--border);font-weight:800;color:var(--bleu);font-size:.95rem;}
.chat-msgs{flex:1;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:.75rem;}
.chat-msgs::-webkit-scrollbar{width:4px;}.chat-msgs::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px;}
.msg-row{display:flex;gap:.6rem;align-items:flex-start;}
.msg-av{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:800;color:#fff;flex-shrink:0;}
.msg-bubble{background:#f3f4f6;border-radius:0 12px 12px 12px;padding:.6rem .9rem;max-width:75%;}
.msg-author{font-size:.72rem;font-weight:800;color:var(--bleu);margin-bottom:.15rem;}
.msg-text{font-size:.85rem;line-height:1.5;}
.msg-time{font-size:.65rem;color:var(--gris2);margin-top:.2rem;}
.msg-row.moi .msg-bubble{background:#dbeafe;border-radius:12px 0 12px 12px;margin-left:auto;}
.msg-row.moi{flex-direction:row-reverse;}
.chat-input-row{padding:.8rem 1rem;border-top:1px solid var(--border);display:flex;gap:.6rem;}
.chat-input{flex:1;padding:.6rem .9rem;border:1.5px solid var(--border);border-radius:8px;font-size:.88rem;font-family:'Nunito',sans-serif;}
.chat-input:focus{outline:none;border-color:var(--bleu);}

/* ── RÉDIGER ── */
.rediger-result{background:#f8fffe;border:1.5px solid #a7f3d0;border-radius:var(--radius);padding:1.5rem;margin-top:1.2rem;display:none;}
.rediger-result.visible{display:block;}
.result-text{font-size:.9rem;line-height:1.8;color:var(--texte);white-space:pre-wrap;}

/* ── MODAL ── */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:100;display:none;align-items:center;justify-content:center;padding:1rem;}
.modal-overlay.open{display:flex;}
.modal{background:#fff;border-radius:var(--radius);max-width:600px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:var(--ombre-lg);}
.modal-head{padding:1.2rem 1.5rem;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:1rem;}
.modal-ico{font-size:1.8rem;}
.modal-title{font-weight:800;font-size:1.1rem;color:var(--bleu);flex:1;}
.modal-close{background:none;border:none;font-size:1.4rem;cursor:pointer;color:var(--gris);padding:.2rem .5rem;}
.modal-body{padding:1.5rem;}

/* ── TOAST ── */
.toast{position:fixed;bottom:1.5rem;right:1.5rem;background:var(--vert);color:#fff;padding:.8rem 1.5rem;border-radius:var(--radius-sm);font-weight:700;font-size:.88rem;box-shadow:var(--ombre-lg);z-index:200;transform:translateY(100px);opacity:0;transition:all .3s;}
.toast.show{transform:translateY(0);opacity:1;}

/* ── SECTION HEADER ── */
.section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;}

/* ── EMPTY STATE ── */
.empty{text-align:center;padding:3rem;color:var(--gris);}
.empty-ico{font-size:3rem;margin-bottom:1rem;}
.empty-text{font-size:1rem;font-weight:600;}
.empty-sub{font-size:.85rem;margin-top:.3rem;}
</style>
</head>
<body>

<header class="header">
  <a class="header-logo" href="#">Vizille <span>en Mouvement</span> <small class="header-sub">— Espace élus</small></a>
  <div class="header-date" id="hdate"></div>
  <a href="https://kmeet.infomaniak.com" target="_blank" class="header-btn btn-visio">🎥 Rejoindre une réunion</a>
</header>

<div class="layout">
  <!-- SIDEBAR -->
  <nav class="sidebar">
    <div class="nav-section">Navigation</div>
    <div class="nav-item active" onclick="goPage('accueil')"><span class="nav-icon">🏠</span> Accueil</div>
    <div class="nav-item" onclick="goPage('agenda')"><span class="nav-icon">📅</span> Agenda</div>
    <div class="nav-item" onclick="goPage('evenements')"><span class="nav-icon">🚨</span> Événements <span class="nav-badge" id="ev-badge" style="display:none"></span></div>
    <div class="nav-item" onclick="goPage('projets')"><span class="nav-icon">📋</span> Nos projets</div>
    <div class="nav-item" onclick="goPage('equipe')"><span class="nav-icon">👥</span> L'équipe</div>
    <div class="nav-section">Ressources</div>
    <div class="nav-item" onclick="goPage('guides')"><span class="nav-icon">📖</span> Guide de l'élu</div>
    <div class="nav-item" onclick="goPage('chat')"><span class="nav-icon">💬</span> Messagerie <span class="nav-badge" id="chat-badge" style="display:none">!</span></div>
    <div class="nav-item" onclick="goPage('rediger')"><span class="nav-icon">✍️</span> Rédiger</div>
    <div class="nav-item" onclick="goPage('ressources')"><span class="nav-icon">🔗</span> Liens utiles</div>
  </nav>

  <!-- MAIN -->
  <main class="main">

    <!-- ── ACCUEIL ── -->
    <div id="page-accueil" class="page active">
      <div id="next-meeting-wrap"></div>
      <div class="tiles">
        <div class="tile t-agenda" onclick="goPage('agenda')">
          <div class="tile-ico">📅</div>
          <div class="tile-label">Agenda</div>
          <div class="tile-desc">Réunions et rendez-vous</div>
        </div>
        <div class="tile t-evenements" onclick="goPage('evenements')">
          <div class="tile-ico">🚨</div>
          <div class="tile-label">Événements</div>
          <div class="tile-desc">Signalements et incidents</div>
        </div>
        <div class="tile t-projets" onclick="goPage('projets')">
          <div class="tile-ico">📋</div>
          <div class="tile-label">Nos projets</div>
          <div class="tile-desc">Suivi du programme</div>
        </div>
        <div class="tile t-equipe" onclick="goPage('equipe')">
          <div class="tile-ico">👥</div>
          <div class="tile-label">L'équipe</div>
          <div class="tile-desc">Contacts des élus</div>
        </div>
        <div class="tile t-guides" onclick="goPage('guides')">
          <div class="tile-ico">📖</div>
          <div class="tile-label">Guide de l'élu</div>
          <div class="tile-desc">Vos droits et devoirs</div>
        </div>
        <div class="tile t-chat" onclick="goPage('chat')">
          <div class="tile-ico">💬</div>
          <div class="tile-label">Messagerie</div>
          <div class="tile-desc">Échangez par commission</div>
        </div>
        <div class="tile t-rediger" onclick="goPage('rediger')">
          <div class="tile-ico">✍️</div>
          <div class="tile-label">Rédiger</div>
          <div class="tile-desc">Assistant à la rédaction IA</div>
        </div>
        <div class="tile t-ressources" onclick="goPage('ressources')">
          <div class="tile-ico">🔗</div>
          <div class="tile-label">Liens utiles</div>
          <div class="tile-desc">AMF, Légifrance, kDrive…</div>
        </div>
        <div class="tile t-site" onclick="window.open('https://vizilleenmouvement.fr','_blank')">
          <div class="tile-ico">🌐</div>
          <div class="tile-label">Site public</div>
          <div class="tile-desc">vizilleenmouvement.fr</div>
        </div>
      </div>
      <div class="grid-4" id="stats-row"></div>
    </div>

    <!-- ── ÉVÉNEMENTS ── -->
    <div id="page-evenements" class="page">
      <div class="section-header">
        <div>
          <div class="page-title">🚨 Événements</div>
          <div class="page-sub">Signalements, incidents, demandes — suivi en temps réel</div>
        </div>
      </div>
      <div class="grid-2" style="margin-bottom:1.5rem;">
        <!-- Formulaire -->
        <div class="form-card">
          <div style="font-weight:800;font-size:1rem;color:var(--bleu);margin-bottom:1rem;">➕ Signaler un événement</div>
          <div class="form-row">
            <label class="form-label">Catégorie</label>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;" id="ev-cat-btns"></div>
          </div>
          <div class="form-row">
            <label class="form-label">Titre / Objet</label>
            <input class="form-input" id="ev-titre" placeholder="Ex : Lampadaire éteint rue Barbusse">
          </div>
          <div class="form-row">
            <label class="form-label">Description</label>
            <textarea class="form-textarea" id="ev-desc" placeholder="Détails, localisation précise, personnes concernées…"></textarea>
          </div>
          <div class="form-row-2">
            <div>
              <label class="form-label">Localisation</label>
              <input class="form-input" id="ev-lieu" placeholder="Adresse, quartier…">
            </div>
            <div>
              <label class="form-label">Priorité</label>
              <select class="form-select" id="ev-prio">
                <option value="normale">Normale</option>
                <option value="urgente">🔴 Urgente</option>
                <option value="faible">Faible</option>
              </select>
            </div>
          </div>
          <button class="btn btn-danger btn-full" onclick="addEvenement()" style="background:#EF4444;color:#fff;">🚨 Signaler</button>
        </div>
        <!-- Stats rapides -->
        <div>
          <div class="grid-2" style="margin-bottom:1rem;" id="ev-stats"></div>
          <div style="font-weight:800;font-size:.85rem;color:var(--gris);margin:.5rem 0 .6rem;">Filtrer par statut</div>
          <div class="ev-filters" id="ev-statut-filters"></div>
        </div>
      </div>
      <!-- Liste -->
      <div class="cat-colors" id="evenements-list"></div>
    </div>

    <!-- ── AGENDA ── -->
    <div id="page-agenda" class="page">
      <div class="section-header">
        <div>
          <div class="page-title">📅 Agenda</div>
          <div class="page-sub">Vos prochaines réunions et rendez-vous</div>
        </div>
      </div>
      <div class="grid-2" style="margin-bottom:1.5rem;">
        <div class="form-card">
          <div style="font-weight:800;font-size:1rem;color:var(--bleu);margin-bottom:1rem;">➕ Ajouter un événement</div>
          <div class="form-row"><label class="form-label">Titre de l'événement</label><input class="form-input" id="ag-titre" placeholder="Ex : Réunion de commission Culture"></div>
          <div class="form-row-2">
            <div><label class="form-label">Date</label><input class="form-input" id="ag-date" type="date"></div>
            <div><label class="form-label">Heure</label><input class="form-input" id="ag-heure" type="time" value="18:00"></div>
          </div>
          <div class="form-row"><label class="form-label">Lieu</label><input class="form-input" id="ag-lieu" placeholder="Ex : Salle du conseil, Hôtel de Ville"></div>
          <button class="btn btn-primary btn-full" onclick="addAgenda()">✅ Enregistrer</button>
        </div>
        <div id="agenda-list" style="display:flex;flex-direction:column;gap:.7rem;"></div>
      </div>
    </div>

    <!-- ── PROJETS ── -->
    <div id="page-projets" class="page">
      <div class="page-title">📋 Nos projets</div>
      <div class="page-sub">Suivi du programme municipal 2026-2032</div>
      <div class="filtre-row" id="filtre-themes">
        <button class="filtre-btn active" onclick="filtreProjet('',this)">Tous</button>
      </div>
      <div id="projets-list"></div>
    </div>

    <!-- ── ÉQUIPE ── -->
    <div id="page-equipe" class="page">
      <div class="page-title">👥 L'équipe</div>
      <div class="page-sub">Les élues et élus de Vizille en Mouvement</div>
      <div class="grid-4" id="equipe-grid" style="margin-bottom:2rem;"></div>
    </div>

    <!-- ── GUIDES ── -->
    <div id="page-guides" class="page">
      <div class="page-title">📖 Guide de l'élu</div>
      <div class="page-sub">Tout ce qu'il faut savoir pour bien exercer votre mandat</div>
      <div class="grid-3" id="guides-grid"></div>
    </div>

    <!-- ── CHAT ── -->
    <div id="page-chat" class="page">
      <div class="page-title">💬 Messagerie</div>
      <div class="page-sub">Échangez avec l'équipe par commission</div>
      <div class="chat-wrap">
        <div>
          <div style="font-weight:800;font-size:.85rem;color:var(--gris);margin-bottom:.75rem;">Canaux</div>
          <div class="chat-channels" id="chat-channels"></div>
        </div>
        <div class="chat-box">
          <div class="chat-head" id="chat-head">Général</div>
          <div class="chat-msgs" id="chat-msgs"></div>
          <div class="chat-input-row">
            <input class="chat-input" id="chat-input" placeholder="Votre message…" onkeydown="if(event.key==='Enter')sendMsg()">
            <button class="btn btn-primary" onclick="sendMsg()">Envoyer →</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── RÉDIGER ── -->
    <div id="page-rediger" class="page">
      <div class="page-title">✍️ Rédiger un document</div>
      <div class="page-sub">L'assistant IA prépare votre document en quelques secondes</div>
      <div class="grid-2">
        <div class="form-card">
          <div class="form-row">
            <label class="form-label">Type de document</label>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:.6rem;" id="doc-types"></div>
          </div>
          <div class="form-row" style="margin-top:1rem;">
            <label class="form-label">Sujet / Objet</label>
            <input class="form-input" id="red-sujet" placeholder="Ex : Inauguration de la nouvelle aire de jeux place Barbusse">
          </div>
          <div class="form-row">
            <label class="form-label">Contexte supplémentaire (facultatif)</label>
            <textarea class="form-textarea" id="red-contexte" placeholder="Informations utiles pour personnaliser le document…"></textarea>
          </div>
          <button class="btn btn-gold btn-full" onclick="generer()" id="btn-gen">✨ Générer avec l'IA</button>
        </div>
        <div>
          <div class="rediger-result" id="rediger-result">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">
              <div style="font-weight:800;color:var(--vert);">✅ Document généré</div>
              <button class="btn btn-ghost btn-sm" onclick="copyResult()">📋 Copier</button>
            </div>
            <div class="result-text" id="result-text"></div>
          </div>
          <div id="rediger-placeholder" style="text-align:center;padding:3rem;color:var(--gris);">
            <div style="font-size:3rem;margin-bottom:1rem;">✨</div>
            <div style="font-weight:700;font-size:1rem;">Votre document apparaîtra ici</div>
            <div style="font-size:.85rem;margin-top:.3rem;">Choisissez un type et un sujet, puis cliquez sur Générer</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── RESSOURCES ── -->
    <div id="page-ressources" class="page">
      <div class="page-title">🔗 Liens utiles</div>
      <div class="page-sub">Vos ressources au quotidien</div>
      <div style="display:flex;flex-direction:column;gap:.75rem;" id="ress-list"></div>
    </div>

  </main>
</div>

<!-- MODAL GUIDE -->
<div class="modal-overlay" id="guide-modal" onclick="if(event.target===this)closeGuide()">
  <div class="modal">
    <div class="modal-head">
      <div class="modal-ico" id="gm-ico"></div>
      <div class="modal-title" id="gm-titre"></div>
      <button class="modal-close" onclick="closeGuide()">✕</button>
    </div>
    <div class="modal-body" id="gm-body" style="font-size:.95rem;line-height:1.85;color:var(--texte);"></div>
  </div>
</div>

<!-- MODAL PROJET -->
<div class="modal-overlay" id="proj-modal" onclick="if(event.target===this)closeProjModal()">
  <div class="modal" style="max-width:700px;">
    <div class="modal-head">
      <div class="modal-ico">📋</div>
      <div class="modal-title" id="pm-titre"></div>
      <button class="modal-close" onclick="closeProjModal()">✕</button>
    </div>
    <div class="modal-body" id="pm-body"></div>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
const GUIDES_DATA = ${JSON.stringify(GUIDES)};
const RESS_DATA   = ${JSON.stringify(RESS)};
const TYPE_API    = ${JSON.stringify(TYPE_API)};
const TYPES_DOC   = ${JSON.stringify(TYPES_DOC)};
const CCOLORS     = ${JSON.stringify(CCOLORS)};

let D = {projets:[],agenda:[],elus:[],chat:[],statuts:{}};
let currentPage = 'accueil';
let currentChannel = 'general';
let chatLastId = 0;
let selectedDocType = TYPES_DOC[0];
let filtreTheme = '';

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('hdate').textContent = new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  renderDocTypes();
  renderRessources();
  renderGuides();
  await loadAll();
  startChatPoll();
});

async function loadAll() {
  try {
    const r = await fetch('/api/all');
    D = await r.json();
    renderAll();
  } catch(e) { console.error(e); }
}

function renderAll() {
  renderAccueil();
  renderAgenda();
  renderProjets();
  renderEquipe();
  renderChatChannels();
  loadChatMsgs();
}

// ── ÉVÉNEMENTS ────────────────────────────────────────────────
const EV_CATS = [
  {id:'Signalement',ico:'📢',color:'#EF4444'},
  {id:'Incident',ico:'⚠️',color:'#F97316'},
  {id:'Voirie',ico:'🚧',color:'#F59E0B'},
  {id:'Éclairage',ico:'💡',color:'#EAB308'},
  {id:'Propreté',ico:'🗑️',color:'#10B981'},
  {id:'Nuisance',ico:'🔊',color:'#8B5CF6'},
  {id:'Demande',ico:'📋',color:'#3B82F6'},
  {id:'Autre',ico:'📌',color:'#6B7280'}
];
const EV_STATUTS = ['Nouveau','En cours','Transmis','Traité','Archivé'];
let evCatSelected = 'Signalement';
let evStatutFilter = '';

function initEvenements() {
  // Boutons catégorie
  document.getElementById('ev-cat-btns').innerHTML = EV_CATS.map(c=>
    '<button class="btn btn-ghost btn-sm" data-cat="'+c.id+'" data-color="'+c.color+'" style="justify-content:flex-start;gap:.4rem;'+(c.id===evCatSelected?'background:'+c.color+';color:#fff;border-color:'+c.color+';':'')+'" onclick="selectEvCat(this)">'+c.ico+' '+c.id+'</button>'
  ).join('');
  // Filtres statut
  document.getElementById('ev-statut-filters').innerHTML =
    '<button class="filtre-btn'+(evStatutFilter===''?' active':'')+'" data-s="" onclick="filtreEv(this)">Tous</button>'+
    EV_STATUTS.map(s=>'<button class="filtre-btn'+(evStatutFilter===s?' active':'')+'" data-s="'+s+'" onclick="filtreEv(this)">'+s+'</button>').join('');
}

function selectEvCat(btn) {
  const id = btn.dataset.cat; const color = btn.dataset.color;
  evCatSelected = id;
  document.querySelectorAll('#ev-cat-btns .btn').forEach(b=>{b.style.background='';b.style.color='';b.style.borderColor='';});
  btn.style.background=color;btn.style.color='#fff';btn.style.borderColor=color;
}

function filtreEv(btn) {
  evStatutFilter = btn.dataset.s||'';
  document.querySelectorAll('#ev-statut-filters .filtre-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderEvenements();
}

function renderEvenements() {
  initEvenements();
  const evs = (D.evenements||[]).filter(e=>!evStatutFilter||e.statut===evStatutFilter)
    .sort((a,b)=>new Date(b.date||0)-new Date(a.date||0));

  // Stats
  const counts = {};
  EV_STATUTS.forEach(s=>counts[s]=0);
  (D.evenements||[]).forEach(e=>{ if(counts[e.statut]!==undefined) counts[e.statut]++; });
  document.getElementById('ev-stats').innerHTML =
    '<div class="card stat-card" style="padding:1rem;"><div style="font-size:1.5rem;">🆕</div><div class="stat-val" style="font-size:1.5rem;">'+(counts['Nouveau']||0)+'</div><div class="stat-label">Nouveaux</div></div>'+
    '<div class="card stat-card" style="padding:1rem;"><div style="font-size:1.5rem;">⚙️</div><div class="stat-val" style="font-size:1.5rem;">'+(counts['En cours']||0)+'</div><div class="stat-label">En cours</div></div>';

  // Badge nav
  const nbNew = counts['Nouveau']||0;
  const badge = document.getElementById('ev-badge');
  if(badge){badge.textContent=nbNew||'';badge.style.display=nbNew?'':'none';}

  if(!evs.length){
    document.getElementById('evenements-list').innerHTML='<div class="empty"><div class="empty-ico">🚨</div><div class="empty-text">Aucun événement'+(evStatutFilter?' avec ce statut':'')+'</div><div class="empty-sub">Utilisez le formulaire pour signaler</div></div>';
    return;
  }

  document.getElementById('evenements-list').innerHTML = evs.map(e=>{
    const cat = EV_CATS.find(c=>c.id===e.categorie)||EV_CATS[EV_CATS.length-1];
    const sc = (e.statut||'Nouveau').replace(/[éèêë]/g,'e').replace(/\s/g,'-');
    const d = e.date ? new Date(e.date).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}) : '';
    const prio = e.priorite==='urgente'?'<span style="background:#fee2e2;color:#991b1b;font-size:.68rem;font-weight:800;padding:.15rem .5rem;border-radius:10px;">🔴 URGENT</span>':'';
    return '<div class="ev-card">'+
      '<div class="ev-cat-dot" style="background:'+cat.color+'" title="'+cat.id+'"></div>'+
      '<div>'+
        '<div class="ev-titre">'+cat.ico+' '+e.titre+'</div>'+
        '<div class="ev-meta">'+cat.id+(e.lieu?' · 📍'+e.lieu:'')+' · '+d+'</div>'+
        (e.description?'<div class="ev-desc">'+e.description+'</div>':'')+
      '</div>'+
      '<div class="ev-statut-wrap">'+
        '<div class="ev-statut ev-'+sc+'">'+(e.statut||'Nouveau')+'</div>'+
        prio+
        '<select style="font-size:.72rem;padding:.25rem .4rem;border:1px solid var(--border);border-radius:6px;font-family:\'Nunito\',sans-serif;cursor:pointer;" onchange="changeEvStatut('+e.id+',this.value)">'+
        EV_STATUTS.map(s=>'<option'+(s===e.statut?' selected':'')+'>'+s+'</option>').join('')+
        '</select>'+
      '</div>'+
    '</div>';
  }).join('');
}

async function addEvenement() {
  const titre = document.getElementById('ev-titre').value.trim();
  if(!titre){toast('Indiquez un titre','⚠️');return;}
  const ev = {
    titre, categorie:evCatSelected,
    description:document.getElementById('ev-desc').value.trim(),
    lieu:document.getElementById('ev-lieu').value.trim(),
    priorite:document.getElementById('ev-prio').value,
    statut:'Nouveau', date:new Date().toISOString()
  };
  const r = await fetch('/api/evenement',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(ev)});
  if((await r.json()).ok){
    document.getElementById('ev-titre').value='';
    document.getElementById('ev-desc').value='';
    document.getElementById('ev-lieu').value='';
    toast('Événement signalé ✅');
    await loadAll();
  }
}

async function changeEvStatut(id, statut) {
  await fetch('/api/evenement/'+id+'/statut',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({statut})});
  toast('Statut mis à jour : '+statut);
  await loadAll();
}

// ── NAVIGATION ────────────────────────────────────────────────
function goPage(id) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n=>{ if(n.textContent.trim().toLowerCase().includes(id)||n.onclick?.toString().includes(id)) n.classList.add('active'); });
  currentPage = id;
  if(id==='chat') loadChatMsgs();
}

// ── ACCUEIL ───────────────────────────────────────────────────
function renderAccueil() {
  // Prochaine réunion
  const now = new Date();
  const prochains = (D.agenda||[])
    .filter(a => new Date(a.date) >= now)
    .sort((a,b)=>new Date(a.date)-new Date(b.date));
  const wrap = document.getElementById('next-meeting-wrap');
  if(prochains.length) {
    const p = prochains[0];
    const d = new Date(p.date);
    const ds = d.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});
    wrap.innerHTML = \`<div class="next-meeting">
      <div class="next-ico">📅</div>
      <div>
        <div class="next-label">Prochaine réunion</div>
        <div class="next-titre">\${p.titre}</div>
        <div class="next-date">\${ds}\${p.heure?' à '+p.heure:''}\${p.lieu?' — '+p.lieu:''}</div>
      </div>
    </div>\`;
  } else {
    wrap.innerHTML = \`<div class="next-meeting"><div class="next-ico">📅</div><div><div class="next-label">Agenda</div><div class="next-empty">Aucune réunion planifiée — ajoutez-en une dans l'agenda</div></div></div>\`;
  }
  // Stats
  const total = D.projets?.length||0;
  const enCours = D.projets?.filter(p=>(D.statuts?.[p.id]||p.statut||'').toLowerCase().includes('cours')).length||0;
  const realises = D.projets?.filter(p=>(D.statuts?.[p.id]||p.statut||'').toLowerCase().includes('realis')).length||0;
  document.getElementById('stats-row').innerHTML = [
    {ico:'📋',val:total,label:'Projets au programme'},
    {ico:'⚙️',val:enCours,label:'En cours'},
    {ico:'✅',val:realises,label:'Réalisés'},
    {ico:'👥',val:D.elus?.length||0,label:'Élues et élus'}
  ].map(s=>\`<div class="card stat-card"><div class="stat-ico">\${s.ico}</div><div class="stat-val">\${s.val}</div><div class="stat-label">\${s.label}</div></div>\`).join('');
}

// ── AGENDA ────────────────────────────────────────────────────
function renderAgenda() {
  const now = new Date();
  const items = (D.agenda||[]).filter(a=>new Date(a.date)>=now).sort((a,b)=>new Date(a.date)-new Date(b.date));
  const el = document.getElementById('agenda-list');
  if(!items.length){el.innerHTML='<div class="empty"><div class="empty-ico">📅</div><div class="empty-text">Aucun événement à venir</div></div>';return;}
  el.innerHTML = items.map(a=>{
    const d = new Date(a.date);
    const day = d.toLocaleDateString('fr-FR',{day:'2-digit'});
    const month = d.toLocaleDateString('fr-FR',{month:'short'});
    return \`<div class="agenda-item">
      <div class="agenda-date-box"><div class="agenda-day">\${day}</div><div class="agenda-month">\${month}</div></div>
      <div style="flex:1;">
        <div class="agenda-title">\${a.titre}</div>
        <div class="agenda-meta">\${a.heure||''}\${a.lieu?' — '+a.lieu:''}</div>
      </div>
      <button class="agenda-del" onclick="delAgenda(\${a.id})" title="Supprimer">🗑</button>
    </div>\`;
  }).join('');
}

async function addAgenda() {
  const titre = document.getElementById('ag-titre').value.trim();
  const date  = document.getElementById('ag-date').value;
  if(!titre||!date){toast('Remplissez le titre et la date','⚠️');return;}
  const r = await fetch('/api/agenda',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({titre,date,heure:document.getElementById('ag-heure').value,lieu:document.getElementById('ag-lieu').value})});
  if((await r.json()).ok){
    document.getElementById('ag-titre').value='';
    document.getElementById('ag-date').value='';
    toast('Événement ajouté ✅');
    await loadAll();
  }
}

async function delAgenda(id) {
  if(!confirm('Supprimer cet événement ?')) return;
  await fetch('/api/agenda/'+id,{method:'DELETE'});
  toast('Événement supprimé');
  await loadAll();
}

// ── PROJETS ───────────────────────────────────────────────────
function renderProjets() {
  const themes = [...new Set((D.projets||[]).map(p=>p.theme).filter(Boolean))].sort();
  const fb = document.getElementById('filtre-themes');
  fb.innerHTML = '<button class="filtre-btn'+(filtreTheme===''?' active':'')+'" onclick="filtreProjet(\\'\\',this)">Tous</button>'
    + themes.map(t=>\`<button class="filtre-btn\${filtreTheme===t?' active':''}" onclick="filtreProjet('\${t.replace(/'/g,"\\\\'")}',this)">\${t}</button>\`).join('');
  const projets = (D.projets||[]).filter(p=>!filtreTheme||p.theme===filtreTheme);
  const el = document.getElementById('projets-list');
  if(!projets.length){el.innerHTML='<div class="empty"><div class="empty-ico">📋</div><div class="empty-text">Aucun projet</div></div>';return;}
  el.innerHTML = projets.map(p=>{
    const statut = D.statuts?.[p.id]||p.statut||'ND';
    const color = CCOLORS[p.theme]||'#6B7280';
    const sc = statut.replace(/[^a-zA-Z]/g,'');
    return \`<div class="projet-card" onclick="openProjet(\${p.id})">
      <div class="projet-theme-dot" style="background:\${color}"></div>
      <div class="projet-info">
        <div class="projet-titre">\${p.titre||p.action||''}</div>
        <div class="projet-meta">\${p.theme||''}  \${p.annee?'· '+p.annee:''}</div>
      </div>
      <div class="statut-badge s-\${sc}">\${statut}</div>
    </div>\`;
  }).join('');
}

function filtreProjet(theme, btn) {
  filtreTheme = theme;
  document.querySelectorAll('.filtre-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderProjets();
}

async function openProjet(id) {
  const r = await fetch('/api/proj/'+id);
  const p = await r.json();
  document.getElementById('pm-titre').textContent = p.titre||p.action||'Projet';
  const statut = p.statut||'ND';
  const sc = statut.replace(/[^a-zA-Z]/g,'');
  const STATUTS = ["Prioritaire","Programme","Planifie","Etude","En cours","Realise","Suspendu"];
  document.getElementById('pm-body').innerHTML = \`
    <div style="margin-bottom:1rem;display:flex;gap:.75rem;flex-wrap:wrap;align-items:center;">
      <span class="statut-badge s-\${sc}">\${statut}</span>
      \${p.theme?'<span style="background:#f3f4f6;padding:.3rem .8rem;border-radius:20px;font-size:.75rem;font-weight:700;">'+p.theme+'</span>':''}
      \${p.annee?'<span style="color:var(--gris);font-size:.8rem;">'+p.annee+'</span>':''}
    </div>
    \${p.resume?'<p style="font-size:.9rem;line-height:1.7;margin-bottom:1rem;">'+p.resume+'</p>':''}
    \${p.description&&p.description!==p.resume?'<p style="font-size:.85rem;line-height:1.7;color:var(--gris);margin-bottom:1rem;">'+p.description+'</p>':''}
    \${p.budget?'<p style="font-size:.85rem;"><strong>Budget :</strong> '+p.budget+'</p>':''}
    \${p.notes?'<div style="background:#f8f6f2;border-radius:8px;padding:.75rem 1rem;margin-top:.75rem;font-size:.85rem;">'+p.notes+'</div>':''}
    <div style="margin-top:1.5rem;">
      <label class="form-label">Changer le statut</label>
      <div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.5rem;">
        \${STATUTS.map(s=>'<button class="btn btn-ghost btn-sm" style="'+(s===statut?'background:var(--bleu);color:#fff;':'')+'" onclick="changeStatut(\${p.id},\\''+s+'\\',\\''+encodeURIComponent(p.titre||p.action||'')+'\\')">'+s+'</button>').join('')}
      </div>
    </div>\`;
  document.getElementById('proj-modal').classList.add('open');
}

async function changeStatut(id, statut, titreEnc) {
  const titre = decodeURIComponent(titreEnc);
  const r = await fetch('/api/statut',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,statut,titre})});
  if((await r.json()).ok){
    if(D.statuts) D.statuts[id]=statut;
    toast('Statut mis à jour : '+statut+' ✅');
    closeProjModal();
    renderProjets();
    renderAccueil();
  }
}

function closeProjModal(){document.getElementById('proj-modal').classList.remove('open');}

// ── ÉQUIPE ────────────────────────────────────────────────────
function renderEquipe() {
  const el = document.getElementById('equipe-grid');
  el.innerHTML = (D.elus||[]).map(e=>{
    const initials = (e.avatar||(e.nom||'').split(' ').map(w=>w[0]).join('').slice(0,2)).toUpperCase();
    const photoPos = e.photoPosition||'center 20%';
    const avatar = e.photo
      ? '<div style="width:72px;height:72px;border-radius:50%;overflow:hidden;margin:0 auto .75rem;border:3px solid var(--or);flex-shrink:0;"><img src="'+e.photo+'" alt="'+e.nom+'" style="width:100%;height:100%;object-fit:cover;object-position:'+photoPos+';display:block;"></div>'
      : '<div class="elu-avatar" style="background:'+( e.color||'#1a3a6b')+'">'+initials+'</div>';
    return '<div class="elu-card">'+avatar+
      '<div class="elu-nom">'+e.nom+'</div>'+
      '<div class="elu-role">'+e.role+'</div>'+
      (e.delegation?'<div class="elu-deleg">'+e.delegation+'</div>':'')+
      (e.email?'<div style="margin-top:.5rem;"><a href="mailto:'+e.email+'" style="font-size:.75rem;color:var(--bleu);">✉️ '+e.email+'</a></div>':'')+
      '</div>';
  }).join('');
}

// ── GUIDES ────────────────────────────────────────────────────
function renderGuides() {
  document.getElementById('guides-grid').innerHTML = GUIDES_DATA.map(g=>\`
    <div class="guide-card" onclick="openGuide('\${g.id}')">
      <div class="guide-ico">\${g.icon}</div>
      <div class="guide-titre">\${g.titre}</div>
      <div class="guide-court">\${g.court}</div>
      <div class="guide-lire">Lire la fiche →</div>
    </div>\`).join('');
}

function openGuide(id) {
  const g = GUIDES_DATA.find(x=>x.id===id);
  if(!g) return;
  document.getElementById('gm-ico').textContent = g.icon;
  document.getElementById('gm-titre').textContent = g.titre;
  const liens = g.liens ? g.liens.map(l=>
    '<a href="'+l.url+'" target="_blank" style="display:flex;align-items:center;gap:.6rem;padding:.65rem .9rem;background:#f0f4ff;border-radius:8px;text-decoration:none;color:var(--bleu);font-weight:700;font-size:.85rem;border:1px solid #c7d7f5;transition:background .15s;" onmouseover="this.style.background=\'#dbeafe\'" onmouseout="this.style.background=\'#f0f4ff\'">'+
    '<span style="font-size:1.1rem;">↗</span><span>'+l.label+'</span></a>'
  ).join('') : '';
  document.getElementById('gm-body').innerHTML =
    '<p style="line-height:1.85;margin-bottom:1.2rem;">'+g.contenu+'</p>'+
    (liens ? '<div style="margin-top:1rem;"><div style="font-size:.75rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--gris);margin-bottom:.6rem;">Liens utiles</div><div style="display:flex;flex-direction:column;gap:.5rem;">'+liens+'</div></div>' : '');
  document.getElementById('guide-modal').classList.add('open');
}
function closeGuide(){document.getElementById('guide-modal').classList.remove('open');}

// ── RESSOURCES ────────────────────────────────────────────────
function renderRessources() {
  document.getElementById('ress-list').innerHTML = RESS_DATA.map(r=>\`
    <a class="ress-card" href="\${r.url}" target="_blank">
      <div class="ress-ico">\${r.icon}</div>
      <div><div class="ress-title">\${r.titre}</div><div class="ress-desc">\${r.desc}</div></div>
      <div class="ress-arr">↗</div>
    </a>\`).join('');
}

// ── CHAT ──────────────────────────────────────────────────────
function renderChatChannels() {
  const channels = ['general',...Object.keys(${JSON.stringify(COMM)})];
  document.getElementById('chat-channels').innerHTML = channels.map(c=>\`
    <button class="channel-btn\${c===currentChannel?' active':''}" onclick="switchChannel('\${c.replace(/'/g,"\\\\'")}')">
      \${c==='general'?'🌐 Général':'# '+c}
    </button>\`).join('');
}

function switchChannel(ch) {
  currentChannel = ch;
  chatLastId = 0;
  document.getElementById('chat-head').textContent = ch==='general'?'🌐 Général':'# '+ch;
  document.querySelectorAll('.channel-btn').forEach(b=>b.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('chat-msgs').innerHTML = '';
  loadChatMsgs();
}

async function loadChatMsgs() {
  try {
    const r = await fetch('/api/chat?channel='+encodeURIComponent(currentChannel)+'&since='+chatLastId);
    const d = await r.json();
    if(d.messages?.length) {
      const el = document.getElementById('chat-msgs');
      d.messages.forEach(m=>{
        const moi = m.auteur==='Moi';
        const av = moi ? '' : '<div class="msg-av" style="background:var(--bleu2)">'+(m.avatar||'?')+'</div>';
        const auth = moi ? '' : '<div class="msg-author">'+m.auteur+'</div>';
        el.innerHTML += '<div class="msg-row'+(moi?' moi':'')+'">'+av+'<div class="msg-bubble">'+auth+'<div class="msg-text">'+m.texte+'</div><div class="msg-time">'+(m.ts||'')+'</div></div></div>';
      });
      el.scrollTop = el.scrollHeight;
      chatLastId = d.lastId;
    }
  } catch(e){}
}

async function sendMsg() {
  const input = document.getElementById('chat-input');
  const texte = input.value.trim();
  if(!texte) return;
  input.value = '';
  await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({channel:currentChannel,auteur:'Moi',avatar:'?',texte})});
  await loadChatMsgs();
}

function startChatPoll() {
  setInterval(()=>{ if(currentPage==='chat') loadChatMsgs(); }, 8000);
}

// ── RÉDIGER ───────────────────────────────────────────────────
function renderDocTypes() {
  document.getElementById('doc-types').innerHTML = TYPES_DOC.map(t=>\`
    <button class="btn btn-ghost btn-sm" style="\${t===selectedDocType?'background:var(--bleu);color:#fff;border-color:var(--bleu);':''}" onclick="selectDocType('\${t}',this)">\${t}</button>
  \`).join('');
}

function selectDocType(t, btn) {
  selectedDocType = t;
  document.querySelectorAll('#doc-types .btn').forEach(b=>{b.style.background='';b.style.color='';b.style.borderColor='';});
  btn.style.background='var(--bleu)';btn.style.color='#fff';btn.style.borderColor='var(--bleu)';
}

async function generer() {
  const sujet = document.getElementById('red-sujet').value.trim();
  if(!sujet){toast('Indiquez un sujet','⚠️');return;}
  const btn = document.getElementById('btn-gen');
  btn.textContent = '⏳ Génération en cours…';btn.disabled=true;
  document.getElementById('rediger-placeholder').style.display='none';
  try {
    const r = await fetch('/api/genere',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({type:TYPE_API[selectedDocType]||'deliberation',sujet,contexte:document.getElementById('red-contexte').value})});
    const d = await r.json();
    if(d.ok){
      document.getElementById('result-text').textContent = d.texte;
      document.getElementById('rediger-result').classList.add('visible');
      toast('Document généré ✅');
    } else { toast('Erreur : '+(d.error||'IA indisponible'),'❌'); document.getElementById('rediger-placeholder').style.display=''; }
  } catch(e){ toast('Erreur réseau','❌'); document.getElementById('rediger-placeholder').style.display=''; }
  btn.textContent="✨ Générer avec l'IA";btn.disabled=false;
}

function copyResult() {
  navigator.clipboard.writeText(document.getElementById('result-text').textContent);
  toast('Copié dans le presse-papier ✅');
}

// ── TOAST ─────────────────────────────────────────────────────
function toast(msg, ico='✅') {
  const el = document.getElementById('toast');
  el.textContent = ico+' '+msg;
  el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'),3000);
}

document.addEventListener('keydown', e=>{
  if(e.key==='Escape'){closeGuide();closeProjModal();}
});

// ── ÉVÉNEMENTS ────────────────────────────────────────────────
const EV_CATS = [
  {id:'Signalement',icon:'📍',color:'#EF4444'},
  {id:'Incident',icon:'⚠️',color:'#F97316'},
  {id:'Voirie',icon:'🛣️',color:'#F59E0B'},
  {id:'Éclairage',icon:'💡',color:'#EAB308'},
  {id:'Propreté',icon:'🧹',color:'#10B981'},
  {id:'Nuisance',icon:'🔊',color:'#8B5CF6'},
  {id:'Demande',icon:'📝',color:'#3B82F6'},
  {id:'Autre',icon:'📌',color:'#6B7280'}
];
const EV_STATUTS = [
  {id:'Nouveau',color:'#fee2e2',text:'#991b1b'},
  {id:'En cours',color:'#fef3c7',text:'#92400e'},
  {id:'Transmis',color:'#dbeafe',text:'#1e40af'},
  {id:'Traité',color:'#dcfce7',text:'#166534'},
  {id:'Archivé',color:'#f3f4f6',text:'#6b7280'}
];
let selectedEvCat = EV_CATS[0].id;
let filtreEvStatut = '';
let evData = [];

(function initEvenements() {
  // Boutons catégorie
  const wrap = document.getElementById('ev-cat-btns');
  if(!wrap) return;
  wrap.innerHTML = EV_CATS.map(c=>'<button class="btn btn-ghost btn-sm" style="'+(c.id===selectedEvCat?'background:'+c.color+';color:#fff;border-color:'+c.color+';':'')+'" onclick="selectEvCat(\''+c.id+'\',this)">'+c.icon+' '+c.id+'</button>').join('');
  // Filtres statut
  const sf = document.getElementById('ev-statut-filters');
  if(sf) {
    sf.innerHTML = '<button class="filtre-btn active" onclick="filtreEv(\\'\\',this)">Tous</button>'
      + EV_STATUTS.map(s=>'<button class="filtre-btn" onclick="filtreEv(\''+s.id+'\',this)">'+s.id+'</button>').join('');
  }
  loadEvenements();
})();

function selectEvCat(id, btn) {
  selectedEvCat = id;
  document.querySelectorAll('#ev-cat-btns .btn').forEach(b=>{b.style.background='';b.style.color='';b.style.borderColor='';});
  const cat = EV_CATS.find(c=>c.id===id);
  btn.style.background = cat.color; btn.style.color='#fff'; btn.style.borderColor=cat.color;
}

function filtreEv(s, btn) {
  filtreEvStatut = s;
  document.querySelectorAll('#ev-statut-filters .filtre-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderEvenements();
}

async function loadEvenements() {
  try {
    const r = await fetch('/api/evenements');
    evenements = await r.json();
    renderEvenements();
  } catch(e){}
}

function renderEvenements() {
  // Stats rapides
  const stats = document.getElementById('ev-stats');
  if(stats) {
    const nvx = evenements.filter(e=>e.statut==='Nouveau').length;
    const enc = evenements.filter(e=>e.statut==='En cours').length;
    const trt = evenements.filter(e=>e.statut==='Traité').length;
    const urg = evenements.filter(e=>e.priorite==='urgente').length;
    stats.innerHTML = [
      {ico:'🔴',val:nvx,label:'Nouveaux'},
      {ico:'⚙️',val:enc,label:'En cours'},
      {ico:'✅',val:trt,label:'Traités'},
      {ico:'🚨',val:urg,label:'Urgents'}
    ].map(s=>'<div class="card stat-card" style="padding:1rem .5rem;"><div class="stat-ico" style="font-size:1.5rem;">'+s.ico+'</div><div class="stat-val" style="font-size:1.6rem;">'+s.val+'</div><div class="stat-label">'+s.label+'</div></div>').join('');
    // Badge sidebar
    const badge = document.getElementById('ev-badge');
    if(badge) { badge.textContent=nvx; badge.style.display=nvx?'':'none'; }
  }
  // Liste
  const el = document.getElementById('evenements-list');
  if(!el) return;
  const liste = filtreEvStatut ? evenements.filter(e=>e.statut===filtreEvStatut) : evenements;
  const sorted = liste.slice().sort((a,b)=>{
    if(a.priorite==='urgente'&&b.priorite!=='urgente') return -1;
    if(b.priorite==='urgente'&&a.priorite!=='urgente') return 1;
    if(a.statut==='Nouveau'&&b.statut!=='Nouveau') return -1;
    if(b.statut==='Nouveau'&&a.statut!=='Nouveau') return 1;
    return new Date(b.date||0)-new Date(a.date||0);
  });
  if(!sorted.length){el.innerHTML='<div class="empty"><div class="empty-ico">✅</div><div class="empty-text">Aucun événement</div><div class="empty-sub">Rien à signaler pour le moment</div></div>';return;}
  el.innerHTML = sorted.map(ev=>{
    const cat = EV_CATS.find(c=>c.id===ev.categorie)||EV_CATS[7];
    const st = EV_STATUTS.find(s=>s.id===ev.statut)||EV_STATUTS[0];
    const urgBadge = ev.priorite==='urgente' ? '<span style="background:#fee2e2;color:#991b1b;font-size:.68rem;font-weight:800;padding:.2rem .5rem;border-radius:10px;margin-left:.4rem;">🔴 URGENT</span>' : '';
    const nextStatuts = EV_STATUTS.filter(s=>s.id!==ev.statut);
    const btns = nextStatuts.map(s=>'<button class="btn btn-ghost btn-sm" style="font-size:.7rem;padding:.3rem .7rem;" onclick="changerStatutEv('+ev.id+',\''+s.id+'\')">→ '+s.id+'</button>').join('');
    return '<div class="ev-card" style="'+(ev.priorite==='urgente'?'border-left:4px solid #EF4444;':'')+'">'
      +'<div class="ev-cat-dot" style="background:'+cat.color+'"></div>'
      +'<div>'
        +'<div class="ev-titre">'+cat.icon+' '+ev.titre+urgBadge+'</div>'
        +'<div class="ev-meta">'+cat.id+(ev.lieu?' · '+ev.lieu:'')+(ev.date?' · '+new Date(ev.date).toLocaleDateString('fr-FR'):'')+'</div>'
        +(ev.description?'<div class="ev-desc">'+ev.description+'</div>':'')
        +'<div style="margin-top:.6rem;display:flex;flex-wrap:wrap;gap:.4rem;">'+btns
        +'<button class="btn btn-ghost btn-sm" style="font-size:.7rem;padding:.3rem .7rem;color:#dc2626;" onclick="delEvenement('+ev.id+')">🗑 Supprimer</button></div>'
      +'</div>'
      +'<div class="ev-statut-wrap">'
        +'<span class="ev-statut" style="background:'+st.color+';color:'+st.text+'">'+ev.statut+'</span>'
      +'</div>'
      +'</div>';
  }).join('');
}

async function addEvenement() {
  const titre = document.getElementById('ev-titre').value.trim();
  if(!titre){toast('Indiquez un titre','⚠️');return;}
  const data = {
    titre,
    categorie:selectedEvCat,
    description:document.getElementById('ev-desc').value.trim(),
    lieu:document.getElementById('ev-lieu').value.trim(),
    priorite:document.getElementById('ev-prio').value,
    statut:'Nouveau',
    date:new Date().toISOString()
  };
  const r = await fetch('/api/evenements',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  if((await r.json()).ok){
    document.getElementById('ev-titre').value='';
    document.getElementById('ev-desc').value='';
    document.getElementById('ev-lieu').value='';
    toast('Événement signalé ✅');
    await loadEvenements();
  }
}

async function changerStatutEv(id, statut) {
  await fetch('/api/evenements/'+id,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({statut})});
  toast('Statut mis à jour : '+statut+' ✅');
  await loadEvenements();
}

async function delEvenement(id) {
  if(!confirm('Supprimer cet événement ?')) return;
  await fetch('/api/evenements/'+id,{method:'DELETE'});
  toast('Événement supprimé');
  await loadEvenements();
}
</script>
</body>
</html>`;
}


const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Lecture du fichier .env si présent
try {
  const envFile = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  envFile.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length && !process.env[k.trim()]) process.env[k.trim()] = v.join('=').trim();
  });
} catch(e) { /* pas de .env — variables d'env système utilisées */ }

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
let elus      = load('elus.json', [
  {"id":1,"nom":"Catherine Troton","role":"Maire","delegation":"Direction générale — Exécutif municipal","avatar":"CT","color":"#1a3a6b","email":"maire@vizille.fr","photo":"images/catherine-troton.jpg","photoPosition":"center 15%"},
  {"id":2,"nom":"Bernard Ughetto-Monfrin","role":"1er adjoint","delegation":"","avatar":"BU","color":"#2d5a9e","photo":"images/bernard-ughetto-monfrin.jpg","photoPosition":"center 20%"},
  {"id":3,"nom":"Saïda Berriche","role":"Adjointe","delegation":"","avatar":"SB","color":"#8B5CF6","photo":"images/saida-berriche.jpg","photoPosition":"center 15%"},
  {"id":4,"nom":"Gilles Faure","role":"Adjoint","delegation":"","avatar":"GF","color":"#10B981","photo":"images/gilles-faure.jpg","photoPosition":"center 20%"},
  {"id":5,"nom":"Angélique Hermitte","role":"Adjointe","delegation":"Enfance, Jeunesse, Périscolaire","avatar":"AH","color":"#F97316","photo":"images/angelique-hermitte.jpg","photoPosition":"center 15%"},
  {"id":6,"nom":"Gérard Forestier","role":"Adjoint","delegation":"","avatar":"GF","color":"#3B82F6","photo":"images/gerard-forestier.jpg","photoPosition":"center 20%"},
  {"id":7,"nom":"Marie-Claude Argoud","role":"Adjointe","delegation":"Culture, Patrimoine, Jumelages","avatar":"MA","color":"#EC4899","photo":"images/marie-claude-argoud.jpg","photoPosition":"center 15%"},
  {"id":8,"nom":"Louis Lamarca","role":"Adjoint","delegation":"","avatar":"LL","color":"#14B8A6","photo":"images/louis-lamarca.jpg","photoPosition":"center 20%"},
  {"id":9,"nom":"Muriel Pasquiou","role":"Adjointe","delegation":"","avatar":"MP","color":"#F59E0B","photo":"images/muriel-pasquiou.jpg","photoPosition":"center 15%"},
  {"id":10,"nom":"Laurent Pichon","role":"Conseiller","delegation":"","avatar":"LP","color":"#6366F1","photo":"images/laurent-pichon.jpg","photoPosition":"center 20%"},
  {"id":11,"nom":"Sakina Yahiaoui","role":"Conseillère","delegation":"","avatar":"SY","color":"#EC4899","photo":"images/sakina-yahiaoui.jpg","photoPosition":"center 15%"},
  {"id":12,"nom":"Mohamed Cherigui","role":"Conseiller","delegation":"","avatar":"MC","color":"#2d5a9e","photo":"images/mohamed-cherigui.jpg","photoPosition":"center 20%"},
  {"id":13,"nom":"Christelle Reijasse","role":"Conseillère","delegation":"","avatar":"CR","color":"#8B5CF6","photo":"images/christelle-reijasse.jpg","photoPosition":"center 15%"},
  {"id":14,"nom":"Ahmed Mendess","role":"Conseiller","delegation":"","avatar":"AM","color":"#10B981","photo":"images/ahmed-mendess.jpg","photoPosition":"center 20%"},
  {"id":15,"nom":"Christine Sanchez","role":"Conseillère","delegation":"","avatar":"CS","color":"#F97316","photo":"images/christine-sanchez.jpg","photoPosition":"center 15%"},
  {"id":16,"nom":"Fabrice Pasquiou","role":"Conseiller","delegation":"","avatar":"FP","color":"#3B82F6","photo":"images/fabrice-pasquiou.jpg","photoPosition":"center 20%"},
  {"id":17,"nom":"Meriem El-Kebir","role":"Conseillère","delegation":"","avatar":"ME","color":"#14B8A6","photo":"images/meriem-el-kebir.jpg","photoPosition":"center 15%"},
  {"id":18,"nom":"Jean-Christophe Garcia","role":"Conseiller","delegation":"Animations de proximité","avatar":"JG","color":"#F59E0B","photo":"images/jean-christophe-garcia.jpg","photoPosition":"center 20%"},
  {"id":19,"nom":"Muriel Picca","role":"Conseillère","delegation":"","avatar":"MP","color":"#6366F1","photo":"images/muriel-picca.jpg","photoPosition":"center 15%"},
  {"id":20,"nom":"Michel Thuillier","role":"Conseiller","delegation":"Numérique, communication, histoire locale","avatar":"MT","color":"#2d5a9e","photo":"images/michel-thuillier.jpg","photoPosition":"center 20%"},
  {"id":21,"nom":"Isabelle Nifenecker","role":"Conseillère","delegation":"","avatar":"IN","color":"#EC4899","photo":"images/isabelle-nifenecker.jpg","photoPosition":"center 15%"},
  {"id":22,"nom":"André-Paul Venans","role":"Conseiller","delegation":"","avatar":"AV","color":"#10B981","photo":"images/andre-paul-venans.jpg","photoPosition":"center 20%"},
  {"id":23,"nom":"Nathalie Jacolin","role":"Conseillère","delegation":"","avatar":"NJ","color":"#8B5CF6","photo":"images/nathalie-jacolin.jpg","photoPosition":"center 15%"},
  {"id":24,"nom":"Ignazio Cosentino","role":"Conseiller","delegation":"","avatar":"IC","color":"#F97316","photo":"images/ignazio-consentino.jpg","photoPosition":"center 20%"},
  {"id":25,"nom":"Nathalie Germain-Vey","role":"Conseillère","delegation":"","avatar":"NG","color":"#3B82F6","photo":"images/nathalie-germain-vey.jpg","photoPosition":"center 15%"},
  {"id":26,"nom":"Stéphane Lasserre","role":"Conseiller","delegation":"","avatar":"SL","color":"#14B8A6","photo":"images/stephane-lasserre.jpg","photoPosition":"center 20%"}
]);
let evenements = load('evenements.json', []);
console.log('VeM Dashboard v7 — projets:'+projets.length+' elus:'+elus.length);

function auth(req) {
  const a=req.headers['authorization']||'';
  if(!a.startsWith('Basic ')) return false;
  return Buffer.from(a.slice(6),'base64').toString().split(':').slice(1).join(':') === PASSWORD;
}
function deny(res) {
  res.writeHead(401,{'WWW-Authenticate':'Basic realm="VeM Elus"','Content-Type':'text/html;charset=utf-8'});
  res.end('<div style="font-family:sans-serif;text-align:center;padding:4rem;color:#1a3a6b"><h2>Vizille en Mouvement — Espace élus</h2><p>Accès protégé — identifiants requis</p></div>');
}
function J(res,d,c){ res.writeHead(c||200,{'Content-Type':'application/json;charset=utf-8','Access-Control-Allow-Origin':'*'}); res.end(JSON.stringify(d)); }
function body(req,cb){ let b=''; req.on('data',d=>{b+=d;if(b.length>2e6)req.destroy();}); req.on('end',()=>{try{cb(null,JSON.parse(b));}catch(e){cb(e);}}); }
function nextId(a){ return a.length?Math.max(...a.map(i=>i.id||0))+1:1; }
function ts(){ return new Date().toLocaleString('fr-FR'); }

const server = http.createServer(function(req, res) {
  const p = req.url.split('?')[0];
  const q = Object.fromEntries(new URL('http://x'+req.url).searchParams);
  const m = req.method;
  if(m==='OPTIONS'){res.writeHead(200,{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,PUT,DELETE','Access-Control-Allow-Headers':'Content-Type,Authorization'});return res.end();}
  if(!auth(req)) return deny(res);

  if(p==='/api/all') return J(res,{projets,statuts,agenda,documents,notifs:notifs.slice(0,100),elus,chat:chat.slice(-50),evenements});

  if(p.match(/^\/api\/proj\/\d+$/) && m==='GET') {
    const id=parseInt(p.split('/').pop());
    const base=projets.find(x=>x.id===id)||{};
    const extra=projExtra[id]||{membres:[],chef_service:'',budget_prevu:0,subventions:[],contacts:[],notes:''};
    return J(res,{...base,...extra,statut:statuts[id]||base.statut||'ND'});
  }

  if(p.match(/^\/api\/proj\/\d+$/) && m==='PUT') {
    const id=parseInt(p.split('/').pop());
    return body(req,function(err,d){
      if(err)return J(res,{ok:false},400);
      if(d.statut&&d.statut!==(statuts[id]||'')){const old=statuts[id]||'ND';statuts[id]=d.statut;save('statuts.json',statuts);notifs.unshift({id:Date.now(),titre:d.titre||'',statut:d.statut,ancien:old,ts:ts(),new:true});if(notifs.length>200)notifs=notifs.slice(0,200);save('notifs.json',notifs);}
      projExtra[id]={membres:d.membres||[],chef_service:d.chef_service||'',budget_prevu:d.budget_prevu||0,subventions:d.subventions||[],contacts:d.contacts||[],notes:d.notes||''};
      save('proj_extra.json',projExtra);
      return J(res,{ok:true});
    });
  }

  if(p==='/api/statut'&&m==='POST') return body(req,function(err,d){
    if(err)return J(res,{ok:false},400);
    const old=statuts[d.id]||'ND';statuts[d.id]=d.statut;save('statuts.json',statuts);
    const notif={id:Date.now(),titre:d.titre,statut:d.statut,ancien:old,ts:ts(),new:true};
    notifs.unshift(notif);if(notifs.length>200)notifs=notifs.slice(0,200);save('notifs.json',notifs);
    return J(res,{ok:true,notif});
  });

  if(p==='/api/agenda'&&m==='POST') return body(req,function(err,d){
    if(err)return J(res,{ok:false},400);
    d.id=nextId(agenda);d.created=ts();agenda.push(d);save('agenda.json',agenda);
    return J(res,{ok:true,item:d});
  });
  if(p.match(/^\/api\/agenda\/\d+$/)&&m==='DELETE'){
    const id=parseInt(p.split('/').pop());agenda=agenda.filter(a=>a.id!==id);save('agenda.json',agenda);return J(res,{ok:true});
  }

  if(p==='/api/chat'&&m==='GET'){
    const since=parseInt(q.since||0);const channel=q.channel||'general';
    const msgs=chat.filter(m=>m.channel===channel&&m.id>since);
    return J(res,{ok:true,messages:msgs,lastId:chat.length?Math.max(...chat.map(m=>m.id)):0});
  }
  if(p==='/api/chat'&&m==='POST') return body(req,function(err,d){
    if(err)return J(res,{ok:false},400);
    const msg={id:nextId(chat),channel:d.channel||'general',auteur:d.auteur||'Élu',avatar:d.avatar||'?',texte:d.texte||'',ts:ts(),date:new Date().toISOString()};
    chat.push(msg);if(chat.length>500)chat=chat.slice(-400);save('chat.json',chat);
    return J(res,{ok:true,message:msg});
  });

  // ── IMAGES STATIQUES ─────────────────────────────────────────────────────
  if(p.startsWith('/images/')) {
    const imgPath = path.join(DIR, p);
    try {
      const data = fs.readFileSync(imgPath);
      const ext = path.extname(p).toLowerCase();
      const mime = {'.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.gif':'image/gif','.webp':'image/webp'}[ext]||'application/octet-stream';
      res.writeHead(200,{'Content-Type':mime,'Cache-Control':'public, max-age=86400'});
      return res.end(data);
    } catch(e){ res.writeHead(404); return res.end('Image not found'); }
  }

  // ── ÉVÉNEMENTS ───────────────────────────────────────────────────────────
  if(p==='/api/evenements'&&m==='GET') return J(res,evenements);
  if(p==='/api/evenements'&&m==='POST') return body(req,function(err,d){
    if(err)return J(res,{ok:false},400);
    d.id=nextId(evenements); d.created=ts(); evenements.unshift(d);
    if(evenements.length>500)evenements=evenements.slice(0,500);
    save('evenements.json',evenements); return J(res,{ok:true,item:d});
  });
  if(p.match(/^\/api\/evenements\/\d+$/)&&m==='PUT') return body(req,function(err,d){
    if(err)return J(res,{ok:false},400);
    const id=parseInt(p.split('/').pop());
    evenements=evenements.map(e=>e.id===id?{...e,...d}:e);
    save('evenements.json',evenements); return J(res,{ok:true});
  });
  if(p.match(/^\/api\/evenements\/\d+$/)&&m==='DELETE'){
    const id=parseInt(p.split('/').pop());
    evenements=evenements.filter(e=>e.id!==id);
    save('evenements.json',evenements); return J(res,{ok:true});
  }

  if(p==='/api/elus'&&m==='GET') return J(res,elus);
  if(p==='/api/elus'&&m==='POST') return body(req,function(err,d){
    if(err)return J(res,{ok:false},400);d.id=nextId(elus);elus.push(d);save('elus.json',elus);return J(res,{ok:true,item:d});
  });

  if(p==='/api/genere'&&m==='POST') return body(req,function(err,d){
    if(err)return J(res,{ok:false,error:'Données invalides'},400);
    const KEY=process.env.ANTHROPIC_API_KEY||'';
    if(!KEY)return J(res,{ok:false,error:'Clé ANTHROPIC_API_KEY non configurée.'});
    const prompts={arrete:'Rédigez un arrêté municipal pour la Commune de Vizille (Isère 38431). Numéro, visas CGCT, considérants, articles. Sujet : ',deliberation:'Rédigez une délibération du conseil de Vizille. Objet, motifs, décision. Sujet : ',facebook:'Post Facebook pour Vizille en Mouvement. Ton chaleureux, emojis, 300 mots max. Sujet : ',communique:'Communiqué de presse Ville de Vizille. Titre, chapeau, corps, contact. Sujet : ',convocation:'Convocation conseil municipal Vizille art.L2121-10 CGCT. Date, heure, lieu, ODJ. Sujet : ',discours:'Discours pour élu de Vizille. Ton sincère et ancré territoire 2026-2032. Sujet : '};
    const prompt=(prompts[d.type]||'Rédigez un document officiel pour Vizille (Isère). Sujet : ')+(d.sujet||'')+' Contexte: '+(d.contexte||'Vizille Isère 38431, Maire: Catherine Troton, mandat 2026-2032');
    const rb=JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1500,messages:[{role:'user',content:prompt}]});
    const opts={hostname:'api.anthropic.com',path:'/v1/messages',method:'POST',headers:{'Content-Type':'application/json','x-api-key':KEY,'anthropic-version':'2023-06-01','Content-Length':Buffer.byteLength(rb)}};
    const r2=https.request(opts,resp=>{let data='';resp.on('data',c=>data+=c);resp.on('end',()=>{try{const r=JSON.parse(data);return J(res,{ok:true,texte:(r.content&&r.content[0]&&r.content[0].text)||''});}catch(e){return J(res,{ok:false,error:'Erreur Claude'});}});});
    r2.on('error',e=>J(res,{ok:false,error:e.message}));r2.write(rb);r2.end();
  });

  // ── ÉVÉNEMENTS ──────────────────────────────────────────────────────────────
  if(p==='/api/evenement'&&m==='POST') return body(req,function(err,d){
    if(err)return J(res,{ok:false},400);
    d.id=nextId(evenements);d.date=d.date||new Date().toISOString();d.statut=d.statut||'Nouveau';
    evenements.unshift(d);if(evenements.length>500)evenements=evenements.slice(0,500);
    save('evenements.json',evenements);return J(res,{ok:true,item:d});
  });
  if(p.match(/^\/api\/evenement\/\d+\/statut$/)&&m==='POST') return body(req,function(err,d){
    if(err)return J(res,{ok:false},400);
    const id=parseInt(p.split('/')[3]);
    evenements=evenements.map(e=>e.id===id?{...e,statut:d.statut,updated:new Date().toISOString()}:e);
    save('evenements.json',evenements);return J(res,{ok:true});
  });
  if(p.match(/^\/api\/evenement\/\d+$/)&&m==='DELETE'){
    const id=parseInt(p.split('/').pop());
    evenements=evenements.filter(e=>e.id!==id);save('evenements.json',evenements);return J(res,{ok:true});
  }

    if(p==='/'||p==='/dashboard'){res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});return res.end(buildPage());}
  res.writeHead(404);res.end('404');
});

server.listen(PORT,()=>console.log('VeM v7 port '+PORT));
