#!/bin/zsh
# set-claude-key.sh — configure la clé Anthropic sur Infomaniak
# Usage : ./set-claude-key.sh sk-ant-api03-TACLÉ

KEY="$1"
if [ -z "$KEY" ]; then
  echo "Usage : ./set-claude-key.sh sk-ant-api03-..."
  exit 1
fi

# Sauvegarder localement dans .env (jamais committé sur GitHub)
echo "ANTHROPIC_API_KEY=$KEY" > /Users/michelt/Vizille-en-mouvement/.env
echo "✅ Clé sauvegardée dans .env (non committé)"

# Rappel : ajouter dans la commande de démarrage Infomaniak
echo ""
echo "📋 Copie cette ligne dans la commande de démarrage Infomaniak :"
echo "sh -c \"rm -f server.js && wget -q -O server.js 'https://raw.githubusercontent.com/Vizilleenmouvement/Vizille-en-mouvement/main/server-elus.js' && ANTHROPIC_API_KEY=$KEY node server.js\""
