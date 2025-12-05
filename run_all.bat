@echo off
echo  Démarrage de Chat bruti...
echo ==============================================================

:: Set console to UTF-8 for emojis
chcp 65001 >nul

:: Kill existing processes
echo Arrêt des processus existants...
taskkill /F /IM python.exe /T >nul 2>&1
taskkill /F /IM node.exe /T >nul 2>&1

:: Wait for processes to terminate
timeout /t 2 /nobreak >nul

:: Start backend
echo.
echo Démarrage du serveur backend...
cd backend

:: Check if virtual environment exists
if not exist "venv\Scripts\activate.bat" (
    echo Environnement virtuel introuvable!
    echo Exécutez dabord install.bat
    pause
    exit /b 1
)

call venv\Scripts\activate.bat

:: Start backend in current window (no new window)
echo Lancement de l API sur http://localhost:5000
start /B python app.py

:: Wait for backend to start
echo Attente du démarrage du backend...
timeout /t 5 /nobreak >nul

:: Start frontend
echo.
echo Démarrage du serveur frontend...
cd ..\frontend

:: Check if node_modules exists
if not exist "node_modules" (
    echo  Dépendances Node.js manquantes!
    echo Exécutez d'abord npm install
    pause
    exit /b 1
)

:: Start frontend in new window
echo Lancement de l'interface sur http://localhost:3000
start cmd /k "npm start"

echo.
echo ==============================================================
echo  Chat'bruti est maintenant en ligne !
echo.
echo  Interface: http://localhost:3000
echo  API: http://localhost:5000
echo  Santé API: http://localhost:5000/api/health
echo.
echo Pour arrêter les serveurs:
echo 1. Fermez la fenêtre npm (où React tourne)
echo 2. Appuyez sur Ctrl+C dans cette fenêtre
echo.
echo ==============================================================
echo.

:: Keep this window open and show backend logs
echo Logs du backend (appuyez sur Ctrl+C pour arrêter):
echo ==============================================================
cd ..\backend
python app.py