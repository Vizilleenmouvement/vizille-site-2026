/**
 * Page d'accueil dynamique - Vizille en Mouvement
 * Charge les données et anime les éléments
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les animations au scroll
    initScrollAnimations();

    // Initialiser les compteurs animés
    initCounters();

    // Charger les données dynamiques
    loadCarousel();
    loadActualites();
    loadGalerie();
    loadEquipePreview();

    // Scroll fluide pour les ancres
    initSmoothScroll();

    // Renouveler le carrousel toutes les 4 heures (14400000 ms)
    setInterval(loadCarousel, 14400000);
});

/**
 * Animations au scroll (Intersection Observer)
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionnel : arrêter d'observer une fois animé
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observer tous les éléments avec la classe animate-on-scroll
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Compteurs animés
 */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000; // 2 secondes
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = target / steps;

    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
        step++;
        current = Math.min(Math.round(increment * step), target);

        // Formater le nombre avec séparateur de milliers
        element.textContent = current.toLocaleString('fr-FR');

        if (step >= steps) {
            clearInterval(timer);
            element.textContent = target.toLocaleString('fr-FR');
        }
    }, stepDuration);
}

/**
 * Charger le carrousel Bilan & Projet
 */
async function loadCarousel() {
    const track = document.getElementById('carousel-track');
    if (!track) return;

    try {
        // Charger les deux fichiers JSON en parallèle
        const [actionsRes, projetsRes] = await Promise.all([
            fetch('actions.json'),
            fetch('projets.json')
        ]);

        const actions = await actionsRes.json();
        const projets = await projetsRes.json();

        // Prendre TOUTES les actions et tous les projets
        let cards = [
            ...actions.map(a => ({ ...a, type: 'bilan' })),
            ...projets.map(p => ({ ...p, type: 'projet' }))
        ];

        // Mélanger aléatoirement
        shuffleArray(cards);

        // Sur mobile, limiter à 50 cards pour la performance
        if (window.innerWidth < 600) {
            cards = cards.slice(0, 50);
        }

        // Générer le HTML des cards
        const cardsHtml = cards.map(item => createCarouselCard(item)).join('');

        // Dupliquer pour boucle infinie
        track.innerHTML = cardsHtml + cardsHtml;

    } catch (error) {
        console.error('Erreur chargement carrousel:', error);
        track.innerHTML = '<p style="padding: 2rem; color: #888;">Chargement...</p>';
    }
}

/**
 * Créer une card du carrousel
 */
function createCarouselCard(item) {
    const theme = item.theme || item.categorie || 'Divers';
    const titre = item.titre || item.nom || 'Action';
    const icon = getThemeIcon(theme);
    const typeClass = item.type === 'bilan' ? 'bilan' : 'projet';
    const typeLabel = item.type === 'bilan' ? 'Bilan' : 'Projet';

    // Nettoyer et raccourcir le titre
    let shortTitle = titre.replace(/^Objectif \d+ - /, '').replace(/^Objectif - /, '');
    if (shortTitle.length > 40) {
        shortTitle = shortTitle.substring(0, 37) + '...';
    }

    return `
        <div class="carousel-card ${typeClass}">
            <div class="carousel-card-icon">${icon}</div>
            <div class="carousel-card-title">${shortTitle}</div>
            <div class="carousel-card-divider"></div>
            <div class="carousel-card-theme">${theme}</div>
            <span class="carousel-card-badge">${typeLabel}</span>
        </div>
    `;
}

/**
 * Obtenir l'icône d'un thème
 */
function getThemeIcon(theme) {
    const icons = {
        'Santé': '🏥',
        'Environnement': '🌳',
        'Transition écologique': '🌿',
        'Tranquillité publique': '🛡️',
        'Tranquillité': '🛡️',
        'Enfance': '👶',
        'Enfance/Jeunesse': '👶',
        'Jeunesse': '🧒',
        'Sport': '🎾',
        'Culture': '🎭',
        'Économie': '💼',
        'Urbanisme': '🏗️',
        'Mobilités': '🚴',
        'Mobilité': '🚴',
        'Solidarité': '❤️',
        'Social': '🤝',
        'Patrimoine': '🏛️',
        'Éducation': '📚',
        'Concertation citoyenne': '🗣️',
        'Métropole': '🏙️',
        'Sécurité': '🔒'
    };
    return icons[theme] || '📌';
}

/**
 * Mélanger un tableau
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Charger les dernières actualités
 */
async function loadActualites() {
    const grid = document.getElementById('actualites-grid');
    if (!grid) return;

    try {
        const response = await fetch('articles.json');
        if (!response.ok) throw new Error('Erreur chargement articles');

        const articles = await response.json();

        // Trier par date et prendre les 3 plus récents
        const recentArticles = articles
            .sort((a, b) => new Date(b.date || b.modifie_le) - new Date(a.date || a.modifie_le))
            .slice(0, 3);

        if (recentArticles.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: #888;">Aucune actualité pour le moment</p>';
            return;
        }

        grid.innerHTML = recentArticles.map(article => {
            const imageUrl = getImageUrl(article.image || article.images?.[0]);
            const date = formatDate(article.date);
            const category = article.categorie || 'Actualité';

            return `
                <a href="blog.html#article-${article.id}" class="actu-card animate-on-scroll">
                    <div class="actu-image">
                        ${imageUrl ? `<img src="${imageUrl}" alt="${article.titre}" loading="lazy">` : ''}
                        <span class="actu-category">${getCategoryIcon(category)} ${category}</span>
                    </div>
                    <div class="actu-content">
                        <div class="actu-date">${date}</div>
                        <h3 class="actu-title">${article.titre}</h3>
                        <p class="actu-excerpt">${truncate(article.extrait || article.contenu, 100)}</p>
                    </div>
                </a>
            `;
        }).join('');

        // Réinitialiser les animations pour les nouveaux éléments
        initScrollAnimations();

    } catch (error) {
        console.error('Erreur chargement actualités:', error);
        grid.innerHTML = '<p style="text-align: center; color: #888;">Impossible de charger les actualités</p>';
    }
}

/**
 * Charger la galerie photos
 */
async function loadGalerie() {
    const mosaic = document.getElementById('galerie-mosaic');
    if (!mosaic) return;

    try {
        const response = await fetch('medias.json');
        if (!response.ok) throw new Error('Erreur chargement médias');

        const data = await response.json();
        const photos = data.photos || [];

        // Prendre les 5 premières photos (ou moins si pas assez)
        const displayPhotos = photos.slice(0, 5);

        if (displayPhotos.length === 0) {
            mosaic.innerHTML = '<p style="text-align: center; color: #888; grid-column: 1/-1;">Aucune photo pour le moment</p>';
            return;
        }

        mosaic.innerHTML = displayPhotos.map((photo, index) => {
            const imageUrl = getImageUrl(photo.src);
            return `
                <div class="galerie-item" onclick="window.location.href='medias.html'">
                    <img src="${imageUrl}" alt="${photo.titre || 'Photo'}" loading="lazy">
                    <div class="galerie-caption">${photo.titre || ''}</div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Erreur chargement galerie:', error);
        mosaic.innerHTML = '<p style="text-align: center; color: #888; grid-column: 1/-1;">Impossible de charger la galerie</p>';
    }
}

/**
 * Charger l'aperçu de l'équipe
 */
async function loadEquipePreview() {
    const grid = document.getElementById('equipe-preview');
    if (!grid) return;

    try {
        const response = await fetch('candidats.json');
        if (!response.ok) throw new Error('Erreur chargement candidats');

        const candidats = await response.json();

        // Prendre les 6 premiers candidats avec photo
        const displayCandidats = candidats
            .filter(c => c.photo)
            .slice(0, 6);

        if (displayCandidats.length === 0) {
            // Afficher des placeholders
            grid.innerHTML = Array(6).fill(`
                <div style="width: 100px; height: 100px; border-radius: 50%; background: rgba(255,255,255,0.2);"></div>
            `).join('');
            return;
        }

        grid.innerHTML = displayCandidats.map(candidat => {
            const photoUrl = getImageUrl(candidat.photo);
            return `
                <img src="${photoUrl}" alt="${candidat.nom}" class="equipe-avatar" title="${candidat.nom}">
            `;
        }).join('');

    } catch (error) {
        console.error('Erreur chargement équipe:', error);
        // Afficher des placeholders en cas d'erreur
        grid.innerHTML = Array(6).fill(`
            <div style="width: 100px; height: 100px; border-radius: 50%; background: rgba(255,255,255,0.2);"></div>
        `).join('');
    }
}

/**
 * Scroll fluide pour les ancres
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Utilitaires
 */
function getImageUrl(path) {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    if (path.startsWith('data:')) return path;
    // Construire l'URL relative
    return path;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr + 'T12:00:00');
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    } catch {
        return dateStr;
    }
}

function truncate(text, maxLength) {
    if (!text) return '';
    // Nettoyer le HTML
    const clean = text.replace(/<[^>]*>/g, '');
    if (clean.length <= maxLength) return clean;
    return clean.substring(0, maxLength).trim() + '...';
}

function getCategoryIcon(category) {
    const icons = {
        'Campagne': '📢',
        'Culture': '🎭',
        'Sport': '⚽',
        'Environnement': '🌿',
        'Social': '🤝',
        'Économie': '💼',
        'Éducation': '📚',
        'Sécurité': '🛡️',
        'Urbanisme': '🏗️',
        'Actualité': '📰'
    };
    return icons[category] || '📰';
}

/**
 * Parallax effect pour le hero (optionnel)
 */
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-dynamic');
    if (!hero) return;

    const scrolled = window.pageYOffset;
    const heroBg = hero.querySelector('.hero-bg');

    if (heroBg && scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});
