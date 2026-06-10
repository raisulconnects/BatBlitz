@echo off
title Cricket Game Server
echo Starting Cricket Game...
echo.
echo Open http://localhost:8080 in your browser
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8080
pause
