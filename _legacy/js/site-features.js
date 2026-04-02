/**
 * Site Features - Vizille en Mouvement
 * Fonctionnalités interactives du site public
 * CSS externalisé dans css/site-features.css
 */

(function() {
    'use strict';

    // ===== DARK MODE =====
    const darkModeToggle = {
        init() {
            const toggle = document.createElement('button');
            toggle.className = 'dark-mode-toggle';
            toggle.innerHTML = '🌙';
            toggle.title = 'Basculer le mode sombre';
            toggle.setAttribute('aria-label', 'Basculer le mode sombre');
            document.body.appendChild(toggle);

            const savedTheme = localStorage.getItem('vizille-theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                document.documentElement.setAttribute('data-theme', 'dark');
                toggle.innerHTML = '☀️';
            }

            toggle.addEventListener('click', () => {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                if (isDark) {
                    document.documentElement.removeAttribute('data-theme');
                    localStorage.setItem('vizille-theme', 'light');
                    toggle.innerHTML = '🌙';
                } else {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    localStorage.setItem('vizille-theme', 'dark');
                    toggle.innerHTML = '☀️';
                }
            });
        }
    };

    // ===== SCROLL PROGRESS BAR =====
    const scrollProgress = {
        init() {
            const progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            document.body.appendChild(progressBar);

            window.addEventListener('scroll', () => {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = (scrollTop / docHeight) * 100;
                progressBar.style.width = progress + '%';
            });
        }
    };

    // ===== BACK TO TOP BUTTON =====
    const backToTop = {
        init() {
            const btn = document.createElement('button');
            btn.className = 'back-to-top';
            btn.innerHTML = '↑';
            btn.title = 'Retour en haut';
            btn.setAttribute('aria-label', 'Retour en haut de la page');
            document.body.appendChild(btn);

            window.addEventListener('scroll', () => {
                btn.classList.toggle('visible', window.scrollY > 300);
            });

            btn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    };

    // ===== SCROLL ANIMATIONS =====
    const scrollAnimations = {
        init() {
            const animatedElements = document.querySelectorAll(
                '.card, .action-card, .projet-card, .candidat-card, .stat-card, ' +
                '.mot-container, .portrait-wrapper, .mot-texte, ' +
                '.section-header, .cards-grid > *, .team-grid > *'
            );

            animatedElements.forEach(el => el.classList.add('animate-on-scroll'));

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

            document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
        }
    };

    // ===== LAZY LOADING =====
    const lazyLoading = {
        init() {
            document.querySelectorAll('img:not([loading])').forEach(img => {
                if (!img.closest('.hero-banner, .header, .hero-content')) {
                    img.setAttribute('loading', 'lazy');
                }
            });

            const lazyImages = document.querySelectorAll('img[data-src]');
            if (lazyImages.length === 0) return;

            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        }
    };

    // ===== INITIALISATION =====
    const init = () => {
        darkModeToggle.init();
        scrollProgress.init();
        backToTop.init();
        scrollAnimations.init();
        lazyLoading.init();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
