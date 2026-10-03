@echo off
title 185ChangarroWeb - sitio local
cd /d "%~dp0"
where node >nul 2>nul || (echo Necesitas Node.js: https://nodejs.org & pause & exit /b)
echo Abriendo el sitio en tu navegador... (cierra esta ventana para apagarlo)
node scripts\dev.js --abrir
pause
