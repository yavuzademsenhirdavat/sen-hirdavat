#!/usr/bin/env bash
# Şen Hırdavat — deploy scripti
# Kullanım: ./deploy.sh "commit mesajı"
# Otomatik: git push + Vercel production deploy tetikle

set -e

MSG="${1:-update}"
VERCEL_TOKEN="vcp_1fA3BDQ1kJMuVyqYOwa81pR3GiwQI5vR6AFfxXxPwTH16UNGAj20JHA3"
TEAM="yavuzademsenhirdavats-projects"
REPO_ID="1231483220"

echo "📦 Staging ve commit..."
git add -A
git commit -m "$MSG

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>" 2>/dev/null || echo "Değişiklik yok, deploy tetikleniyor..."

echo "🚀 GitHub'a push..."
git push origin main

echo "⚡ Vercel production deploy tetikleniyor..."
RESULT=$(curl -s -X POST "https://api.vercel.com/v13/deployments?teamSlug=$TEAM" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"sen-hirdavat\",
    \"target\": \"production\",
    \"gitSource\": {
      \"type\": \"github\",
      \"repoId\": \"$REPO_ID\",
      \"ref\": \"main\"
    }
  }")

DEPLOY_ID=$(echo "$RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('id','ERROR'))")
DEPLOY_URL=$(echo "$RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('url',''))")

if [ "$DEPLOY_ID" = "ERROR" ]; then
  echo "❌ Deploy tetiklenemedi: $RESULT"
  exit 1
fi

echo "✅ Deploy başladı: $DEPLOY_ID"
echo "🔗 URL: https://$DEPLOY_URL"
echo ""
echo "Durumu kontrol etmek için:"
echo "  curl -s \"https://api.vercel.com/v13/deployments/$DEPLOY_ID?teamSlug=$TEAM\" \\"
echo "    -H \"Authorization: Bearer $VERCEL_TOKEN\" | python3 -c \"import sys,json; d=json.load(sys.stdin); print(d.get('readyState'))\""
