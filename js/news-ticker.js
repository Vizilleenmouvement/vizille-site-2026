// Bandeau d'actualités défilant
(function() {
    // Configuration des messages - MODIFIEZ ICI
    const NEWS_ITEMS = [
        "📢 Nouveau : Consultez notre galerie Médias avec photos et vidéos de la campagne !",
        "📅 Prochaine réunion publique : consultez les Actualités",
        "✨ Site mis à jour le 3 février 2026 - Bilan enrichi avec photos",
        "🗳️ Élections municipales 2026 - Ensemble pour Vizille !"
    ];

    // Styles du bandeau
    const styles = `
        .news-ticker {
            background: linear-gradient(90deg, #1a3a5c 0%, #2c5282 50%, #1a3a5c 100%);
            color: white;
            padding: 8px 0;
            overflow: hidden;
            position: relative;
            font-size: 0.9rem;
            border-bottom: 2px solid #E91E63;
        }
        .news-ticker-content {
            display: flex;
            animation: ticker 30s linear infinite;
            white-space: nowrap;
        }
        .news-ticker-item {
            padding: 0 3rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .news-ticker-item::after {
            content: "•";
            margin-left: 3rem;
            color: #E91E63;
        }
        .news-ticker:hover .news-ticker-content {
            animation-play-state: paused;
        }
        @keyframes ticker {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .news-ticker-close {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            cursor: pointer;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            z-index: 10;
        }
        .news-ticker-close:hover {
            background: rgba(255,255,255,0.3);
        }
        @media (max-width: 768px) {
            .news-ticker { font-size: 0.8rem; }
            .news-ticker-item { padding: 0 2rem; }
        }
    `;

    // Ne pas afficher si fermé récemment
    const lastClosed = localStorage.getItem('newsTickerClosed');
    if (lastClosed) {
        const hoursSinceClosed = (Date.now() - parseInt(lastClosed)) / (1000 * 60 * 60);
        if (hoursSinceClosed < 24) return; // Masqué pendant 24h après fermeture
    }

    // Créer le bandeau
    function createTicker() {
        // Ajouter les styles
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        // Créer le HTML
        const ticker = document.createElement('div');
        ticker.className = 'news-ticker';
        ticker.innerHTML = `
            <div class="news-ticker-content">
                ${NEWS_ITEMS.map(item => `<span class="news-ticker-item">${item}</span>`).join('')}
                ${NEWS_ITEMS.map(item => `<span class="news-ticker-item">${item}</span>`).join('')}
            </div>
            <button class="news-ticker-close" title="Fermer">✕</button>
        `;

        // Bouton fermer
        ticker.querySelector('.news-ticker-close').addEventListener('click', function() {
            ticker.style.display = 'none';
            localStorage.setItem('newsTickerClosed', Date.now().toString());
        });

        // Insérer après le header ou au début du body
        const header = document.querySelector('header');
        if (header && header.nextSibling) {
            header.parentNode.insertBefore(ticker, header.nextSibling);
        } else {
            document.body.insertBefore(ticker, document.body.firstChild);
        }
    }

    // Lancer au chargement
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createTicker);
    } else {
        createTicker();
    }
})();
