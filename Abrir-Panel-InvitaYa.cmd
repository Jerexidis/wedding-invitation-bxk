@echo off
setlocal
title Invita-Ya - Panel local
cd /d "%~dp0"

where npm.cmd >nul 2>nul
if errorlevel 1 (
    echo No se encontro Node.js. Instala Node.js antes de abrir el panel.
    pause
    exit /b 1
)

start "" powershell.exe -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:5173/admin'"
call npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort

echo.
echo El panel local se cerro.
pause
