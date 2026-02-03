/**
 * Serveur local pour Vizille en Mouvement
 * Permet de sauvegarder les fichiers JSON directement depuis l'admin
 *
 * Usage: npm run dev
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT_DIR = __dirname;

// Types MIME
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.pdf': 'application/pdf'
};

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // API pour upload d'images en local
    if (req.method === 'POST' && req.url.startsWith('/api/upload/')) {
        const targetPath = decodeURIComponent(req.url.replace('/api/upload/', ''));

        // Sécurité : n'autoriser que le dossier images/
        if (!targetPath.startsWith('images/')) {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Upload autorisé uniquement dans images/' }));
            return;
        }

        let body = [];
        req.on('data', chunk => body.push(chunk));
        req.on('end', () => {
            try {
                const buffer = Buffer.concat(body);
                const jsonData = JSON.parse(buffer.toString());

                // Extraire le base64 (supprimer le préfixe data:image/xxx;base64,)
                const base64Data = jsonData.content;
                const imageBuffer = Buffer.from(base64Data, 'base64');

                const filePath = path.join(ROOT_DIR, targetPath);

                // Créer le dossier si nécessaire
                const dir = path.dirname(filePath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                fs.writeFileSync(filePath, imageBuffer);

                console.log(`✅ Image uploadée: ${filePath}`);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    path: targetPath,
                    url: `/${targetPath}`
                }));
            } catch (err) {
                console.error(`❌ Erreur upload:`, err.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    // API pour sauvegarder les fichiers JSON
    if (req.method === 'POST' && req.url.startsWith('/api/save/')) {
        const filename = req.url.replace('/api/save/', '');

        // Sécurité : n'autoriser que certains fichiers JSON
        const allowedFiles = [
            'articles.json', 'projets.json', 'candidats.json',
            'faq.json', 'themes.json', 'medias.json',
            'abonnes.json', 'config.json', 'actions.json'
        ];

        if (!allowedFiles.includes(filename)) {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Fichier non autorisé' }));
            return;
        }

        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                // Valider que c'est du JSON valide
                const jsonData = JSON.parse(body);

                // Sauvegarder à la racine (tous les fichiers)
                const filePath = path.join(ROOT_DIR, filename);

                // Créer le dossier si nécessaire
                const dir = path.dirname(filePath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');

                console.log(`✅ Sauvegardé: ${filePath}`);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, file: filename }));
            } catch (err) {
                console.error(`❌ Erreur sauvegarde ${filename}:`, err.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    // Servir les fichiers statiques
    let filePath = req.url === '/' ? '/index.html' : req.url;

    // Supprimer les query strings
    filePath = filePath.split('?')[0];

    // Sécurité : empêcher la navigation hors du dossier
    filePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');
    filePath = path.join(ROOT_DIR, filePath);

    // Vérifier que le fichier existe
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Essayer avec index.html pour les dossiers
            if (stats && stats.isDirectory()) {
                filePath = path.join(filePath, 'index.html');
            } else {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Fichier non trouvé</h1>');
                return;
            }
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<h1>500 - Erreur serveur</h1>');
                return;
            }

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    });
});

server.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Serveur Vizille en Mouvement                        ║
║                                                           ║
║   📍 http://localhost:${PORT}                              ║
║   📍 http://localhost:${PORT}/admin.html                   ║
║                                                           ║
║   ✅ Sauvegarde locale des JSON activée                  ║
║                                                           ║
║   Ctrl+C pour arrêter                                     ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`);
});
