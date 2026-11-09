#!/usr/bin/env bash
set -euo pipefail

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js 22+ is required." >&2
  exit 1
fi

node -e "const major = Number(process.versions.node.split('.')[0]); if (major < 22) process.exit(1)" || {
  echo "Please install Node.js 22 or newer." >&2
  exit 1
}

npm install
npm run build
if [ ! -d android ]; then
  npx cap add android
fi
node ./scripts/lock-portrait.mjs
npx cap sync android
( cd android && ./gradlew assembleDebug )

echo "APK created at: android/app/build/outputs/apk/debug/app-debug.apk"
