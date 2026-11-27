@echo off
title Royal Bio Data Maker
echo ======================================================
echo           Starting Royal Bio Data Maker
echo ======================================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node.js detected. Launching local web server...
    start "" "http://localhost:3000"
    node server.js
) else (
    echo [NOTICE] Node.js not found in PATH. Opening index.html directly...
    start "" "index.html"
)
pause
