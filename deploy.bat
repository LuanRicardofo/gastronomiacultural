@echo off
echo ====================================
echo   Iniciando Deploy Automatico...
echo ====================================

:: Adiciona todas as alteracoes
git add .

:: Cria o commit com a data e hora atuais
git commit -m "Auto deploy em %date% - %time%"

:: Envia para o GitHub (e dispara a Vercel)
git push origin main

echo ====================================
echo   Deploy enviado para o GitHub!
echo ====================================
pause