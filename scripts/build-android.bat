@echo off
setlocal
cd /d "%~dp0.."
node -e "const major = Number(process.versions.node.split('.')[0]); if (major < 22) process.exit(1)"
if errorlevel 1 (
  echo Please install Node.js 22 or newer.
  exit /b 1
)
npm install
if errorlevel 1 exit /b 1
npm run build
if errorlevel 1 exit /b 1
if not exist android\app\src\main\AndroidManifest.xml npx cap add android
if errorlevel 1 exit /b 1
node scripts/lock-portrait.mjs
if errorlevel 1 exit /b 1
npx cap sync android
if errorlevel 1 exit /b 1
cd android
call gradlew.bat assembleDebug
if errorlevel 1 exit /b 1
echo APK created at: android\app\build\outputs\apk\debug\app-debug.apk
endlocal
