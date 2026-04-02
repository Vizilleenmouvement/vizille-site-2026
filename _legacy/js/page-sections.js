/**
 * page-sections.js
 * Charge page-sections.json et pilote l'affichage des sections de la page d'accueil
 */
(async function() {
    try {
        const res = await fetch('page-sections.json?v=' + Date.now());
        if (!res.ok) return;
        const cfg = await res.json();

        // --- BANDEAU ---
        const bandeau = document.getElementById('section-bandeau');
        if (bandeau) {
            if (cfg.bandeau?.visible) {
                bandeau.style.cssText = `background:${cfg.bandeau.background||'#1a3a6b'};color:${cfg.bandeau.couleur||'#fff'};text-align:center;padding:0.55rem 1rem;font-size:0.82rem;letter-spacing:0.03em;`;
                bandeau.innerHTML = cfg.bandeau.lien
                    ? `<a href="${cfg.bandeau.lien}" style="color:inherit;text-decoration:none;">${cfg.bandeau.texte}</a>`
                    : cfg.bandeau.texte;
            } else {
                bandeau.style.display = 'none';
            }
        }

        // --- BLOC ÉVÉNEMENT ---
        const evt = document.getElementById('section-evenement');
        if (evt) {
            if (cfg.evenement?.visible) {
                evt.innerHTML = `
                <section style="background:#f7f4ef;border-bottom:3px solid #c9a84c;padding:0;">
                    <div style="max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;min-height:300px;">
                        <div style="overflow:hidden;">
                            <img src="${cfg.evenement.photo}" alt="${cfg.evenement.titre}" style="width:100%;height:100%;object-fit:cover;object-position:center 30%;display:block;">
                        </div>
                        <div style="padding:2rem 2.5rem;display:flex;flex-direction:column;justify-content:center;">
                            <p style="font-size:0.62rem;letter-spacing:0.22em;text-transform:uppercase;color:#c9a84c;font-weight:700;margin:0 0 0.5rem;">${cfg.evenement.surtitre||''}</p>
                            <h2 style="font-family:'Playfair Display',serif;font-size:clamp(1.1rem,2.5vw,1.6rem);font-weight:600;color:#1a3a6b;margin:0 0 0.8rem;line-height:1.3;">${cfg.evenement.titre}</h2>
                            <p style="font-size:0.88rem;color:#555;line-height:1.75;margin:0 0 0.8rem;">${cfg.evenement.texte}</p>
                            ${cfg.evenement.detail ? `<p style="font-size:0.8rem;color:#888;margin:0 0 1.2rem;line-height:1.6;">${cfg.evenement.detail}</p>` : ''}
                            <div style="display:flex;flex-direction:column;gap:0.4rem;align-self:flex-start;">
                                ${cfg.evenement.lien_principal ? `<a href="${cfg.evenement.lien_principal}" style="display:inline-block;background:#1a3a6b;color:#fff;padding:0.6rem 1.3rem;border-radius:3px;text-decoration:none;font-size:0.8rem;letter-spacing:0.04em;">${cfg.evenement.texte_lien_principal||'En savoir plus →'}</a>` : ''}
                                ${cfg.evenement.lien_secondaire ? `<a href="${cfg.evenement.lien_secondaire}" style="display:inline-block;color:#1a3a6b;font-size:0.78rem;text-decoration:underline;letter-spacing:0.03em;">${cfg.evenement.texte_lien_secondaire||''}</a>` : ''}
                            </div>
                        </div>
                    </div>
                </section>`;
            }
        }

        // --- SECTIONS TOGGLE ---
        const map = {
            'vote_banner':    'section-vote-banner',
            'resultats':      'section-resultats',
            'facebook':       'section-facebook',
            'galerie':        'section-galerie',
            'equipe_preview': 'section-equipe-preview',
            'rejoindre':      'section-rejoindre'
        };
        if (cfg.sections) {
            for (const [key, id] of Object.entries(map)) {
                const el = document.getElementById(id);
                if (el && cfg.sections[key]?.visible === false) {
                    el.style.display = 'none';
                }
            }
        }

    } catch(e) {
        console.warn('page-sections.js: erreur chargement', e);
    }
})();
