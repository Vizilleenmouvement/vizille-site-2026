/**
 * Bandeau d'actualités animé
 * Charge les news depuis news.json et les affiche avec un effet fade
 */

(function() {
    'use strict';

    const NEWS_INTERVAL = 5000; // Changement toutes les 5 secondes
    const FADE_DURATION = 500;  // Durée du fade en ms

    let newsItems = [];
    let currentIndex = 0;
    let intervalId = null;

    // Créer le bandeau HTML
    function createBanner() {
        const banner = document.createElement('div');
        banner.id = 'news-banner';
        banner.innerHTML = `
            <div class="news-banner-content">
                <span class="news-icon"></span>
                <span class="news-text"></span>
            </div>
            <button class="news-close" aria-label="Fermer" title="Fermer">&times;</button>
        `;
        return banner;
    }

    // Injecter les styles
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #news-banner {
                background: linear-gradient(135deg, #1a3a5c 0%, #2d5a87 100%);
                color: white;
                padding: 0.6rem 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
                font-size: 0.95rem;
                position: relative;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            }
            #news-banner.hidden {
                display: none;
            }
            .news-banner-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                cursor: pointer;
                transition: opacity 0.5s ease;
            }
            .news-banner-content:hover {
                opacity: 0.9;
            }
            .news-banner-content.fade-out {
                opacity: 0;
            }
            .news-icon {
                font-size: 1.2rem;
            }
            .news-text {
                font-weight: 500;
            }
            .news-text a {
                color: white;
                text-decoration: underline;
                text-underline-offset: 2px;
            }
            .news-close {
                position: absolute;
                right: 1rem;
                background: none;
                border: none;
                color: white;
                font-size: 1.4rem;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.2s;
                padding: 0.2rem 0.5rem;
                line-height: 1;
            }
            .news-close:hover {
                opacity: 1;
            }
            /* Indicateurs de pagination */
            .news-dots {
                display: flex;
                gap: 0.4rem;
                margin-left: 1rem;
            }
            .news-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: rgba(255,255,255,0.4);
                transition: background 0.3s;
            }
            .news-dot.active {
                background: white;
            }
            @media (max-width: 768px) {
                #news-banner {
                    padding: 0.5rem 2.5rem 0.5rem 0.8rem;
                    font-size: 0.85rem;
                }
                .news-dots {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Filtrer les news actives (dates valides)
    function filterActiveNews(news) {
        const today = new Date().toISOString().split('T')[0];
        return news.filter(n => {
            if (!n.actif) return false;
            if (n.dateDebut && n.dateDebut > today) return false;
            if (n.dateFin && n.dateFin < today) return false;
            return true;
        });
    }

    // Afficher une news
    function showNews(index, immediate = false) {
        const content = document.querySelector('.news-banner-content');
        const iconEl = document.querySelector('.news-icon');
        const textEl = document.querySelector('.news-text');
        const dots = document.querySelectorAll('.news-dot');

        if (!newsItems[index]) return;

        const news = newsItems[index];

        function updateContent() {
            // Mettre à jour le contenu
            iconEl.textContent = news.icon || '📢';

            if (news.lien) {
                textEl.innerHTML = `<a href="${news.lien}">${news.texte}</a>`;
                content.onclick = () => window.location.href = news.lien;
                content.style.cursor = 'pointer';
            } else {
                textEl.textContent = news.texte;
                content.onclick = null;
                content.style.cursor = 'default';
            }

            // Mettre à jour les dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });

            // Fade in
            content.classList.remove('fade-out');
        }

        // Affichage immédiat pour la première news
        if (immediate) {
            updateContent();
            return;
        }

        // Fade out puis mise à jour
        content.classList.add('fade-out');

        setTimeout(() => {
            updateContent();
        }, FADE_DURATION / 2);
    }

    // Passer à la news suivante
    function nextNews() {
        currentIndex = (currentIndex + 1) % newsItems.length;
        showNews(currentIndex);
    }

    // Ajouter les indicateurs de pagination
    function addDots(banner, count) {
        if (count <= 1) return;

        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'news-dots';

        for (let i = 0; i < count; i++) {
            const dot = document.createElement('span');
            dot.className = 'news-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => {
                currentIndex = i;
                showNews(currentIndex);
                // Reset l'intervalle
                if (intervalId) clearInterval(intervalId);
                if (newsItems.length > 1) {
                    intervalId = setInterval(nextNews, NEWS_INTERVAL);
                }
            });
            dotsContainer.appendChild(dot);
        }

        banner.querySelector('.news-banner-content').after(dotsContainer);
    }

    // Fermer le bandeau
    function closeBanner() {
        const banner = document.getElementById('news-banner');
        if (banner) {
            banner.classList.add('hidden');
            if (intervalId) clearInterval(intervalId);
            // Mémoriser la fermeture pour cette session
            sessionStorage.setItem('news-banner-closed', 'true');
        }
    }

    // Initialisation
    async function init() {
        console.log('[News Banner] Initialisation...');

        // Vérifier si l'utilisateur a fermé le bandeau
        if (sessionStorage.getItem('news-banner-closed') === 'true') {
            console.log('[News Banner] Bandeau fermé par l\'utilisateur, skip.');
            return;
        }

        try {
            const response = await fetch('news.json?v=' + Date.now());
            console.log('[News Banner] Fetch response:', response.status);
            if (!response.ok) return;

            const allNews = await response.json();
            console.log('[News Banner] News chargées:', allNews.length);
            newsItems = filterActiveNews(allNews);
            console.log('[News Banner] News actives:', newsItems.length);

            if (newsItems.length === 0) {
                console.log('[News Banner] Aucune news active à afficher');
                return;
            }

            // Injecter styles et créer le bandeau
            injectStyles();
            const banner = createBanner();
            console.log('[News Banner] Bandeau créé:', banner);

            // Insérer après le header
            const header = document.querySelector('header.header');
            console.log('[News Banner] Header trouvé:', header);
            if (header && header.nextSibling) {
                header.parentNode.insertBefore(banner, header.nextSibling);
                console.log('[News Banner] Inséré après le header');
            } else {
                document.body.insertBefore(banner, document.body.firstChild);
                console.log('[News Banner] Inséré en début de body');
            }

            // Ajouter les dots si plusieurs news
            addDots(banner, newsItems.length);

            // Afficher la première news immédiatement
            showNews(0, true);
            console.log('[News Banner] Bandeau affiché !');

            // Démarrer la rotation si plusieurs news
            if (newsItems.length > 1) {
                intervalId = setInterval(nextNews, NEWS_INTERVAL);
            }

            // Bouton fermer
            banner.querySelector('.news-close').addEventListener('click', closeBanner);

        } catch (e) {
            console.warn('Impossible de charger les actualités:', e);
        }
    }

    // Lancer au chargement du DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
